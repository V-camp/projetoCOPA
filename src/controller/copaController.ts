import { PrismaClient } from "@prisma/client"
import { IdadosCadastroTime } from "../model/interfaces/CadastroTime"
import { dadosAtualizarTime } from "../model/interfaces/DadosAtualizarTime"
import { timesEmJogo } from "../model/enums/TimesEmJogo"
import { dadosTimePerdedor } from "model/interfaces/TimePerdedor"
import { IGruposTimes } from "model/interfaces/GruposDosTimes"
import { IMatchDay } from "model/interfaces/MatchDay"
import { IDisputasMatchDays } from "model/interfaces/DisputasMatchDays"

const prisma = new PrismaClient()

export class CopaController {
  public async buscarTodosOsTimes(): Promise<Array<IdadosCadastroTime>> {
      const time = await prisma.times.findMany();
      
      return [
        // @ts-ignore
          { Time: "Brasil" },
          { Time: "EUA" }
      ] || time
  }

  public async cadastrarTime(cadastroTime: IdadosCadastroTime): Promise<IdadosCadastroTime> {

    const timeJaExiste: IdadosCadastroTime = await prisma.times.findUnique({
      where: {
        nomeDoPais: cadastroTime.nomeDoPais,
      },
    })

    const quantidadeDeTimes: Array<IdadosCadastroTime> = await this.buscarTodosOsTimes()

    const grupos: Array<string> = []

    quantidadeDeTimes.forEach((timeAtual: IdadosCadastroTime) => grupos.push(timeAtual.grupoPertencente))
      
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
      const timeCriado: IdadosCadastroTime = await prisma.user.create({
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

    const times: Array<IdadosCadastroTime> = await this.buscarTodosOsTimes()

    const grupoTime: IGruposTimes = this.timesEmCadaGrupo(times);

    const matchDay = this.matchDays(grupoTime);

    return matchDay;
  }

  public timesEmCadaGrupo(times: Array<IdadosCadastroTime>) {
    return {
      timesNoGrupoA: times.filter((time: IdadosCadastroTime) => time.grupoPertencente === "A"),
      timesNoGrupoB: times.filter((time: IdadosCadastroTime) => time.grupoPertencente === "B"),
      timesNoGrupoC: times.filter((time: IdadosCadastroTime) => time.grupoPertencente === "C"),
      timesNoGrupoD: times.filter((time: IdadosCadastroTime) => time.grupoPertencente === "D"),
      timesNoGrupoE: times.filter((time: IdadosCadastroTime) => time.grupoPertencente === "E"),
      timesNoGrupoF: times.filter((time: IdadosCadastroTime) => time.grupoPertencente === "F"),
      timesNoGrupoG: times.filter((time: IdadosCadastroTime) => time.grupoPertencente === "G"),
      timesNoGrupoH: times.filter((time: IdadosCadastroTime) => time.grupoPertencente === "H"),
    }
  }

  // @TODO MELHORAR ESSE METODO!!!!!!!!!!!!!!!  
  public matchDays(gruposTimes: IGruposTimes): IDisputasMatchDays {

    const day1: IMatchDay = {
      disputaGrupoA: `${gruposTimes.timesNoGrupoA[0].nomeDoPais} vs ${gruposTimes.timesNoGrupoA[1].nomeDoPais}\n
                      ${gruposTimes.timesNoGrupoA[2].nomeDoPais} vs ${gruposTimes.timesNoGrupoA[3].nomeDoPais}`,

      disputaGrupoB: `${gruposTimes.timesNoGrupoB[0].nomeDoPais} vs ${gruposTimes.timesNoGrupoB[1].nomeDoPais}\n
                      ${gruposTimes.timesNoGrupoB[2].nomeDoPais} vs ${gruposTimes.timesNoGrupoB[3].nomeDoPais}`,

      disputaGrupoC: `${gruposTimes.timesNoGrupoC[0].nomeDoPais} vs ${gruposTimes.timesNoGrupoC[1].nomeDoPais}\n
                      ${gruposTimes.timesNoGrupoC[2].nomeDoPais} vs ${gruposTimes.timesNoGrupoC[3].nomeDoPais}`,

      disputaGrupoD: `${gruposTimes.timesNoGrupoD[0].nomeDoPais} vs ${gruposTimes.timesNoGrupoD[1].nomeDoPais}\n
                      ${gruposTimes.timesNoGrupoD[2].nomeDoPais} vs ${gruposTimes.timesNoGrupoD[3].nomeDoPais}`,
                      
      disputaGrupoE: `${gruposTimes.timesNoGrupoE[0].nomeDoPais} vs ${gruposTimes.timesNoGrupoE[1].nomeDoPais}\n
                      ${gruposTimes.timesNoGrupoE[2].nomeDoPais} vs ${gruposTimes.timesNoGrupoE[3].nomeDoPais}`,

      disputaGrupoF: `${gruposTimes.timesNoGrupoF[0].nomeDoPais} vs ${gruposTimes.timesNoGrupoF[1].nomeDoPais}\n
                      ${gruposTimes.timesNoGrupoF[2].nomeDoPais} vs ${gruposTimes.timesNoGrupoF[3].nomeDoPais}`,

      disputaGrupoG: `${gruposTimes.timesNoGrupoG[0].nomeDoPais} vs ${gruposTimes.timesNoGrupoG[1].nomeDoPais}\n
                      ${gruposTimes.timesNoGrupoG[2].nomeDoPais} vs ${gruposTimes.timesNoGrupoG[3].nomeDoPais}`,

      disputaGrupoH: `${gruposTimes.timesNoGrupoH[0].nomeDoPais} vs ${gruposTimes.timesNoGrupoH[1].nomeDoPais}\n
                      ${gruposTimes.timesNoGrupoH[2].nomeDoPais} vs ${gruposTimes.timesNoGrupoH[3].nomeDoPais}`,
    }

    const day2: IMatchDay = {
      disputaGrupoA: `${gruposTimes.timesNoGrupoA[0].nomeDoPais} vs ${gruposTimes.timesNoGrupoA[2].nomeDoPais}\n
                      ${gruposTimes.timesNoGrupoA[3].nomeDoPais} vs ${gruposTimes.timesNoGrupoA[1].nomeDoPais}`,
                      
      disputaGrupoB: `${gruposTimes.timesNoGrupoB[0].nomeDoPais} vs ${gruposTimes.timesNoGrupoB[2].nomeDoPais}\n
                      ${gruposTimes.timesNoGrupoB[3].nomeDoPais} vs ${gruposTimes.timesNoGrupoB[1].nomeDoPais}`,

      disputaGrupoC: `${gruposTimes.timesNoGrupoC[0].nomeDoPais} vs ${gruposTimes.timesNoGrupoC[2].nomeDoPais}\n
                      ${gruposTimes.timesNoGrupoC[3].nomeDoPais} vs ${gruposTimes.timesNoGrupoC[1].nomeDoPais}`,

      disputaGrupoD: `${gruposTimes.timesNoGrupoD[0].nomeDoPais} vs ${gruposTimes.timesNoGrupoD[2].nomeDoPais}\n
                      ${gruposTimes.timesNoGrupoD[3].nomeDoPais} vs ${gruposTimes.timesNoGrupoD[1].nomeDoPais}`,
                      
      disputaGrupoE: `${gruposTimes.timesNoGrupoE[0].nomeDoPais} vs ${gruposTimes.timesNoGrupoE[2].nomeDoPais}\n
                      ${gruposTimes.timesNoGrupoE[3].nomeDoPais} vs ${gruposTimes.timesNoGrupoE[1].nomeDoPais}`,

      disputaGrupoF: `${gruposTimes.timesNoGrupoF[0].nomeDoPais} vs ${gruposTimes.timesNoGrupoF[2].nomeDoPais}\n
                      ${gruposTimes.timesNoGrupoF[3].nomeDoPais} vs ${gruposTimes.timesNoGrupoF[1].nomeDoPais}`,

      disputaGrupoG: `${gruposTimes.timesNoGrupoG[0].nomeDoPais} vs ${gruposTimes.timesNoGrupoG[2].nomeDoPais}\n
                      ${gruposTimes.timesNoGrupoG[3].nomeDoPais} vs ${gruposTimes.timesNoGrupoG[1].nomeDoPais}`,

      disputaGrupoH: `${gruposTimes.timesNoGrupoH[0].nomeDoPais} vs ${gruposTimes.timesNoGrupoH[2].nomeDoPais}\n
                      ${gruposTimes.timesNoGrupoH[3].nomeDoPais} vs ${gruposTimes.timesNoGrupoH[1].nomeDoPais}`,
    }

    const day3: IMatchDay = {
      disputaGrupoA: `${gruposTimes.timesNoGrupoA[3].nomeDoPais} vs ${gruposTimes.timesNoGrupoA[0].nomeDoPais}\n
                      ${gruposTimes.timesNoGrupoA[1].nomeDoPais} vs ${gruposTimes.timesNoGrupoA[2].nomeDoPais}`,
                      
      disputaGrupoB: `${gruposTimes.timesNoGrupoB[3].nomeDoPais} vs ${gruposTimes.timesNoGrupoB[0].nomeDoPais}\n
                      ${gruposTimes.timesNoGrupoB[1].nomeDoPais} vs ${gruposTimes.timesNoGrupoB[2].nomeDoPais}`,

      disputaGrupoC: `${gruposTimes.timesNoGrupoC[3].nomeDoPais} vs ${gruposTimes.timesNoGrupoC[0].nomeDoPais}\n
                      ${gruposTimes.timesNoGrupoC[1].nomeDoPais} vs ${gruposTimes.timesNoGrupoC[2].nomeDoPais}`,

      disputaGrupoD: `${gruposTimes.timesNoGrupoD[3].nomeDoPais} vs ${gruposTimes.timesNoGrupoD[0].nomeDoPais}\n
                      ${gruposTimes.timesNoGrupoD[1].nomeDoPais} vs ${gruposTimes.timesNoGrupoD[2].nomeDoPais}`,
                      
      disputaGrupoE: `${gruposTimes.timesNoGrupoE[3].nomeDoPais} vs ${gruposTimes.timesNoGrupoE[0].nomeDoPais}\n
                      ${gruposTimes.timesNoGrupoE[1].nomeDoPais} vs ${gruposTimes.timesNoGrupoE[2].nomeDoPais}`,

      disputaGrupoF: `${gruposTimes.timesNoGrupoF[3].nomeDoPais} vs ${gruposTimes.timesNoGrupoF[0].nomeDoPais}\n
                      ${gruposTimes.timesNoGrupoF[1].nomeDoPais} vs ${gruposTimes.timesNoGrupoF[2].nomeDoPais}`,

      disputaGrupoG: `${gruposTimes.timesNoGrupoG[3].nomeDoPais} vs ${gruposTimes.timesNoGrupoG[0].nomeDoPais}\n
                      ${gruposTimes.timesNoGrupoG[1].nomeDoPais} vs ${gruposTimes.timesNoGrupoG[2].nomeDoPais}`,

      disputaGrupoH: `${gruposTimes.timesNoGrupoH[3].nomeDoPais} vs ${gruposTimes.timesNoGrupoH[0].nomeDoPais}\n
                      ${gruposTimes.timesNoGrupoH[1].nomeDoPais} vs ${gruposTimes.timesNoGrupoH[2].nomeDoPais}`,
    }

    return {
      day1,
      day2,
      day3,
    }
  }
}
