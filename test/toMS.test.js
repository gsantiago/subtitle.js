import { toMS } from '../lib/toMS'

test('should convert SRT time to milliseconds', () => {
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

  expect(toMS(time1.srt)).toBe(time1.ms)
  expect(toMS(time2.srt)).toBe(time2.ms)
  expect(toMS(time3.srt)).toBe(time3.ms)
})

test('should convert VTT time to milliseconds including short formats', () => {
  const time1 = {
    srt: '02:22.542',
    ms: 120000 + 22000 + 542
  }

  const time2 = {
    srt: '01:51:58.219',
    ms: 3600000 + 3060000 + 58000 + 219
  }

  const time3 = {
    srt: '00:00.000',
    ms: 0
  }

  const time4 = {
    srt: '1201:51:58.219',
    ms: 1201 * 3600000 + 3060000 + 58000 + 219
  }

  expect(toMS(time1.srt)).toBe(time1.ms)
  expect(toMS(time2.srt)).toBe(time2.ms)
  expect(toMS(time3.srt)).toBe(time3.ms)
  expect(toMS(time4.srt)).toBe(time4.ms)
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
