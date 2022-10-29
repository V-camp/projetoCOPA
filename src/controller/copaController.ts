import { Utils } from './../util/utils';
import { PrismaClient } from "@prisma/client"
import { IdadosTime } from "../model/interfaces/DadosTime"
import { dadosAtualizarTime } from "../model/interfaces/DadosAtualizarTime"
import { timesEmJogo } from "../model/enums/TimesEmJogo"
import { dadosTimePerdedor } from "model/interfaces/TimePerdedor"
import { IGruposTimes } from "model/interfaces/GruposDosTimes"
import { IMatchDay } from "model/interfaces/MatchDay"
import { IDisputasMatchDays } from "model/interfaces/DisputasMatchDays"

const prisma = new PrismaClient()
const utils = new Utils()

export class CopaController {
  public async buscarTodosOsTimes(): Promise<Array<IdadosTime>> {
      const time = await prisma.times.findMany();
      
      return [
        // @ts-ignore
          { Time: "Brasil" },
          { Time: "EUA" }
      ] || time
  }

  public async cadastrarTime(cadastroTime: IdadosTime): Promise<IdadosTime> {

    const timeJaExiste: IdadosTime = await prisma.times.findUnique({
      where: {
        nomeDoPais: cadastroTime.nomeDoPais,
      },
    })

    const quantidadeDeTimes: Array<IdadosTime> = await this.buscarTodosOsTimes()

    const grupos: Array<string> = []

    quantidadeDeTimes.forEach((timeAtual: IdadosTime) => grupos.push(timeAtual.grupoPertencente))
      
    let qtdNoGrupo = 0;
    const gruposPossiveis = ["A", "B", "C", "D", "E", "F", "G", "H"]

    grupos.forEach((grupoAtual: string, index: number) => {
      if (
          grupoAtual === cadastroTime.grupoPertencente 
          && cadastroTime.grupoPertencente === gruposPossiveis[index]
        ) {
        qtdNoGrupo += 1;
      }
    })

    if (!timeJaExiste && quantidadeDeTimes.length <= 32 && qtdNoGrupo < 4) {
      const timeCriado: IdadosTime = await prisma.user.create({
        data: {
          nomeDoPais: cadastroTime.nomeDoPais,
          qtdJogadores: cadastroTime.qtdDeJogadores,
          treinadorDoTime: cadastroTime.treinador,
          capitao: cadastroTime.capitao,
          qtdDeCartaoVermelho: cadastroTime.qtdDeCartaoVermelho,
          qtdDeCartaoAmarelho: cadastroTime.qtdDeCartaoAmarelho,
          estaEmJogo: timesEmJogo.EM_JOGO,
          grupoPertencente: cadastroTime.grupoPertencente,
        },
      })

      return timeCriado
    }

    throw "Error rever condições..."
  }

  public async atualizarTime(timeAtualizar: dadosAtualizarTime): Promise<object> {
      const timeAtualizado = await prisma.post.update({

          where: {
            id: timeAtualizar.id,
          },
          data: {
              name: timeAtualizar.nomeDoPais,
              qtdJogadores: timeAtualizar.qtdDeJogadores,
              liderDoTime: timeAtualizar.lider,
              emJogo: timesEmJogo.EM_JOGO,
          },
        })

      return { Time: "Brasil", etapa: "final" } || timeAtualizado
  }

  public async eliminarTime(timePerdedor: dadosTimePerdedor): Promise<object> {

      const timeEliminado = await prisma.post.update({

          where: {
            id: timePerdedor.id,
          },
          data: {
              emJogo: timesEmJogo.ELIMINADO,
          },
        })

    return { Time: "Eua", Venceu: false, Eliminado: true  } || timeEliminado
  }

  public async listarAsDisputadasIniciais (): Promise<IDisputasMatchDays> {

    const times: Array<IdadosTime> = await this.buscarTodosOsTimes()

    const grupoTime: IGruposTimes = this.timesEmCadaGrupo(times);

    const matchDay = this.matchDays(grupoTime);

    return matchDay;
  }

  public timesEmCadaGrupo(times: Array<IdadosTime>) {
    return {
      timesNoGrupoA: times.filter((time: IdadosTime) => time.grupoPertencente === "A"),
      timesNoGrupoB: times.filter((time: IdadosTime) => time.grupoPertencente === "B"),
      timesNoGrupoC: times.filter((time: IdadosTime) => time.grupoPertencente === "C"),
      timesNoGrupoD: times.filter((time: IdadosTime) => time.grupoPertencente === "D"),
      timesNoGrupoE: times.filter((time: IdadosTime) => time.grupoPertencente === "E"),
      timesNoGrupoF: times.filter((time: IdadosTime) => time.grupoPertencente === "F"),
      timesNoGrupoG: times.filter((time: IdadosTime) => time.grupoPertencente === "G"),
      timesNoGrupoH: times.filter((time: IdadosTime) => time.grupoPertencente === "H"),
    }
  }

  // @TODO MELHORAR ESSE METODO!!!!!!!!!!!!!!!  
  public matchDays(gruposTimes: IGruposTimes): IDisputasMatchDays {

    const day1: IMatchDay = {
      disputaGrupoA:  [gruposTimes.timesNoGrupoA[0].nomeDoPais, gruposTimes.timesNoGrupoA[1].nomeDoPais, 
                       gruposTimes.timesNoGrupoA[2].nomeDoPais, gruposTimes.timesNoGrupoA[3].nomeDoPais],

      disputaGrupoB: [gruposTimes.timesNoGrupoB[0].nomeDoPais, gruposTimes.timesNoGrupoB[1].nomeDoPais,
                      gruposTimes.timesNoGrupoB[2].nomeDoPais, gruposTimes.timesNoGrupoB[3].nomeDoPais],

      disputaGrupoC: [gruposTimes.timesNoGrupoC[0].nomeDoPais, gruposTimes.timesNoGrupoC[1].nomeDoPais,
                      gruposTimes.timesNoGrupoC[2].nomeDoPais, gruposTimes.timesNoGrupoC[3].nomeDoPais],

      disputaGrupoD: [gruposTimes.timesNoGrupoD[0].nomeDoPais, gruposTimes.timesNoGrupoD[1].nomeDoPais,
                      gruposTimes.timesNoGrupoD[2].nomeDoPais, gruposTimes.timesNoGrupoD[3].nomeDoPais],
                      
      disputaGrupoE: [gruposTimes.timesNoGrupoE[0].nomeDoPais, gruposTimes.timesNoGrupoE[1].nomeDoPais,
                      gruposTimes.timesNoGrupoE[2].nomeDoPais, gruposTimes.timesNoGrupoE[3].nomeDoPais],

      disputaGrupoF: [gruposTimes.timesNoGrupoF[0].nomeDoPais, gruposTimes.timesNoGrupoF[1].nomeDoPais,
                      gruposTimes.timesNoGrupoF[2].nomeDoPais, gruposTimes.timesNoGrupoF[3].nomeDoPais],

      disputaGrupoG: [gruposTimes.timesNoGrupoG[0].nomeDoPais, gruposTimes.timesNoGrupoG[1].nomeDoPais,
                      gruposTimes.timesNoGrupoG[2].nomeDoPais, gruposTimes.timesNoGrupoG[3].nomeDoPais],

      disputaGrupoH: [gruposTimes.timesNoGrupoH[0].nomeDoPais, gruposTimes.timesNoGrupoH[1].nomeDoPais,
                      gruposTimes.timesNoGrupoH[2].nomeDoPais, gruposTimes.timesNoGrupoH[3].nomeDoPais],
    }

    const day2: IMatchDay = {
      disputaGrupoA: [gruposTimes.timesNoGrupoA[0].nomeDoPais, gruposTimes.timesNoGrupoA[2].nomeDoPais,
                      gruposTimes.timesNoGrupoA[3].nomeDoPais, gruposTimes.timesNoGrupoA[1].nomeDoPais],
                      
      disputaGrupoB: [gruposTimes.timesNoGrupoB[0].nomeDoPais, gruposTimes.timesNoGrupoB[2].nomeDoPais,
                      gruposTimes.timesNoGrupoB[3].nomeDoPais, gruposTimes.timesNoGrupoB[1].nomeDoPais],

      disputaGrupoC: [gruposTimes.timesNoGrupoC[0].nomeDoPais, gruposTimes.timesNoGrupoC[2].nomeDoPais,
                      gruposTimes.timesNoGrupoC[3].nomeDoPais, gruposTimes.timesNoGrupoC[1].nomeDoPais],

      disputaGrupoD: [gruposTimes.timesNoGrupoD[0].nomeDoPais, gruposTimes.timesNoGrupoD[2].nomeDoPais,
                      gruposTimes.timesNoGrupoD[3].nomeDoPais, gruposTimes.timesNoGrupoD[1].nomeDoPais],
                      
      disputaGrupoE: [gruposTimes.timesNoGrupoE[0].nomeDoPais, gruposTimes.timesNoGrupoE[2].nomeDoPais,
                      gruposTimes.timesNoGrupoE[3].nomeDoPais, gruposTimes.timesNoGrupoE[1].nomeDoPais],

      disputaGrupoF: [gruposTimes.timesNoGrupoF[0].nomeDoPais, gruposTimes.timesNoGrupoF[2].nomeDoPais,
                      gruposTimes.timesNoGrupoF[3].nomeDoPais, gruposTimes.timesNoGrupoF[1].nomeDoPais],

      disputaGrupoG: [gruposTimes.timesNoGrupoG[0].nomeDoPais, gruposTimes.timesNoGrupoG[2].nomeDoPais,
                      gruposTimes.timesNoGrupoG[3].nomeDoPais, gruposTimes.timesNoGrupoG[1].nomeDoPais],

      disputaGrupoH: [gruposTimes.timesNoGrupoH[0].nomeDoPais, gruposTimes.timesNoGrupoH[2].nomeDoPais,
                      gruposTimes.timesNoGrupoH[3].nomeDoPais, gruposTimes.timesNoGrupoH[1].nomeDoPais],
    }

    const day3: IMatchDay = {
      disputaGrupoA: [gruposTimes.timesNoGrupoA[3].nomeDoPais, gruposTimes.timesNoGrupoA[0].nomeDoPais,
                      gruposTimes.timesNoGrupoA[1].nomeDoPais, gruposTimes.timesNoGrupoA[2].nomeDoPais],
                      
      disputaGrupoB: [gruposTimes.timesNoGrupoB[3].nomeDoPais, gruposTimes.timesNoGrupoB[0].nomeDoPais,
                      gruposTimes.timesNoGrupoB[1].nomeDoPais, gruposTimes.timesNoGrupoB[2].nomeDoPais],

      disputaGrupoC: [gruposTimes.timesNoGrupoC[3].nomeDoPais, gruposTimes.timesNoGrupoC[0].nomeDoPais,
                      gruposTimes.timesNoGrupoC[1].nomeDoPais, gruposTimes.timesNoGrupoC[2].nomeDoPais],

      disputaGrupoD: [gruposTimes.timesNoGrupoD[3].nomeDoPais, gruposTimes.timesNoGrupoD[0].nomeDoPais,
                      gruposTimes.timesNoGrupoD[1].nomeDoPais, gruposTimes.timesNoGrupoD[2].nomeDoPais],
                      
      disputaGrupoE: [gruposTimes.timesNoGrupoE[3].nomeDoPais, gruposTimes.timesNoGrupoE[0].nomeDoPais,
                      gruposTimes.timesNoGrupoE[1].nomeDoPais, gruposTimes.timesNoGrupoE[2].nomeDoPais],

      disputaGrupoF: [gruposTimes.timesNoGrupoF[3].nomeDoPais, gruposTimes.timesNoGrupoF[0].nomeDoPais,
                      gruposTimes.timesNoGrupoF[1].nomeDoPais, gruposTimes.timesNoGrupoF[2].nomeDoPais],

      disputaGrupoG: [gruposTimes.timesNoGrupoG[3].nomeDoPais, gruposTimes.timesNoGrupoG[0].nomeDoPais,
                      gruposTimes.timesNoGrupoG[1].nomeDoPais, gruposTimes.timesNoGrupoG[2].nomeDoPais],

      disputaGrupoH: [gruposTimes.timesNoGrupoH[3].nomeDoPais, gruposTimes.timesNoGrupoH[0].nomeDoPais,
                      gruposTimes.timesNoGrupoH[1].nomeDoPais, gruposTimes.timesNoGrupoH[2].nomeDoPais],
    }

    return {
      day1,
      day2,
      day3,
    }
  }

  // @TODO OTIMIZAR ESSE METODO COM PROMISE.ALL
  public async decidirVencedor(): Promise<Array<string>> {
    const times: Array<IdadosTime> = await this.buscarTodosOsTimes()

    const grupoTime: IGruposTimes = this.timesEmCadaGrupo(times);

    const vendoresDia1 = this.matchDays(grupoTime)

    const disputaGrupos = Object.keys(vendoresDia1.day1)

    const timesVencedoresMatchDay1 = []

    for (let i = 0; i <= disputaGrupos.length; i++) {
        // @ts-ignore
        timesVencedoresMatchDay1.push(utils.timeVencedor(vendoresDia1.day1[disputaGrupos[i]]))
    }

    return timesVencedoresMatchDay1;
  }
}
