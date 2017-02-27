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
