const mongoose = require('mongoose')
const UserVerificationSchema = new mongoose.Schema(
    {
        userId: { type: String },
        uniqueString: { type: String, required: true, unique: true },
        createdAt: { type: Date },
        expiresAt: { type: Date },
        
       
    },
    {
        timestamps: true
    }
);
const UserVerification = mongoose.model("UserVerifications", UserVerificationSchema);
module.exports = UserVerification;