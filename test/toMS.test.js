import { toMS } from '../lib/toMS'

test.each([
  ['00:02:22,542', 120000 + 22000 + 542],
  ['01:51:58,219', 3600000 + 3060000 + 58000 + 219],
  ['00:00:00,000', 0]
])('(SRT) toMS(%s) === %d', (srt, ms) => {
  expect(toMS(srt)).toBe(ms)
})

test.each([
  ['02:22.542', 120000 + 22000 + 542],
  ['01:51:58.219', 3600000 + 3060000 + 58000 + 219],
  ['1201:51:58.219', 1201 * 3600000 + 3060000 + 58000 + 219],
  ['00:00.000', 0]
])('(VTT) toMS(%s) === %d', (vtt, ms) => {
  expect(toMS(vtt)).toBe(ms)
})

test('invalid format should throw an error', () => {
  expect(() => {
    toMS('12,34:56,78')
  }).toThrow()
})

test('should return the given numbers', () => {
  expect(toMS(1000)).toBe(1000)
  expect(toMS(600)).toBe(600)
  expect(toMS(-150)).toBe(-150)
})
