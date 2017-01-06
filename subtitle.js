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

var toMS = require('./lib/toMS')
var toSrtTime = require('./lib/toSrtTime')
var parse = require('./lib/parse')
var stringify = require('./lib/stringify')
var resync = require('./lib/resync')
var getSubtitles = require('./lib/getSubtitles')
var add = require('./lib/add')

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
 * Alias for `Subtitle.prototype`.
 */

var fn = Subtitle.prototype

/**
 * SRT parser
 *
 * @method
 * @param {String} SRT
 */

fn.parse = function _parse (srt) {
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

fn.add = function _add (caption) {
  add(this._subtitles, caption)
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

fn.getSubtitles = function _getSubtitles (options) {
  return getSubtitles(this._subtitles, options)
}

/**
 * Stringifies the subtitles.
 * @returns {String} srt
 */

fn.stringify = function _stringify () {
  return stringify(this._subtitles)
}

/**
 * Resync the captions
 * @param {Integer} Time in milleseconds
 */

fn.resync = function _resync (time) {
  this._subtitles = resync(this._subtitles, time)
  return this
}

module.exports = Subtitle
