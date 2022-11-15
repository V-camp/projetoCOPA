import { Utils } from './../util/utils';
import { IdadosTime } from "../model/interfaces/DadosTime"
import { IdadosAtualizarTime } from "../model/interfaces/DadosAtualizarTime"
import { timesEmJogo } from "../model/enums/TimesEmJogo"
import { IGruposTimes } from "model/interfaces/GruposDosTimes"
import { IDisputasMatchDays } from "model/interfaces/DisputasMatchDays"
import { IInputMatchEFinais } from "../model/interfaces/InputMatchEFinais";
import { ITimesVencedores } from 'model/interfaces/TimesVencedores';
import { ITimesDadosCompletos } from 'model/interfaces/TimeDadosCompletos';
import { IPartida } from 'model/interfaces/Partida';
import { IInputFinais, IOutputFinail, IOutputFinais, IOutputTerceiro } from 'model/interfaces/Finais';
import { IVencedorMatchDay } from 'model/interfaces/VencedorMatchDay';

//@ts-ignore
import { PrismaClient } from '@prisma/client'
import { ok } from 'assert';
import { ITimesFinais } from 'model/interfaces/InputTimeFinais';
import { TimeInputFinais } from 'model/TimesInputFinais';
import { FinaisInput } from 'model/Finais';
import { tipoDePartidasEnum } from 'model/enums/TipoDePartidas';

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

    public async atualizarTime(timeAtualizar: IdadosAtualizarTime): Promise<IdadosTime> {     
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

    public timesEmCadaGrupo(times: Array<IdadosTime | ITimesDadosCompletos>): IGruposTimes {
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

    public async finais(finais: FinaisInput): Promise <IOutputFinais | any> {
        try {
            const idPaisWhithoutClassification = []
            const times = finais.times;
            const timesVencedores = []
            const segundoColocado = []


            // check if ids of "times", is classifieds to "finais"
            if (finais.tipoDeQualificacao == "OitavasFinais") {
                for (let index = 0; index < times.length; index++) {
                    let time = times[index];

                    if(!await this.checkTimeClassification(time.idPais, finais.tipoDeQualificacao)){
                        idPaisWhithoutClassification.push(time.idPais);
                    }
                }
                if (idPaisWhithoutClassification.length > 0) {
                    return "Os Paises com id/ids " + idPaisWhithoutClassification + " não estão classificados para finais";
                }

                let partidas = await this.montarPartidas(times, finais.tipoDeQualificacao)

                for (let index = 0; index < partidas.length; index++) {
                    const times = partidas[index];
                    if(times[0].qtdgol == times[1].qtdgol){
                        await prisma.vencedoresoitavasfinais.deleteMany()
                        throw "Times " + times[0].idPais + " e " + times[1].idPais +" não podem ter a mesma quantidade de Gol, tem que haver penalts";
                    }
                    if (times[0].qtdgol > times[1].qtdgol){
                        timesVencedores.push(times[0]) 
                        await prisma.vencedoresoitavasfinais.create({
                                data: {
                                    id: times[0].idPais,
                                    partida: index + 1,
                                },
                            }
                        );
                    }else{
                        timesVencedores.push(times[1])
                        await prisma.vencedoresoitavasfinais.create({
                                data: {
                                    id: times[1].idPais,
                                    partida: index + 1,
                                },
                            }
                        );
                    }
                }

                const outPutFinais:IOutputFinais = {
                    proximaEtapa: "QuartasFinais",
                    times: timesVencedores
                };
                return outPutFinais 
            }
            
            if (finais.tipoDeQualificacao == "QuartasFinais") {
                for (let index = 0; index < times.length; index++) {
                    let time = times[index];

                    if(!await this.checkTimeClassification(time.idPais, finais.tipoDeQualificacao)){
                        idPaisWhithoutClassification.push(time.idPais);
                    }
                }
                if (idPaisWhithoutClassification.length > 0) {
                    return "Os Paises com id/ids " + idPaisWhithoutClassification + " não estão classificados para finais";
                }

                let partidas = await this.montarPartidas(times, finais.tipoDeQualificacao)

                for (let index = 0; index < partidas.length; index++) {
                    const times = partidas[index];
                    console.log(partidas[index])
                    if(times[0].qtdgol == times[1].qtdgol){
                        await prisma.vencedoresquartasfinais.deleteMany()
                        throw "Times " + times[0].idPais + " e " + times[1].idPais +" não podem ter a mesma quantidade de Gol, tem que haver penalts";

                    }
                    if (times[0].qtdgol > times[1].qtdgol){
                        timesVencedores.push(times[0]) 

                        await prisma.vencedoresquartasfinais.create({
                                data: {
                                    id: times[0].idPais,
                                    partida: index + 1,
                                },
                            }
                        );

                        await prisma.competidoresterceiro.create({
                                data: {
                                    id: times[1].idPais,
                                    partida: index + 1,
                                },
                            }
                        );
                    }else{
                        timesVencedores.push(times[1])
                        await prisma.vencedoresquartasfinais.create({
                                data: {
                                    id: times[1].idPais,
                                    partida: index + 1,
                                },
                            }
                        );

                        await prisma.competidoresterceiro.create({
                                data: {
                                    id: times[0].idPais,
                                    partida: index + 1,
                                },
                            }
                        );
                    }
                }

                const outPutFinais:IOutputFinais = {
                    proximaEtapa: "SemiFinais",
                    times: timesVencedores
                };
                return outPutFinais 
            }

            if (finais.tipoDeQualificacao == "SemiFinais") {
                for (let index = 0; index < times.length; index++) {
                    let time = times[index];

                    if(!await this.checkTimeClassification(time.idPais, finais.tipoDeQualificacao)){
                        idPaisWhithoutClassification.push(time.idPais);
                    }
                }
                if (idPaisWhithoutClassification.length > 0) {
                    return "Os Paises com id/ids " + idPaisWhithoutClassification + " não estão classificados para finais";
                }

                let partidas = await this.montarPartidas(times, finais.tipoDeQualificacao)

                for (let index = 0; index < partidas.length; index++) {
                    const times = partidas[index];
                    if(times[0].qtdgol == times[1].qtdgol){
                        await prisma.vencedoresquartasfinais.deleteMany()
                        throw "Times " + times[0].idPais + " e " + times[1].idPais +" não podem ter a mesma quantidade de Gol, tem que haver penalts";

                    }
                    if (times[0].qtdgol > times[1].qtdgol){
                        timesVencedores.push(times[0]) 
                        await prisma.vencedoressemifinais.create({
                                data: {
                                    id: times[0].idPais,
                                    partida: index + 1,
                                },
                            }
                        );
                    }else{
                        timesVencedores.push(times[1])
                        await prisma.vencedoressemifinais.create({
                                data: {
                                    id: times[1].idPais,
                                    partida: index + 1,
                                },
                            }
                        );
                    }
                }

                const outPutFinais:IOutputFinais = {
                    proximaEtapa: "Final",
                    times: timesVencedores
                };
                return outPutFinais 
            }


            if (finais.tipoDeQualificacao == "Final") {
                for (let index = 0; index < times.length; index++) {
                    let time = times[index];

                    if(!await this.checkTimeClassification(time.idPais, finais.tipoDeQualificacao)){
                        idPaisWhithoutClassification.push(time.idPais);
                    }
                }
                if (idPaisWhithoutClassification.length > 0) {
                    return "Os Paises com id/ids " + idPaisWhithoutClassification + " não estão classificados para finais";
                }

                let partidas = await this.montarPartidas(times, finais.tipoDeQualificacao)

                for (let index = 0; index < partidas.length; index++) {
                    const times = partidas[index];
                    if(times[0].qtdgol == times[1].qtdgol){
                        await prisma.vencedoresfinais.deleteMany()
                        throw "Times " + times[0].idPais + " e " + times[1].idPais +" não podem ter a mesma quantidade de Gol, tem que haver penalts";

                    }
                    if (times[0].qtdgol > times[1].qtdgol){
                        timesVencedores.push(times[0]) 
                        segundoColocado.push(times[1])
                        await prisma.vencedoresfinais.create({
                                data: {
                                    id: times[0].idPais,
                                    partida: index + 1,
                                },
                            }
                        );

                    }else{
                        timesVencedores.push(times[1])
                        segundoColocado.push(times[0])
                        await prisma.vencedoresfinais.create({
                                data: {
                                    id: times[1].idPais,
                                    partida: index + 1,
                                },
                            }
                        );
                    }
                }

                const outPutFinais:IOutputFinail = {
                    proximaEtapa: "DecidirTerceiro",
                    campeao: timesVencedores,
                    segundo: segundoColocado,
                };
                return outPutFinais 
            }

            if (finais.tipoDeQualificacao == "DecidirTerceiro") {
                for (let index = 0; index < times.length; index++) {
                    let time = times[index];

                    if(!await this.checkTimeClassification(time.idPais, finais.tipoDeQualificacao)){
                        idPaisWhithoutClassification.push(time.idPais);
                    }
                }
                if (idPaisWhithoutClassification.length > 0) {
                    return "Os Paises com id/ids " + idPaisWhithoutClassification + " não estão classificados para finais";
                }

                let partidas = await this.montarPartidas(times, finais.tipoDeQualificacao)

                for (let index = 0; index < partidas.length; index++) {
                    const times = partidas[index];
                    if(times[0].qtdgol == times[1].qtdgol){
                        await prisma.vencedoresfinais.deleteMany()
                        throw "Times " + times[0].idPais + " e " + times[1].idPais +" não podem ter a mesma quantidade de Gol, tem que haver penalts";

                    }
                    if (times[0].qtdgol > times[1].qtdgol){
                        timesVencedores.push(times[0]) 
                        await prisma.vencedoresterceiro.create({
                                data: {
                                    id: times[0].idPais,
                                    partida: index + 1,
                                },
                            }
                        );

                    }else{
                        timesVencedores.push(times[1])
                        await prisma.vencedoresterceiro.create({
                                data: {
                                    id: times[1].idPais,
                                    partida: index + 1,
                                },
                            }
                        );
                    }
                }

                const outPutFinais:IOutputTerceiro = {
                    proximaEtapa: "Encerrado",
                    terceiro: timesVencedores,
                };
                return outPutFinais 
            }

		}catch(error){
			throw(error)
		}
    }
    private async montarPartidas(times:Array<ITimesFinais>, tipoDeQualificacao:string) {
        const grupoA = [];
        const grupoB = [];
        const grupoC = [];
        const grupoD = [];
        const grupoE = [];
        const grupoF = [];
        const grupoG = [];
        const grupoH = [];

        if (tipoDeQualificacao == "OitavasFinais") {
            for (let index = 0; index < times.length; index++) {
                let time = times[index];
                let times_valor = await this.getTimeFromDb(time.idPais);
                // @ts-ignore
                time['grupopertencente'] = times_valor.grupopertencente;

                if(time.grupopertencente == 'A'){
                    grupoA.push(time)
                }

                if(time.grupopertencente == 'B'){
                    grupoB.push(time)
                }

                if(time.grupopertencente == 'C'){
                    grupoC.push(time)
                }

                if(time.grupopertencente == 'D'){
                    grupoD.push(time)
                }

                if(time.grupopertencente == 'E'){
                    grupoE.push(time)
                }

                if(time.grupopertencente == 'F'){
                    grupoF.push(time)
                }

                if(time.grupopertencente == 'G'){
                    grupoG.push(time)
                }

                if(time.grupopertencente == 'H'){
                    grupoH.push(time)
                }

            }
            
            const partidas:any = [];

            partidas.push([grupoA[0], grupoB[1]]);
            partidas.push([grupoA[1], grupoB[0]]);

            partidas.push([grupoC[0], grupoD[1]]);
            partidas.push([grupoC[1], grupoD[0]]);

            partidas.push([grupoE[0], grupoF[1]]);
            partidas.push([grupoE[1], grupoF[0]]);

            partidas.push([grupoG[0], grupoH[1]]);
            partidas.push([grupoG[1], grupoH[0]]);

            return partidas;
        }

        if (tipoDeQualificacao == "QuartasFinais") {
            const partidas:any = [];
            let idTimesPartidas = await prisma.vencedoresoitavasfinais.findMany(
                {
                    where:{
                        OR: [{ partida: 1},{ partida: 3},],},
                    select: {
                        id: true,
                    }
                },
            );
            
            partidas.push([times.find((obj) => { return obj.idPais == idTimesPartidas[0].id}),times.find((obj) => { return obj.idPais == idTimesPartidas[1].id})]);

            idTimesPartidas = await prisma.vencedoresoitavasfinais.findMany(
                {
                    where:{
                        OR: [{ partida: 5},{ partida: 7},],},
                    select: {
                        id: true,
                    }
                },
            );

            partidas.push([times.find((obj) => { return obj.idPais == idTimesPartidas[0].id}),times.find((obj) => { return obj.idPais == idTimesPartidas[1].id})]);

            idTimesPartidas = await prisma.vencedoresoitavasfinais.findMany(
                {
                    where:{
                        OR: [{ partida: 2},{ partida: 4},],},
                    select: {
                        id: true,
                    }
                },
            );

            partidas.push([times.find((obj) => { return obj.idPais == idTimesPartidas[0].id}),times.find((obj) => { return obj.idPais == idTimesPartidas[1].id})]);

            idTimesPartidas = await prisma.vencedoresoitavasfinais.findMany(
                {
                    where:{
                        OR: [{ partida: 6},{ partida: 8},],},
                    select: {
                        id: true,
                    }
                },
            );

            partidas.push([times.find((obj) => { return obj.idPais == idTimesPartidas[0].id}),times.find((obj) => { return obj.idPais == idTimesPartidas[1].id})]);

            return partidas 
        }

        if (tipoDeQualificacao == "SemiFinais") {
            const partidas:any = [];
            let idTimesPartidas = await prisma.vencedoresquartasfinais.findMany(
                {
                    where:{
                        OR: [{ partida: 1},{ partida: 2},],},
                    select: {
                        id: true,
                    }
                },
            );
            
            partidas.push([times.find((obj) => { return obj.idPais == idTimesPartidas[0].id}),times.find((obj) => { return obj.idPais == idTimesPartidas[1].id})]);

            idTimesPartidas = await prisma.vencedoresquartasfinais.findMany(
                {
                    where:{
                        OR: [{ partida: 3},{ partida: 4},],},
                    select: {
                        id: true,
                    }
                },
            );

            partidas.push([times.find((obj) => { return obj.idPais == idTimesPartidas[0].id}),times.find((obj) => { return obj.idPais == idTimesPartidas[1].id})]);

            return partidas 
        }

        if (tipoDeQualificacao == "Final") {
            const partidas:any = [];
            let idTimesPartidas = await prisma.vencedoressemifinais.findMany(
                {
                    where:{
                        OR: [{ partida: 1},{ partida: 2},],},
                    select: {
                        id: true,
                    }
                },
            );
            
            partidas.push([times.find((obj) => { return obj.idPais == idTimesPartidas[0].id}),times.find((obj) => { return obj.idPais == idTimesPartidas[1].id})]);

            console.log(partidas);
            
            return partidas 
        }

        if (tipoDeQualificacao == "DecidirTerceiro") {
            const partidas:any = [];
            let idTimesPartidas = await prisma.competidoresterceiro.findMany(
                {
                    select: {
                        id: true,
                    }
                },
            );
            
            partidas.push([times.find((obj) => { return obj.idPais == idTimesPartidas[0].id}),times.find((obj) => { return obj.idPais == idTimesPartidas[1].id})]);

            console.log(partidas);
            
            return partidas 
        }
    }

    private async getTimeFromDb(idPais:number) {
        let time = await prisma.times.findUnique(
            {
                where: {
                    id:idPais,
                },
            }
        )
        return time;
    }

    private async checkTimeClassification(idtime: number, tipoDeQualificacao: string) {
        try {
            if(tipoDeQualificacao == "OitavasFinais"){
                const time = await prisma.vencedoresMatchDays.aggregate({
                    where:{
                        id:idtime
                    },
                    _count: true
                })

                if (time._count == 0) {
                   return false 
                }

                return true;
            }


            if (tipoDeQualificacao == "QuartasFinais") {
                const time = await prisma.vencedoresoitavasfinais.aggregate({
                    where:{
                        id:idtime
                    },
                    _count: true
                })

                if (time._count == 0) {
                   return false 
                }

                return true;
            }

            if (tipoDeQualificacao == "SemiFinais") {
                const time = await prisma.vencedoresquartasfinais.aggregate({
                    where:{
                        id:idtime
                    },
                    _count: true
                })

                if (time._count == 0) {
                   return false 
                }

                return true;
            }

            if (tipoDeQualificacao == "Final") {
                const time = await prisma.vencedoressemifinais.aggregate({
                    where:{
                        id:idtime
                    },
                    _count: true
                })

                if (time._count == 0) {
                   return false 
                }

                return true;
            }

            if (tipoDeQualificacao == "DecidirTerceiro") {
                const time = await prisma.competidoresterceiro.aggregate({
                    where:{
                        id:idtime
                    },
                    _count: true
                })

                if (time._count == 0) {
                   return false 
                }

                return true;
            }
		}catch(error){
			throw(error)
		}
    }

    public async decidirVencedor(inputPartidas: IInputMatchEFinais): Promise<string | undefined> {
        return this.vencedoresMatchDay(inputPartidas)
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
        console.log(vencedoresDasPartidas)

        return this.salvarTimeVencedorNoDB(vencedoresDasPartidas, inputPartidas.tipoDeQualificacao, timeVencedoresJaSalvosNoDB);
    }

    private async salvarTimeVencedorNoDB(vencedoresDasPartidas: Array<IVencedorMatchDay>, tipoDePartida: string, timeVencedoresJaSalvosNoDB: Array<ITimesVencedores>): Promise<string> {
        try {
            const times = await this.buscarTodosOsTimes()
        
            for (let i = 0; i < vencedoresDasPartidas.length; i++) {
                const dadosTimesVencedors = times.find((time) => time.id === vencedoresDasPartidas[i].idPais)
                
                const timesVencedorExiste = timeVencedoresJaSalvosNoDB.find((time: ITimesVencedores) => time.id === vencedoresDasPartidas[i].idPais)
                
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

    public async decidirVencedorMatchDay(): Promise<Array<ITimesDadosCompletos>> {
        const timesVencedores: Array<ITimesVencedores> = await this.buscarTimesVendores()
        const timesTotais: Array<IdadosTime> = await this.buscarTodosOsTimes()

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

        // @ts-ignore
        const timesVencedoresMatchDayPorGrupo = this.diminuirPontuacaoComBaseNosCartoes(timesVencedoresComDadosCompletoEPontuacao);

        const chavesTimes = Object.keys(timesVencedoresMatchDayPorGrupo);

        const definirVencedoresPara16DeFinais = this.ordenarTimesComBaseNaPontuacao(chavesTimes, timesVencedoresMatchDayPorGrupo);

        const vencedoresEmCadaGrupo = this.timesEmCadaGrupo(definirVencedoresPara16DeFinais)

        const salvarVencedores = await this.salvarVencedoresDosMatchDays(vencedoresEmCadaGrupo, chavesTimes)

        return salvarVencedores 
    }

    private async salvarVencedoresDosMatchDays(vencedoresEmCadaGrupo: IGruposTimes, chavesTimes: Array<string>) {
        let timesSalvosNoDB = []
        
        console.log("Estou no salvarVencedoresDosMatchDays");
        
        for (let i = 0; i < chavesTimes.length; i++) {
            // @ts-ignore
            let time = vencedoresEmCadaGrupo[chavesTimes[i]];
            for (let j = 0; j < 2; j++) {
                let timeSalvo = await prisma.vencedoresMatchDays.create({
                    data: {
                        // @ts-ignore
                        id: vencedoresEmCadaGrupo[chavesTimes[i]][j].id,
                        // @ts-ignore
                        nomedopais: vencedoresEmCadaGrupo[chavesTimes[i]][j].nomedopais,
                        // @ts-ignore
                        qtddejogadores: vencedoresEmCadaGrupo[chavesTimes[i]][j].qtddejogadores,
                        // @ts-ignore
                        treinador: vencedoresEmCadaGrupo[chavesTimes[i]][j].treinador,
                        // @ts-ignore
                        capitao: vencedoresEmCadaGrupo[chavesTimes[i]][j].capitao,
                        // @ts-ignore
                        estaemjogo: vencedoresEmCadaGrupo[chavesTimes[i]][j].estaemjogo,
                        // @ts-ignore
                        grupopertencente: vencedoresEmCadaGrupo[chavesTimes[i]][j].grupopertencente,
                        // @ts-ignore
                        qtdgol: vencedoresEmCadaGrupo[chavesTimes[i]][j].qtdgol,
                        // @ts-ignore
                        qtdcartaovermelho: vencedoresEmCadaGrupo[chavesTimes[i]][j].qtdcartaovermelho,
                        // @ts-ignore
                        qtdcartaoamarelo: vencedoresEmCadaGrupo[chavesTimes[i]][j].qtdcartaoamarelo,
                        // @ts-ignore
                        pontuacao: vencedoresEmCadaGrupo[chavesTimes[i]][j].pontuacao,
                        // @ts-ignore
                        tipodepartida: vencedoresEmCadaGrupo[chavesTimes[i]][j].tipodepartida,
                    },
                });
                timesSalvosNoDB.push(timeSalvo);
            }
        }

        return timesSalvosNoDB
    }

    private diminuirPontuacaoComBaseNosCartoes(timesVencedoresComDadosCompletoEPontuacao: Array<ITimesDadosCompletos>) {
        const timesVencedoresMatchDayPorGrupo = this.timesEmCadaGrupo(timesVencedoresComDadosCompletoEPontuacao);
        const chavesTimes = Object.keys(timesVencedoresMatchDayPorGrupo);

        for (let i = 0; i < chavesTimes.length; i++) {
            // @ts-ignore
            let time = timesVencedoresMatchDayPorGrupo[chavesTimes[i]];

            for (let j = 0; j < time.length; j++) {
                if (time[j].qtdcartaovermelho > 0) {
                    // @ts-ignore
                    timesVencedoresMatchDayPorGrupo[chavesTimes[i]][j].pontuacao -= 3;
                }

                if (time[j].qtdcartaoamarelo > 0) {
                    // @ts-ignore
                    timesVencedoresMatchDayPorGrupo[chavesTimes[i]][j].pontuacao -= 1;
                }
            }
        }
        return timesVencedoresMatchDayPorGrupo;
    }

    private ordenarTimesComBaseNaPontuacao(chavesTimes: Array<string>, timesVencedoresMatchDayPorGrupo: IGruposTimes) {
        const definirVencedoresPara16DeFinais = [];

        for (let i = 0; i < chavesTimes.length; i++) {
            // @ts-ignore
            timesVencedoresMatchDayPorGrupo[chavesTimes[i]].sort((time1: ITimesDadosCompletos, time2: ITimesDadosCompletos) => {
                if (time1.pontuacao < time2.pontuacao) {
                    return 1;
                }
                if (time1.pontuacao > time2.pontuacao) {
                    return -1;
                }
                return 0;
            });
        }

        for (let i = 0; i < chavesTimes.length; i++) {

            definirVencedoresPara16DeFinais.push(
                // @ts-ignore
                timesVencedoresMatchDayPorGrupo[chavesTimes[i]][0], timesVencedoresMatchDayPorGrupo[chavesTimes[i]][1]
            );
        }
        return definirVencedoresPara16DeFinais;
    }

    public async buscarVencedoresDosMatchDaysNoDb(): Promise<Array<ITimesDadosCompletos>> {
        return prisma.vencedoresMatchDays.findMany()
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
            console.log(error);
            return "Erro ao cadastrar os times"
        }
    }
}
