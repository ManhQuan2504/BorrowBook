"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure " + obj); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var UserService = require('../services/UserService');
var JwtService = require('../services/JwtService');
var rabbitmqFunc = require('../config/rabbitmq');
var jwt = require('jsonwebtoken');
var XLSX = require("xlsx");
var path = require('path');
var createUser = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var _req$body, name, email, password, phone, language, regEmail, phoneRegex, isCheckEmail, isCheckPhone, response, _response$data, _response$data2, messageData;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password, phone = _req$body.phone, language = _req$body.language;
          regEmail = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
          phoneRegex = /^(0|\+84)(3[2-9]|5[2689]|7[06789]|8[1-9]|9[0-9])\d{7}$/;
          isCheckEmail = regEmail.test(email);
          isCheckPhone = phoneRegex.test(phone);
          if (!(!email || !password || !name || !phone)) {
            _context.next = 10;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            code: 400,
            success: false,
            message: 'Yêu cầu nhập đủ dữ liệu đầu vào!'
          }));
        case 10:
          if (isCheckEmail) {
            _context.next = 14;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            code: 400,
            success: false,
            message: 'Kiểm tra định dạng Email!'
          }));
        case 14:
          if (isCheckPhone) {
            _context.next = 18;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            code: 400,
            success: false,
            message: 'Kiểm tra lại định dạng Phone!'
          }));
        case 18:
          if (!(password.length < 6)) {
            _context.next = 20;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            code: 400,
            success: false,
            message: 'Mật khẩu không được nhỏ hơn 6 kí tự'
          }));
        case 20:
          _context.next = 22;
          return UserService.createUser(req.body);
        case 22:
          response = _context.sent;
          if (response && response != undefined) {
            messageData = {
              type: 'register',
              _id: response === null || response === void 0 || (_response$data = response.data) === null || _response$data === void 0 || (_response$data = _response$data.createdUser) === null || _response$data === void 0 ? void 0 : _response$data._id,
              email: response === null || response === void 0 || (_response$data2 = response.data) === null || _response$data2 === void 0 || (_response$data2 = _response$data2.createdUser) === null || _response$data2 === void 0 ? void 0 : _response$data2.email,
              language: language
            };
            rabbitmqFunc.send_msg(messageData);
            console.log("Sent message: ".concat(JSON.stringify(messageData)));
          }
          return _context.abrupt("return", res.status(response.code).json(response));
        case 27:
          _context.prev = 27;
          _context.t0 = _context["catch"](0);
          console.log('Có lỗi khi createUser', _context.t0);
          return _context.abrupt("return", res.status(500).json({
            code: 500,
            success: false,
            message: _context.t0 + ''
          }));
        case 31:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 27]]);
  }));
  return function createUser(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var loginUser = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var _response$data3, _req$body2, email, password, response, newReponse;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          if (!(!email || !password)) {
            _context2.next = 4;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            code: 400,
            success: false,
            message: 'Yêu cầu nhập đủ dữ liệu đầu vào!'
          }));
        case 4:
          _context2.next = 6;
          return UserService.loginUser(req.body);
        case 6:
          response = _context2.sent;
          newReponse = _extends({}, (_objectDestructuringEmpty(response), response));
          if (response !== null && response !== void 0 && (_response$data3 = response.data) !== null && _response$data3 !== void 0 && _response$data3.refresh_token) {
            res.cookie('refresh_token', response.data.refresh_token, {
              httpOnly: true,
              secure: false,
              sameSite: 'strict',
              path: '/'
            });
          }
          return _context2.abrupt("return", res.status(response.code).json(_objectSpread({}, newReponse)));
        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          console.log('Có lỗi khi loginUser', _context2.t0);
          return _context2.abrupt("return", res.status(500).json({
            code: 500,
            success: false,
            message: _context2.t0.message
          }));
        case 16:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 12]]);
  }));
  return function loginUser(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var updateUser = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var userId, data, phone, phoneRegex, isCheckPhone, response;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = req.params.id;
          data = req.body;
          console.log('data', data);
          phone = data.dataEdit.phone;
          phoneRegex = /^(0|\+84)(3[2-9]|5[2689]|7[06789]|8[1-9]|9[0-9])\d{7}$/;
          isCheckPhone = phoneRegex.test(phone);
          if (userId) {
            _context3.next = 9;
            break;
          }
          return _context3.abrupt("return", res.status(400).json({
            code: 400,
            success: false,
            message: 'Yêu cầu cần vào đủ (userId)'
          }));
        case 9:
          if (isCheckPhone) {
            _context3.next = 11;
            break;
          }
          return _context3.abrupt("return", res.status(400).json({
            code: 400,
            success: false,
            message: 'Kiểm tra lại định dạng Phone!'
          }));
        case 11:
          _context3.next = 13;
          return UserService.updateUser(userId, data.dataEdit);
        case 13:
          response = _context3.sent;
          return _context3.abrupt("return", res.status(response.code).json(response));
        case 17:
          _context3.prev = 17;
          _context3.t0 = _context3["catch"](0);
          console.log('err updateUser ', _context3.t0);
          return _context3.abrupt("return", res.status(500).json({
            code: 500,
            success: false,
            message: _context3.t0.message
          }));
        case 21:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 17]]);
  }));
  return function updateUser(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
var deleteUser = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var userId, response;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          userId = req.params.id;
          if (userId) {
            _context4.next = 4;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            code: 400,
            success: false,
            message: 'Yêu cầu cần vào đủ (userId)'
          }));
        case 4:
          _context4.next = 6;
          return UserService.deleteUser(userId);
        case 6:
          response = _context4.sent;
          return _context4.abrupt("return", res.status(response.code).json(response));
        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](0);
          console.log('co loi khi deleteUser', _context4.t0);
          return _context4.abrupt("return", res.status(500).json({
            code: 500,
            success: false,
            message: _context4.t0.message
          }));
        case 14:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 10]]);
  }));
  return function deleteUser(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
var deleteMany = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var ids, idArray, response;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          ids = req.query.ids; // Đọc danh sách các ID từ query parameters
          if (ids) {
            _context5.next = 4;
            break;
          }
          return _context5.abrupt("return", res.status(400).json({
            code: 400,
            success: false,
            message: 'Yêu cầu cần chứa một mảng các userId'
          }));
        case 4:
          // Tách chuỗi IDs thành mảng và loại bỏ khoảng trắng
          idArray = ids.split(',').map(function (id) {
            return id.trim();
          }); // Kiểm tra xem mảng có rỗng hoặc không
          if (!(idArray.length === 0 || idArray[0] === '')) {
            _context5.next = 7;
            break;
          }
          return _context5.abrupt("return", res.status(400).json({
            code: 400,
            success: false,
            message: 'Yêu cầu cần chứa một mảng các userId'
          }));
        case 7:
          _context5.next = 9;
          return UserService.deleteManyUser(idArray);
        case 9:
          response = _context5.sent;
          return _context5.abrupt("return", res.status(response.code).json(response));
        case 13:
          _context5.prev = 13;
          _context5.t0 = _context5["catch"](0);
          console.log('Có lỗi khi deleteMany', _context5.t0);
          return _context5.abrupt("return", res.status(500).json({
            code: 500,
            success: false,
            message: _context5.t0.message
          }));
        case 17:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 13]]);
  }));
  return function deleteMany(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
var getAllUser = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var _req$query, limit, page, response;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _req$query = req.query, limit = _req$query.limit, page = _req$query.page;
          _context6.next = 4;
          return UserService.getAllUser(Number(limit) || null, Number(page) || 0);
        case 4:
          response = _context6.sent;
          return _context6.abrupt("return", res.status(response.code).json(response));
        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](0);
          console.log('getAllUser err', _context6.t0);
          return _context6.abrupt("return", res.status(500).json({
            code: 500,
            success: false,
            message: _context6.t0 + ''
          }));
        case 12:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 8]]);
  }));
  return function getAllUser(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();
var getAllUserSearch = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var _req$query2, limit, page, type, key, response;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _req$query2 = req.query, limit = _req$query2.limit, page = _req$query2.page, type = _req$query2.type, key = _req$query2.key;
          _context7.next = 4;
          return UserService.getAllUserSearch(Number(limit) || null, Number(page) || 0, String(type) || '_id', String(key) || '');
        case 4:
          response = _context7.sent;
          return _context7.abrupt("return", res.status(response.code).json(response));
        case 8:
          _context7.prev = 8;
          _context7.t0 = _context7["catch"](0);
          console.log('getAllUser err', _context7.t0);
          return _context7.abrupt("return", res.status(500).json({
            code: 500,
            success: false,
            message: _context7.t0 + ''
          }));
        case 12:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 8]]);
  }));
  return function getAllUserSearch(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();
var getDetailsUser = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
    var userId, response;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          userId = req.params.id;
          if (userId) {
            _context8.next = 4;
            break;
          }
          return _context8.abrupt("return", res.status(404).json({
            code: 404,
            success: false,
            message: 'Yêu cầu đầy đủ userId!'
          }));
        case 4:
          _context8.next = 6;
          return UserService.getDetailsUser(userId);
        case 6:
          response = _context8.sent;
          return _context8.abrupt("return", res.status(response.code).json(response));
        case 10:
          _context8.prev = 10;
          _context8.t0 = _context8["catch"](0);
          return _context8.abrupt("return", res.status(500).json({
            code: 500,
            success: false,
            message: _context8.t0 + ''
          }));
        case 13:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 10]]);
  }));
  return function getDetailsUser(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();
var logoutUser = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res) {
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          res.clearCookie('refresh_token');
          return _context9.abrupt("return", res.status(200).json({
            code: 200,
            success: true,
            message: 'Đăng xuất thành công!'
          }));
        case 5:
          _context9.prev = 5;
          _context9.t0 = _context9["catch"](0);
          console.log('logoutUser', _context9.t0);
          return _context9.abrupt("return", res.status(500).json({
            code: 500,
            success: false,
            message: _context9.t0 + ''
          }));
        case 9:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 5]]);
  }));
  return function logoutUser(_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();
var updatePassword = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(req, res) {
    var token, accessToken, user, userId, _req$body3, newPassword, confirmNewPassword, response;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          token = req.headers.token;
          accessToken = token.split(" ")[1]; // Sử dụng Promise để chờ xác thực token
          _context10.next = 5;
          return new Promise(function (resolve, reject) {
            jwt.verify(accessToken, process.env.ACCESS_TOKEN, function (err, user) {
              if (err) {
                console.log('Lỗi khi xác thực token:', err);
                reject('Lỗi xác thực token');
              } else {
                resolve(user);
              }
            });
          });
        case 5:
          user = _context10.sent;
          userId = user.id;
          _req$body3 = req.body, newPassword = _req$body3.newPassword, confirmNewPassword = _req$body3.confirmNewPassword;
          if (!(!newPassword || !confirmNewPassword)) {
            _context10.next = 12;
            break;
          }
          return _context10.abrupt("return", res.status(400).json({
            code: 400,
            success: false,
            message: 'Yêu cầu nhập đủ dữ liệu đầu vào!'
          }));
        case 12:
          if (!(newPassword.length < 6)) {
            _context10.next = 16;
            break;
          }
          return _context10.abrupt("return", res.status(400).json({
            code: 400,
            success: false,
            message: 'Mật khẩu không được nhỏ hơn 6 kí tự'
          }));
        case 16:
          if (!(newPassword !== confirmNewPassword)) {
            _context10.next = 18;
            break;
          }
          return _context10.abrupt("return", res.status(400).json({
            code: 400,
            success: false,
            message: 'Nhập lại mật khẩu sai!'
          }));
        case 18:
          _context10.next = 20;
          return UserService.updatePasswordService(userId, req.body);
        case 20:
          response = _context10.sent;
          return _context10.abrupt("return", res.status(response.code).json(response));
        case 24:
          _context10.prev = 24;
          _context10.t0 = _context10["catch"](0);
          console.log('Co loi trong viec updatePassword', _context10.t0);
          return _context10.abrupt("return", res.status(500).json({
            message: _context10.t0 + ''
          }));
        case 28:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[0, 24]]);
  }));
  return function updatePassword(_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}();
var exportExcel = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(req, res) {
    var response, data, rows, headers, worksheet, MAX_COLUMN_WIDTH, columnWidths, workbook, buffer;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return UserService.exportExcel();
        case 3:
          response = _context11.sent;
          if (response) {
            _context11.next = 6;
            break;
          }
          return _context11.abrupt("return", res.status(400).json({
            message: "No data available for export."
          }));
        case 6:
          data = response.data;
          rows = data.map(function (user) {
            return [user.id || '', user.name || '', user.email || '', user.phone || '', user.address || ''];
          }); // Thêm header
          headers = ['ID', 'Họ tên', 'Email', 'SĐT', 'Địa chỉ'];
          rows.unshift(headers);

          // Tạo worksheet, thêm data, bắt đầu từ ô A1
          worksheet = XLSX.utils.aoa_to_sheet(rows, {
            origin: "A1"
          });
          MAX_COLUMN_WIDTH = 1000; // Tính chiều rộng tối đa của mỗi cột
          columnWidths = rows[0].map(function (_, colIndex) {
            return Math.min(MAX_COLUMN_WIDTH, rows.reduce(function (acc, row) {
              return Math.max(acc, "".concat(row[colIndex]).length);
            }, headers[colIndex].length));
          }); // Thêm chiều rộng cột vào worksheet
          worksheet['!cols'] = columnWidths.map(function (width) {
            return {
              wch: width
            };
          });

          // Tạo workbook và thêm worksheet
          workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'User Data');
          // XLSX.writeFile(workbook, 'dataUser.xlsx'); 
          // Lưu file Excel vào memory buffer
          buffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'buffer'
          }); // Set header Content-Disposition
          res.setHeader('Content-Disposition', 'attachment; filename=userData123.xlsx');
          // Set content type
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

          // Send the Excel file as a response
          res.send(buffer);
          return _context11.abrupt("return", res.status(200));
        case 23:
          _context11.prev = 23;
          _context11.t0 = _context11["catch"](0);
          console.error('Export Excel ERR: ', _context11.t0);
          return _context11.abrupt("return", res.status(500).json({
            message: "Internal server error during Excel export."
          }));
        case 27:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[0, 23]]);
  }));
  return function exportExcel(_x21, _x22) {
    return _ref11.apply(this, arguments);
  };
}();
module.exports = {
  createUser: createUser,
  loginUser: loginUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  getAllUser: getAllUser,
  getDetailsUser: getDetailsUser,
  logoutUser: logoutUser,
  deleteMany: deleteMany,
  updatePassword: updatePassword,
  getAllUserSearch: getAllUserSearch,
  exportExcel: exportExcel
};