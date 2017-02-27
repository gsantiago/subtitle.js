(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Subtitle = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Module dependencies.
 */

var toMS = require('./toMS')
var toSrtTime = require('./toSrtTime')

/**
 * Add a new caption into the array of subtitles.
 *
 * @param {Array} subtitles
 * @param {Object} caption
 * @return {Array} subtitles
 */

module.exports = function add (subtitles, caption) {
  if (!caption.start || !caption.end || !caption.text) {
    throw new Error('Invalid caption data')
  }

  for (var prop in caption) {
    if (!caption.hasOwnProperty(prop) || prop === 'text') {
      continue
    }

    if (prop === 'start' || prop === 'end') {
      if (/^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/.test(caption[prop])) {
        continue
      }
      if (/^\d+$/.test(caption[prop])) {
        caption[prop] = toSrtTime(caption[prop])
      } else {
        throw new Error('Invalid caption time format')
      }
    }
  }

  subtitles.push({
    index: subtitles.length + 1,
    start: caption.start,
    end: caption.end,
    duration: toMS(caption.end) - toMS(caption.start),
    text: caption.text
  })

  return subtitles
}

},{"./toMS":6,"./toSrtTime":7}],2:[function(require,module,exports){
/**
 * Module dependencies.
 */

var extend = require('xtend/immutable')
var toMS = require('./toMS')

/**
 * Default options.
 */

var defaults = {
  timeFormat: 'srt',
  duration: false
}

/**
 * Transform the given array of subtitles.
 * @param {Array} subtitles
 * @param {Object} options
 * @return {Array} subtitles
 */

module.exports = function getSubtitles (subtitles, options) {
  options = extend(defaults, options)

  if (options.timeFormat === 'ms') {
    subtitles = subtitles.map(function (caption) {
      caption.start = toMS(caption.start)
      caption.end = toMS(caption.end)
      return caption
    })
  }

  if (!options.duration) {
    subtitles = subtitles.map(function (caption) {
      delete caption.duration
      return caption
    })
  }

  return subtitles
}

},{"./toMS":6,"xtend/immutable":8}],3:[function(require,module,exports){
/**
 * Module dependencies.
 */

var toMS = require('./toMS')

/**
 * Parse SRT string.
 * @param {String} srt
 * @return {Array} subtitles
 */

module.exports = function parse (srt) {
  var subs = []
  var index
  var time
  var text
  var start
  var end

  if (!srt) {
    throw new Error('No SRT to parse')
  }

  srt = srt.trim()
  srt += '\n'
  srt = srt
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')

  srt.forEach(function (line) {
    line = line.toString()

    // if we don't have an index, so we should expect an index
    if (!index) {
      if (/^\d+$/.test(line)) {
        index = parseInt(line)
        return
      }
    }

    // now we have to check for the time
    if (!time) {
      var match = line.match(/^(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})$/)
      if (match) {
        start = match[1]
        end = match[2]
        time = true
        return
      }
    }

    // now we get all the strings until we get an empty line
    if (line.trim() === '') {
      subs.push({
        index: index,
        start: start,
        end: end,
        duration: toMS(end) - toMS(start),
        text: text || ''
      })
      index = time = start = end = text = null
    } else {
      if (!text) {
        text = line
      } else {
        text += '\n' + line
      }
    }
  })

  return subs
}

},{"./toMS":6}],4:[function(require,module,exports){
/**
 * Module dependencies.
 */

var toMS = require('./toMS')
var toSrtTime = require('./toSrtTime')

/**
 * Resync the subtitles.
 * @param {Array} subtitles
 * @param {Number} time
 */

module.exports = function resync (subtitles, time) {
  if (!/(-|\+)?\d+/.test(time.toString())) {
    throw new Error('Invalid time: ' + time + '.Expected a valid integer')
  }

  time = parseInt(time, 10)

  return subtitles.map(function (caption) {
    var start = toMS(caption.start)
    var end = toMS(caption.end)

    start = start + time
    end = end + time

    caption.start = start < 0
      ? toSrtTime(0)
      : toSrtTime(start)

    caption.end = end < 0
      ? toSrtTime(0)
      : toSrtTime(end)

    return caption
  })
}

},{"./toMS":6,"./toSrtTime":7}],5:[function(require,module,exports){
/**
 * Stringify the given array of subtitles.
 * @param {Array} subtitles
 * @return {String} srt
 */

module.exports = function stringify (subtitles) {
  var buffer = ''

  subtitles.forEach(function (caption, index) {
    if (index > 0) {
      buffer += '\n'
    }
    buffer += caption.index
    buffer += '\n'
    buffer += caption.start + ' --> ' + caption.end
    buffer += '\n'
    buffer += caption.text
    buffer += '\n'
  })

  return buffer
}

},{}],6:[function(require,module,exports){
/**
 * Return the given SRT timestamp as milleseconds.
 * @param {String} srtTime
 * @returns {Number} milliseconds
 */

module.exports = function toMS (srtTime) {
  var match = srtTime.match(/^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/)

  if (!match) {
    throw new Error('Invalid SRT time format')
  }

  var hours = parseInt(match[1], 10)
  var minutes = parseInt(match[2], 10)
  var seconds = parseInt(match[3], 10)
  var milliseconds = parseInt(match[4], 10)

  hours *= 3600000
  minutes *= 60000
  seconds *= 1000

  return hours + minutes + seconds + milliseconds
}

},{}],7:[function(require,module,exports){
/**
 * Return the given milliseconds as SRT timestamp.
 * @param {Integer} milliseconds
 * @return {String} srtTimestamp
 */

module.exports = function toSrtTime (milliseconds) {
  if (!/^\d+$/.test(milliseconds.toString())) {
    throw new Error('Time should be an Integer value in milliseconds')
  }

  milliseconds = parseInt(milliseconds)

  var date = new Date(0, 0, 0, 0, 0, 0, milliseconds)

  var hours = date.getHours() < 10
    ? '0' + date.getHours()
    : date.getHours()

  var minutes = date.getMinutes() < 10
    ? '0' + date.getMinutes()
    : date.getMinutes()

  var seconds = date.getSeconds() < 10
    ? '0' + date.getSeconds()
    : date.getSeconds()

  var ms = milliseconds - ((hours * 3600000) + (minutes * 60000) + (seconds * 1000))

  if (ms < 100 && ms >= 10) {
    ms = '0' + ms
  } else if (ms < 10) {
    ms = '00' + ms
  }

  var srtTime = hours + ':' + minutes + ':' + seconds + ',' + ms

  return srtTime
}

},{}],8:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],9:[function(require,module,exports){
'use strict'

/*!
 * Subtitle.js
 * Parse and manipulate SRT (SubRip)
 * https://github.com/gsantiago/subtitle.js
 *
 * @version 0.1.5
 * @author Guilherme Santiago
*/

/**
 * Module dependencies.
 */

var toMS = require('./lib/toMS')
var toSrtTime = require('./lib/toSrtTime')
var parse = require('./lib/parse')
var stringify = require('./lib/stringify')
var resync = require('./lib/resync')
var getSubtitles = require('./lib/getSubtitles')
var add = require('./lib/add')

/**
 * Export `Subtitle`.
 */

module.exports = Subtitle

/**
 * Subtitle constructor.
 * @constructor
 * @param {String} srt
 */

function Subtitle (srt) {
  if (!(this instanceof Subtitle)) return new Subtitle(srt)

  this._subtitles = []

  if (srt) {
    this.parse(srt)
  }
}

/**
 * Alias for `Subtitle.prototype`.
 */

var fn = Subtitle.prototype

/**
 * Parse the given SRT.
 *
 * @method
 * @param {String} srt
 */

fn.parse = function _parse (srt) {
  this._subtitles = parse(srt)
}

/**
 * Add a caption.
 * You have to pass an object with the following data:
 * start - The start timestamp
 * end - The end timestamp
 * text - The caption text
 *
 * The timestamps support two patterns:
 * The SRT pattern: '00:00:24,400'
 * Or a positive integer representing milliseconds
 *
 * @public
 * @param {Object} Caption data
 */

fn.add = function _add (caption) {
  add(this._subtitles, caption)
  return this
}

/**
 * Return the subtitles.
 *
 * @param {Object} Options
 * @returns {Array} Subtitles
 */

fn.getSubtitles = function _getSubtitles (options) {
  return getSubtitles(this._subtitles, options)
}

/**
 * Stringify the SRT.
 *
 * @returns {String} srt
 */

fn.stringify = function _stringify () {
  return stringify(this._subtitles)
}

/**
 * Resync the captions.
 *
 * @param {Integer} Time in milleseconds
 */

fn.resync = function _resync (time) {
  this._subtitles = resync(this._subtitles, time)
  return this
}

/**
 * Convert the SRT time format to milliseconds
 *
 * @static
 * @param {String} SRT time format
 */

Subtitle.toMS = toMS

/**
 * Convert milliseconds to SRT time format
 *
 * @static
 * @param {Integer} Milleseconds
 */

Subtitle.toSrtTime = toSrtTime

},{"./lib/add":1,"./lib/getSubtitles":2,"./lib/parse":3,"./lib/resync":4,"./lib/stringify":5,"./lib/toMS":6,"./lib/toSrtTime":7}]},{},[9])(9)
});