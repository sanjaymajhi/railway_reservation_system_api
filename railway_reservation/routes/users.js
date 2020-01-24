var express = require("express");
var Router = express.Router();

var userController = require("../controller/userController");

/* GET users listing. */
Router.get("/", function(req, res, next) {
  res.send("ok");
});

Router.get("/:id/", userController.user_detail);

Router.get("/create/", userController.user_register_get);
Router.post("/create/", userController.user_register_post);

Router.get("/:id/update/", userController.user_update_get);
Router.post("/:id/update/", userController.user_update_post);

Router.get("/login/", userController.user_login_get);
Router.post("/login/", userController.user_login_post);

module.exports = Router;
