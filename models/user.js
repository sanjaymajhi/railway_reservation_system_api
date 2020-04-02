var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var moment = require("moment");

var user = new Schema({
  f_name: { type: String, min: 2, max: 20, required: true },
  l_name: { type: String, min: 2, max: 20, required: true },
  dob: { type: Date, required: true },
  username: { type: String, min: 5, max: 20, required: true },
  password: { type: String, min: 8, max: 15, required: true },
  email: { type: String, required: true },
  mobile: { type: Number, required: true },
  gender: { type: String, enum: ["M", "F", "O"], required: true },
  trains_booked: [{ type: Schema.Types.ObjectId, ref: "Ticket" }],
  admin: { type: Boolean, required: true }
});
user.virtual("DOB").get(function() {
  return moment(this.dob).format("YYYY-MM-DD");
});

module.exports = mongoose.model("User_railway", user);
