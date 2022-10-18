import { PrismaClient } from "@prisma/client"
import { dadosCadastroTime } from "../model/interfaces/CadastroTime"
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

    public async cadastrarTime(cadastroTime: dadosCadastroTime): Promise<object> {
        const timeCriado = await prisma.user.create({

            data: {
              name: cadastroTime.nomeDoPais,
              qtdJogadores: cadastroTime.qtdDeJogadores,
              liderDoTime: cadastroTime.lider,
              emJogo: timesEmJogo.EM_JOGO,
              posts: {
                create: {
                  title: 'My first post',
                  body: 'Lots of really interesting stuff',
                  slug: 'my-first-post',
                },
              },
            },
          })

        return { message: "salvo" } || timeCriado
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
