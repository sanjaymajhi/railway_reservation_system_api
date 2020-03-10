var express = require("express");
var Router = express.Router();

var trainController = require("../controller/trainController");
var stationController = require("../controller/stationController");
var ticketController = require("../controller/ticketController");
var routeController = require("../controller/routeController");
var otherController = require("../controller/otherController");

//train routes

Router.get("/train/create", trainController.train_create_get);
Router.post("/train/create", trainController.train_create_post);

Router.get("/train/:id", trainController.train_detail);
Router.get("/trains", trainController.train_list);

Router.get("/train/:id/update", trainController.train_update_get);
Router.post("/train/:id/update", trainController.train_update_post);

Router.get("/train/:id/delete", trainController.train_delete_get);
Router.post("/train/:id/delete", trainController.train_delete_post);

Router.get("/train/:id/book", trainController.train_book_get);
Router.post("/train/:id/book", trainController.train_book_post);

//route routes

Router.get("/route/create", routeController.route_create_get);
Router.post("/route/create", routeController.route_create_post);

Router.get("/routes", routeController.route_list);
Router.get("/route/:id", routeController.route_detail);

Router.get("/route/:id/update", routeController.route_update_get);
Router.post("/route/:id/update", routeController.route_update_post);

Router.get("/route/:id/delete", routeController.route_delete_get);
Router.post("/route/:id/delete", routeController.route_delete_post);

//station routes

Router.get("/station/create", stationController.station_create_get);
Router.post("/station/create", stationController.station_create_post);

Router.get("/stations", stationController.station_list);

Router.get("/station/:id/update", stationController.station_update_get);
Router.post("/station/:id/update", stationController.station_update_post);

Router.get("/station/:id/delete", stationController.station_delete_get);
Router.post("/station/:id/delete", stationController.station_delete_post);

//ticket routes

Router.get("/ticket/:id", ticketController.ticket_detail);

Router.get("/ticket/:id/cancel", ticketController.ticket_cancel_get);
Router.post("/ticket/:id/cancel", ticketController.ticket_cancel_post);

//other routes

Router.get("/about", otherController.about);
Router.get("/contact", otherController.contact_get);
Router.post("/contact", otherController.contact_post);

module.exports = Router;