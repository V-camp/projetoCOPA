import { PrismaClient } from "@prisma/client"
import { IdadosCadastroTime } from "../model/interfaces/CadastroTime"
import { dadosAtualizarTime } from "../model/interfaces/DadosAtualizarTime"
import { timesEmJogo } from "../model/enums/TimesEmJogo"
import { dadosTimePerdedor } from "model/interfaces/TimePerdedor"

const prisma = new PrismaClient()

export class CopaController {
    public async apresentarTimes(): Promise<Array<object>> {
        const time = await prisma.times.findMany();
        
        return [
            { Time: "Brasil" },
            { Time: "EUA" }
        ] || time
    }

    public async cadastrarTime(cadastroTime: IdadosCadastroTime): Promise<IdadosCadastroTime> {
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
}
