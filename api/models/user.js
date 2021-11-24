const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: Array,
    email: String,
    password: String,
    phone: String,
    payment_method: String,
    card_information: String,
    balance: Number,
    account_status: String
});

module.exports = mongoose.model("User", userSchema);
