/**
 * Module dependencies.
 */

const toMS = require('./toMS')

/**
 * Default parse options.
 */

const defaults = {
  timeFormat: 'srt' // 'ms'
}

/**
 * Parse SRT string.
 * @param {String} srt
 * @param {Object} options
 * @return {Array} subtitles
 */

module.exports = function parse (srt, options = {}) {
  if (!srt) {
    return []
  }

  var subs = []
  var index
  var time
  var text
  var start
  var end

  const settings = Object.assign({}, defaults, options)

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
        start: settings.timeFormat === 'ms' ? toMS(start) : start,
        end: settings.timeFormat === 'ms' ? toMS(end) : end,
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
