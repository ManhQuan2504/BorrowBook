const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
    {
        name: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, default: false, required: true },
        verified: { type: Boolean },
        phone: { type: String },
        address: { type: String },
        image: { type: String },
       

    },
    {
        timestamps: true
    }
);
const User = mongoose.model("Users", userSchema);
module.exports = User;