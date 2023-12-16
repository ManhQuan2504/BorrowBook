"use strict";

var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    "default": false,
    required: true
  },
  verified: {
    type: Boolean
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  image: {
    type: String
  }
}, {
  timestamps: true
});
var User = mongoose.model("Users", userSchema);
module.exports = User;