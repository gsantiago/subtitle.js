import { resync, Tree } from '../src'

const cues: Tree = [
  {
    type: 'cue',
    data: {
      start: 10100,
      end: 10500,
      text: 'Text'
    }
  },
  {
    type: 'cue',
    data: {
      start: 20650,
      end: 23300,
      text: 'Text'
    }
  },
  {
    type: 'cue',
    data: {
      start: 300000,
      end: 310150,
      text: 'Text'
    }
  }
]

test('delay 100ms', () => {
  const expected = {
    start: 10000,
    end: 10400,
    text: 'Text'
  }

  const result = resync(cues, -100)[0].data

  expect(result).toEqual(expected)
})

test('advance 1s', () => {
  const expected = {
    start: 21650,
    end: 24300,
    text: 'Text'
  }

  const result = resync(cues, 1000)[1].data

  expect(result).toEqual(expected)
})

test('delay 2 hours', () => {
  const expected = {
    start: 180000,
    end: 190150,
    text: 'Text'
  }

  const result = resync(cues, 2 * 60 * 1000 * -1)[2].data

  expect(result).toEqual(expected)
})
