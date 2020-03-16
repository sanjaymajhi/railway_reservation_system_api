const async = require("async");
const mongoose = require("mongoose");
const validator = require("express-validator");
const moment = require("moment");

const Train = require("../models/train");
const Route = require("../models/routes");

exports.train_list = [
  validator
    .body("date", "not a valid date")
    .trim()
    .isISO8601(),
  validator.sanitizeBody("*").escape(),
  (req, res) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ found: "unsuccessful", error: errors.array() });
      return;
    }
    Route.findOne(
      { src_stn: req.body.from_stn, des_stn: req.body.to_stn },
      "_id route_code stations distance src_stn des_stn"
    )
      .populate("stations")
      .populate("src_stn")
      .populate("des_stn")
      .exec((err, result) => {
        const date = new Date(req.body.date);
        const day = date
          .toLocaleDateString("en-US", { weekday: "short" })
          .toLowerCase();
        if (req.body.class == "all") {
          //using var makes it usable outside ifelse..
          var search = { route: result._id, departing_days: day };
        } else {
          var search = {
            route: result._id,
            departing_days: day,
            available_tiers: req.body.class
          };
        }
        Train.find(search, (err, trains) => {
          if (err) {
            throw err;
          }
          if (trains.length === 0) {
            res.json({
              found: "unsuccessfull",
              error: { msg: "No trains available" }
            });
            return;
          } else {
            const route_detail = {
              src_stn: result.src_stn,
              des_stn: result.des_stn,
              distance: result.distance,
              stations: result.stations,
              route_code: result.route_code
            };

            res.json({
              found: "success",
              trains: trains,
              route_detail: route_detail
            });
          }
        });
      });
  }
];

exports.train_detail = (req, res) => {
  res.send("ok");
};

exports.train_create_post = [
  validator
    .body("name", "name can be min 4 and max 20 characters long ")
    .trim()
    .isLength({ min: 4, max: 20 }),
  validator.body("depart_time").trim(),
  validator.body("arrival_time"),
  validator.body("train_no").isNumeric(),
  validator.body("total_seats").isNumeric(),
  validator.body("coach_seats").isNumeric(),
  validator.body("ticket_cost").isNumeric(),

  validator.sanitizeBody("name").escape(),
  validator.sanitizeBody("depart_time").escape(),
  validator.sanitizeBody("arrival_time").escape(),
  validator.sanitizeBody("train_no").escape(),
  validator.sanitizeBody("total_seats").escape(),
  validator.sanitizeBody("coach_seats").escape(),
  validator.sanitizeBody("ticket_cost").escape(),

  (req, res) => {
    if (req.user_detail.admin) {
      const errors = validator.validationResult(req);
      if (!errors.isEmpty()) {
        res.json({ saved: "unsuccessful", error: errors.array() });
        return;
      }
      Train.findOne({ train_no: req.body.train_no }).exec((err, result) => {
        if (err) {
          throw err;
        }
        if (result) {
          res.json({
            saved: "unsuccessful",
            error: "train already present in database..."
          });
          return;
        } else {
          var train = new Train({
            name: req.body.name,
            train_no: req.body.train_no,
            available_tiers: req.body.available_tiers,
            departing_days: req.body.departing_days,
            route: req.body.route,
            depart_time: new Date("2000-01-01 " + req.body.depart_time),
            arrival_time: new Date("2000-01-01 " + req.body.arrival_time),
            coach_seats: req.body.coach_seats,
            total_seats: req.body.total_seats,
            ticket_cost: req.body.ticket_cost,
            available_seats: req.body.available_seats,
            total_coaches: req.body.total_coaches
          });
          train.save(err => {
            if (err) {
              throw new Error("save to database error");
            }
            res.json({ saved: "success" });
          });
        }
      });
    } else {
      res.json({
        saved: "unsuccessful",
        error: { msg: "You are not an admin" }
      });
      return;
    }
  }
];

exports.train_update_get = (req, res) => {
  res.send("ok");
};

exports.train_update_post = (req, res) => {
  res.send("ok");
};

exports.train_delete_get = (req, res) => {
  res.send("ok");
};

exports.train_delete_post = (req, res) => {
  res.send("ok");
};

exports.train_book_get = (req, res) => {
  res.send("ok");
};

exports.train_book_post = (req, res) => {
  res.send("ok");
};
