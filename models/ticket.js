var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var passenger = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  food: { type: String, required: true }
});

var ticket = new Schema({
  train_name: { type: String, required: true },
  train_no: { type: Number, required: true },
  teir: { type: String, required: true },
  count: { type: Number, required: true },
  src_stn: { type: Schema.Types.ObjectId, ref: "Station" },
  des_stn: { type: Schema.Types.ObjectId, ref: "Station" },
  depart_date: { type: Date, required: true },
  arrival_date: { type: Date, required: true },
  passengers: [passenger],
  cost: { type: mongoose.Decimal128, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User_railway" },
  paymentId: { type: String, required: true },
  bookedOn: { type: Date, required: true }
});

module.exports = mongoose.model("Ticket", ticket);
