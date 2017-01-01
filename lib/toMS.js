/**
 * Returns the given SRT time as milleseconds.
 * @param {String} srtTime
 * @returns {Number} milliseconds
 */

module.exports = function toMS (srtTime) {
  var match = srtTime.match(/^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/)

  if (!match) {
    throw new Error('Invalid SRT time format')
  }

  var hours = parseInt(match[1], 10)
  var minutes = parseInt(match[2], 10)
  var seconds = parseInt(match[3], 10)
  var milliseconds = parseInt(match[4], 10)

  hours *= 3600000
  minutes *= 60000
  seconds *= 1000

  return hours + minutes + seconds + milliseconds
}
