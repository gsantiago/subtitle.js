import { formatTimestamp } from '../src'

test.each([
  [120000 + 22000 + 542, '00:02:22,542'],
  [3600000 + 3060000 + 58000 + 219, '01:51:58,219'],
  [0, '00:00:00,000']
])('format timestamp to SRT format: %d -> %s', (ms, srt) => {
  expect(formatTimestamp(ms)).toBe(srt)
})

test.each([
  [120000 + 22000 + 542, '00:02:22.542'],
  [3600000 + 3060000 + 58000 + 219, '01:51:58.219'],
  [0, '00:00:00.000']
])('format timestamp to VTT format: %d -> %s', (ms, vtt) => {
  expect(formatTimestamp(ms, { format: 'WebVTT' })).toBe(vtt)
})
