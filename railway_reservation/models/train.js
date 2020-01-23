var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var train = new Schema({
  name: { type: String, min: 4, max: 20, required: true },
  train_no: { type: Number, min: 5, max: 6, required: true },
  tiers: {
    type: String,
    enum: ["1A", "2A", "3A", "SL"],
    required: true,
    default: "SL"
  },
  departing_days: {
    type: String,
    enum: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
    required: true
  },
  route: { type: Schema.Types.ObjectId, ref: "Route" },
  depart_time: { type: Date, default: Date.now },
  arrival_time: { type: Date, default: Date.now },
  coach_seats: { type: Number, min: 0, max: 200, required: true },
  total_coaches: { type: Number, min: 1, max: 40, required: true },
  available_seats: { type: Number, min: 0, max: 1000 },
  status: { type: String, enum: ["AVL", "RAC", "WL", "CAN"], default: "AVL" },
  price: { type: Number, required: true }
});

module.exports = mongoose.model("Train", train);
