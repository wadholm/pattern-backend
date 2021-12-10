const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        // eslint-disable-next-line max-len
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: true },
    phone: { type: String, default: "unknown"},
    city: { type: mongoose.Schema.Types.ObjectId, ref: "City"},
    payment_method: { type: String, default: "unknown"},
    card_information: { type: String, default: "unknown"},
    balance: { type: Number, default: 0},
    account_status: { type: String, default: "active"}
});

module.exports = mongoose.model("User", userSchema);
