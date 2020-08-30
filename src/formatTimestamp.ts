import { padLeft } from './padLeft'
import { FormatOptions } from './types'

export function formatTimestamp(
  timestamp: number,
  options: FormatOptions = { format: 'srt' }
) {
  const date = new Date(0, 0, 0, 0, 0, 0, timestamp)

  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const ms = timestamp - (hours * 3600000 + minutes * 60000 + seconds * 1000)

  return `${padLeft(hours)}:${padLeft(minutes)}:${padLeft(seconds)}${
    options.format === 'vtt' ? '.' : ','
  }${padLeft(ms, 3)}`
}
