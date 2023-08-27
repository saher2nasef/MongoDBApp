const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const Router = require("./Controllers/main");

const app = express();
const _PORT = 1000;

app.use(bodyParser.json());
let connect = mongoose
  .connect("mongodb://127.0.0.1:27017/oshb")
  .then(() => {
    console.log("Connect");
  })
  .catch((e) => {
    console.log("DisConnect");
  });

app.use("/API", Router);

app.listen(_PORT, () => {
  console.log(`http://localhost:${_PORT}/`);
});
