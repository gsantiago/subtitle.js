/**
 * Return the given SRT timestamp as milleseconds.
 * @param {String} srtTime
 * @returns {Number} milliseconds
 */

module.exports = function toMS (srtTime) {
  const match = srtTime.match(/^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/)

  if (!match) {
    throw new Error('Invalid SRT time format')
  }

  const hours = parseInt(match[1], 10) * 3600000
  const minutes = parseInt(match[2], 10) * 60000
  const seconds = parseInt(match[3], 10) * 1000
  const milliseconds = parseInt(match[4], 10)

  return hours + minutes + seconds + milliseconds
}
