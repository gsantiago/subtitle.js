import { toMS } from './toMS'

/**
 * Timestamp regex
 * @type {RegExp}
 */

const RE = /^((?:\d{1,}:)?\d{2}:\d{2}[,.]\d{3}) --> ((?:\d{1,}:)?\d{2}:\d{2}[,.]\d{3})(?: (.*))?$/

/**
 * parseTimestamps
 * @param value
 * @returns {{start: Number, end: Number}}
 */

export function parseTimestamps(value) {
  const match = RE.exec(value)

  if (match) {
    return {
      start: toMS(match[1]),
      end: toMS(match[2]),
      settings: match[3]
    }
  }
}
