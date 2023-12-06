"use strict";

var mongoose = require('mongoose');
var UserVerificationSchema = new mongoose.Schema({
  userId: {
    type: String
  },
  uniqueString: {
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
var UserVerification = mongoose.model("UserVerifications", UserVerificationSchema);
module.exports = UserVerification;