const async = require("async");
const mongoose = require("mongoose");
const validator = require("express-validator");
const moment = require("moment");

const Train = require("../models/train");

exports.train_list = (req, res) => {
  res.send("ok");
};

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
