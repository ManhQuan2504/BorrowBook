"use strict";

var mongoose = require('mongoose');
var UserResetPasswordSchema = new mongoose.Schema({
  userId: {
    type: String
  },
  resetString: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});
var UserResetPassword = mongoose.model("UserResetPasswords", UserResetPasswordSchema);
module.exports = UserResetPassword;