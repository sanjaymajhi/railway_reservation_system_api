var express = require("express");
var Router = express.Router();

//train controller

Router.get("/train/:id", trainController.train_detail);

//route controller

Router.get("/train_list/", routeController.train_list);
Router.get("/routes", routeController.route_list);

Router.get("/route/create", routeController.route_create_get);
Router.post("/route/create", routeController.route_create_post);

Router.get("/route/:id", routeController.route_detail);

Router.get("/route/update", routeController.route_update_get);
Router.post("/route/update", routeController.route_update_post);

//station controller

Router.get("/stations", stationController.station_list);
Router.get("/station/:id", stationController.station_detail);

Router.get("/station/create", stationController.station_create_get);
Router.get("/station/create", stationController.station_create_post);

Router.get("/station/update", stationController.station_update_get);
Router.get("/station/update", stationController.station_update_post);

//user controller

Router.get("/users", userController.user_list);

Router.get("/user/:id", userController.user_detail);
Router.post("/user/:id", userController.user_update);

//ticket controller

Router.get("/train/:id/book", ticketController.book_get);
Router.post("/train/:id/book", ticketController.book_post);

//other controller

Router.get("/about", otherController.about);
Router.get("/contact", otherController.contact_get);
Router.post("/contact", otherController.contact_post);
