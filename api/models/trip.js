const mongoose = require("mongoose");

const latLongSchema = mongoose.Schema({
    _id: false,
    lat: { type: Number, default: 0},
    long: { type: Number, default: 0},
});

const tripSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true},
    bike_id: { type: mongoose.Schema.Types.ObjectId, ref: "Bike", require: true},
    start_time:  { type: Date, reguire: true },
    stop_time:  { type: Date },
    start_coordinates: { type: latLongSchema, require: true },
    stop_coordinates: { type: latLongSchema },
    average_speed: { type: Number },
    distance: { type: Number },
    price: { type: Number }
});

module.exports = mongoose.model("Trip", tripSchema);
