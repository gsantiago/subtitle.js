/**
 * Module dependencies.
 */

const zeroFill = require('zero-fill')

/**
 * Return the given milliseconds as SRT timestamp.
 * @param milliseconds
 * @returns {string}
 */

module.exports = function toSrtTime (milliseconds) {
  if (isNaN(milliseconds)) {
    return milliseconds
  }

  const date = new Date(0, 0, 0, 0, 0, 0, milliseconds)

  const hours = zeroFill(2, date.getHours())
  const minutes = zeroFill(2, date.getMinutes())
  const seconds = zeroFill(2, date.getSeconds())
  const ms = milliseconds - ((hours * 3600000) + (minutes * 60000) + (seconds * 1000))

  return `${hours}:${minutes}:${seconds},${zeroFill(3, ms)}`
}
