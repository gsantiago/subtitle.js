import { resync } from '../lib/resync'

const captions = [
  {
    start: '00:00:10,100',
    end: '00:00:10,500',
    text: 'Text'
  },
  {
    start: '00:00:20,650',
    end: '00:00:23,300',
    text: 'Text'
  },
  {
    start: '00:05:00,000',
    end: '00:05:10,150',
    text: 'Text'
  }
]

const captionsMS = [
  {
    start: 10100,
    end: 10500,
    text: 'Text'
  },
  {
    start: 20650,
    end: 23300,
    text: 'Text'
  },
  {
    start: 300000,
    end: 310150,
    text: 'Text'
  }
]

test('delay 100ms', () => {
  const expected = {
    start: 10000,
    end: 10400,
    text: 'Text'
  }

  const result = resync(captions, -100)[0]
  const result2 = resync(captionsMS, -100)[0]

  expect(result).toEqual(expected)
  expect(result2).toEqual(expected)
})

test('advance 1s', () => {
  const expected = {
    start: 21650,
    end: 24300,
    text: 'Text'
  }

  const result = resync(captions, 1000)[1]
  const result2 = resync(captionsMS, 1000)[1]

  expect(result).toEqual(expected)
  expect(result2).toEqual(expected)
})

test('delay 2 hours', () => {
  const expected = {
    start: 180000,
    end: 190150,
    text: 'Text'
  }

  const result = resync(captions, 2 * 60 * 1000 * -1)[2]
  const result2 = resync(captionsMS, 2 * 60 * 1000 * -1)[2]

  expect(result).toEqual(expected)
  expect(result2).toEqual(expected)
})
