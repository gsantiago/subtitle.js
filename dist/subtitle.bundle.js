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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Return the given SRT timestamp as milleseconds.
 * @param {string|number} timestamp
 * @returns {number} milliseconds
 */

module.exports = function toMS(timestamp) {
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
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Module dependencies.
 */

var zeroFill = __webpack_require__(3);

/**
 * Return the given milliseconds as SRT timestamp.
 * @param timestamp
 * @returns {string}
 */

module.exports = function toSrtTime(timestamp) {
  if (isNaN(timestamp)) {
    return timestamp;
  }

  var date = new Date(0, 0, 0, 0, 0, 0, timestamp);

  var hours = zeroFill(2, date.getHours());
  var minutes = zeroFill(2, date.getMinutes());
  var seconds = zeroFill(2, date.getSeconds());
  var ms = timestamp - (hours * 3600000 + minutes * 60000 + seconds * 1000);

  return hours + ':' + minutes + ':' + seconds + ',' + zeroFill(3, ms);
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.toMS = __webpack_require__(0);
exports.toSrtTime = __webpack_require__(1);
exports.parse = __webpack_require__(4);
exports.stringify = __webpack_require__(6);
exports.resync = __webpack_require__(7);

/***/ }),
/* 3 */
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Module dependencies.
 */

var parseTimestamps = __webpack_require__(5);

/**
 * Parse a SRT or WebVTT string.
 * @param {String} srtOrVtt
 * @return {Array} subtitles
 */

module.exports = function parse(srtOrVtt) {
  if (!srtOrVtt) return [];

  var source = srtOrVtt.trim().concat('\n').replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').replace(/^WEBVTT.*\n{2}/, '').split('\n');

  return source.reduce(function (captions, row, index) {
    var caption = captions[captions.length - 1];

    if (!caption.index) {
      if (/^\d+$/.test(row)) {
        caption.index = parseInt(row, 10);
        return captions;
      }
    }

    if (!caption.hasOwnProperty('start')) {
      Object.assign(caption, parseTimestamps(row));
      return captions;
    }

    if (row.trim() === '') {
      delete caption.index;
      if (index !== source.length - 1) {
        captions.push({});
      }
    } else {
      caption.text = caption.text ? caption.text + '\n' + row : row;
    }

    return captions;
  }, [{}]);
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Module dependencies.
 */

var toMS = __webpack_require__(0);

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

module.exports = function parseTimestamps(value) {
  var match = RE.exec(value);
  var cue = {
    start: toMS(match[1]),
    end: toMS(match[2])
  };
  if (match[3]) {
    cue.settings = match[3];
  }
  return cue;
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Module dependencies.
 */

var toSrtTime = __webpack_require__(1);

/**
 * Stringify the given array of captions.
 * @param {Array} captions
 * @return {String} srt
 */

module.exports = function stringify(captions) {
  return captions.map(function (caption, index) {
    return (index > 0 ? '\n' : '') + [index + 1, toSrtTime(caption.start) + ' --> ' + toSrtTime(caption.end), caption.text].join('\n');
  }).join('\n') + '\n';
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Module dependencies.
 */

var toMS = __webpack_require__(0);

/**
 * Resync the given subtitles.
 * @param captions
 * @param time
 * @returns {Array|*}
 */

module.exports = function resync(captions, time) {
  return captions.map(function (caption) {
    var start = toMS(caption.start) + time;
    var end = toMS(caption.end) + time;

    return Object.assign({}, caption, {
      start: start,
      end: end
    });
  });
};

/***/ })
/******/ ]);
});