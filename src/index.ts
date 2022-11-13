import express, { Request,Response } from "express"
import CopaRotas from "./routes/copa"
import bodyParser from "body-parser";
import { SwaggerApi } from "./routes/swagger.api"

const app = express();

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));
app.use("/", CopaRotas);

const rotaSwagger = new SwaggerApi()
rotaSwagger.swagger(app)

app.get('/healthz', function (req: Request, res: Response) {
  res.send('I am happy and healthy\n');
});

module.exports = app;
