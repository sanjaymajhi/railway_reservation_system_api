var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var station = new Schema({
  name: { type: String, min: 5, max: 30, required: true },
  code: { type: String, min: 3, max: 4, required: true }
});

module.exports = mongoose.model("Station", station);
