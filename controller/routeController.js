var async = require("async");
var mongoose = require("mongoose");
const validator = require("express-validator");

var Route = require("../models/routes");

exports.route_detail = (req, res) => {
  res.send("ok");
};

exports.route_list = (req, res) => {
  Route.find({}, "_id route_code").exec((err, routes) => {
    if (err) {
      throw err;
    }
    res.json({ list: routes });
  });
};

exports.route_create_post = [
  validator
    .body("distance", "distance can only be a number")
    .trim()
    .isNumeric(),
  validator.sanitizeBody("distance").escape(),
  (req, res, next) => {
    if (req.user_detail.admin) {
      const errors = validator.validationResult(req);
      if (!errors.isEmpty()) {
        res.json({ saved: "unsuccessful", error: errors.array() });
        return;
      }
      Route.findOne({ route_code: req.body.route_code }).exec(
        async (err, result) => {
          if (err) {
            throw new Error("route search error");
          }
          if (result) {
            res.json({
              saved: "unsuccessful",
              error: "route already exists..."
            });
            return;
          } else {
            console.log(req.body);
            var route = new Route({
              src_stn: req.body.src_stn,
              des_stn: req.body.des_stn,
              stations: req.body.stations,
              distance: req.body.distance,
              route_code: req.body.route_code
            });
            await route.save(err => {
              if (err) {
                throw new Error("unable to save to database...");
              }
              res.status(200).json({ saved: "success" });
            });
          }
        }
      );
    } else {
      res.json({
        saved: "unsuccessful",
        error: { msg: "You are not an admin" }
      });
      return;
    }
  }
];

exports.route_update_get = (req, res) => {
  res.send("ok");
};

exports.route_update_post = (req, res) => {
  res.send("ok");
};

exports.route_delete_get = (req, res) => {
  res.send("ok");
};

exports.route_delete_post = (req, res) => {
  res.send("ok");
};
