var express = require("express");
var Router = express.Router();

var trainController = require("../controller/trainController");
var stationController = require("../controller/stationController");
var ticketController = require("../controller/ticketController");
var routeController = require("../controller/routeController");
var otherController = require("../controller/otherController");

const auth = require("../auth");

//train routes
Router.post("/train/create", auth, trainController.train_create_post);

Router.get("/train/:id", trainController.train_detail);
Router.post("/trains", trainController.train_list);

Router.get("/train/:id/update", trainController.train_update_get);
Router.post("/train/:id/update", trainController.train_update_post);

Router.get("/train/:id/delete", trainController.train_delete_get);
Router.post("/train/:id/delete", trainController.train_delete_post);

Router.get("/train/book", trainController.train_book_get);
Router.post("/train/book", trainController.train_book_post);

Router.post("/train/status", trainController.train_availability);

//route routes

Router.post("/route/create", auth, routeController.route_create_post);

Router.get("/routes", routeController.route_list);
Router.get("/route/:id", routeController.route_detail);

Router.get("/route/:id/update", routeController.route_update_get);
Router.post("/route/:id/update", routeController.route_update_post);

Router.get("/route/:id/delete", routeController.route_delete_get);
Router.post("/route/:id/delete", routeController.route_delete_post);

//station routes

Router.post("/station/create", auth, stationController.station_create_post);

Router.get("/stations", stationController.station_list);

Router.get("/station/:id/update", stationController.station_update_get);
Router.post("/station/:id/update", stationController.station_update_post);

Router.get("/station/:id/delete", stationController.station_delete_get);
Router.post("/station/:id/delete", stationController.station_delete_post);

//ticket routes

Router.post("/ticket/", ticketController.create_ticket);

Router.post("/ticket/search/", ticketController.ticket_search);
Router.post("/ticket/cancel", ticketController.ticket_cancel);

//other routes

Router.get("/about", otherController.about);
Router.get("/contact", otherController.contact_get);
Router.post("/contact", otherController.contact_post);

module.exports = Router;
