var async = require("async");
var mongoose = require("mongoose");

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
        paymentId: req.body.paymentId
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
            console.log("saved");
          }
        );

        var availability = {
          date: req.body.depart_date,
          available_seats: req.body.available_seats,
          status: req.body.status
        };
        let train_availability = result.train_detail.availability.push(
          availability
        );

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
          availability: train_availability,
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
            console.log("saved");
          }
        );
      });
    }
  );
};

exports.ticket_cancel_get = (req, res) => {
  res.send("ok");
};
exports.ticket_cancel_post = (req, res) => {
  res.send("ok");
};
