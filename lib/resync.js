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
