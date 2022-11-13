import express, { Request, Response } from "express"
import { CopaController } from "../controller/copaController"

const server = express()

const copaController = new CopaController()
const path: string = "/copa"

/**
 * @swagger
 *  paths:
 *  /copa:
 *    get:
 *      tags:
 *        - Copa
 *      summary: Mostra todos os times salvos no Banco
 *      description: Mostra todos os times salvos no Banco
 *      responses:
 *        200:
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                example:
 *                 [
 *                    {
 *                      id: 1,
 *                      nomedopais: "Brasil",                 
 *                      qtddejogadores: 11,                 
 *                      treinador: "treinadorTeste",                 
 *                      capitao: "capitaoTeste",                 
 *                      estaemjogo: "Em jogo",                 
 *                      grupopertencente: "A",                                 
 *                    }    
 *                 ]
 *        422:
 *          description: Falha ao acessar DB
 */
server.get(`${path}`, async (req: express.Request, res: express.Response) => {

    const times = await copaController.buscarTodosOsTimes()

    if (times) {
        return res.json(times);
    }

    return res.send("Error");
})

/**
 * @swagger
 *  paths:
 *  /copa/cadastrar:
 *    post:
 *      tags:
 *        - Copa
 *      summary: Cadastra um time de cada vez
 *      description: Cadastra um time de cada vez
 *      parameters:
 *        - in: body
 *          name: copa
 *          description: Cadastra um time 
 *          schema:
 *            type: object
 *            required:
 *              - id
 *              - nomedopais
 *              - qtddejogadores
 *              - treinador
 *              - capitao
 *              - estaemjogo
 *              - grupopertencente
 *            properties:
 *              id:
 *                type: number
 *              nomedopais:
 *                type: string
 *              qtddejogadores:
 *                type: number
 *              treinador:
 *                type: string
 *              capitao:
 *                type: string
 *              estaemjogo:
 *                type: string
 *              grupopertencente:
 *                type: string
 *      responses:
 *        200:
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                example:
 *                 [
 *                    {
 *                      id: 1,
 *                      nomedopais: "Brasil",                 
 *                      qtddejogadores: 11,                 
 *                      treinador: "treinadorTeste",                 
 *                      capitao: "capitaoTeste",                 
 *                      estaemjogo: "Em jogo",                 
 *                      grupopertencente: "A",                                 
 *                    }    
 *                 ]
 *        422:
 *          description: Falha ao acessar DB
 */
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

/**
 * @swagger
 *  paths:
 *  /copa/atualizarTimes:
 *    put:
 *      tags:
 *        - Copa
 *      summary: Atualiza um time de cada vez
 *      description: Atualiza um time de cada vez
 *      parameters:
 *        - in: body
 *          name: copa
 *          description: Atualiza um time 
 *          schema:
 *            type: object
 *            required:
 *              - id
 *            properties:
 *              id:
 *                type: number
 *              nomedopais:
 *                type: string
 *              qtddejogadores:
 *                type: number
 *              treinador:
 *                type: string
 *              capitao:
 *                type: string
 *              estaemjogo:
 *                type: string
 *              grupopertencente:
 *                type: string
 *      responses:
 *        200:
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                example:
 *                 [
 *                    {
 *                      id: 1,
 *                      nomedopais: "Brasil",                 
 *                      qtddejogadores: 11,                 
 *                      treinador: "treinadorTeste",                 
 *                      capitao: "capitaoTeste",                 
 *                      estaemjogo: "Em jogo",                 
 *                      grupopertencente: "A",                                 
 *                    }    
 *                 ]
 *        422:
 *          description: Falha ao acessar DB
 */
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

/**
 * @swagger
 *  paths:
 *  /copa/listarAsDisputadasIniciais:
 *    get:
 *      tags:
 *        - Copa
 *      summary: listar as disputadas iniciais
 *      description: listar as disputadas iniciais
 *      responses:
 *        200:
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *        422:
 *          description: Falha ao acessar DB
 */
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

/**
 * @swagger
 *  paths:
 *  /copa/mostrarVencedorMatch2:
 *    post:
 *      tags:
 *        - Copa
 *      summary: mostrar os vencedor do Match1
 *      description: mostrar os vencedor do Match1
 *      parameters:
 *        - in: body
 *          name: copa
 *          description: mostrar os vencedor do Match1
 *          schema:
 *            type: array
 *            required:
 *              - idPais
 *              - qtdGol
 *              - qtdCartaoVermelho
 *              - qtdCartaoAmarelo
 *            properties:
 *              idPais:
 *                type: number
 *              qtdGol:
 *                type: number
 *              qtdCartaoVermelho:
 *                type: number
 *              qtdCartaoAmarelo:
 *                type: number
 *      responses:
 *        200:
 *          description: Salvos
 *        422:
 *          description: Falha ao acessar DB
 */
server.post(`${path}/mostrarVencedorMatch1`, async (req: Request, res: Response) => {
    try {
        const disputadasIniciais = await copaController.decidirVencedor(req.body)

        if (disputadasIniciais) {
            return res.json(disputadasIniciais);
        }

        return res.send("Error!")
    } catch(error) {
        return res.json(error)
    }
})

/**
 * @swagger
 *  paths:
 *  /copa/mostrarVencedorMatch2:
 *    post:
 *      tags:
 *        - Copa
 *      summary: mostrar os vencedor do Match2
 *      description: mostrar os vencedor do Match2
 *      parameters:
 *        - in: body
 *          name: copa
 *          description: mostrar os vencedor do Match2
 *          schema:
 *            type: array
 *            required:
 *              - idPais
 *              - qtdGol
 *              - qtdCartaoVermelho
 *              - qtdCartaoAmarelo
 *            properties:
 *              idPais:
 *                type: number
 *              qtdGol:
 *                type: number
 *              qtdCartaoVermelho:
 *                type: number
 *              qtdCartaoAmarelo:
 *                type: number
 *      responses:
 *        200:
 *          description: Salvos
 *        422:
 *          description: Falha ao acessar DB
 */
server.post(`${path}/mostrarVencedorMatch2`, async (req: Request, res: Response) => {
    try {
        const disputadasIniciais = await copaController.decidirVencedor(req.body)

        if (disputadasIniciais) {
            return res.json(disputadasIniciais);
        }

        return res.send("Error!")
    } catch(error) {
        return res.json(error)
    }
})

/**
 * @swagger
 *  paths:
 *  /copa/mostrarVencedorMatch3:
 *    post:
 *      tags:
 *        - Copa
 *      summary: mostrar os vencedor do Match3
 *      description: mostrar os vencedor do Match3
 *      parameters:
 *        - in: body
 *          name: copa
 *          description: mostrar os vencedor do Match3
 *          schema:
 *            type: array
 *            required:
 *              - idPais
 *              - qtdGol
 *              - qtdCartaoVermelho
 *              - qtdCartaoAmarelo
 *            properties:
 *              idPais:
 *                type: number
 *              qtdGol:
 *                type: number
 *              qtdCartaoVermelho:
 *                type: number
 *              qtdCartaoAmarelo:
 *                type: number
 *      responses:
 *        200:
 *          description: Salvos
 *        422:
 *          description: Falha ao acessar DB
 */
server.post(`${path}/mostrarVencedorMatch3`, async (req: Request, res: Response) => {
    try {
        const disputadasIniciais = await copaController.decidirVencedor(req.body)

        if (disputadasIniciais) {
            return res.json(disputadasIniciais);
        }

        return res.send("Error!")
    } catch(error) {
        return res.json(error)
    }
})

/**
 * @swagger
 *  paths:
 *  /copa/verVencedoresPartidas:
 *    get:
 *      tags:
 *        - Copa
 *      summary: Mostra todos os times vencedores de cada match day salvos no Banco
 *      description: Mostra todos os times salvos no Banco
 *      responses:
 *        200:
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                example:
 *                 [
 *                    {
 *                      id: 69,
 *                      nomedopais: "Holanda",                 
 *                      qtdgol: 3,                 
 *                      qtdcartaovermelho: 0,                 
 *                      qtdcartaoamarelo: 2,                 
 *                      pontuacao: 3,                 
 *                      tipodepartida: "MatchDay1"                                 
 *                    }    
 *                 ]
 *        422:
 *          description: Falha ao acessar DB
 */
server.get(`${path}/verVencedoresPartidas`, async (req: Request, res: Response) => {

    const times = await copaController.buscarTimesVendores()

    if (times) {
        return res.json(times);
    }

    return res.send("Error");
})

/**
 * @swagger
 *  paths:
 *  /copa/cadastrarTodosTimes:
 *    post:
 *      tags:
 *        - Copa
 *      summary: Cadastra todos time de cada vez
 *      description: Cadastra todos time de cada vez
 *      parameters:
 *        - in: body
 *          name: copa
 *          description: Insira um array de objetos com as seguintes propriedades
 *          schema:
 *            type: array
 *            required:
 *              - id
 *              - nomedopais
 *              - qtddejogadores
 *              - treinador
 *              - capitao
 *              - estaemjogo
 *              - grupopertencente
 *            properties:
 *              id:
 *                type: number
 *              nomedopais:
 *                type: string
 *              qtddejogadores:
 *                type: number
 *              treinador:
 *                type: string
 *              capitao:
 *                type: string
 *              estaemjogo:
 *                type: string
 *              grupopertencente:
 *                type: string
 *      responses:
 *        200:
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                example:
 *                 [
 *                    {
 *                      id: 1,
 *                      nomedopais: "Brasil",                 
 *                      qtddejogadores: 11,                 
 *                      treinador: "treinadorTeste",                 
 *                      capitao: "capitaoTeste",                 
 *                      estaemjogo: "Em jogo",                 
 *                      grupopertencente: "A",                                 
 *                    }    
 *                 ]
 *        422:
 *          description: Falha ao acessar DB
 */
server.post(`${path}/cadastrarTodosTimes`, async (req: Request, res: Response) => {
    try {
        const timeCadastrado = await copaController.cadastrarTodosTimes(req.body)

        if (timeCadastrado) {
            return res.json(timeCadastrado);
        }

        return res.json("Error! - Dados inseridos inválidos ou faltandes");
    } catch (error) {
        return res.json(error)
    }
})

/**
 * @swagger
 *  paths:
 *  /copa/matchdayVencedores:
 *    get:
 *      tags:
 *        - Copa
 *      summary: Mostra todos os times que venceu os matchdays salvos no Banco
 *      description: Mostra os times que vencedores os matchdays salvos no Banco
 *      responses:
 *        200:
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                example:
 *                 [
 *                    {
 *                      id: 34,
 *                      nomedopais: "Qatar",               
 *                      qtddejogadores: 11,                 
 *                      treinador: "treinadorTeste",                 
 *                      capitao: "capitaoTeste",                 
 *                      estaemjogo: "Em jogo",                 
 *                      qtdgol: 6,                                 
 *                      qtdcartaovermelho: 2,                                 
 *                      qtdcartaoamarelo: 3,                                 
 *                      pontuacao: 5,                                 
 *                      tipodepartida: "MatchDay3"                                                                
 *                    }    
 *                 ]
 *        422:
 *          description: Falha ao acessar DB
 */
server.get(`${path}/matchdayVencedores`, async (req: Request, res: Response) => {
    try {
        const times = await copaController.decidirVencedorMatchDay()

        if (times) {
            return res.json(times);
        }

        return res.send("Error");
    } catch(error) {
        return error
    }
})

/**
 * @swagger
 *  paths:
 *  /copa/buscarTimesVencedores:
 *    get:
 *      tags:
 *        - Copa
 *      summary: Mostra todos os times que venceu todos matchday salvos no Banco
 *      description: Mostra os times vencedores do matchdays salvos no Banco
 *      responses:
 *        200:
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                example:
 *                 [
 *                    {
 *                      id: 34,
 *                      nomedopais: "Qatar",               
 *                      qtddejogadores: 11,                 
 *                      treinador: "treinadorTeste",                 
 *                      capitao: "capitaoTeste",                 
 *                      estaemjogo: "Em jogo",                 
 *                      qtdgol: 6,                                 
 *                      qtdcartaovermelho: 2,                                 
 *                      qtdcartaoamarelo: 3,                                 
 *                      pontuacao: 5,                                 
 *                      tipodepartida: "MatchDay3"                                                                
 *                    }    
 *                 ]
 *        422:
 *          description: Falha ao acessar DB
 */
server.get(`${path}/buscarTimesVencedores`, async (req: Request, res: Response) => {
    try {
        const times = await copaController.buscarVencedoresDosMatchDaysNoDb()

        if (times) {
            return res.json(times);
        }

        return res.send("Error");
    } catch(error) {
        return error
    }
})

export default server
