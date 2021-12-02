const mongoose = require("mongoose");

const latLongSchema = mongoose.Schema({
    _id: false,
    lat: { type: Number, default: 0},
    long: { type: Number, default: 0},
});

const bikeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    city_id: { type: mongoose.Schema.Types.ObjectId, ref: "City", require: true},
    charge_id: { type: mongoose.Schema.Types.ObjectId, ref: "Station", default: null},
    parking_id: { type: mongoose.Schema.Types.ObjectId, ref: "Station", default: null},
    bike_status: { type: String, default: "unknown" },
    battery_status: { type: String, default: "unknown" },
    maintanance: { type: Date },
    coordinates: { type: latLongSchema },
});

module.exports = mongoose.model("Bike", bikeSchema);
