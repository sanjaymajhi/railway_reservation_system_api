var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var user = new Schema({
  f_name: { type: String, min: 5, max: 20, required: true },
  l_name: { type: String, min: 5, max: 20, required: true },
  dob: { type: Date, required: true, max: Date("2002/12/31") },
  username: { type: String, min: 5, max: 10, required: true },
  password: { type: String, min: 8, max: 15, required: true },
  email: { type: String, min: 5, max: 20, required: true },
  mobile: { type: Number, min: 10, max: 10, required: true },
  gender: { type: String, enum: ["M", "F", "O"], required: true },
  food: { type: String, enum: ["VEG", "NON-VEG"], required: true },
  bedroll: { type: Boolean, required: true },
  trains_booked: [{ type: Schema.Types.ObjectId, ref: "Train" }]
});

module.exports = mongoose.model("User", user);
