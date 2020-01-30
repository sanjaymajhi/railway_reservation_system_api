var async = require("async");
var mongoose = require("mongoose");

var User = require("../models/user");

var validator = require("express-validator");

var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");

var BodyParser = require("body-parser");
//for recaptcha
var Request = require("request");

exports.profile = (req, res) => {
  User.findById(req.user_detail.id).exec((err, details) => {
    if (details) {
      res.render("profile", {
        title: "Profile Page",
        user: details,
        profile: 1
      });
    } else {
      res.send("no token");
    }
  });
};

exports.user_register_get = (req, res) => {
  res.render("register", { title: "Registration Page" });
};
exports.user_register_post = [
  validator
    .body("f_name", "Invalid First Name")
    .trim()
    .isLength({ min: 5, max: 20 }),
  validator
    .body("l_name", "Invalid Last Name")
    .trim()
    .isLength({ min: 5, max: 20 }),
  validator
    .body("username", "Invalid Username")
    .trim()
    .isLength({ min: 5, max: 10 })
    .isAlphanumeric()
    .withMessage("Only Alpha numeric charcaters allowed"),
  validator
    .body("dob", "Invalid date")
    .trim()
    .isISO8601(),
  validator
    .body("password", "password length min 8 and max 15")
    .trim()
    .isLength({ min: 8, max: 15 }),
  validator
    .body("email", "Invalid Email")
    .trim()
    .isEmail(),
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
      res.render("register", {
        title: "Registration Page",
        errors: errors.array()
      });

      return;
    }

    User.find({ email: req.body.email }, "email").exec(async (err, email) => {
      if (err) {
        return next(err);
      }
      if (email.length) {
        console.log(email);
        res.render("register", { title: "Registration Page", user_error: 1 });
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
          admin: false
        });

        await user.save(err => {
          if (err) {
            return next(err);
          }
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "web.developer.sanjay.majhi@gmail.com",
              pass: "Qwerty12345*"
            }
          });

          var mailoption = {
            from: "web.developer.sanjay.majhi@gmail.com",
            to: user.email,
            subject: "Singup successful",
            text:
              "Welcome " +
              user.f_name +
              " , to Indian railways ticket booking website. \nHere, you can book tickets and check pnr. \nThanks from Sanjay Majhi"
          };

          transporter.sendMail(mailoption, (err, info) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Email sent : " + info.response);
            }
          });
          res.render("login", { title: "Login Page" });
        });
      }
    });
  }
];

exports.user_update_post = [
  validator
    .body("f_name", "Invalid First Name")
    .trim()
    .isLength({ min: 5, max: 20 }),
  validator
    .body("l_name", "Invalid Last Name")
    .trim()
    .isLength({ min: 5, max: 20 }),
  validator
    .body("username", "Invalid Username")
    .trim()
    .isLength({ min: 5, max: 10 })
    .isAlphanumeric()
    .withMessage("Only Alpha numeric charcaters allowed"),
  validator
    .body("dob", "Invalid date")
    .trim()
    .isISO8601(),
  validator
    .body("password", "password length min 8 and max 15")
    .trim()
    .isLength({ min: 8, max: 15 }),
  validator
    .body("email", "Invalid Email")
    .trim()
    .isEmail(),
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
      res.render("profile", {
        title: "Profile Page",
        errors: errors.array()
      });

      return;
    }

    User.findOne({ email: req.body.email }, "email").exec(
      async (err, result) => {
        if (err) {
          return next(err);
        }
        if (result.email != req.body.email) {
          res.render("profile", { title: "Profile Page", user_error: 1 });
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
            _id: result._id
          });

          await User.findByIdAndUpdate(user._id, user, err => {
            if (err) {
              return next(err);
            }
            var transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "web.developer.sanjay.majhi@gmail.com",
                pass: "Qwerty12345*"
              }
            });

            var mailoption = {
              from: "web.developer.sanjay.majhi@gmail.com",
              to: user.email,
              subject: "Profile Updated",
              text:
                "Hey " +
                user.f_name +
                " , your profile has been successfully updated. \nThanks from Sanjay Majhi"
            };

            transporter.sendMail(mailoption, (err, info) => {
              if (err) {
                console.log(err);
              } else {
                console.log("Email sent : " + info.response);
              }
            });
            res.json({ updated: "success" });
          });
        }
      }
    );
  }
];

exports.user_login_get = (req, res) => {
  res.render("login", { title: "Login Page" });
};

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

  (req, res, next) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      res.render("login", { title: "Login Page", errors: errors.array() });
      return;
    }
    const RECAPTCHA_SECRET = "6LdMetIUAAAAALUeAujOsFtdp1qj14QVnMa8B5Tn";
    var recaptcha_url = "https://www.google.com/recaptcha/api/siteverify?";
    recaptcha_url += "secret=" + RECAPTCHA_SECRET + "&";
    recaptcha_url += "response=" + req.body["g-recaptcha-response"] + "&";
    recaptcha_url += "remoteip=" + req.connection.remoteAddress;
    Request(recaptcha_url, (error, resp, body) => {
      body = JSON.parse(body);
      if (body.success !== undefined && !body.success) {
        return res.send({ message: "Captcha validation failed" });
      }
      User.findOne({ email: req.body.email }, "email password").exec(
        async (err, result) => {
          if (err) {
            return next(err);
          }
          if (!result.email) {
            res.render("login", { title: "Login Page", user_error: 1 });
            return;
          } else {
            const isMatch = await bcrypt.compare(
              req.body.password,
              result.password
            );
            if (!isMatch) {
              res.render("login", { title: "Login Page", user_error: 1 });
              return;
            } else {
              var payload = {
                user: {
                  id: result._id
                }
              };
              await jwt.sign(
                payload,
                "sanjay",
                { expiresIn: 10000 },
                (err, token) => {
                  if (err) {
                    return next(err);
                  }
                  res.status(200).json(token);
                }
              );
            }
          }
        }
      );
    });
  }
];
