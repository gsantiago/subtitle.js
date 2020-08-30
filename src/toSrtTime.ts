import { padLeft } from './padLeft'

export function toSrtTime(timestamp: number): string {
  const date = new Date(0, 0, 0, 0, 0, 0, timestamp)

  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const ms = timestamp - (hours * 3600000 + minutes * 60000 + seconds * 1000)

  return `${padLeft(hours)}:${padLeft(minutes)}:${padLeft(seconds)},${padLeft(
    ms,
    3
  )}`
}
