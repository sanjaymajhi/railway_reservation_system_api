var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var route = new Schema({
  src_stn: { type: Schema.Types.ObjectId, required: true },
  des_stn: { type: Schema.Types.ObjectId, required: true },
  stations: [{ type: Schema.Types.ObjectId, required: true }],
  trains: [{ type: Schema.Types.ObjectId, ref: "train", required: true }]
});

module.exports = mongoose.model("Route", route);
