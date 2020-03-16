var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var route = new Schema({
  route_code: { type: String, required: true },
  src_stn: { type: Schema.Types.ObjectId, required: true, ref: "Station" },
  des_stn: { type: Schema.Types.ObjectId, required: true, ref: "Station" },
  stations: [{ type: Schema.Types.ObjectId, required: true, ref: "Station" }],
  distance: { type: Number, required: true }
});

module.exports = mongoose.model("Route", route);
