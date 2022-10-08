import express, { Request, Response } from "express"
import bodyParser from "body-parser"
import { CopaController } from "../controller/copaController"

const server = express()

const copaController = new CopaController()
const path: string = "copa"

server.post(`${path}/cadastrarTime`, async (req: Request, res: Response) => {

    const cadastroTime = req.body
    const timeCadastrado = await copaController.cadastrarTime(cadastroTime)

    if (timeCadastrado) {
        return res.send("Time cadastrado");
    }

    return res.send("Error!")
        
})
