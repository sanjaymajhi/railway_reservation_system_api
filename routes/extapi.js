var express = require("express");
var Router = express.Router();

var extapiController = require("../controller/extapiController");

Router.get("/payments/:id", extapiController.paymentFetch);
Router.get("/payments/:id/refunds", extapiController.refundFetch);
