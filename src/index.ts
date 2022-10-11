// simple node web server that displays hello world
// optimized for Docker image

import express,{Request,Response} from "express"
// this example uses express web framework so we know what longer build times
// do and how Dockerfile layer ordering matters. If you mess up Dockerfile ordering
// you'll see long build times on every code change + build. If done correctly,
// code changes should be only a few seconds to build locally due to build cache.

import {MongoClient} from "mongodb"
// this example includes a connection to MongoDB

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

// Api
const app = express();

app.get('/', function (req: Request, res: Response) {
  res.send('Copa Hello World\n');
});

app.get('/healthz', function (req: Request, res: Response) {
	// do app logic here to determine if app is truly healthy
	// you should return 200 if healthy, and anything else will fail
	// if you want, you should be able to restrict this to localhost (include ipv4 and ipv6)
  res.send('I am happy and healthy\n');
});

module.exports = app;
