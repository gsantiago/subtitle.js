export function parseTimestamp(timestamp: string): number {
  const match = timestamp.match(
    /^(?:(\d{1,}):)?(\d{1,2}):(\d{1,2})[,.](\d{1,3})$/
  )

  if (!match) {
    throw new Error('Invalid SRT or VTT time format: "' + timestamp + '"')
  }

  const hours = match[1] ? parseInt(match[1], 10) * 3600000 : 0
  const minutes = parseInt(match[2], 10) * 60000
  const seconds = parseInt(match[3], 10) * 1000
  const milliseconds = parseInt(match[4], 10)

  return hours + minutes + seconds + milliseconds
}
