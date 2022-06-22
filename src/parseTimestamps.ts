import { parseTimestamp, Timestamp } from '.'

export const RE_TIMESTAMP = /^((?:\d{1,}:)?\d{1,2}:\d{1,2}[,.]\d{1,3}) --> ((?:\d{1,}:)?\d{1,2}:\d{1,2}[,.]\d{1,3})(?: (.*))?$/

export function parseTimestamps(value: string): Timestamp {
  const match = RE_TIMESTAMP.exec(value)

  if (!match) {
    throw new Error('Invalid timestamp format')
  }

  const timestamp: Timestamp = {
    start: parseTimestamp(match[1]),
    end: parseTimestamp(match[2])
  }

  if (match[3]) {
    timestamp.settings = match[3]
  }

  return timestamp
}
