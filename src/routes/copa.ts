import express, { Request, response, Response } from "express"
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

    return res.send("Error");
})

server.post(`${path}/cadastrar`, async (req: Request, res: Response) => {
    try {
        const cadastroTime = req.body
        const timeCadastrado = await copaController.cadastrarTime(cadastroTime)
    
        if (timeCadastrado) {
            return res.json(timeCadastrado);
        }
    
        return res.json("Error! - Dados inseridos inválidos ou faltandes");
    } catch (error) {
        return res.json(error)
    }
})

server.put(`${path}/atualizarTimes`, async (req: Request, res: Response) => {
    try {
        const timeAtualizado = await copaController.atualizarTime(req.body)
    
        if (timeAtualizado) {
            return res.json(timeAtualizado);
        }
    
        return res.send("Error!");
    } catch(error) {
        return res.send(error)
    }
})

server.get(`${path}/listarAsDisputadasIniciais`, async (req: Request, res: Response) => {
    try {
        const disputadasIniciais = await copaController.listarAsDisputadasIniciais()

        if (disputadasIniciais) {
            return res.json(disputadasIniciais);
        }
    
        return res.send("Error!")
    } catch(error) {
        return res.json(error)
    }
})

server.post(`${path}/mostrarVencedorMatch`, async (req: Request, res: Response) => {
    try {
        const disputadasIniciais = await copaController.decidirVencedor(req.body)

        if (disputadasIniciais) {
            return res.json(disputadasIniciais);
        }

        return res.send("Error!")
    } catch(error) {
        return response.json(error)
    }
})

export default server
