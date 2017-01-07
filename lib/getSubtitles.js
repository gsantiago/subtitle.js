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
 * Transforms the given array of subtitles.
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
