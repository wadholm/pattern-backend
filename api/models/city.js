const mongoose = require("mongoose");

const latLongSchema = mongoose.Schema({
    _id: false,
    lat: { type: Number, default: 0},
    long: { type: Number, default: 0},
});

const coordSchema = mongoose.Schema({
    _id: false,
    northwest: {type: latLongSchema},
    southeast: {type: latLongSchema}
});

const stationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    coordinates: {
        type: coordSchema
    }
});

const citySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        unique: true
    },
    coordinates: {
        type: coordSchema
    },
    charge_stations: [stationSchema],
    parking_stations: [stationSchema]
});


const City = mongoose.model("City", citySchema);
const Station = mongoose.model("Station", stationSchema);

module.exports = { City, Station };
