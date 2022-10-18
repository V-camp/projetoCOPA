import express, { Request,Response } from "express"
import { MongoClient } from "mongodb"
import CopaRotas from "../src/routes/copa"

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DATABASE_NAME
} = process.env;

// // Connection URL
// const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}`;

// // Create a new MongoClient
// const client = new MongoClient(url);

// let db;
// // Use connect method to connect to the Server
// setTimeout(() => {
//   client.connect(function(err) {
//     if (err) {
//       return console.error(err);
//     }
//     console.log("Connected successfully to database");
//     db = client.db(MONGO_DATABASE_NAME);
//   });
// }, 2000);

const app = express();

app.use("/", CopaRotas)

app.get('/healthz', function (req: Request, res: Response) {
  res.send('I am happy and healthy\n');
});

module.exports = app;
