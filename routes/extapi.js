var express = require("express");
var Router = express.Router();

var extapiController = require("../controller/extapiController");

Router.get("/payments/:id", extapiController.paymentFetch);

Router.post("/payments/:id/refund", extapiController.paymentRefund);
Router.get("/payments/:id/refunds", extapiController.refundFetch);

Router.get("/invoices/", extapiController.ticketStatus);

Router.get("/invoices/:id", extapiController.ticket_book_get);
Router.post("/invoices/", extapiController.ticket_book_post);

module.exports = Router;
