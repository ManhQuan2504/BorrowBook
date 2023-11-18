const mongoose = require('mongoose')
const UserResetPasswordSchema = new mongoose.Schema(
    {
        userId: { type: String },
        resetString: { type: String, required: true, unique: true },
        createdAt: { type: Date },
        expiresAt: { type: Date },
        
       
    },
    {
        timestamps: true
    }
);
const UserResetPassword = mongoose.model("UserResetPasswords", UserResetPasswordSchema);
module.exports = UserResetPassword;