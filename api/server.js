/*This is just for developing purpose only.
The production deployment will be done on AWS Lambda.
Hence the lambda will call the handler function in ./index.js directly
without any server requirement.
As this is only for development, always keep only one API with empty route,
and handle all the functionality in that API. Don't add multiple APIs.*/

const express = require("express");
const cors = require("cors");
const handler = require("./index");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/", async (req, res) => {
  let event = {
    queryStringParameters: req.query,
    key: req.body,
  };
  event.queryStringParameters.key = req.body;
  let response = await handler.handler(event);
  res.set(response.headers);
  res.status(response.statusCode).json(response.body);
});

const port = 8000;
app.listen(port, () => {
  console.info("Server listening at port ", port);
});
