var async = require("async");
var mongoose = require("mongoose");
const validator = require("express-validator");

var Station = require("../models/station");

exports.station_list = (req, res) => {
  Station.find({}, "name code").exec((err, stations) => {
    if (err) {
      throw err;
    }
    res.json({ list: stations });
  });
};

exports.station_create_post = [
  validator
    .body("name", "Name min 5 character and max 30 character")
    .trim()
    .isLength({ min: 5, max: 30 }),
  validator
    .body("code", "code can be of 3 or 4 characters")
    .trim()
    .isLength({ min: 3, max: 4 }),

  validator.sanitizeBody("name").escape(),
  validator.sanitizeBody("code").escape(),

  (req, res, next) => {
    if (req.user_detail.admin) {
      const errors = validator.validationResult(req);
      if (!errors.isEmpty()) {
        res.json({ saved: "unsuccessful", error: errors.array() });
        return;
      }
      Station.findOne({ code: req.body.code }, "code").exec(
        async (err, result) => {
          if (err) {
            throw err;
          }
          if (result) {
            res.json({
              saved: "unsuccessful",
              error: "station already exists"
            });
          } else {
            var station = new Station({
              name: req.body.name,
              code: req.body.code
            });
            await station.save(err => {
              if (err) {
                throw err;
              }
            });
            res.status(200).json({ saved: "success" });
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

exports.station_update_get = (req, res) => {
  res.send("ok");
};
exports.station_update_post = (req, res) => {
  res.send("ok");
};

exports.station_delete_get = (req, res) => {
  res.send("ok");
};
exports.station_delete_post = (req, res) => {
  res.send("ok");
};
