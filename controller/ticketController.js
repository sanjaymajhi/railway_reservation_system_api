var async = require("async");
var mongoose = require("mongoose");
var validator = require("express-validator");

const User = require("../models/user");
const Ticket = require("../models/ticket");
const Train = require("../models/train");

exports.create_ticket = (req, res) => {
  async.parallel(
    {
      user_detail: callback =>
        User.findOne({ _id: req.body.user }).exec(callback),
      train_detail: callback =>
        Train.findOne({ train_no: req.body.train_no }).exec(callback)
    },
    (err, result) => {
      if (err) {
        throw err;
      }

      var ticket = new Ticket({
        train_name: req.body.train_name,
        train_no: req.body.train_no,
        teir: req.body.teir,
        count: req.body.count,
        src_stn: req.body.src_stn,
        des_stn: req.body.des_stn,
        depart_date: req.body.depart_date,
        arrival_date: req.body.arrival_date,
        passengers: req.body.passengers,
        cost: req.body.cost,
        user: req.body.user,
        paymentId: req.body.paymentId,
        bookedOn: new Date()
      });

      ticket.save(async err => {
        if (err) {
          throw err;
        }
        let trains_booked = result.user_detail.trains_booked;
        trains_booked.push(ticket._id);
        var user = new User({
          f_name: result.user_detail.f_name,
          l_name: result.user_detail.l_name,
          dob: result.user_detail.dob,
          username: result.user_detail.username,
          password: result.user_detail.password,
          email: result.user_detail.email,
          mobile: result.user_detail.mobile,
          gender: result.user_detail.gender,
          trains_booked: trains_booked,
          admin: result.user_detail.admin,
          _id: result.user_detail._id
        });
        await User.findByIdAndUpdate(
          user._id,
          user,
          { useFindAndModify: false },
          err => {
            if (err) {
              throw err;
            }
          }
        );

        if (req.body.available_seats - req.body.count > 0) {
          var status = "AVL";
        } else {
          var status = "NAVL";
        }
        var flag = 0;
        for (var item in result.train_detail.availability) {
          if (
            new Date(result.train_detail.availability[item].date).getTime() ===
            new Date(req.body.depart_date).getTime()
          ) {
            result.train_detail.availability[item].available_seats =
              req.body.available_seats - req.body.count;
            result.train_detail.availability[item].status = status;
            flag = 1;
            break;
          }
        }

        if (flag == 0) {
          result.train_detail.availability.push({
            date: req.body.depart_date,
            available_seats: req.body.available_seats - req.body.count,
            status: status
          });
        }

        var train = new Train({
          name: result.train_detail.name,
          train_no: result.train_detail.train_no,
          available_tiers: result.train_detail.available_tiers,
          departing_days: result.train_detail.departing_days,
          route: result.train_detail.route,
          depart_time: result.train_detail.depart_time,
          arrival_time: result.train_detail.arrival_time,
          coach_seats: result.train_detail.coach_seats,
          total_coaches: result.train_detail.total_coaches,
          availability: result.train_detail.availability,
          ticket_cost: result.train_detail.ticket_cost,
          _id: result.train_detail._id
        });
        await Train.findByIdAndUpdate(
          train._id,
          train,
          { useFindAndModify: false },
          err => {
            if (err) {
              throw err;
            }
            res.json({ status: "saved", id: ticket._id });
          }
        );
      });
    }
  );
};

exports.ticket_search = [
  validator
    .body("pnr", "PNR no. is 24 characters long.")
    .trim()
    .isLength({ min: 20, max: 30 }),
  validator.sanitizeBody("pnr").escape(),
  (req, res) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ found: "unsuccessful", err: errors.array() });
      return;
    }
    Ticket.findOne({ _id: req.body.pnr })
      .populate("src_stn")
      .populate("des_stn")
      .populate("user")
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        if (result === null) {
          res.json({
            found: "unsuccessful",
            error: { msg: "No ticket found with given pnr no." }
          });
        } else {
          res.json({ found: "success", data: result });
        }
      });
  }
];
exports.ticket_cancel = (req, res) => {
  Ticket.findOne({ _id: req.body.id }).exec((err, result) => {
    if (err) {
      throw err;
    }
    var ticket = new Ticket({
      train_name: result.train_name,
      train_no: result.train_no,
      teir: result.teir,
      count: result.count,
      src_stn: result.src_stn,
      des_stn: result.des_stn,
      depart_date: result.depart_date,
      arrival_date: result.arrival_date,
      passengers: result.passengers,
      cost: result.cost,
      user: result.user,
      paymentId: result.paymentId + "cancelled",
      _id: req.body.id,
      bookedOn: result.bookedOn
    });
    Ticket.findByIdAndUpdate(
      req.body.id,
      ticket,
      { useFindAndModify: false },
      err => {
        if (err) {
          throw err;
        }
      }
    );

    Train.findOne({ train_no: ticket.train_no }).exec((err, train_detail) => {
      if (err) {
        throw err;
      }
      for (var item in train_detail.availability) {
        if (
          new Date(train_detail.availability[item].date).getTime() ===
          new Date(ticket.depart_date).getTime()
        ) {
          train_detail.availability[item].available_seats += ticket.count;
          train_detail.availability[item].status = "AVL";
          break;
        }
      }

      var train = new Train({
        name: train_detail.name,
        train_no: train_detail.train_no,
        available_tiers: train_detail.available_tiers,
        departing_days: train_detail.departing_days,
        route: train_detail.route,
        depart_time: train_detail.depart_time,
        arrival_time: train_detail.arrival_time,
        coach_seats: train_detail.coach_seats,
        total_coaches: train_detail.total_coaches,
        availability: train_detail.availability,
        ticket_cost: train_detail.ticket_cost,
        _id: train_detail._id
      });
      Train.findByIdAndUpdate(
        train._id,
        train,
        { useFindAndModify: false },
        err => {
          if (err) {
            throw err;
          }
          res.json({ cancelled: "success" });
        }
      );
    });
  });
};
