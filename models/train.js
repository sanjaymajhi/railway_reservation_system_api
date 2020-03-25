var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var availability = new Schema({
  date: { type: Date, required: true },
  available_seats: { type: Number, required: true },
  status: { type: String, enum: ["AVL", "NAVL"], required: true }
});

var train = new Schema({
  name: { type: String, min: 4, max: 20, required: true },
  train_no: { type: Number, required: true },
  available_tiers: [
    {
      type: String,
      enum: ["1A", "2A", "3A", "SL", "CC"],
      required: true
    }
  ],
  departing_days: [
    {
      type: String,
      enum: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
      required: true
    }
  ],
  route: { type: Schema.Types.ObjectId, ref: "Route" },
  depart_time: { type: Date, default: Date.now },
  arrival_time: { type: Date, default: Date.now },
  coach_seats: { type: Number, required: true },
  total_coaches: { type: Number, required: true },
  availability: [availability],
  ticket_cost: { type: Number, required: true }
});

module.exports = mongoose.model("Train", train);
