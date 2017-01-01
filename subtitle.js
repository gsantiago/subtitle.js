'use strict'

/*!
 * Subtitle.js
 * Parse and manipulate SRT (SubRip)
 * https://github.com/gsantiago/subtitle.js
 *
 * @version 0.1.2
 * @author Guilherme Santiago
*/

/**
 * Module dependencies.
 */

var extend = require('xtend/immutable')
var toMS = require('./lib/toMS')
var toSrtTime = require('./lib/toSrtTime')
var parse = require('./lib/parse')

/**
 * @constructor
 * @param {String} Optional SRT content to be parsed
*/
function Subtitle (srt) {
  if (!(this instanceof Subtitle)) return new Subtitle(srt)

  this._subtitles = []

  if (srt) {
    this.parse(srt)
  }
}

/**
 * SRT parser
 *
 * @method
 * @param {String} SRT
 */

Subtitle.prototype.parse = function (srt) {
  this._subtitles = parse(srt)
}

/**
 * Add a caption
 * You have to pass an object containing the following data:
 * start - The start time
 * end - The end time
 * text - The caption text
 *
 * The start and end time support two patterns:
 * The SRT: '00:00:24,400'
 * Or a positive integer representing milliseconds
 *
 * @public
 * @param {Object} Caption data
*/
Subtitle.prototype.add = function (caption) {
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
        caption[prop] = Subtitle.toSrtTime(caption[prop])
      } else {
        throw new Error('Invalid caption time format')
      }
    }
  }

  this._subtitles.push({
    index: this._subtitles.length + 1,
    start: caption.start,
    end: caption.end,
    duration: Subtitle.toMS(caption.end) - Subtitle.toMS(caption.start),
    text: caption.text
  })

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

/**
 * Return the subtitles
 *
 * @param {Object} Options
 * @returns {Array} Subtitles
*/
Subtitle.prototype.getSubtitles = function (options) {
  var subtitles = this._subtitles

  var defaults = {
    timeFormat: 'srt',
    duration: false
  }

  options = extend(defaults, options)

  if (options.timeFormat === 'ms') {
    subtitles = subtitles.map(function (caption) {
      caption.start = Subtitle.toMS(caption.start)
      caption.end = Subtitle.toMS(caption.end)
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

/**
 * Returns the subtitles in SRT string
 * @returns {String} srt
*/
Subtitle.prototype.stringify = function () {
  var buffer = ''

  this._subtitles.forEach(function (caption, index) {
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

/**
 * Resync the captions
 * @param {Integer} Time in milleseconds
*/
Subtitle.prototype.resync = function (time) {
  if (!/(-|\+)?\d+/.test(time.toString())) {
    throw new Error('Invalid time: ' + time + '.Expected a valid integer')
  }

  time = parseInt(time, 10)

  this._subtitles = this._subtitles.map(function (caption) {
    var start = Subtitle.toMS(caption.start)
    var end = Subtitle.toMS(caption.end)

    start = start + time
    end = end + time

    caption.start = start < 0
      ? Subtitle.toSrtTime(0)
      : Subtitle.toSrtTime(start)

    caption.end = end < 0
      ? Subtitle.toSrtTime(0)
      : Subtitle.toSrtTime(end)

    return caption
  })

  return this
}

module.exports = Subtitle
