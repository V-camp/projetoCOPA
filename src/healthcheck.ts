import {Response} from "express"
import http from "http"

let options = {
  timeout: 2000,
  host: 'localhost',
  port: process.env.PORT || 8080,
  path: '/healthz' // must be the same as HEALTHCHECK in Dockerfile
};

let request = http.request(options, (res: Response) => {
  console.info('STATUS: ' + res.status);
  process.exitCode = (res.status === 200) ? 0 : 1;
  process.exit();
});

request.on('error', function (err: any) {
  console.error('ERROR', err);
  process.exit(1);
});

request.end();
