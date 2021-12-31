const mongoose = require("mongoose");
var findOrCreate = require('mongoose-findorcreate');

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
    password: { type: String },
    phone: { type: String, default: "unknown"},
    city: { type: mongoose.Schema.Types.ObjectId, ref: "City"},
    payment_method: { type: String, default: "refill"}, // monthly/refill
    card_information: { type: String, default: "unknown"},
    balance: { type: Number, default: 0},
    account_status: { type: String, default: "active"}
});

userSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", userSchema);
