"use strict";

var jwt = require('jsonwebtoken');
var dotenv = require('dotenv');
dotenv.config();
var authMiddleWareAdmin = function authMiddleWareAdmin(req, res, next) {
  var token = req.headers.token;
  if (token) {
    var accessToken = token.split(" ")[1];
    jwt.verify(accessToken, process.env.ACCESS_TOKEN, function (err, user) {
      if (err) {
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Token đã hết hạn hoặc không phải bạn!"
        });
      }
      if (user !== null && user !== void 0 && user.isAdmin) {
        next();
      } else {
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Bạn không có quyền thực hiện chức năng này!"
        });
      }
    });
  } else {
    res.status(401).json({
      code: 401,
      success: false,
      message: "Bạn chưa đăng nhập!"
    });
  }
};
var authMiddleWareUser = function authMiddleWareUser(req, res, next) {
  var token = req.headers.token;
  var userId = req.params.id;
  if (token) {
    var accessToken = token.split(" ")[1];
    jwt.verify(accessToken, process.env.ACCESS_TOKEN, function (err, user) {
      if (err) {
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Token đã hết hạn hoặc không phải bạn!"
        });
      }
      if (user !== null && user !== void 0 && user.isAdmin || (user === null || user === void 0 ? void 0 : user.id) === userId) {
        next();
      } else {
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Bạn không có quyền thực hiện chức năng này!"
        });
      }
    });
  } else {
    res.status(401).json({
      code: 401,
      success: false,
      message: "Bạn chưa đăng nhập!"
    });
  }
};
var authMiddleWareUserCart = function authMiddleWareUserCart(req, res, next) {
  var token = req.headers.token;
  var user_id = req.body.user_id;
  if (token) {
    var accessToken = token.split(" ")[1];
    jwt.verify(accessToken, process.env.ACCESS_TOKEN, function (err, user) {
      if (err) {
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Token đã hết hạn hoặc không phải bạn!"
        });
      }
      if (user !== null && user !== void 0 && user.isAdmin || (user === null || user === void 0 ? void 0 : user.id) === user_id) {
        next();
      } else {
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Bạn không có quyền thực hiện chức năng này!"
        });
      }
    });
  } else {
    res.status(401).json({
      code: 401,
      success: false,
      message: "Bạn chưa đăng nhập!"
    });
  }
};
var authMiddleWareToken = function authMiddleWareToken(req, res, next) {
  //ACCESS TOKEN FROM HEADER, REFRESH TOKEN FROM COOKIE
  var token = req.headers.token;
  if (token) {
    var accessToken = token.split(" ")[1];
    jwt.verify(accessToken, process.env.ACCESS_TOKEN, function (err, user) {
      if (err) {
        res.status(401).json({
          code: 401,
          success: false,
          message: "Token đã hết hạn hoặc không phải bạn!"
        });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({
      code: 401,
      success: false,
      message: "Bạn chưa đăng nhập!"
    });
  }
};
module.exports = {
  authMiddleWareAdmin: authMiddleWareAdmin,
  authMiddleWareUser: authMiddleWareUser,
  authMiddleWareToken: authMiddleWareToken,
  authMiddleWareUserCart: authMiddleWareUserCart
};