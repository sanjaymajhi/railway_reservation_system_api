var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ticket = new Schema({
  pnr: { type: Number, required: true },
  booked_by: { type: Schema.Types.ObjectId, required: true },
  depart_date: { type: Date, required: true },
  arrival_date: { type: Date, required: true },
  passenger_count: { type: Number, min: 1, max: 5, required: true },
  price: { type: Number, required: true },
  food: { type: String, enum: ["VEG", "NON-VEG"], required: true },
  bedroll: { type: Boolean, required: true },
  passengers: [{ type: String, min: 5, max: 30, required: true }]
});
