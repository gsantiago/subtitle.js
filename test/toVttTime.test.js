import { toVttTime } from '../lib/toVttTime'

test('should convert time from milliseconds to WebVTT format', () => {
  const time1 = {
    srt: '00:02:22.542',
    ms: 120000 + 22000 + 542
  }

  const time2 = {
    srt: '01:51:58.219',
    ms: 3600000 + 3060000 + 58000 + 219
  }

  const time3 = {
    srt: '00:00:00.000',
    ms: 0
  }

  expect(toVttTime(time1.ms)).toEqual(time1.srt)
  expect(toVttTime(time2.ms)).toEqual(time2.srt)
  expect(toVttTime(time3.ms)).toEqual(time3.srt)
})

test('should return the given values that are not numbers', () => {
  expect(toVttTime('01:51:58,219')).toEqual('01:51:58,219')
  expect(toVttTime('string')).toEqual('string')
})
