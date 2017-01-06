/**
 * Module dependencies.
 */

var toMS = require('./toMS')
var toSrtTime = require('./toSrtTime')

/**
 * Adds a new caption into the array of subtitles.
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
