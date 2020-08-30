import { toMS } from './toMS'
import { Timestamp } from './types'

export const RE_TIMESTAMP = /^((?:\d{1,}:)?\d{2}:\d{2}[,.]\d{3}) --> ((?:\d{1,}:)?\d{2}:\d{2}[,.]\d{3})(?: (.*))?$/

export function parseTimestamps(value: string): Timestamp {
  const match = RE_TIMESTAMP.exec(value)

  if (!match) {
    throw new Error('Invalid timestamp format')
  }

  const timestamp: Timestamp = {
    start: toMS(match[1]),
    end: toMS(match[2])
  }

  if (match[3]) {
    timestamp.settings = match[3]
  }

  return timestamp
}
