"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logGraphQLErrorToSlack = undefined;

var logGraphQLErrorToSlack = exports.logGraphQLErrorToSlack = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(webhook, error) {
    var message, slack;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            message = {
              message: error.message,
              locations: error.locations,
              stack: error.stack
            };
            _context2.prev = 1;
            slack = new _nodeSlack2.default(webhook);
            _context2.next = 5;
            return slack.send({ text: JSON.stringify(message) });

          case 5:
            _context2.next = 10;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](1);

            console.log("koa-error-slack: Unable to send error message to Slack", _context2.t0);

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 7]]);
  }));

  return function logGraphQLErrorToSlack(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * Log Koa errors to Slack helper.
 */


var logToSlack = function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(webhook, ctx, start, error) {
    var end, request, response, message, slack;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;

            console.log("koa-error-slack: Error detected...");
            end = new Date();
            request = {
              headers: ctx.headers || 'NA',
              method: ctx.method || 'NA',
              url: ctx.url || 'NA',
              originalUrl: ctx.originalUrl || 'NA',
              origin: ctx.origin || 'NA',
              href: ctx.href || 'NA',
              path: ctx.path || 'NA',
              query: ctx.query || 'NA',
              querystring: ctx.querystring || 'NA',
              host: ctx.host || 'NA',
              hostname: ctx.hostname || 'NA',
              protocol: ctx.protocol || 'NA',
              ip: ctx.ip || 'NA',
              ips: ctx.ips || 'NA',
              subdomains: ctx.subdomains || 'NA',
              secure: ctx.secure || 'NA'
            };
            response = {
              // body: ctx.body || 'NA',
              status: ctx.status || 'NA',
              message: ctx.message || 'NA',
              length: ctx.length || 'NA',
              type: ctx.type || 'NA'
            };
            message = {
              request: request,
              response: response,
              error: {
                error: error || 'NA',
                stack: JSON.stringify(error.stack) || 'NA'
              },
              date: {
                start: start,
                end: end,
                delta: time(start, end)
              }
            };

            //Create new Slack instance and publish

            slack = new _nodeSlack2.default(webhook);
            _context3.next = 9;
            return slack.send({ text: JSON.stringify(message) });

          case 9:
            _context3.next = 14;
            break;

          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3["catch"](0);

            console.log("koa-error-slack: Unable to send error message to Slack", _context3.t0);

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 11]]);
  }));

  return function logToSlack(_x5, _x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * Helper funtion
 * Returns the response time in milliseconds if less than 10 seconds,
 * in seconds otherwise.
 */

exports.default = koaErrorLogToSlack;

var _nodeSlack = require("node-slack");

var _nodeSlack2 = _interopRequireDefault(_nodeSlack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Middleware that log Koa errors to Slack.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */


function koaErrorLogToSlack(webhook) {
  var _this = this;

  console.log("koa-error-slack: Setting up...");
  return function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
      var start;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              start = new Date(); // Time the request started

              if (!webhook) {
                _context.next = 14;
                break;
              }

              _context.prev = 2;
              _context.next = 5;
              return next();

            case 5:
              _context.next = 12;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](2);
              _context.next = 11;
              return logToSlack(webhook, ctx, start, _context.t0);

            case 11:
              throw _context.t0;

            case 12:
              _context.next = 15;
              break;

            case 14:
              throw "Koa Error Slack needs a webhook";

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this, [[2, 7]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
}

function time(start, end) {
  var delta = end - start;
  delta = delta < 10000 ? delta + 'ms' : Math.round(delta / 1000) + 's';
  return delta;
}