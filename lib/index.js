'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _dataStore = require('@slack/client/lib/data-store/data-store');

var _dataStore2 = _interopRequireDefault(_dataStore);

var _lodash = require('lodash');

var _models = require('@slack/client/lib/models');

var _models2 = _interopRequireDefault(_models);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.promisifyAll(_redis2.default.RedisClient.prototype); /**
                                                                         * Redis data store for caching information from the Slack API.
                                                                         */

_bluebird2.default.promisifyAll(_redis2.default.Multi.prototype);

function validateArgs(message) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  args.forEach(function (arg) {
    if ((typeof arg === 'undefined' ? 'undefined' : (0, _typeof3.default)(arg)) === 'object') {
      console.log('Invalid arguments: ' + message + ', ' + arg);
    }
  });
}

var SlackRedisDataStore = function (_SlackDataStore) {
  (0, _inherits3.default)(SlackRedisDataStore, _SlackDataStore);

  function SlackRedisDataStore(opts) {
    var _this2 = this;

    (0, _classCallCheck3.default)(this, SlackRedisDataStore);

    var dataStoreOpts = opts || {};

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SlackRedisDataStore).call(this, dataStoreOpts));

    _this.getUserById = function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(userId) {
        var user, data;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (userId) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return', undefined);

              case 2:
                user = void 0;

                validateArgs('getUserByid', _this.userKeyName, userId);
                _context.next = 6;
                return _this.client.hgetAsync(_this.userKeyName, userId);

              case 6:
                data = _context.sent;

                if (data) {
                  user = _this.deserializeToModel(_models2.default.User, data);
                }
                return _context.abrupt('return', user);

              case 9:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this2);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();

    _this.getUserByName = function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(name) {
        var userId;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                validateArgs('getUserByName', _this.userByNameKeyName, name);
                _context2.next = 3;
                return _this.client.hgetAsync(_this.userByNameKeyName, name);

              case 3:
                userId = _context2.sent;
                return _context2.abrupt('return', _this.getUserById(userId));

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this2);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }();

    _this.getUserByEmail = function () {
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(email) {
        var userId;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                validateArgs('getUserByEmail', _this.userByEmailKeyName, email);
                _context3.next = 3;
                return _this.client.hgetAsync(_this.userByEmailKeyName, email);

              case 3:
                userId = _context3.sent;
                return _context3.abrupt('return', _this.getUserById(userId));

              case 5:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, _this2);
      }));

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    }();

    _this.getUserByBotId = function () {
      var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(botId) {
        var userId;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                validateArgs('getUserByBotId', _this.userByBotIdKeyName, botId);
                _context4.next = 3;
                return _this.client.hgetAsync(_this.userByBotIdKeyName, botId);

              case 3:
                userId = _context4.sent;
                return _context4.abrupt('return', _this.getUserById(userId));

              case 5:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, _this2);
      }));

      return function (_x4) {
        return _ref4.apply(this, arguments);
      };
    }();

    _this.getChannelById = function () {
      var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(channelId) {
        var channel, data;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (channelId) {
                  _context5.next = 2;
                  break;
                }

                return _context5.abrupt('return', undefined);

              case 2:
                channel = void 0;

                validateArgs('getChannelById', _this.channelKeyName, channelId);
                _context5.next = 6;
                return _this.client.hgetAsync(_this.channelKeyName, channelId);

              case 6:
                data = _context5.sent;

                if (data) {
                  channel = _this.deserializeToModel(_models2.default.Channel, data);
                }
                return _context5.abrupt('return', channel);

              case 9:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, _this2);
      }));

      return function (_x5) {
        return _ref5.apply(this, arguments);
      };
    }();

    _this.getChannelByName = function () {
      var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(name) {
        var transformedName, channelId;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                transformedName = name.replace(/^#/, '');

                validateArgs('getChannelByName', _this.channelByNameKeyName, transformedName);
                _context6.next = 4;
                return _this.client.hgetAsync(_this.channelByNameKeyName, transformedName);

              case 4:
                channelId = _context6.sent;

                validateArgs('getChannelByNameInner', channelId);
                return _context6.abrupt('return', _this.getChannelById(channelId));

              case 7:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, _this2);
      }));

      return function (_x6) {
        return _ref6.apply(this, arguments);
      };
    }();

    _this.getGroupById = function () {
      var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(groupId) {
        var group, data;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (groupId) {
                  _context7.next = 2;
                  break;
                }

                return _context7.abrupt('return', undefined);

              case 2:
                group = void 0;

                validateArgs('getGroupById', _this.groupKeyName, groupId);
                _context7.next = 6;
                return _this.client.hgetAsync(_this.groupKeyName, groupId);

              case 6:
                data = _context7.sent;

                if (data) {
                  group = _this.deserializeToModel(_models2.default.Group, data);
                }
                return _context7.abrupt('return', group);

              case 9:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, _this2);
      }));

      return function (_x7) {
        return _ref7.apply(this, arguments);
      };
    }();

    _this.getGroupByName = function () {
      var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(name) {
        var groupId;
        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                validateArgs('getGroupByName', _this.groupByNameKeyName, name);
                _context8.next = 3;
                return _this.client.hgetAsync(_this.groupByNameKeyName, name);

              case 3:
                groupId = _context8.sent;
                return _context8.abrupt('return', _this.getGroupById(groupId));

              case 5:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, _this2);
      }));

      return function (_x8) {
        return _ref8.apply(this, arguments);
      };
    }();

    _this.getDMById = function () {
      var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(dmId) {
        var dm, data;
        return _regenerator2.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (dmId) {
                  _context9.next = 2;
                  break;
                }

                return _context9.abrupt('return', undefined);

              case 2:
                dm = void 0;

                validateArgs('getDMById', _this.dmKeyName, dmId);
                _context9.next = 6;
                return _this.client.hgetAsync(_this.dmKeyName, dmId);

              case 6:
                data = _context9.sent;

                if (data) {
                  dm = _this.deserializeToModel(_models2.default.DM, data);
                }
                return _context9.abrupt('return', dm);

              case 9:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, _this2);
      }));

      return function (_x9) {
        return _ref9.apply(this, arguments);
      };
    }();

    _this.getDMByUserId = function () {
      var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(userId) {
        var dmId;
        return _regenerator2.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                validateArgs('getDMByUserId', _this.dmByUserIdKeyName, userId);
                _context10.next = 3;
                return _this.client.hgetAsync(_this.dmByUserIdKeyName, userId);

              case 3:
                dmId = _context10.sent;
                return _context10.abrupt('return', _this.getDMById(dmId));

              case 5:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, _this2);
      }));

      return function (_x10) {
        return _ref10.apply(this, arguments);
      };
    }();

    _this.getDMByName = function () {
      var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(name) {
        var userId;
        return _regenerator2.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                validateArgs('getDMByName', _this.userByNameKeyName, name);
                _context11.next = 3;
                return _this.client.hgetAsync(_this.userByNameKeyName, name);

              case 3:
                userId = _context11.sent;
                return _context11.abrupt('return', _this.getDMByUserId(userId));

              case 5:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, _this2);
      }));

      return function (_x11) {
        return _ref11.apply(this, arguments);
      };
    }();

    _this.getBotById = function () {
      var _ref12 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(botId) {
        var bot, data;
        return _regenerator2.default.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                if (botId) {
                  _context12.next = 2;
                  break;
                }

                return _context12.abrupt('return', undefined);

              case 2:
                bot = void 0;

                validateArgs('getBotById', _this.botKeyName, botId);
                _context12.next = 6;
                return _this.client.hgetAsync(_this.botKeyName, botId);

              case 6:
                data = _context12.sent;

                if (data) {
                  bot = _this.deserialize(data);
                }
                return _context12.abrupt('return', bot);

              case 9:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, _this2);
      }));

      return function (_x12) {
        return _ref12.apply(this, arguments);
      };
    }();

    _this.getBotByName = function () {
      var _ref13 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13(name) {
        var botId;
        return _regenerator2.default.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                validateArgs('getBotByName', _this.botByNameKeyName, name);
                _context13.next = 3;
                return _this.client.hgetAsync(_this.botByNameKeyName, name);

              case 3:
                botId = _context13.sent;
                return _context13.abrupt('return', _this.getBotById(botId));

              case 5:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, _this2);
      }));

      return function (_x13) {
        return _ref13.apply(this, arguments);
      };
    }();

    _this.getBotByUserId = function () {
      var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee14(userId) {
        var bot, user;
        return _regenerator2.default.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                bot = void 0;
                _context14.next = 3;
                return _this.getUserById(userId);

              case 3:
                user = _context14.sent;

                if (user) {
                  bot = _this.getBotById(user.profile.bot_id);
                }
                return _context14.abrupt('return', bot);

              case 6:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, _this2);
      }));

      return function (_x14) {
        return _ref14.apply(this, arguments);
      };
    }();

    _this.getTeamById = function () {
      var _ref15 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee15(teamId) {
        var team, data;
        return _regenerator2.default.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                if (teamId) {
                  _context15.next = 2;
                  break;
                }

                return _context15.abrupt('return', undefined);

              case 2:
                team = void 0;

                validateArgs('getTeamById', _this.teamKeyName, teamId);
                _context15.next = 6;
                return _this.client.hgetAsync(_this.teamKeyName, teamId);

              case 6:
                data = _context15.sent;

                if (data) {
                  team = _this.deserialize(data);
                }
                return _context15.abrupt('return', team);

              case 9:
              case 'end':
                return _context15.stop();
            }
          }
        }, _callee15, _this2);
      }));

      return function (_x15) {
        return _ref15.apply(this, arguments);
      };
    }();

    _this.upsertChannel = function () {
      var _ref16 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee16(channel) {
        var multi, instance, prev;
        return _regenerator2.default.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                multi = void 0;
                instance = void 0;
                _context16.next = 4;
                return _this.getChannelById(channel.id);

              case 4:
                prev = _context16.sent;

                if (prev) {
                  multi = _this.client.multi().hdel(_this.channelByNameKeyName, prev.name);
                  instance = prev.update(channel);
                } else {
                  instance = new _models2.default.Channel(channel);
                }
                return _context16.abrupt('return', _this.setChannel(instance, multi));

              case 7:
              case 'end':
                return _context16.stop();
            }
          }
        }, _callee16, _this2);
      }));

      return function (_x16) {
        return _ref16.apply(this, arguments);
      };
    }();

    _this.upsertGroup = function () {
      var _ref17 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee17(group) {
        var multi, instance, prev;
        return _regenerator2.default.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                multi = void 0;
                instance = void 0;
                _context17.next = 4;
                return _this.getGroupById(group.id);

              case 4:
                prev = _context17.sent;

                if (prev) {
                  multi = _this.client.multi().hdel(_this.groupByNameKeyName, prev.name);
                  instance = prev.update(group);
                } else {
                  instance = new _models2.default.Group(group);
                }
                return _context17.abrupt('return', _this.setGroup(instance, multi));

              case 7:
              case 'end':
                return _context17.stop();
            }
          }
        }, _callee17, _this2);
      }));

      return function (_x17) {
        return _ref17.apply(this, arguments);
      };
    }();

    _this.upsertDM = function () {
      var _ref18 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee18(dm) {
        var multi, instance, prev;
        return _regenerator2.default.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                multi = void 0;
                instance = void 0;
                _context18.next = 4;
                return _this.getDMById(dm.id);

              case 4:
                prev = _context18.sent;

                if (prev) {
                  multi = _this.client.multi().hdel(_this.dmByUserIdKeyName, prev.user);
                  instance = prev.update(dm);
                } else {
                  instance = new _models2.default.DM(dm);
                }
                return _context18.abrupt('return', _this.setDM(instance, multi));

              case 7:
              case 'end':
                return _context18.stop();
            }
          }
        }, _callee18, _this2);
      }));

      return function (_x18) {
        return _ref18.apply(this, arguments);
      };
    }();

    _this.upsertUser = function () {
      var _ref19 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee19(user) {
        var multi, instance, prev;
        return _regenerator2.default.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                multi = void 0;
                instance = void 0;
                _context19.next = 4;
                return _this.getUserById(user.id);

              case 4:
                prev = _context19.sent;

                if (prev) {
                  multi = _this.client.multi().hdel(_this.userByNameKeyName, prev.name).hdel(_this.userByEmailKeyName, prev.email);

                  if (prev.profile && prev.profile.bot_id) {
                    multi = multi.hdel(_this.userByBotIdKeyName, prev.profile.bot_id);
                  }

                  instance = prev.update(user);
                } else {
                  instance = new _models2.default.User(user);
                }
                return _context19.abrupt('return', _this.setUser(instance, multi));

              case 7:
              case 'end':
                return _context19.stop();
            }
          }
        }, _callee19, _this2);
      }));

      return function (_x19) {
        return _ref19.apply(this, arguments);
      };
    }();

    _this.upsertBot = function () {
      var _ref20 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee20(bot) {
        var multi, instance, prev;
        return _regenerator2.default.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                multi = void 0;
                instance = void 0;
                _context20.next = 4;
                return _this.getBotById(bot.id);

              case 4:
                prev = _context20.sent;

                if (prev) {
                  multi = _this.client.multi().hdel(_this.botByNameKeyName, prev.name);
                  instance = (0, _assign2.default)({}, prev, bot);
                } else {
                  instance = bot;
                }
                return _context20.abrupt('return', _this.setBot(instance, multi));

              case 7:
              case 'end':
                return _context20.stop();
            }
          }
        }, _callee20, _this2);
      }));

      return function (_x20) {
        return _ref20.apply(this, arguments);
      };
    }();

    _this.upsertTeam = function () {
      var _ref21 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee21(team) {
        var instance, prev;
        return _regenerator2.default.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                instance = void 0;
                _context21.next = 3;
                return _this.getTeamById(team.id);

              case 3:
                prev = _context21.sent;

                if (prev) {
                  instance = (0, _assign2.default)({}, prev, team);
                } else {
                  instance = team;
                }
                return _context21.abrupt('return', _this.setTeam(instance));

              case 6:
              case 'end':
                return _context21.stop();
            }
          }
        }, _callee21, _this2);
      }));

      return function (_x21) {
        return _ref21.apply(this, arguments);
      };
    }();

    _this.removeChannel = function () {
      var _ref22 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee22(channelId) {
        var channel;
        return _regenerator2.default.wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                _context22.next = 2;
                return _this.getChannelById(channelId);

              case 2:
                channel = _context22.sent;
                return _context22.abrupt('return', _this.client.multi().hdel(_this.channelByNameKeyName, channel.name).hdel(_this.channelKeyName, channel.id).execAsync());

              case 4:
              case 'end':
                return _context22.stop();
            }
          }
        }, _callee22, _this2);
      }));

      return function (_x22) {
        return _ref22.apply(this, arguments);
      };
    }();

    _this.removeGroup = function () {
      var _ref23 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee23(groupId) {
        var group;
        return _regenerator2.default.wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                _context23.next = 2;
                return _this.getGroupById(groupId);

              case 2:
                group = _context23.sent;
                return _context23.abrupt('return', _this.client.multi().hdel(_this.groupByNameKeyName, group.name).hdel(_this.groupKeyName, group.id).execAsync());

              case 4:
              case 'end':
                return _context23.stop();
            }
          }
        }, _callee23, _this2);
      }));

      return function (_x23) {
        return _ref23.apply(this, arguments);
      };
    }();

    _this.removeDM = function () {
      var _ref24 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee24(dmId) {
        var dm;
        return _regenerator2.default.wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                _context24.next = 2;
                return _this.getDMById(dmId);

              case 2:
                dm = _context24.sent;
                return _context24.abrupt('return', _this.client().multi().hdel(_this.dmByUserIdKeyName, dm.user).hdel(_this.dmKeyName, dm.id).execAsync());

              case 4:
              case 'end':
                return _context24.stop();
            }
          }
        }, _callee24, _this2);
      }));

      return function (_x24) {
        return _ref24.apply(this, arguments);
      };
    }();

    _this.removeUser = function () {
      var _ref25 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee25(userId) {
        var user, multi;
        return _regenerator2.default.wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                _context25.next = 2;
                return _this.getUserById(userId);

              case 2:
                user = _context25.sent;
                multi = _this.cient().multi().hdel(_this.userByNameKeyName, user.name).hdel(_this.userKeyName, user.id);


                if (user.profile.bot_id) {
                  multi = multi.hdel(_this.userByBotIdKeyName, user.profile.bot_id);
                }
                if (user.profile.email) {
                  multi = multi.hdel(_this.userByEmailKeyName, user.profile.email);
                }
                return _context25.abrupt('return', multi.execAsync());

              case 7:
              case 'end':
                return _context25.stop();
            }
          }
        }, _callee25, _this2);
      }));

      return function (_x25) {
        return _ref25.apply(this, arguments);
      };
    }();

    _this.removeBot = function () {
      var _ref26 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee26(botId) {
        var bot;
        return _regenerator2.default.wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                _context26.next = 2;
                return _this.getBotById(botId);

              case 2:
                bot = _context26.sent;
                return _context26.abrupt('return', _this.client.multi().hdel(_this.botByNameKeyName, bot.name).hdel(_this.botKeyName, bot.id));

              case 4:
              case 'end':
                return _context26.stop();
            }
          }
        }, _callee26, _this2);
      }));

      return function (_x26) {
        return _ref26.apply(this, arguments);
      };
    }();

    _this.cacheRtmStart = function () {
      var _ref27 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee27(data) {
        var user;
        return _regenerator2.default.wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                _context27.next = 2;
                return _this.clear();

              case 2:
                _context27.next = 4;
                return _this.cacheData(data);

              case 4:
                _context27.next = 6;
                return _this.getUserById(data.self.id);

              case 6:
                user = _context27.sent;

                user.update(data.self);
                _context27.next = 10;
                return _this.setUser(user);

              case 10:
              case 'end':
                return _context27.stop();
            }
          }
        }, _callee27, _this2);
      }));

      return function (_x27) {
        return _ref27.apply(this, arguments);
      };
    }();

    _this.cacheData = function () {
      var _ref28 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee28(data) {
        var promises;
        return _regenerator2.default.wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                promises = [];

                (0, _lodash.forEach)(data.users || [], function (user) {
                  promises.push(_this.setUser(new _models2.default.User(user)));
                });
                (0, _lodash.forEach)(data.channels || [], function (channel) {
                  promises.push(_this.setChannel(new _models2.default.Channel(channel)));
                });
                (0, _lodash.forEach)(data.ims || [], function (dm) {
                  promises.push(_this.setDM(new _models2.default.DM(dm)));
                });
                (0, _lodash.forEach)(data.groups || [], function (group) {
                  promises.push(_this.setGroup(new _models2.default.Group(group)));
                });
                (0, _lodash.forEach)(data.bots || [], function (bot) {
                  promises.push(_this.setBot(bot));
                });
                promises.push(_this.setTeam(data.team));
                return _context28.abrupt('return', _promise2.default.all(promises));

              case 8:
              case 'end':
                return _context28.stop();
            }
          }
        }, _callee28, _this2);
      }));

      return function (_x28) {
        return _ref28.apply(this, arguments);
      };
    }();

    _this.getChannelOrGroupByName = function () {
      var _ref29 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee29(name) {
        var channel;
        return _regenerator2.default.wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                _context29.next = 2;
                return _this.getChannelByName(name);

              case 2:
                channel = _context29.sent;
                return _context29.abrupt('return', channel || _this.getGroupByName(name));

              case 4:
              case 'end':
                return _context29.stop();
            }
          }
        }, _callee29, _this2);
      }));

      return function (_x29) {
        return _ref29.apply(this, arguments);
      };
    }();

    _this.keyPrefix = dataStoreOpts.keyPrefix || '';
    _this.userKeyName = _this.fullKeyName(dataStoreOpts.userKeyName || 'user');
    _this.userByNameKeyName = _this.fullKeyName(dataStoreOpts.userByNameKeyName || 'user.name');
    _this.userByEmailKeyName = _this.fullKeyName(dataStoreOpts.userByEmailKeyName || 'user.email');
    _this.userByBotIdKeyName = _this.fullKeyName(dataStoreOpts.userByBotIdKeyName || 'user.botId');
    _this.channelKeyName = _this.fullKeyName(dataStoreOpts.channelKeyName || 'channel');
    _this.channelByNameKeyName = _this.fullKeyName(dataStoreOpts.channelByNameKeyName || 'channel.name');
    _this.dmKeyName = _this.fullKeyName(dataStoreOpts.dmKeyName || 'dm');
    _this.dmByUserIdKeyName = _this.fullKeyName(dataStoreOpts.dmByUserIdKeyName || 'dm.userId');
    _this.groupKeyName = _this.fullKeyName(dataStoreOpts.groupKeyName || 'group');
    _this.groupByNameKeyName = _this.fullKeyName(dataStoreOpts.groupByNameKeyName || 'group.name');
    _this.botKeyName = _this.fullKeyName(dataStoreOpts.botKeyName || 'bot');
    _this.botByNameKeyName = _this.fullKeyName(dataStoreOpts.botByNameKeyName || 'bot.name');
    _this.teamKeyName = _this.fullKeyName(dataStoreOpts.teamKeyName || 'team');
    _this.client = _redis2.default.createClient(dataStoreOpts.redisOpts || {});
    return _this;
  }

  (0, _createClass3.default)(SlackRedisDataStore, [{
    key: 'fullKeyName',
    value: function fullKeyName(name) {
      return '' + this.keyPrefix + name;
    }
  }, {
    key: 'serialize',
    value: function serialize(obj) {
      return (0, _stringify2.default)(obj);
    }
  }, {
    key: 'deserialize',
    value: function deserialize(data) {
      return JSON.parse(data);
    }
  }, {
    key: 'clear',
    value: function clear() {
      return this.client.multi().del(this.userKeyName).del(this.userByNameKeyName).del(this.userByEmailKeyName).del(this.userByBotIdKeyName).del(this.channelKeyName).del(this.channelByNameKeyName).del(this.dmKeyName).del(this.dmByUserIdKeyName).del(this.groupKeyName).del(this.groupByNameKeyName).del(this.botKeyName).del(this.botByNameKeyName).del(this.teamKeyName).execAsync();
    }
  }, {
    key: 'deserializeToModel',
    value: function deserializeToModel(Model, data) {
      return new Model(this.deserialize(data));
    }
  }, {
    key: 'setChannel',
    value: function setChannel(channel) {
      var multi = arguments.length <= 1 || arguments[1] === undefined ? this.client.multi() : arguments[1];

      return multi.hset(this.channelKeyName, channel.id, this.serialize(channel)).hset(this.channelByNameKeyName, channel.name, channel.id).execAsync();
    }
  }, {
    key: 'setGroup',
    value: function setGroup(group) {
      var multi = arguments.length <= 1 || arguments[1] === undefined ? this.client.multi() : arguments[1];

      return multi.hset(this.groupKeyName, group.id, this.serialize(group)).hset(this.groupByNameKeyName, group.name, group.id).execAsync();
    }
  }, {
    key: 'setDM',
    value: function setDM(dm) {
      var multi = arguments.length <= 1 || arguments[1] === undefined ? this.client.multi() : arguments[1];

      return multi.hset(this.dmKeyName, dm.id, this.serialize(dm)).hset(this.dmByUserIdKeyName, dm.user, dm.id).execAsync();
    }
  }, {
    key: 'setUser',
    value: function setUser(user) {
      var m = arguments.length <= 1 || arguments[1] === undefined ? this.client.multi() : arguments[1];

      var multi = m.hset(this.userKeyName, user.id, this.serialize(user)).hset(this.userByNameKeyName, user.name, user.id);

      if (user.profile.bot_id) {
        multi = multi.hset(this.userByBotIdKeyName, user.profile.bot_id, user.id);
      }
      if (user.profile.email) {
        multi = multi.hset(this.userByEmailKeyName, user.profile.email, user.id);
      }
      return multi.execAsync();
    }
  }, {
    key: 'setBot',
    value: function setBot(bot) {
      var m = arguments.length <= 1 || arguments[1] === undefined ? this.client.multi() : arguments[1];

      var multi = m.hset(this.botKeyName, bot.id, this.serialize(bot));
      if (bot.name) {
        multi = multi.hset(this.botByNameKeyName, bot.name, bot.id);
      }
      return multi.execAsync();
    }
  }, {
    key: 'setTeam',
    value: function setTeam(team) {
      var multi = arguments.length <= 1 || arguments[1] === undefined ? this.client.multi() : arguments[1];

      return multi.hset(this.teamKeyName, team.id, this.serialize(team)).execAsync();
    }
  }, {
    key: 'removeTeam',
    value: function removeTeam(teamId) {
      return this.client.hdelAsync(this.teamKeyName, teamId);
    }
  }]);
  return SlackRedisDataStore;
}(_dataStore2.default);

exports.default = SlackRedisDataStore;