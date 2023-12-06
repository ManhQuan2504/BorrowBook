"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var User = require("../models/UserModel");
var UserVerification = require("../models/UserVerification");
var bcrypt = require("bcrypt");
var _require = require("./JwtService"),
  generalAccessToken = _require.generalAccessToken,
  generalRefreshToken = _require.generalRefreshToken;
var UserResetPassword = require("../models/UserResetPassword");
var createUser = function createUser(newUser) {
  return new Promise( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(resolve, reject) {
      var name, email, password, phone, address, checkUser, hash, createdUser;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            name = newUser.name, email = newUser.email, password = newUser.password, phone = newUser.phone, address = newUser.address;
            _context.prev = 1;
            _context.next = 4;
            return User.findOne({
              email: email
            });
          case 4:
            checkUser = _context.sent;
            if (checkUser !== null) {
              resolve({
                code: 404,
                success: false,
                message: 'Email này đã tồn tại, vui lòng đăng ký bằng Email khác!',
                data: []
              });
            }
            hash = bcrypt.hashSync(password, 10);
            _context.next = 9;
            return User.create({
              name: name,
              email: email,
              password: hash,
              phone: phone,
              verified: false,
              address: address
            });
          case 9:
            createdUser = _context.sent;
            resolve({
              code: 200,
              success: true,
              message: 'Đăng ký thành công!',
              data: {
                createdUser: createdUser
              }
            });
            _context.next = 16;
            break;
          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](1);
            reject(_context.t0);
          case 16:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[1, 13]]);
    }));
    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};
var loginUser = function loginUser(userLogin) {
  return new Promise( /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(resolve, reject) {
      var email, password, checkUser, comparePassword, access_token, refresh_token;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            email = userLogin.email, password = userLogin.password;
            _context2.prev = 1;
            _context2.next = 4;
            return User.findOne({
              email: email
            });
          case 4:
            checkUser = _context2.sent;
            if (!(checkUser === null)) {
              _context2.next = 9;
              break;
            }
            resolve({
              code: 404,
              success: false,
              message: 'Email này không tồn tại, vui lòng đăng ký!'
            });
            _context2.next = 19;
            break;
          case 9:
            if (!checkUser.isAdmin) {
              resolve({
                code: 404,
                success: false,
                message: 'Bạn không có quyền để login!'
              });
            }
            comparePassword = bcrypt.compareSync(password, checkUser.password);
            if (!comparePassword) {
              resolve({
                code: 404,
                success: false,
                message: 'Sai mật khẩu. Vui lòng thử lại!'
              });
            }
            _context2.next = 14;
            return generalAccessToken({
              id: checkUser.id,
              isAdmin: checkUser.isAdmin
            });
          case 14:
            access_token = _context2.sent;
            _context2.next = 17;
            return generalRefreshToken({
              id: checkUser.id,
              isAdmin: checkUser.isAdmin
            });
          case 17:
            refresh_token = _context2.sent;
            resolve({
              code: 200,
              success: true,
              message: 'Đăng nhập thành công!',
              data: {
                access_token: access_token,
                refresh_token: refresh_token
              }
            });
          case 19:
            _context2.next = 24;
            break;
          case 21:
            _context2.prev = 21;
            _context2.t0 = _context2["catch"](1);
            reject(_context2.t0);
          case 24:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[1, 21]]);
    }));
    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }());
};
var updateUser = function updateUser(id, data) {
  return new Promise( /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(resolve, reject) {
      var checkUser, updatedUser;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return User.findOne({
              _id: id
            });
          case 3:
            checkUser = _context3.sent;
            if (checkUser === null) {
              resolve({
                code: 404,
                success: false,
                message: 'Không tìm thấy đối tượng để sửa!'
              });
            }
            _context3.next = 7;
            return User.findByIdAndUpdate(id, _objectSpread({}, data), {
              "new": true
            });
          case 7:
            updatedUser = _context3.sent;
            resolve({
              code: 200,
              success: true,
              message: 'Sửa thành công!',
              data: updatedUser
            });
            _context3.next = 14;
            break;
          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3["catch"](0);
            reject(_context3.t0);
          case 14:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[0, 11]]);
    }));
    return function (_x5, _x6) {
      return _ref3.apply(this, arguments);
    };
  }());
};
var deleteUser = function deleteUser(id) {
  return new Promise( /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(resolve, reject) {
      var checkUser;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return User.findOne({
              _id: id
            });
          case 3:
            checkUser = _context4.sent;
            if (checkUser === null) {
              resolve({
                code: 404,
                success: false,
                message: 'Không tìm thấy đối tượng để xóa!'
              });
            }
            _context4.next = 7;
            return User.findByIdAndDelete(id);
          case 7:
            resolve({
              code: 200,
              success: true,
              message: 'Xóa thành công!'
            });
            _context4.next = 13;
            break;
          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](0);
            reject(_context4.t0);
          case 13:
          case "end":
            return _context4.stop();
        }
      }, _callee4, null, [[0, 10]]);
    }));
    return function (_x7, _x8) {
      return _ref4.apply(this, arguments);
    };
  }());
};
var deleteManyUser = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(ids) {
    var result;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return User.deleteMany({
            _id: {
              $in: ids
            }
          });
        case 3:
          result = _context5.sent;
          return _context5.abrupt("return", {
            code: 200,
            success: true,
            message: 'Delete user success',
            result: result
          });
        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          throw new Error('Error deleting users: ' + _context5.t0.message);
        case 10:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 7]]);
  }));
  return function deleteManyUser(_x9) {
    return _ref5.apply(this, arguments);
  };
}();
var getAllUser = function getAllUser(limit, page) {
  return new Promise( /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(resolve, reject) {
      var totalUser, allUser, skip;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return User.count();
          case 3:
            totalUser = _context6.sent;
            allUser = [];
            if (limit) {
              _context6.next = 11;
              break;
            }
            _context6.next = 8;
            return User.find().select('-image -password');
          case 8:
            allUser = _context6.sent;
            _context6.next = 15;
            break;
          case 11:
            skip = (page - 1) * limit;
            _context6.next = 14;
            return User.find().limit(limit).skip(skip);
          case 14:
            allUser = _context6.sent;
          case 15:
            resolve({
              code: 200,
              success: true,
              message: 'Lấy danh sách User thành công!',
              data: allUser,
              total: totalUser,
              pageCurrent: Number(page),
              totalPage: limit ? Math.ceil(totalUser / limit) : 1
            });
            _context6.next = 21;
            break;
          case 18:
            _context6.prev = 18;
            _context6.t0 = _context6["catch"](0);
            reject(_context6.t0);
          case 21:
          case "end":
            return _context6.stop();
        }
      }, _callee6, null, [[0, 18]]);
    }));
    return function (_x10, _x11) {
      return _ref6.apply(this, arguments);
    };
  }());
};
var getAllUserSearch = function getAllUserSearch(limit, page, type, key) {
  return new Promise( /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(resolve, reject) {
      var query, allUser, skip;
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            query = {}; // Sử dụng biểu thức chính quy để tạo điều kiện tìm kiếm gần đúng
            query["".concat(type)] = {
              $regex: key,
              $options: 'i'
            };
            console.log('query', query);
            allUser = [];
            if (limit) {
              _context7.next = 11;
              break;
            }
            _context7.next = 8;
            return User.find(query).select('-image -password');
          case 8:
            allUser = _context7.sent;
            _context7.next = 15;
            break;
          case 11:
            skip = (page - 1) * limit;
            _context7.next = 14;
            return User.find(query).skip(skip).limit(limit);
          case 14:
            allUser = _context7.sent;
          case 15:
            resolve({
              code: 200,
              success: true,
              message: 'Lấy danh sách User thành công!',
              data: allUser,
              total: allUser.length,
              pageCurrent: Number(page),
              totalPage: limit ? Math.ceil(allUser.length / limit) : 1
            });
            _context7.next = 21;
            break;
          case 18:
            _context7.prev = 18;
            _context7.t0 = _context7["catch"](0);
            reject(_context7.t0);
          case 21:
          case "end":
            return _context7.stop();
        }
      }, _callee7, null, [[0, 18]]);
    }));
    return function (_x12, _x13) {
      return _ref7.apply(this, arguments);
    };
  }());
};
var getDetailsUser = function getDetailsUser(id) {
  return new Promise( /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(resolve, reject) {
      var user;
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return User.findOne({
              _id: id
            }).select('-password');
          case 3:
            user = _context8.sent;
            if (user === null) {
              resolve({
                code: 404,
                success: false,
                message: 'Không tìm thấy người dùng!'
              });
            }
            resolve({
              code: 200,
              success: true,
              message: 'Lấy thông tin người dùng thành công!',
              data: user
            });
            _context8.next = 11;
            break;
          case 8:
            _context8.prev = 8;
            _context8.t0 = _context8["catch"](0);
            reject(_context8.t0);
          case 11:
          case "end":
            return _context8.stop();
        }
      }, _callee8, null, [[0, 8]]);
    }));
    return function (_x14, _x15) {
      return _ref8.apply(this, arguments);
    };
  }());
};
var updatePasswordService = function updatePasswordService(userId, data) {
  return new Promise( /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(resolve, reject) {
      var user, isCurrentPassword, saltRounds, hashedNewPassword, updatePassword;
      return _regeneratorRuntime().wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            _context9.next = 3;
            return User.findOne({
              _id: userId
            });
          case 3:
            user = _context9.sent;
            if (!user) {
              resolve({
                code: 404,
                success: false,
                message: 'Người dùng không tồn tại'
              });
            }
            _context9.next = 7;
            return bcrypt.compare(data.newPassword, user.password);
          case 7:
            isCurrentPassword = _context9.sent;
            if (!isCurrentPassword) {
              _context9.next = 12;
              break;
            }
            resolve({
              code: 404,
              success: false,
              message: 'Mật khẩu mới không được giống mật khẩu hiện tại!'
            });
            _context9.next = 18;
            break;
          case 12:
            saltRounds = 10;
            _context9.next = 15;
            return bcrypt.hash(data.newPassword, saltRounds);
          case 15:
            hashedNewPassword = _context9.sent;
            updatePassword = User.updateOne({
              _id: userId
            }, {
              password: hashedNewPassword
            }).then()["catch"](function (error) {
              console.log('Có lỗi khi update mật khẩu mới!', error);
              resolve({
                code: 500,
                success: false,
                message: 'Có lỗi khi update mật khẩu mới!'
              });
            });
            if (updatePassword) {
              resolve({
                code: 200,
                success: true,
                message: 'Đổi mật khẩu thành công!'
              });
            } else {
              resolve({
                code: 500,
                success: false,
                message: 'Có lỗi khi update mật khẩu mới!'
              });
            }
          case 18:
            _context9.next = 23;
            break;
          case 20:
            _context9.prev = 20;
            _context9.t0 = _context9["catch"](0);
            reject(_context9.t0);
          case 23:
          case "end":
            return _context9.stop();
        }
      }, _callee9, null, [[0, 20]]);
    }));
    return function (_x16, _x17) {
      return _ref9.apply(this, arguments);
    };
  }());
};
var exportExcel = function exportExcel() {
  return new Promise( /*#__PURE__*/function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(resolve, reject) {
      var totalUser, allUser;
      return _regeneratorRuntime().wrap(function _callee10$(_context10) {
        while (1) switch (_context10.prev = _context10.next) {
          case 0:
            _context10.prev = 0;
            _context10.next = 3;
            return User.count();
          case 3:
            totalUser = _context10.sent;
            allUser = [];
            _context10.next = 7;
            return User.find();
          case 7:
            allUser = _context10.sent;
            resolve({
              code: 200,
              success: true,
              message: 'Lấy danh sách User thành công!',
              data: allUser,
              total: totalUser
            });
            _context10.next = 14;
            break;
          case 11:
            _context10.prev = 11;
            _context10.t0 = _context10["catch"](0);
            reject(_context10.t0);
          case 14:
          case "end":
            return _context10.stop();
        }
      }, _callee10, null, [[0, 11]]);
    }));
    return function (_x18, _x19) {
      return _ref10.apply(this, arguments);
    };
  }());
};
module.exports = {
  createUser: createUser,
  loginUser: loginUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  getAllUser: getAllUser,
  getDetailsUser: getDetailsUser,
  deleteManyUser: deleteManyUser,
  updatePasswordService: updatePasswordService,
  getAllUserSearch: getAllUserSearch,
  exportExcel: exportExcel
};