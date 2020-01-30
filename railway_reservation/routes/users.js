var express = require("express");
var Router = express.Router();

var userController = require("../controller/userController");

var auth = require("../auth");

/* GET users listing. */

Router.get("/register/", userController.user_register_get);
Router.post("/register/", userController.user_register_post);

Router.get("/login/", userController.user_login_get);
Router.post("/login/", userController.user_login_post);

Router.post("/profile", auth, userController.profile);
Router.get("/profile", auth, userController.profile);

Router.post("/update/", userController.user_update_post);

module.exports = Router;
