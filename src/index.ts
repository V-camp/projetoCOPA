import express, { Request,Response } from "express"
import CopaRotas from "../src/routes/copa"

const app = express();

app.use("/", CopaRotas)

app.get('/healthz', function (req: Request, res: Response) {
  res.send('I am happy and healthy\n');
});

module.exports = app;
