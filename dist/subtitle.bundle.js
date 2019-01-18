(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Subtitle"] = factory();
	else
		root["Subtitle"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toMS;
/**
 * Return the given SRT timestamp as milleseconds.
 * @param {string|number} timestamp
 * @returns {number} milliseconds
 */

function toMS(timestamp) {
  if (!isNaN(timestamp)) {
    return timestamp;
  }

  var match = timestamp.match(/^(?:(\d{2,}):)?(\d{2}):(\d{2})[,.](\d{3})$/);

  if (!match) {
    throw new Error('Invalid SRT or VTT time format: "' + timestamp + '"');
  }

  var hours = match[1] ? parseInt(match[1], 10) * 3600000 : 0;
  var minutes = parseInt(match[2], 10) * 60000;
  var seconds = parseInt(match[3], 10) * 1000;
  var milliseconds = parseInt(match[4], 10);

  return hours + minutes + seconds + milliseconds;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toSrtTime;

var _zeroFill = __webpack_require__(2);

var _zeroFill2 = _interopRequireDefault(_zeroFill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Return the given milliseconds as SRT timestamp.
 * @param timestamp
 * @returns {string}
 */

function toSrtTime(timestamp) {
  if (isNaN(timestamp)) {
    return timestamp;
  }

  var date = new Date(0, 0, 0, 0, 0, 0, timestamp);

  var hours = (0, _zeroFill2.default)(2, date.getHours());
  var minutes = (0, _zeroFill2.default)(2, date.getMinutes());
  var seconds = (0, _zeroFill2.default)(2, date.getSeconds());
  var ms = timestamp - (hours * 3600000 + minutes * 60000 + seconds * 1000);

  return hours + ':' + minutes + ':' + seconds + ',' + (0, _zeroFill2.default)(3, ms);
} /**
   * Module dependencies.
   */

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/**
 * Given a number, return a zero-filled string.
 * From http://stackoverflow.com/questions/1267283/
 * @param  {number} width
 * @param  {number} number
 * @return {string}
 */
module.exports = function zeroFill (width, number, pad) {
  if (number === undefined) {
    return function (number, pad) {
      return zeroFill(width, number, pad)
    }
  }
  if (pad === undefined) pad = '0'
  width -= number.toString().length
  if (width > 0) return new Array(width + (/\./.test(number) ? 2 : 1)).join(pad) + number
  return number + ''
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toVttTime;

var _zeroFill = __webpack_require__(2);

var _zeroFill2 = _interopRequireDefault(_zeroFill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Return the given milliseconds as WebVTT timestamp.
 * @param timestamp
 * @returns {string}
 */

function toVttTime(timestamp) {
  if (isNaN(timestamp)) {
    return timestamp;
  }

  var date = new Date(0, 0, 0, 0, 0, 0, timestamp);

  var hours = (0, _zeroFill2.default)(2, date.getHours());
  var minutes = (0, _zeroFill2.default)(2, date.getMinutes());
  var seconds = (0, _zeroFill2.default)(2, date.getSeconds());
  var ms = timestamp - (hours * 3600000 + minutes * 60000 + seconds * 1000);

  return hours + ':' + minutes + ':' + seconds + '.' + (0, _zeroFill2.default)(3, ms);
} /**
   * Module dependencies.
   */

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseTimestamps;

var _toMS = __webpack_require__(0);

var _toMS2 = _interopRequireDefault(_toMS);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Timestamp regex
 * @type {RegExp}
 */

var RE = /^((?:\d{2,}:)?\d{2}:\d{2}[,.]\d{3}) --> ((?:\d{2,}:)?\d{2}:\d{2}[,.]\d{3})(?: (.*))?$/;

/**
 * parseTimestamps
 * @param value
 * @returns {{start: Number, end: Number}}
 */

/**
 * Module dependencies.
 */

function parseTimestamps(value) {
  var match = RE.exec(value);
  if (match) {
    var cue = {
      start: (0, _toMS2.default)(match[1]),
      end: (0, _toMS2.default)(match[2])
    };
    if (match[3]) {
      cue.settings = match[3];
    }
    return cue;
  }
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toMS = __webpack_require__(0);

Object.defineProperty(exports, 'toMS', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_toMS).default;
  }
});

var _toSrtTime = __webpack_require__(1);

Object.defineProperty(exports, 'toSrtTime', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_toSrtTime).default;
  }
});

var _toVttTime = __webpack_require__(3);

Object.defineProperty(exports, 'toVttTime', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_toVttTime).default;
  }
});

var _parse = __webpack_require__(6);

Object.defineProperty(exports, 'parse', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_parse).default;
  }
});

var _stringify = __webpack_require__(7);

Object.defineProperty(exports, 'stringify', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_stringify).default;
  }
});

var _stringifyVtt = __webpack_require__(8);

Object.defineProperty(exports, 'stringifyVtt', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_stringifyVtt).default;
  }
});

var _resync = __webpack_require__(9);

Object.defineProperty(exports, 'resync', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_resync).default;
  }
});

var _parseTimestamps = __webpack_require__(4);

Object.defineProperty(exports, 'parseTimestamps', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_parseTimestamps).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parse;

var _parseTimestamps = __webpack_require__(4);

var _parseTimestamps2 = _interopRequireDefault(_parseTimestamps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Parse a SRT or WebVTT string.
 * @param {String} srtOrVtt
 * @return {Array} subtitles
 */

function parse(srtOrVtt) {
  if (!srtOrVtt) return [];

  var source = srtOrVtt.trim().concat('\n').replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').replace(/^WEBVTT.*\n(?:.*: .*\n)*\n/, '').split('\n');

  return source.reduce(function (captions, row, index) {
    var caption = captions[captions.length - 1];

    if (!caption.index) {
      if (/^\d+$/.test(row)) {
        caption.index = parseInt(row, 10);
        return captions;
      }
    }

    if (!caption.hasOwnProperty('start')) {
      var timestamp = (0, _parseTimestamps2.default)(row);
      if (timestamp) {
        Object.assign(caption, timestamp);
      } else if (captions.length > 1) {
        captions[captions.length - 2].text += '\n' + row;
      }
      return captions;
    }

    if (row === '') {
      delete caption.index;
      if (index !== source.length - 1) {
        captions.push({});
      }
    } else {
      caption.text = caption.text ? caption.text + '\n' + row : row;
    }

    return captions;
  }, [{}]);
} /**
   * Module dependencies.
   */

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = stringify;

var _toSrtTime = __webpack_require__(1);

var _toSrtTime2 = _interopRequireDefault(_toSrtTime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Stringify the given array of captions.
 * @param {Array} captions
 * @return {String} srt
 */

function stringify(captions) {
  return captions.map(function (caption, index) {
    return (index > 0 ? '\n' : '') + [index + 1, (0, _toSrtTime2.default)(caption.start) + ' --> ' + (0, _toSrtTime2.default)(caption.end), caption.text].join('\n');
  }).join('\n') + '\n';
} /**
   * Module dependencies.
   */

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = stringifyVtt;

var _toVttTime = __webpack_require__(3);

var _toVttTime2 = _interopRequireDefault(_toVttTime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Stringify the given array of captions to WebVTT format.
 * @param {Array} captions
 * @return {String} webVtt
 */

function stringifyVtt(captions) {
  return 'WEBVTT\n\n' + captions.map(function (caption, index) {
    return (index > 0 ? '\n' : '') + [index + 1, (0, _toVttTime2.default)(caption.start) + ' --> ' + (0, _toVttTime2.default)(caption.end) + (caption.settings ? ' ' + caption.settings : ''), caption.text].join('\n');
  }).join('\n') + '\n';
} /**
   * Module dependencies.
   */

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resync;

var _toMS = __webpack_require__(0);

var _toMS2 = _interopRequireDefault(_toMS);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Resync the given subtitles.
 * @param captions
 * @param time
 * @returns {Array|*}
 */

function resync(captions, time) {
  return captions.map(function (caption) {
    var start = (0, _toMS2.default)(caption.start) + time;
    var end = (0, _toMS2.default)(caption.end) + time;

    return Object.assign({}, caption, {
      start: start,
      end: end
    });
  });
} /**
   * Module dependencies.
   */

/***/ })
/******/ ]);
});