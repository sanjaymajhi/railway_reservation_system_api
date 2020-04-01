var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var BodyParser = require("body-parser");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var bookingRouter = require("./routes/booking");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "build")));

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/booking", bookingRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

var cors = require("cors");
const corsOptions = {
  origin: "https://api.razorpay.com/v1/",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options("*", cors());

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

var compression = require("compression");
app.use(compression());

var helmet = require("helmet");
app.use(helmet());

var mongoose = require("mongoose");
var dev_db_URl =
  "mongodb+srv://sanjay:1Sanjay@@cluster0-1naxh.mongodb.net/test?retryWrites=true&w=majority";
var mongoDB = process.env.MONGODB_URI || dev_db_URl;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = app;
