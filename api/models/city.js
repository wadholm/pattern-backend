const mongoose = require("mongoose");


const stationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    coordinates: { type: Object, default: {northwest: "x", southeast: "y"}}
});

const citySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        unique: true
    },
    coordinates: { type: Object, default: {northwest: "x", southeast: "y"}},
    charge_stations: [stationSchema],
    parking_stations: [stationSchema]
});

module.exports = mongoose.model("City", citySchema);
