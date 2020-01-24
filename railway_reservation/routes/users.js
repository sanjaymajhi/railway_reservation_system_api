var express = require("express");
var Router = express.Router();

var userController = require("../controller/userController");

/* GET users listing. */

Router.get("/register/", userController.user_register_get);
Router.post("/register/", userController.user_register_post);

Router.get("/login/", userController.user_login_get);
Router.post("/login/", userController.user_login_post);

Router.get("/:id/", userController.user_detail);

Router.get("/:id/update/", userController.user_update_get);
Router.post("/:id/update/", userController.user_update_post);

module.exports = Router;
