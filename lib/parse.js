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
