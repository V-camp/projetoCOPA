import express, { Request, Response } from "express"
import { IdadosTime } from "model/interfaces/DadosTime"
import { CopaController } from "../controller/copaController"

const server = express()

const copaController = new CopaController()
const path: string = "/copa"


server.get(`${path}`, async (req: Request, res: Response) => {

    const times = await copaController.buscarTodosOsTimes()

    if (times) {
        return res.json(times);
    }

    return res.send("Error!");
})

server.post(`${path}/cadastrar`, async (req: express.Request, res: express.Response) => {

    const cadastroTime = req.body
    const timeCadastrado = await copaController.cadastrarTime(cadastroTime)

    if (timeCadastrado) {
        return res.json(timeCadastrado);
    }

    return res.json("Error! - Dados inseridos inválidos ou faltandes");
})

server.put(`${path}/atualizarTimes`, async (req: Request, res: Response) => {

    const time = req.body
    const timeAtualizado = await copaController.atualizarTime(time)

    if (timeAtualizado) {
        return res.json(timeAtualizado);
    }

    return res.send("Error!");
})

server.post(`${path}/eliminarTime`, async (req: Request, res: Response) => {

    const time = req.body
    const timePerdedor = await copaController.eliminarTime(time)

    if (timePerdedor) {
        return res.json(timePerdedor);
    }

    return res.send("Error!")
})

server.get(`${path}/listarAsDisputadasIniciais`, async (req: Request, res: Response) => {

    const disputadasIniciais = await copaController.listarAsDisputadasIniciais()

    if (disputadasIniciais) {
        return res.json(disputadasIniciais);
    }

    return res.send("Error!")
})

server.get(`${path}/mostrarVencedorDoMatch`, async (req: Request, res: Response) => {

    const disputadasIniciais = await copaController.decidirVencedor()

    if (disputadasIniciais) {
        return res.json(disputadasIniciais);
    }

    return res.send("Error!")
})


server.get(`${path}/teste`, async (req: Request, res: Response) => {

    const teste = req.body

    return res.json("pong")
})

export default server
