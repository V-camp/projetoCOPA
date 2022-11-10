import { IPartidasGerais } from './../model/interfaces/PartidasGerais';
import { Utils } from './../util/utils';
import { IdadosTime } from "../model/interfaces/DadosTime"
import { IdadosAtualizarTime } from "../model/interfaces/DadosAtualizarTime"
import { timesEmJogo } from "../model/enums/TimesEmJogo"
import { IGruposTimes } from "model/interfaces/GruposDosTimes"
import { IDisputasMatchDays } from "model/interfaces/DisputasMatchDays"
import { IInputMatchEFinais } from "../model/interfaces/InputMatchEFinais";
import { tipoDePartidasEnum } from "../model/enums/TipoDePartidas";
import { PrismaClient } from '@prisma/client'
import { ITimesVencedores } from 'model/interfaces/TimesVencedores';

const prisma = new PrismaClient()
const utils = new Utils()

export class CopaController {
    public async buscarTodosOsTimes(): Promise<Array<IdadosTime>> {
        const time = await prisma.times.findMany();

        return time
    }

    public async cadastrarTime(cadastroTime: IdadosTime): Promise<IdadosTime> {        
        const quantidadeDeTimes: Array<IdadosTime> = await this.buscarTodosOsTimes()

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

    public timesEmCadaGrupo(times: Array<IdadosTime | any>): IGruposTimes {
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

    public matchDays(gruposTimes: IGruposTimes, timesNoDB: Array<IdadosTime>): IDisputasMatchDays {
        
        if(timesNoDB.length  === 32) {
            return utils.criarTabelaMatchDay(gruposTimes);
        }

        throw "Times Insuficiente para montar o MatchDay";
    }



    public async decidirVencedor(inputPartidas: IInputMatchEFinais): Promise<string | undefined> {
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

    private async vencedoresMatchDay(inputPartidas: IInputMatchEFinais): Promise<string> {
        const vencedoresDasPartidas = [];

        const chavesDasPartidas = Object.keys(inputPartidas.partidas);

        const timeVencedoresJaSalvosNoDB: Array<ITimesVencedores> = await prisma.timesVencedoresDasPartidas.findMany()

        for (let i = 0; i < chavesDasPartidas.length; i++) {
            // @ts-ignore
            let partidaAtual = inputPartidas.partidas[chavesDasPartidas[i]];

            if (partidaAtual[1].qtdGol > partidaAtual[0].qtdGol) {
                let historicoDoTime = timeVencedoresJaSalvosNoDB.find((time: ITimesVencedores) => time.id === partidaAtual[1].idPais)

                console.log(historicoDoTime);
                partidaAtual[1] = { 
                    ...partidaAtual[1], 
                    //@ts-ignore
                    pontuacao: historicoDoTime ? historicoDoTime.pontuacao + 3 : 3
                }

                vencedoresDasPartidas.push(partidaAtual[1]);
            } else if (partidaAtual[1].qtdGol === partidaAtual[0].qtdGol) {
                let historicoDoTime1 = timeVencedoresJaSalvosNoDB.find((time: ITimesVencedores) => time.id === partidaAtual[0].idPais)
                partidaAtual[0] = { 
                    ...partidaAtual[0], 
                    //@ts-ignore
                    pontuacao: historicoDoTime1 ? historicoDoTime1.pontuacao + 1 : 1
                }

                let historicoDoTime2 = timeVencedoresJaSalvosNoDB.find((time: ITimesVencedores) => time.id === partidaAtual[1].idPais)
                partidaAtual[1] = { 
                    ...partidaAtual[1], 
                    //@ts-ignore
                    pontuacao: historicoDoTime2 ? historicoDoTime2.pontuacao + 1 : 1
                }
            } else {
                let historicoDoTime = timeVencedoresJaSalvosNoDB.find((time: ITimesVencedores) => time.id === partidaAtual[0].idPais)
                
                partidaAtual[0] = { 
                    ...partidaAtual[0], 
                    //@ts-ignore
                    pontuacao: historicoDoTime ? historicoDoTime.pontuacao + 3 : 3
                }

                vencedoresDasPartidas.push(partidaAtual[0]);
            }
        }

        return this.salvarTimeVencedorNoDB(vencedoresDasPartidas, inputPartidas.tipoDeQualificacao, timeVencedoresJaSalvosNoDB);
    }

    private async salvarTimeVencedorNoDB(vencedoresDasPartidas: Array<any>, tipoDePartida: string, timeVencedoresJaSalvosNoDB: any): Promise<string> {
        try {
            const times = await this.buscarTodosOsTimes()
        
            for (let i = 0; i < vencedoresDasPartidas.length; i++) {
                const dadosTimesVencedors = times.find((time) => time.id === vencedoresDasPartidas[i].idPais)
                
                const timesVencedorExiste = timeVencedoresJaSalvosNoDB.find((time: any) => time.id === vencedoresDasPartidas[i].idPais)
                
                if (timesVencedorExiste) {
                    await prisma.timesVencedoresDasPartidas.update({
                        where: {
                            id: vencedoresDasPartidas[i].idPais,
                        },
                        data: {
                            // @ts-ignore
                            nomedopais: dadosTimesVencedors.nomedopais,
                            qtdgol: vencedoresDasPartidas[i].qtdGol || timesVencedorExiste.qtdgol,
                            qtdcartaovermelho: vencedoresDasPartidas[i].qtdCartaoVermelho || timesVencedorExiste.qtdcartaovermelho,
                            qtdcartaoamarelo: vencedoresDasPartidas[i].qtdCartaoAmarelo || timesVencedorExiste.qtdcartaoamarelo,
                            pontuacao: vencedoresDasPartidas[i].pontuacao || timesVencedorExiste.pontuacao,
                            tipodepartida: tipoDePartida || timesVencedorExiste.tipodepartida
                        },
                    });
                } else {                
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
            }

            return "Salvo!"
        } catch (error) {
            return "Erro ao salvar os times vencedores"
        }
    }

    public async buscarTimesVendores(): Promise<Array<ITimesVencedores>> {
        const time = await prisma.timesVencedoresDasPartidas.findMany();

        return time
    }

    public async decidirVencedorMatchDay(): Promise<any> {
        const timesVencedores: Array<any> = await this.buscarTimesVendores()
        const timesTotais: Array<any> = await this.buscarTodosOsTimes()

        let timesVencedoresComDadosCompleto = []
        for (let index = 0; index < timesVencedores.length; index++) {
            timesVencedoresComDadosCompleto.push(timesTotais.find((time) => time.id === timesVencedores[index].id))
        }

        //@ts-ignore
        let timesVencedoresComDadosCompletoEPontuacao = []
        for (let i = 0; i < timesVencedoresComDadosCompleto.length; i++) {
            // @ts-ignore
            timesVencedoresComDadosCompletoEPontuacao.push(
                { 
                   ...timesVencedoresComDadosCompleto[i],
                   ...timesVencedores[i]
                }
            )
        }

        const timesVencedoresMatchDayPorGrupo = this.timesEmCadaGrupo(timesVencedoresComDadosCompletoEPontuacao);
        const chavesTimes = Object.keys(timesVencedoresMatchDayPorGrupo)
        console.log("chaves -", chavesTimes);
        

        for (let i = 0; i < 3; i++) {
            // @ts-ignore
            let time = timesVencedoresMatchDayPorGrupo[chavesTimes[i]]
            
            for (let j = 0; j < 3; j++) {
                if (time[j].qtdcartaovermelho > 0) {
                    // @ts-ignore
                    console.log("1", timesVencedoresMatchDayPorGrupo[chavesTimes[i]][j].pontuacao -= 3)
                }

                if (time[j].qtdcartaoamarelo > 0) {
                    // @ts-ignore
                    timesVencedoresMatchDayPorGrupo[chavesTimes[i][j]].pontuacao -= 1
                }
            }
        }

        
        const definirVencedoresPara16DeFinais = []

        // console.log("eee->", timesVencedoresMatchDayPorGrupo.timesNoGrupoA);
        

        // for (let i = 0; i < 3; i++) {
        //     let time = timesVencedoresMatchDayPorGrupo.timesNoGrupoA[i]
        //     // @ts-ignore
        //     let menorPontuacao = timesVencedoresMatchDayPorGrupo.timesNoGrupoA[0].pontuacao
        //     console.log("mp =", menorPontuacao);
            
        //     // @ts-ignore
        //     if (time.pontuacao >= menorPontuacao) {
        //         definirVencedoresPara16DeFinais.push(time)
        //         console.log("- ", definirVencedoresPara16DeFinais[i]);
        //     } else {
        //         // @ts-ignore
        //         menorPontuacao = time.pontuacao
        //         console.log("else", menorPontuacao);
        //     }
        // }

        // console.log("Depois", definirVencedoresPara16DeFinais);
        

        return definirVencedoresPara16DeFinais 
    }

    public async cadastrarTodosTimes(cadastroDosTime: Array<IdadosTime>): Promise<string> {
        try {   
            for (let i = 0; i < cadastroDosTime.length; i++) {
                    await prisma.times.create({
                        data: {
                            id: cadastroDosTime[i].id,
                            nomedopais: cadastroDosTime[i].nomedopais,
                            qtddejogadores: cadastroDosTime[i].qtddejogadores,
                            treinador: cadastroDosTime[i].treinador,
                            capitao: cadastroDosTime[i].capitao,
                            estaemjogo: timesEmJogo.EM_JOGO,
                            grupopertencente: cadastroDosTime[i].grupopertencente,
                        }
                    })
            }
            
            return "times criados"
        } catch(error) {
            return "Erro ao cadastrar os times"
        }           
    }
}
