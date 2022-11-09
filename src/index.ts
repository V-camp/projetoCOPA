import express, { Request,Response } from "express"
import CopaRotas from "./routes/copa"

// Only to test
//@ts-ignore
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

module.exports = app;
