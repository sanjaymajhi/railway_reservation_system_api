var async = require("async");
var mongoose = require("mongoose");

var User = require("../models/user");

var validator = require("express-validator");

var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");

var BodyParser = require("body-parser");
//for recaptcha
var Request = require("request-promise");

exports.profile = (req, res) => {
  User.findById(req.user_detail.id).exec((err, details) => {
    if (details) {
      res.status(200).json(details);
    } else {
      res.send("no token");
    }
  });
};

exports.user_register_post = [
  validator
    .body("f_name", "First Name should have min 2 and max 20 characters")
    .trim()
    .isLength({ min: 2, max: 20 }),
  validator
    .body("l_name", "Last Name should have min 2 and max 20 characters")
    .trim()
    .isLength({ min: 2, max: 20 }),
  validator
    .body("username", "Username should have min 5 and max 20 characters")
    .trim()
    .isLength({ min: 5, max: 20 })
    .isAlphanumeric()
    .withMessage("Only Alpha numeric charcaters allowed in username"),
  validator.body("dob", "Invalid date").trim().isISO8601(),
  validator
    .body("password", "password length min 8 and max 15")
    .trim()
    .isLength({ min: 8, max: 15 }),
  validator.body("email", "Invalid Email").trim().isEmail(),
  validator
    .body("mobile", "Invalid Mobile")
    .trim()
    .isLength({ min: 10, max: 10 }),

  validator.sanitizeBody("f_name").escape(),
  validator.sanitizeBody("l_name").escape(),
  validator.sanitizeBody("mobile").escape(),
  validator.sanitizeBody("username").escape(),

  (req, res) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        saved: "unsuccessful",
        errors: errors.array(),
      });
      return;
    }

    User.find({ email: req.body.email }, "email").exec(async (err, email) => {
      if (err) {
        throw err;
      }
      if (email.length) {
        res.json({
          saved: "unsuccessful",
          error: { msg: "Email already exists" },
        });
        return;
      } else {
        var salt = await bcrypt.genSalt(10);
        var password = await bcrypt.hash(req.body.password, salt);

        var user = new User({
          f_name: req.body.f_name,
          l_name: req.body.l_name,
          dob: req.body.dob,
          mobile: req.body.mobile,
          username: req.body.username,
          password: password,
          gender: req.body.gender,
          email: req.body.email,
          trains_booked: [],
          admin: false,
        });

        await user.save((err) => {
          if (err) {
            throw err;
          }

          res.status(200).json({ saved: "success" });
        });
      }
    });
  },
];

exports.user_update_post = [
  validator
    .body("f_name", "First Name should be min 2 and max 20 characters long.")
    .trim()
    .isLength({ min: 2, max: 20 }),
  validator
    .body("l_name", "Last Name should be min 2 and max 20 characters long.")
    .trim()
    .isLength({ min: 2, max: 20 }),
  validator
    .body("username", "Username should be min 5 and max 20 characters long.")
    .trim()
    .isLength({ min: 5, max: 20 })
    .isAlphanumeric()
    .withMessage("Only Alpha numeric charcaters allowed in username"),
  validator.body("dob", "Invalid date").trim().isISO8601(),
  validator
    .body("password", "password length min 8 and max 15")
    .trim()
    .isLength({ min: 8, max: 15 }),
  validator.body("email", "Invalid Email").trim().isEmail(),
  validator
    .body("mobile", "Invalid Mobile")
    .trim()
    .isLength({ min: 10, max: 10 }),

  validator.sanitizeBody("f_name").escape(),
  validator.sanitizeBody("l_name").escape(),
  validator.sanitizeBody("mobile").escape(),
  validator.sanitizeBody("username").escape(),

  (req, res, next) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        saved: "unsuccessful",
        errors: errors.array(),
      });
      return;
    }
    User.findOne(
      { _id: req.user_detail.id },
      "_id email password trains_booked"
    ).exec(async (err, result) => {
      if (err) {
        throw err;
      }
      const isMatch = await bcrypt.compare(req.body.password, result.password);
      if (!isMatch) {
        res.json({
          saved: "unsuccessful",
          error: { msg: "password not matched" },
        });
        return;
      } else {
        User.findOne({ email: req.body.email }, "_id").exec(
          (err, founded_user) => {
            if (err) {
              throw err;
            }
            if (founded_user._id != req.user_detail.id) {
              res.json({
                saved: "unsuccessful",
                error: { msg: "email already exists" },
              });
              return;
            }
          }
        );
        var salt = await bcrypt.genSalt(10);
        var password = await bcrypt.hash(req.body.password, salt);
        var user = new User({
          f_name: req.body.f_name,
          l_name: req.body.l_name,
          dob: req.body.dob,
          mobile: req.body.mobile,
          username: req.body.username,
          password: password,
          gender: req.body.gender,
          email: req.body.email,
          _id: req.user_detail.id,
          trains_booked: result.trains_booked,
        });
        await User.findByIdAndUpdate(user._id, user, (err) => {
          if (err) {
            throw err;
          }
          res.json({ saved: "success" });
        });
      }
    });
  },
];

exports.user_login_post = [
  validator
    .body("email", "Invalid Username or Password")
    .isLength({ min: 5 })
    .trim(),
  validator
    .body("password", "Invalid Username or Password")
    .isLength({ min: 5 })
    .trim(),
  validator
    .body("g-recaptcha-response", "Please fill reCaptcha")
    .isLength({ min: 1 }),

  validator.sanitizeBody("*").escape(),

  (req, res) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        saved: "unsuccessful",
        errors: errors.array(),
      });
      return;
    }
    const RECAPTCHA_SECRET = "6LdD4-UUAAAAAAUvQUO6L13GK3wZ9v0CvIe244D3";
    var recaptcha_url = "https://www.google.com/recaptcha/api/siteverify?";
    recaptcha_url += "secret=" + RECAPTCHA_SECRET + "&";
    recaptcha_url += "response=" + req.body["g-recaptcha-response"] + "&";
    recaptcha_url += "remoteip=" + req.connection.remoteAddress;
    Request(recaptcha_url, (error, resp, body) => {
      body = JSON.parse(body);
      if (body.success !== undefined && !body.success) {
        return res.send({ message: "Captcha validation failed" });
      }
      User.findOne({ email: req.body.email }, "email password admin").exec(
        async (err, result) => {
          if (err) {
            throw err;
          }
          if (!result) {
            res.json({
              saved: "unsuccessful",
              error: { msg: "Email does not exists" },
            });
            return;
          } else {
            const isMatch = await bcrypt.compare(
              req.body.password,
              result.password
            );
            if (!isMatch) {
              res.json({
                saved: "unsuccessful",
                error: { msg: "Incorrect password" },
              });
              return;
            } else {
              var payload = {
                user: {
                  id: result._id,
                  admin: result.admin,
                },
              };
              await jwt.sign(
                payload,
                "sanjay",
                { expiresIn: 10000 },
                (err, token) => {
                  if (err) {
                    throw err;
                  }
                  res
                    .status(200)
                    .json({ saved: "success", token, admin: result.admin });
                }
              );
            }
          }
        }
      );
    });
  },
];

exports.change_pass = [
  validator
    .body("c_pass", "old password cannot be empty")
    .isLength({ min: 1 })
    .trim(),
  validator
    .body("n_pass", "new password length min 8 and max 15")
    .isLength({ min: 8, max: 15 })
    .trim(),

  validator.sanitizeBody("c_pass").escape(),
  validator.sanitizeBody("n_pass").escape(),
  (req, res) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ saved: "unsuccessful", error: errors.array() });
      return;
    }
    User.findOne({ _id: req.user_detail.id }).exec(async (err, result) => {
      if (err) {
        throw err;
      }
      if (result == null) {
        res.json({
          saved: "unsuccessful",
          error: { msg: "user does not exist" },
        });
        return;
      } else {
        const isMatch = await bcrypt.compare(req.body.c_pass, result.password);
        if (!isMatch) {
          res.json({
            saved: "unsuccessful",
            error: { msg: "Incorrect password" },
          });
          return;
        } else {
          var salt = await bcrypt.genSalt(10);
          var password = await bcrypt.hash(req.body.n_pass, salt);
          var user = new User({
            f_name: result.f_name,
            l_name: result.l_name,
            dob: result.dob,
            mobile: result.mobile,
            username: result.username,
            password: password,
            gender: result.gender,
            email: result.email,
            _id: req.user_detail.id,
            trains_booked: result.trains_booked,
          });
          await User.findByIdAndUpdate(user._id, user, (err) => {
            if (err) {
              throw err;
            }
            res.json({ saved: "success" });
          });
        }
      }
    });
  },
];

exports.tickets = (req, res) => {
  User.findOne({ _id: req.user_detail.id })
    .populate("trains_booked")
    .exec((err, result) => {
      if (err) {
        throw err;
      }

      res.json({ tickets: result.trains_booked });
    });
};

exports.paymentIds = (req, res) => {
  User.findOne({ _id: req.user_detail.id }, "trains_booked")
    .populate("trains_booked")
    .exec((err, result) => {
      if (err) {
        throw err;
      }
      let paymentIds = result.trains_booked.map((ticket) => ticket.paymentId);
      res.json({ paymentIds: paymentIds });
    });
};
