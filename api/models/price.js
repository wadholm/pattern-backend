const mongoose = require("mongoose");

const priceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    starting_fee: { type: Number, default: 5},
    price_per_minute: { type: Number, default: 3},
    penalty_fee: { type: Number, default: 50},
    discount: { type: Number, default: 0.1}
});

module.exports = mongoose.model("Price", priceSchema);
