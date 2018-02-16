import test from 'ava'
import { parseTimestamps } from '..'

const checkWith = (t) => (val, expected) => {
  t.deepEqual(parseTimestamps(val), expected)
}

test('parseTimestamps with SRT input', t => {
  const check = checkWith(t)

  // SRT timestamps
  check('00:00:20,000 --> 00:00:24,400', {
    start: 20000,
    end: 24400
  })

  check('00:00:00,000 --> 00:00:01,000', {
    start: 0,
    end: 1000
  })

  check('00:01:00,500 --> 00:01:10,800', {
    start: 60500,
    end: 70800
  })

  check('12:34:56,789 --> 98:76:54,321', {
    start: 45296789,
    end: 357414321
  })
})

test('parseTimestamps with VTT input and short formats', t => {
  const check = checkWith(t)

  check('00:20.000 --> 00:24.400', {
    start: 20000,
    end: 24400
  })

  check('00:00.000 --> 00:01,000', {
    start: 0,
    end: 1000
  })

  check('59:50.050 --> 01:00:20.070', {
    start: 3590050,
    end: 3620070
  })
})

test('parseTimestamps with VTT settings', t => {
  const check = checkWith(t)

  check('12:34:56,789 --> 98:76:54,321 align:middle line:90%', {
    start: 45296789,
    end: 357414321,
    settings: 'align:middle line:90%'
  })

  check('00:20.000 --> 00:24.400 position:45%,line-right align:center size:35%', {
    start: 20000,
    end: 24400,
    settings: 'position:45%,line-right align:center size:35%'
  })
})
