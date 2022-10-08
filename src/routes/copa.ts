import express, { Request, Response } from "express"
import { CopaController } from "../controller/copaController"

const server = express()

const copaController = new CopaController()
const path: string = "copa"

server.get(`${path}`, async (req: Request, res: Response) => {

    const timeEmJogo = req.body
    const times = await copaController.apresentarTimes(timeEmJogo)

    if (times) {
        return res.json(times);
    }

    return res.send("Error!")        
})

server.post(`${path}/cadastrarTime`, async (req: Request, res: Response) => {

    const cadastroTime = req.body
    const timeCadastrado = await copaController.cadastrarTime(cadastroTime)

    if (timeCadastrado) {
        return res.send("Time cadastrado");
    }

    return res.send("Error!")        
})

server.put(`${path}/atualizarTimes`, async (req: Request, res: Response) => {

    const time = req.body
    const timeAtualizado = await copaController.atualizarTime(time)

    if (timeAtualizado) {
        return res.json(timeAtualizado);
    }

    return res.send("Error!")        
})

server.post(`${path}/eliminarTime`, async (req: Request, res: Response) => {

    const time = req.body
    const timePerdedor  = await copaController.eliminarTime(time)

    if (timePerdedor) {
        return res.json(timePerdedor);
    }

    return res.send("Error!")        
})
