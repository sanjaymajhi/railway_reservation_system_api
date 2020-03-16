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
      res.status(200).json(details);
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
    .isLength({ min: 5, max: 20 })
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

          res.status(200).json({ registration: "success" });
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
    User.findOne({ _id: req.user_detail.id }, "_id email password").exec(
      async (err, result) => {
        if (err) {
          throw err;
        }
        const isMatch = await bcrypt.compare(
          req.body.password,
          result.password
        );
        if (!isMatch) {
          console.log("password not matched");
          return;
        } else {
          User.findOne({ email: req.body.email }, "_id").exec(
            (err, founded_user) => {
              if (err) {
                throw err;
              }
              if (founded_user._id != req.user_detail.id) {
                console.log(founded_user._id, req.user_detail.id);
                const error = new Error("email already exists");
                throw error;
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
            _id: req.user_detail.id
          });
          await User.findByIdAndUpdate(user._id, user, err => {
            if (err) {
              throw err;
            }
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
      User.findOne({ email: req.body.email }, "email password admin").exec(
        async (err, result) => {
          if (err) {
            return next(err);
          }
          if (!result) {
            res.json({
              saved: "unsuccessful",
              error: { msg: "Email does not exists" }
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
                error: { msg: "Incorrect password" }
              });
              return;
            } else {
              var payload = {
                user: {
                  id: result._id,
                  admin: result.admin
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
  }
];
