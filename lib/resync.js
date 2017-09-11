/**
 * Module dependencies.
 */

const toMS = require('./toMS')
const toSrtTime = require('./toSrtTime')

/**
 * Resync the given subtitles.
 * @param {Array} captions
 * @param {Number} time
 */

module.exports = function resync (captions, time) {
  return captions.map(function (caption) {
    const start = toMS(caption.start) + time
    const end = toMS(caption.end) + time

    return Object.assign({}, caption, {
      start: start < 0
        ? toSrtTime(0)
        : toSrtTime(start),
      end: end < 0
        ? toSrtTime(0)
        : toSrtTime(end)
    })
  })
}
