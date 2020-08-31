import { parseTimestamps } from '../src'

test.each([
  [
    '00:00:20,000 --> 00:00:24,400',
    {
      start: 20000,
      end: 24400
    }
  ],
  [
    '00:00:00,000 --> 00:00:01,000',
    {
      start: 0,
      end: 1000
    }
  ],
  [
    '00:01:00,500 --> 00:01:10,800',
    {
      start: 60500,
      end: 70800
    }
  ],
  [
    '12:34:56,789 --> 98:76:54,321',
    {
      start: 45296789,
      end: 357414321
    }
  ],
  [
    '0:59:50,050 --> 1:00:20,070',
    {
      start: 3590050,
      end: 3620070
    }
  ],
  [
    '0:00:20,000 --> 0:00:24,400',
    {
      start: 20000,
      end: 24400
    }
  ]
])('parseTimestamps with SRT input: "%s" => %o', (input, expected) => {
  expect(parseTimestamps(input)).toEqual(expected)
})

test.each([
  [
    '00:20.000 --> 00:24.400',
    {
      start: 20000,
      end: 24400
    }
  ],
  [
    '00:00.000 --> 00:01,000',
    {
      start: 0,
      end: 1000
    }
  ],
  [
    '59:50.050 --> 01:00:20.070',
    {
      start: 3590050,
      end: 3620070
    }
  ],
  [
    '0:59:50.050 --> 1:00:20.070',
    {
      start: 3590050,
      end: 3620070
    }
  ]
])(
  'parseTimestamps with VTT input and short format: "%s" => %o',
  (input, expected) => {
    expect(parseTimestamps(input)).toEqual(expected)
  }
)

test.each([
  [
    '12:34:56,789 --> 98:76:54,321 align:middle line:90%',
    {
      start: 45296789,
      end: 357414321,
      settings: 'align:middle line:90%'
    }
  ],
  [
    '00:20.000 --> 00:24.400 position:45%,line-right align:center size:35%',
    {
      start: 20000,
      end: 24400,
      settings: 'position:45%,line-right align:center size:35%'
    }
  ],
  [
    '0:00:20.000 --> 0:00:24.400 position:45%,line-right align:center size:35%',
    {
      start: 20000,
      end: 24400,
      settings: 'position:45%,line-right align:center size:35%'
    }
  ]
])('parseTimestamps with VTT settings: "%s" => %o"', (input, expected) => {
  expect(parseTimestamps(input)).toEqual(expected)
})

test('invalid timestamp format should throw an error', () => {
  expect(() => parseTimestamps('INVALID FORMAT')).toThrow()
})
