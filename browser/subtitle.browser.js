(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Subtitle = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

exports.toMS = require('./lib/toMS');
exports.toSrtTime = require('./lib/toSrtTime');
exports.parse = require('./lib/parse');
exports.stringify = require('./lib/stringify');
exports.resync = require('./lib/resync');

},{"./lib/parse":2,"./lib/resync":4,"./lib/stringify":5,"./lib/toMS":6,"./lib/toSrtTime":7}],2:[function(require,module,exports){
'use strict';

/**
 * Module dependencies.
 */

var parseTimestamps = require('./parseTimestamps');

/**
 * Parse SRT string.
 * @param {String} srt
 * @return {Array} subtitles
 */

module.exports = function parse(srt) {
  if (!srt) return [];

  var source = srt.trim().concat('\n').replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').split('\n');

  return source.reduce(function (captions, row, index) {
    var caption = captions[captions.length - 1];

    if (!caption.index) {
      if (/^\d+$/.test(row)) {
        caption.index = parseInt(row, 10);
        return captions;
      }
    }

    if (!caption.start) {
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

},{"./parseTimestamps":3}],3:[function(require,module,exports){
'use strict';

/**
 * Module dependencies.
 */

var toMS = require('./toMS');

/**
 * Timestamp regex
 * @type {RegExp}
 */

var RE = /^(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})$/;

/**
 * parseTimestamps
 * @param value
 * @returns {{start: Number, end: Number}}
 */

module.exports = function parseTimestamps(value) {
  var match = RE.exec(value);
  return {
    start: toMS(match[1]),
    end: toMS(match[2])
  };
};

},{"./toMS":6}],4:[function(require,module,exports){
'use strict';

/**
 * Module dependencies.
 */

var toMS = require('./toMS');

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

},{"./toMS":6}],5:[function(require,module,exports){
'use strict';

/**
 * Module dependencies.
 */

var toSrtTime = require('./toSrtTime');

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

},{"./toSrtTime":7}],6:[function(require,module,exports){
'use strict';

/**
 * Return the given SRT timestamp as milleseconds.
 * @param {string|number} timestamp
 * @returns {number} milliseconds
 */

module.exports = function toMS(timestamp) {
  if (!isNaN(timestamp)) {
    return timestamp;
  }

  var match = timestamp.match(/^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/);

  if (!match) {
    throw new Error('Invalid SRT time format');
  }

  var hours = parseInt(match[1], 10) * 3600000;
  var minutes = parseInt(match[2], 10) * 60000;
  var seconds = parseInt(match[3], 10) * 1000;
  var milliseconds = parseInt(match[4], 10);

  return hours + minutes + seconds + milliseconds;
};

},{}],7:[function(require,module,exports){
'use strict';

/**
 * Module dependencies.
 */

var zeroFill = require('zero-fill');

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

},{"zero-fill":8}],8:[function(require,module,exports){
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

},{}]},{},[1])(1)
});