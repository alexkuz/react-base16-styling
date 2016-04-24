'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBase16Theme = exports.createStyling = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _lodash = require('lodash.curry');

var _lodash2 = _interopRequireDefault(_lodash);

var _base = require('base16');

var base16 = _interopRequireWildcard(_base);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var truthy = function truthy(x) {
  return x;
};
var returnEmptyObject = function returnEmptyObject() {
  return {};
};
var DEFAULT_BASE16 = base16.default;

var BASE16_KEYS = (0, _keys2.default)(DEFAULT_BASE16);
var GRAY_COLORS = (0, _from2.default)({ length: 8 }).map(function (_, idx) {
  return 'base0' + idx;
});

var getReversedKey = function getReversedKey(key) {
  return GRAY_COLORS.indexOf(key) !== -1 ? 'base0' + (7 - key.match(/base0(\d)/)[1]) : key;
};

var reverseTheme = function reverseTheme(theme) {
  return (0, _keys2.default)(theme).reduce(function (t, key) {
    return t[getReversedKey(key)] = theme[key], t;
  }, {});
};

var getStylingByKeys = function getStylingByKeys(customStyling, defaultStyling, keys) {
  for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  if (!Array.isArray(keys)) {
    keys = [keys];
  }

  var styles = keys.reduce(function (s, key) {
    return [].concat((0, _toConsumableArray3.default)(s), [defaultStyling[key], customStyling[key]]);
  }, []).filter(truthy);

  return styles.reduce(function (obj, s) {
    if (typeof s === 'string') {
      return (0, _extends3.default)({}, obj, { className: obj.className + ' ' + s });
    } else if ((typeof s === 'undefined' ? 'undefined' : (0, _typeof3.default)(s)) === 'object') {
      return (0, _extends3.default)({}, obj, { style: (0, _extends3.default)({}, obj.style, s) });
    } else if (typeof s === 'function') {
      return (0, _extends3.default)({}, obj, s.apply(undefined, [obj].concat(args)));
    } else {
      return obj;
    }
  }, { className: '', style: {} });
};

var createStyling = (0, _lodash2.default)(function (options) {
  for (var _len2 = arguments.length, args = Array(_len2 > 4 ? _len2 - 4 : 0), _key2 = 4; _key2 < _len2; _key2++) {
    args[_key2 - 4] = arguments[_key2];
  }

  var themeOrStyling = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var base16Themes = arguments[2];
  var isLightTheme = arguments[3];
  var _options$getStylingFr = options.getStylingFromBase16;
  var getStylingFromBase16 = _options$getStylingFr === undefined ? returnEmptyObject : _options$getStylingFr;
  var _options$defaultBase = options.defaultBase16;
  var defaultBase16 = _options$defaultBase === undefined ? DEFAULT_BASE16 : _options$defaultBase;


  var base16Theme = getBase16Theme(themeOrStyling, base16Themes);
  if (base16Theme) {
    themeOrStyling = (0, _extends3.default)({}, base16Theme, themeOrStyling);
  }

  var theme = BASE16_KEYS.reduce(function (t, key) {
    return t[key] = themeOrStyling[key] || defaultBase16[key], t;
  }, {});

  var customStyling = (0, _keys2.default)(themeOrStyling).reduce(function (s, key) {
    return BASE16_KEYS.indexOf(key) === -1 ? (s[key] = themeOrStyling[key], s) : s;
  }, {});

  var defaultStyling = getStylingFromBase16(isLightTheme ? reverseTheme(theme) : theme);

  return (0, _lodash2.default)(getStylingByKeys, 3).apply(undefined, [customStyling, defaultStyling].concat(args));
}, 4);

var getBase16Theme = function getBase16Theme(theme, base16Themes) {
  if (theme && theme.extend) {
    theme = theme.extend;
  }

  if (typeof theme === 'string') {
    theme = (base16Themes || {})[theme] || base16[theme];
  }

  return theme && theme.hasOwnProperty('base00') ? theme : undefined;
};

exports.createStyling = createStyling;
exports.getBase16Theme = getBase16Theme;