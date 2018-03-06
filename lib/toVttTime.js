/**
 * Module dependencies.
 */

import zeroFill from 'zero-fill'

/**
 * Return the given milliseconds as WebVTT timestamp.
 * @param timestamp
 * @returns {string}
 */

export default function toVttTime (timestamp) {
  if (isNaN(timestamp)) {
    return timestamp
  }

  const date = new Date(0, 0, 0, 0, 0, 0, timestamp)

  const hours = zeroFill(2, date.getHours())
  const minutes = zeroFill(2, date.getMinutes())
  const seconds = zeroFill(2, date.getSeconds())
  const ms = timestamp - ((hours * 3600000) + (minutes * 60000) + (seconds * 1000))

  return `${hours}:${minutes}:${seconds}.${zeroFill(3, ms)}`
}
