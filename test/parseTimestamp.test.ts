import { parseTimestamp } from '../src'

test.each([
  ['00:02:22,542', 120000 + 22000 + 542],
  ['01:51:58,219', 3600000 + 3060000 + 58000 + 219],
  ['00:00:00,000', 0]
])('(SRT) parseTimestamp(%s) === %d', (srt, ms) => {
  expect(parseTimestamp(srt)).toBe(ms)
})

test.each([
  ['02:22.542', 120000 + 22000 + 542],
  ['01:51:58.219', 3600000 + 3060000 + 58000 + 219],
  ['1201:51:58.219', 1201 * 3600000 + 3060000 + 58000 + 219],
  ['00:00.000', 0]
])('(VTT) parseTimestamp(%s) === %d', (vtt, ms) => {
  expect(parseTimestamp(vtt)).toBe(ms)
})

test('invalid format should throw an error', () => {
  expect(() => {
    parseTimestamp('12,34:56,78')
  }).toThrow()
})

test('timestamp digit', () => {
  expect(parseTimestamp('00:00:31,5')).toBe(parseTimestamp('00:00:31,005'))
  expect(parseTimestamp('00:00:31,50')).toBe(parseTimestamp('00:00:31,050'))
  expect(parseTimestamp('00:00:31,06')).toBe(parseTimestamp('00:00:31,006'))
})
