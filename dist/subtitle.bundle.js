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
exports.toMS = toMS;
/**
 * Return the given SRT timestamp as milleseconds.
 * @param {string|number} timestamp
 * @returns {number} milliseconds
 */

function toMS(timestamp) {
  if (!isNaN(timestamp)) {
    return timestamp;
  }

  var match = timestamp.match(/^(?:(\d{1,}):)?(\d{2}):(\d{2})[,.](\d{3})$/);

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
exports.toSrtTime = toSrtTime;

var _padLeft = __webpack_require__(2);

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

  var hours = (0, _padLeft.padLeft)(date.getHours());
  var minutes = (0, _padLeft.padLeft)(date.getMinutes());
  var seconds = (0, _padLeft.padLeft)(date.getSeconds());
  var ms = timestamp - (hours * 3600000 + minutes * 60000 + seconds * 1000);

  return hours + ':' + minutes + ':' + seconds + ',' + (0, _padLeft.padLeft)(ms, 3);
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var padLeft = exports.padLeft = function padLeft(value) {
  var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  return value.toString().padStart(length, 0);
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toVttTime = toVttTime;

var _padLeft = __webpack_require__(2);

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

  var hours = (0, _padLeft.padLeft)(date.getHours());
  var minutes = (0, _padLeft.padLeft)(date.getMinutes());
  var seconds = (0, _padLeft.padLeft)(date.getSeconds());
  var ms = timestamp - (hours * 3600000 + minutes * 60000 + seconds * 1000);

  return hours + ':' + minutes + ':' + seconds + '.' + (0, _padLeft.padLeft)(ms, 3);
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseTimestamps = parseTimestamps;

var _toMS = __webpack_require__(0);

/**
 * Timestamp regex
 * @type {RegExp}
 */

var RE = /^((?:\d{1,}:)?\d{2}:\d{2}[,.]\d{3}) --> ((?:\d{1,}:)?\d{2}:\d{2}[,.]\d{3})(?: (.*))?$/;

/**
 * parseTimestamps
 * @param value
 * @returns {{start: Number, end: Number}}
 */

function parseTimestamps(value) {
  var match = RE.exec(value);

  if (match) {
    return {
      start: (0, _toMS.toMS)(match[1]),
      end: (0, _toMS.toMS)(match[2]),
      settings: match[3]
    };
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
    return _toMS.toMS;
  }
});

var _toSrtTime = __webpack_require__(1);

Object.defineProperty(exports, 'toSrtTime', {
  enumerable: true,
  get: function get() {
    return _toSrtTime.toSrtTime;
  }
});

var _toVttTime = __webpack_require__(3);

Object.defineProperty(exports, 'toVttTime', {
  enumerable: true,
  get: function get() {
    return _toVttTime.toVttTime;
  }
});

var _parse = __webpack_require__(6);

Object.defineProperty(exports, 'parse', {
  enumerable: true,
  get: function get() {
    return _parse.parse;
  }
});

var _stringify = __webpack_require__(7);

Object.defineProperty(exports, 'stringify', {
  enumerable: true,
  get: function get() {
    return _stringify.stringify;
  }
});

var _stringifyVtt = __webpack_require__(8);

Object.defineProperty(exports, 'stringifyVtt', {
  enumerable: true,
  get: function get() {
    return _stringifyVtt.stringifyVtt;
  }
});

var _resync = __webpack_require__(9);

Object.defineProperty(exports, 'resync', {
  enumerable: true,
  get: function get() {
    return _resync.resync;
  }
});

var _parseTimestamps = __webpack_require__(4);

Object.defineProperty(exports, 'parseTimestamps', {
  enumerable: true,
  get: function get() {
    return _parseTimestamps.parseTimestamps;
  }
});

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;

var _parseTimestamps = __webpack_require__(4);

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
      var timestamp = (0, _parseTimestamps.parseTimestamps)(row);
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
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringify = stringify;

var _toSrtTime = __webpack_require__(1);

/**
 * Stringify the given array of captions.
 * @param {Array} captions
 * @return {String} srt
 */

function stringify(captions) {
  return captions.map(function (caption, index) {
    return (index > 0 ? '\n' : '') + [index + 1, (0, _toSrtTime.toSrtTime)(caption.start) + ' --> ' + (0, _toSrtTime.toSrtTime)(caption.end), caption.text].join('\n');
  }).join('\n') + '\n';
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringifyVtt = stringifyVtt;

var _toVttTime = __webpack_require__(3);

/**
 * Stringify the given array of captions to WebVTT format.
 * @param {Array} captions
 * @return {String} webVtt
 */

function stringifyVtt(captions) {
  return 'WEBVTT\n\n' + captions.map(function (caption, index) {
    return (index > 0 ? '\n' : '') + [index + 1, (0, _toVttTime.toVttTime)(caption.start) + ' --> ' + (0, _toVttTime.toVttTime)(caption.end) + (caption.settings ? ' ' + caption.settings : ''), caption.text].join('\n');
  }).join('\n') + '\n';
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resync = resync;

var _toMS = __webpack_require__(0);

/**
 * Resync the given subtitles.
 * @param captions
 * @param time
 * @returns {Array|*}
 */

function resync(captions, time) {
  return captions.map(function (caption) {
    var start = (0, _toMS.toMS)(caption.start) + time;
    var end = (0, _toMS.toMS)(caption.end) + time;

    return Object.assign({}, caption, {
      start: start,
      end: end
    });
  });
}

/***/ })
/******/ ]);
});