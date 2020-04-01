var express = require("express");
var Router = express.Router();

var userController = require("../controller/userController");

var auth = require("../auth");

/* GET users listing. */

Router.post("/register/", userController.user_register_post);

Router.post("/login/", userController.user_login_post);

Router.post("/profile", auth, userController.profile);
Router.get("/profile", auth, userController.profile);

Router.post("/update/", auth, userController.user_update_post);
Router.post("/change_pass/", auth, userController.change_pass);

Router.post("/tickets/", auth, userController.tickets);
Router.post("/payment_ids/", auth, userController.paymentIds);

module.exports = Router;
