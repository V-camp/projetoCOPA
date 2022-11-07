import express, { Request,Response } from "express"
import CopaRotas from "./routes/copa"

// Only to test
import { PrismaClient } from '@prisma/client'
import bodyParser from "body-parser";
const prisma = new PrismaClient()

const app = express();

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));
app.use("/", CopaRotas);

app.get('/healthz', function (req: Request, res: Response) {
  res.send('I am happy and healthy\n');
});


// Test CRUD by Wedsley
app.post('/insertest', async function (req: Request, res: Response) {
    const test = await prisma.teste.create({
        data: {
            String: "String de Teste"
        },
    });

    res.send(test)
});

app.get('/getest', async function (req: Request, res: Response) {
    const test = await prisma.teste.findMany();
    res.send(test)
});

module.exports = app;
