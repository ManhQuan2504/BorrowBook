"use strict";

var express = require("express");
var configViewEngine = function configViewEngine(app) {
  app.use(express["static"]("./src/public"));
  app.set("view engine", "ejs");
  app.set("views", "./src/views");
};
module.exports = configViewEngine;