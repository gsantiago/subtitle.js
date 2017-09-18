/**
 * Module dependencies.
 */

const toMS = require('./toMS')

/**
 * Resync the given subtitles.
 * @param captions
 * @param time
 * @returns {Array|*}
 */

module.exports = function resync (captions, time) {
  return captions.map(caption => {
    const start = toMS(caption.start) + time
    const end = toMS(caption.end) + time

    return Object.assign({}, caption, {
      start,
      end
    })
  })
}
