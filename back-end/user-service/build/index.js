"use strict";

var express = require("express");
var dotenv = require('dotenv');
dotenv.config();
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var routes = require('./routes');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var multer = require('multer');
var YAML = require('yaml');
var fs = require("fs");
var path = require("path");
var swaggerUi = require('swagger-ui-express');
var viewEngine = require('./viewEngine');
var file = fs.readFileSync(path.resolve(__dirname, 'OBERIswagger.yaml'), 'utf8');
var swaggerDocument = YAML.parse(file);
var app = express();
var port = process.env.PORT || 3002;

// const corsOptions = {
//     origin: process.env.URL_REACT, // Replace with your Vercel frontend URL
//     credentials: true,  // Enable credentials (cookies, authorization headers, etc.)
//   };
//   app.options('*',cors())
app.use(cors());
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));
app.use(cookieParser());
var storage = multer.memoryStorage();
var upload = multer({
  storage: storage
});
app.use(upload.single('image'));
var swaggerUrl = '/api-docs'; // Điều này có thể thay đổi thành URL tùy chỉnh của bạn
app.use(swaggerUrl, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
viewEngine(app);
routes(app);
app.use(express["static"](path.join(__dirname, '..', 'node_modules/swagger-ui-dist'), {
  index: false
}));
mongoose.set('strictQuery', false);
mongoose.connect("".concat(process.env.MONGO_DB), {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  console.log('Connect MongoDB success!');
  app.listen(port, function () {
    console.log('Server is running in port: ', +port);
  });
})["catch"](function (err) {
  console.log(err);
});