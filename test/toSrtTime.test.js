import test from 'ava'
import { toSrtTime } from '..'

test('should convert time from milliseconds to SRT format', t => {
  const time1 = {
    srt: '00:02:22,542',
    ms: 120000 + 22000 + 542
  }

  const time2 = {
    srt: '01:51:58,219',
    ms: 3600000 + 3060000 + 58000 + 219
  }

  const time3 = {
    srt: '00:00:00,000',
    ms: 0
  }

  t.is(toSrtTime(time1.ms), time1.srt)
  t.is(toSrtTime(time2.ms), time2.srt)
  t.is(toSrtTime(time3.ms), time3.srt)
})

test('should return the given values that are not numbers', t => {
  t.is(toSrtTime('01:51:58,219'), '01:51:58,219')
  t.is(toSrtTime('string'), 'string')
})
