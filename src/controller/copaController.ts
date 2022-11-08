import { IPartidasGerais } from './../model/interfaces/PartidasGerais';
import { Utils } from './../util/utils';
import { IdadosTime } from "../model/interfaces/DadosTime"
import { IdadosAtualizarTime } from "../model/interfaces/DadosAtualizarTime"
import { timesEmJogo } from "../model/enums/TimesEmJogo"
import { IGruposTimes } from "model/interfaces/GruposDosTimes"
import { IMatchDay } from "model/interfaces/MatchDay"
import { IDisputasMatchDays } from "model/interfaces/DisputasMatchDays"
import { IInputMatchEFinais } from "../model/interfaces/InputMatchEFinais";
import { tipoDePartidasEnum } from "../model/enums/TipoDePartidas";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class CopaController {
    public async buscarTodosOsTimes(): Promise<Array<IdadosTime>> {
        const time = await prisma.times.findMany();

        return time
    }

    public async cadastrarTime(cadastroTime: IdadosTime): Promise<IdadosTime> {        
        const quantidadeDeTimes: Array<any> = await this.buscarTodosOsTimes()

        const timeJaExiste = quantidadeDeTimes.find((timeExistente) => timeExistente.nomedopais === cadastroTime.nomedopais)
        
        const grupos: Array<string> = []

        quantidadeDeTimes.forEach((timeAtual: IdadosTime) => grupos.push(timeAtual.grupopertencente))

        let qtdNoGrupo = 0;
        const gruposPossiveis = ["A", "B", "C", "D", "E", "F", "G", "H"]

        grupos.forEach((grupoAtual: string, index: number) => {
            if (
                grupoAtual === cadastroTime.grupopertencente 
                    && cadastroTime.grupopertencente === gruposPossiveis[index]
            ) {
                qtdNoGrupo += 1;
            }
        })

        if (!timeJaExiste && quantidadeDeTimes.length <= 32 && qtdNoGrupo < 4) {
            const timeCriado: IdadosTime = await prisma.times.create({
                data: {
                    nomedopais: cadastroTime.nomedopais,
                    qtddejogadores: cadastroTime.qtddejogadores,
                    treinador: cadastroTime.treinador,
                    capitao: cadastroTime.capitao,
                    qtddecartaovermelho: cadastroTime.qtddecartaovermelho,
                    qtddecartaoamarelho: cadastroTime.qtddecartaoamarelho,
                    estaemjogo: timesEmJogo.EM_JOGO,
                    grupopertencente: cadastroTime.grupopertencente,
                },
            })

            return timeCriado
        }

        throw "Error rever informações..."
    }

    public async atualizarTime(timeAtualizar: IdadosAtualizarTime): Promise<object> {     
        const times = await this.buscarTodosOsTimes()
        const timeExistente = times.find((timeAntesDeAtualizar) => timeAntesDeAtualizar.id === timeAtualizar.id)

        const timeAtualizado = await prisma.times.update({
            where: {
                id: timeAtualizar.id,
            },
            data: {
                nomedopais: timeAtualizar.nomedopais || timeExistente?.nomedopais,
                qtddejogadores: timeAtualizar.qtddejogadores || timeExistente?.qtddejogadores,
                treinador: timeAtualizar.treinador || timeExistente?.treinador,
                capitao: timeAtualizar.capitao || timeExistente?.capitao,
                qtddecartaovermelho: timeAtualizar.qtddecartaovermelho || timeExistente?.qtddecartaovermelho,
                qtddecartaoamarelho: timeAtualizar.qtddecartaoamarelho || timeExistente?.qtddecartaoamarelho,
                estaemjogo: timeAtualizar.estaemjogo || timeExistente?.estaemjogo,
                grupopertencente: timeAtualizar.grupopertencente || timeExistente?.grupopertencente,
            },
          })

        return timeAtualizado
    }

    public async listarAsDisputadasIniciais (): Promise<IDisputasMatchDays> {

        const times: Array<IdadosTime> = await this.buscarTodosOsTimes()

        const grupoTime: IGruposTimes = this.timesEmCadaGrupo(times);

        return this.matchDays(grupoTime, times); 
    }

    public timesEmCadaGrupo(times: Array<any>) {
        return {
            timesNoGrupoA: times.filter((time) => time.grupopertencente === "A"),
            timesNoGrupoB: times.filter((time) => time.grupopertencente === "B"),
            timesNoGrupoC: times.filter((time) => time.grupopertencente === "C"),
            timesNoGrupoD: times.filter((time) => time.grupopertencente === "D"),
            timesNoGrupoE: times.filter((time) => time.grupopertencente === "E"),
            timesNoGrupoF: times.filter((time) => time.grupopertencente === "F"),
            timesNoGrupoG: times.filter((time) => time.grupopertencente === "G"),
            timesNoGrupoH: times.filter((time) => time.grupopertencente === "H"),
        }
    }

    public matchDays(gruposTimes: any, timesNoDB: Array<IdadosTime>): IDisputasMatchDays {
        
        if(timesNoDB.length  === 32) {
            const day1: IMatchDay = {
            disputaGrupoA:  [[gruposTimes.timesNoGrupoA[0].nomedopais, gruposTimes.timesNoGrupoA[1].nomedopais], 
                [gruposTimes.timesNoGrupoA[2].nomedopais, gruposTimes.timesNoGrupoA[3].nomedopais]],

            disputaGrupoB: [[gruposTimes.timesNoGrupoB[0].nomedopais, gruposTimes.timesNoGrupoB[1].nomedopais],
                [gruposTimes.timesNoGrupoB[2].nomedopais, gruposTimes.timesNoGrupoB[3].nomedopais]],

            disputaGrupoC: [[gruposTimes.timesNoGrupoC[0].nomedopais, gruposTimes.timesNoGrupoC[1].nomedopais],
                [gruposTimes.timesNoGrupoC[2].nomedopais, gruposTimes.timesNoGrupoC[3].nomedopais]],

            disputaGrupoD: [[gruposTimes.timesNoGrupoD[0].nomedopais, gruposTimes.timesNoGrupoD[1].nomedopais],
                [gruposTimes.timesNoGrupoD[2].nomedopais, gruposTimes.timesNoGrupoD[3].nomedopais]],

            disputaGrupoE: [[gruposTimes.timesNoGrupoE[0].nomedopais, gruposTimes.timesNoGrupoE[1].nomedopais],
                [gruposTimes.timesNoGrupoE[2].nomedopais, gruposTimes.timesNoGrupoE[3].nomedopais]],

            disputaGrupoF: [[gruposTimes.timesNoGrupoF[0].nomedopais, gruposTimes.timesNoGrupoF[1].nomedopais],
                [gruposTimes.timesNoGrupoF[2].nomedopais, gruposTimes.timesNoGrupoF[3].nomedopais]],

            disputaGrupoG: [[gruposTimes.timesNoGrupoG[0].nomedopais, gruposTimes.timesNoGrupoG[1].nomedopais],
                [gruposTimes.timesNoGrupoG[2].nomedopais, gruposTimes.timesNoGrupoG[3].nomedopais]],

            disputaGrupoH: [[gruposTimes.timesNoGrupoH[0].nomedopais, gruposTimes.timesNoGrupoH[1].nomedopais],
                [gruposTimes.timesNoGrupoH[2].nomedopais, gruposTimes.timesNoGrupoH[3].nomedopais]],
            }

            const day2: IMatchDay = {
            disputaGrupoA: [[gruposTimes.timesNoGrupoA[0].nomedopais, gruposTimes.timesNoGrupoA[2].nomedopais],
                [gruposTimes.timesNoGrupoA[3].nomedopais, gruposTimes.timesNoGrupoA[1].nomedopais]],

            disputaGrupoB: [[gruposTimes.timesNoGrupoB[0].nomedopais, gruposTimes.timesNoGrupoB[2].nomedopais],
                [gruposTimes.timesNoGrupoB[3].nomedopais, gruposTimes.timesNoGrupoB[1].nomedopais]],

            disputaGrupoC: [[gruposTimes.timesNoGrupoC[0].nomedopais, gruposTimes.timesNoGrupoC[2].nomedopais],
                [gruposTimes.timesNoGrupoC[3].nomedopais, gruposTimes.timesNoGrupoC[1].nomedopais]],

            disputaGrupoD: [[gruposTimes.timesNoGrupoD[0].nomedopais, gruposTimes.timesNoGrupoD[2].nomedopais],
                [gruposTimes.timesNoGrupoD[3].nomedopais, gruposTimes.timesNoGrupoD[1].nomedopais]],

            disputaGrupoE: [[gruposTimes.timesNoGrupoE[0].nomedopais, gruposTimes.timesNoGrupoE[2].nomedopais],
                [gruposTimes.timesNoGrupoE[3].nomedopais, gruposTimes.timesNoGrupoE[1].nomedopais]],

            disputaGrupoF: [[gruposTimes.timesNoGrupoF[0].nomedopais, gruposTimes.timesNoGrupoF[2].nomedopais],
                [gruposTimes.timesNoGrupoF[3].nomedopais, gruposTimes.timesNoGrupoF[1].nomedopais]],

            disputaGrupoG: [[gruposTimes.timesNoGrupoG[0].nomedopais, gruposTimes.timesNoGrupoG[2].nomedopais],
                [gruposTimes.timesNoGrupoG[3].nomedopais, gruposTimes.timesNoGrupoG[1].nomedopais]],

            disputaGrupoH: [[gruposTimes.timesNoGrupoH[0].nomedopais, gruposTimes.timesNoGrupoH[2].nomedopais],
                [gruposTimes.timesNoGrupoH[3].nomedopais, gruposTimes.timesNoGrupoH[1].nomedopais]],
            }

            const day3: IMatchDay = {
            disputaGrupoA: [[gruposTimes.timesNoGrupoA[3].nomedopais, gruposTimes.timesNoGrupoA[0].nomedopais],
                [gruposTimes.timesNoGrupoA[1].nomedopais, gruposTimes.timesNoGrupoA[2].nomedopais]],

            disputaGrupoB: [[gruposTimes.timesNoGrupoB[3].nomedopais, gruposTimes.timesNoGrupoB[0].nomedopais],
                [gruposTimes.timesNoGrupoB[1].nomedopais, gruposTimes.timesNoGrupoB[2].nomedopais]],

            disputaGrupoC: [[gruposTimes.timesNoGrupoC[3].nomedopais, gruposTimes.timesNoGrupoC[0].nomedopais],
                [gruposTimes.timesNoGrupoC[1].nomedopais, gruposTimes.timesNoGrupoC[2].nomedopais]],

            disputaGrupoD: [[gruposTimes.timesNoGrupoD[3].nomedopais, gruposTimes.timesNoGrupoD[0].nomedopais],
                [gruposTimes.timesNoGrupoD[1].nomedopais, gruposTimes.timesNoGrupoD[2].nomedopais]],

            disputaGrupoE: [[gruposTimes.timesNoGrupoE[3].nomedopais, gruposTimes.timesNoGrupoE[0].nomedopais],
                [gruposTimes.timesNoGrupoE[1].nomedopais, gruposTimes.timesNoGrupoE[2].nomedopais]],

            disputaGrupoF: [[gruposTimes.timesNoGrupoF[3].nomedopais, gruposTimes.timesNoGrupoF[0].nomedopais],
                [gruposTimes.timesNoGrupoF[1].nomedopais, gruposTimes.timesNoGrupoF[2].nomedopais]],

            disputaGrupoG: [[gruposTimes.timesNoGrupoG[3].nomedopais, gruposTimes.timesNoGrupoG[0].nomedopais],
                [gruposTimes.timesNoGrupoG[1].nomedopais, gruposTimes.timesNoGrupoG[2].nomedopais]],

            disputaGrupoH: [[gruposTimes.timesNoGrupoH[3].nomedopais, gruposTimes.timesNoGrupoH[0].nomedopais],
                [gruposTimes.timesNoGrupoH[1].nomedopais, gruposTimes.timesNoGrupoH[2].nomedopais]],
            }

            return {
                day1,
                day2,
                day3,
            }
        }

        throw "Times Insuficiente para montar o MatchDay";
    }

    public async decidirVencedor(inputPartidas: IInputMatchEFinais): Promise<any> {
        let vendoresDoMatchDay;

        if (inputPartidas.tipoDeQualificacao === tipoDePartidasEnum.MATCHDAY1) {
            vendoresDoMatchDay = this.vencedoresMatchDay(inputPartidas)
        }

        else if (inputPartidas.tipoDeQualificacao === tipoDePartidasEnum.MATCHDAY2) {
            vendoresDoMatchDay = this.vencedoresMatchDay(inputPartidas)
        }

        else if (inputPartidas.tipoDeQualificacao === tipoDePartidasEnum.MATCHDAY3) {
            vendoresDoMatchDay = this.vencedoresMatchDay(inputPartidas)
        }

        return vendoresDoMatchDay
    }

    private async vencedoresMatchDay(inputPartidas: IInputMatchEFinais): Promise<any> {
        const vencedoresDasPartidas = [];

        const chavesDasPartidas = Object.keys(inputPartidas.partidas);

        const timeVencedoresJaSalvosNoDB = await prisma.timesVencedoresDasPartidas.findMany()

        for (let i = 0; i < chavesDasPartidas.length; i++) {
            // @ts-ignore
            let partidaAtual = inputPartidas.partidas[chavesDasPartidas[i]];

            if (partidaAtual[1].qtdGol > partidaAtual[0].qtdGol) {
                let historicoDoTime = timeVencedoresJaSalvosNoDB.find((time: any) => time.id === partidaAtual[1].idPais)
                
                partidaAtual[1] = { 
                    ...partidaAtual[1], 
                    pontuacao: historicoDoTime ? historicoDoTime.pontuacao + 3 : 3
                }

                vencedoresDasPartidas.push(partidaAtual[1]);
            } else if (partidaAtual[1].qtdGol === partidaAtual[0].qtdGol) {
                partidaAtual[0] = { ...partidaAtual[0], pontuacao: 1 }
                partidaAtual[1] = { ...partidaAtual[1], pontuacao: 1 }
            } else {
                partidaAtual[0] = { ...partidaAtual[0], pontuacao: 3 }
                vencedoresDasPartidas.push(partidaAtual[0]);
            }
        }

        return this.salvarTimeVencedorNoDB(vencedoresDasPartidas, inputPartidas.tipoDeQualificacao);
    }

    private async salvarTimeVencedorNoDB(vencedoresDasPartidas: any[], tipoDePartida: string): Promise<any> {
        try {
            const times = await this.buscarTodosOsTimes()
        
            for (let i = 0; i < vencedoresDasPartidas.length; i++) {
                const dadosTimesVencedors = times.find((time) => time.id === vencedoresDasPartidas[i].idPais)
                
                await prisma.timesVencedoresDasPartidas.create({
                    data: {
                        id: vencedoresDasPartidas[i].idPais,
                        // @ts-ignore
                        nomedopais: dadosTimesVencedors.nomedopais,
                        qtdgol: vencedoresDasPartidas[i].qtdGol,
                        qtdcartaovermelho: vencedoresDasPartidas[i].qtdCartaoVermelho,
                        qtdcartaoamarelo: vencedoresDasPartidas[i].qtdCartaoAmarelo,
                        pontuacao: vencedoresDasPartidas[i].pontuacao,
                        tipodepartida: tipoDePartida
                    },
                });
            }

            return "Salvo!"
        } catch (error) {
            return error
        }
    }

    public async buscarTimesVendores(): Promise<Array<any>> {
        const time = await prisma.timesVencedoresDasPartidas.findMany();

        return time
    }


    public async cadastrarTodosTimes(cadastroDosTime: Array<any>): Promise<any> {
        try {
            for (let i = 0; i < cadastroDosTime.length; i++) {
                await prisma.times.create({
                    data: {
                        id: cadastroDosTime[i].id,
                        nomedopais: cadastroDosTime[i].nomedopais,
                        qtddejogadores: cadastroDosTime[i].qtddejogadores,
                        treinador: cadastroDosTime[i].treinador,
                        capitao: cadastroDosTime[i].capitao,
                        qtddecartaovermelho: cadastroDosTime[i].qtddecartaovermelho,
                        qtddecartaoamarelho: cadastroDosTime[i].qtddecartaoamarelho,
                        estaemjogo: timesEmJogo.EM_JOGO,
                        grupopertencente: cadastroDosTime[i].grupopertencente,
                    },
                })
            }
            
            return "times criados"
        } catch(error) {
            return error
        }           
    }
}
