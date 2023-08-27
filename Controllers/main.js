const AuthRouter = require("./Auth/Auth");

var express = require("express"),
  Router = express.Router();
Router.use("/Auth", AuthRouter);
Router.get("/", (req, res) => {
  res.json("Hello");
});
module.exports = Router;
