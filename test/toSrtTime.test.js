import { toSrtTime } from '../lib/toSrtTime'

test.each([
  [120000 + 22000 + 542, '00:02:22,542'],
  [3600000 + 3060000 + 58000 + 219, '01:51:58,219'],
  [0, '00:00:00,000']
])('toSrtTime(%d) === %s', (ms, srt) => {
  expect(toSrtTime(ms)).toBe(srt)
})

test('should return the given values that are not numbers', () => {
  expect(toSrtTime('01:51:58,219')).toEqual('01:51:58,219')
  expect(toSrtTime('string')).toEqual('string')
})
