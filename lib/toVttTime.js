import { padLeft } from './padLeft'

/**
 * Return the given milliseconds as WebVTT timestamp.
 * @param timestamp
 * @returns {string}
 */

export function toVttTime(timestamp) {
  if (isNaN(timestamp)) {
    return timestamp
  }

  const date = new Date(0, 0, 0, 0, 0, 0, timestamp)

  const hours = padLeft(date.getHours())
  const minutes = padLeft(date.getMinutes())
  const seconds = padLeft(date.getSeconds())
  const ms = timestamp - (hours * 3600000 + minutes * 60000 + seconds * 1000)

  return `${hours}:${minutes}:${seconds}.${padLeft(ms, 3)}`
}
