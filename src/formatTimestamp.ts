import { padLeft } from './utils'
import { FormatOptions } from '.'

export function formatTimestamp(
  timestamp: number,
  options: FormatOptions = { format: 'SRT' }
) {
  const date = new Date(0, 0, 0, 0, 0, 0, timestamp)

  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const ms = Math.floor(
    timestamp - (hours * 3600000 + minutes * 60000 + seconds * 1000)
  )

  return `${padLeft(hours)}:${padLeft(minutes)}:${padLeft(seconds)}${
    options.format === 'WebVTT' ? '.' : ','
  }${padLeft(ms, 3)}`
}
