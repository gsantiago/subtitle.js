import { fixtures, getFixture } from '../test-utils'
import { stringify } from '../src'

const normalize = (str: string) => str.replace(/\r\n/g, '\n')

test.each(fixtures)('stringify fixture SRT: %s.json', async filename => {
  const json = JSON.parse(await getFixture(filename, 'json'))
  const srt = await getFixture(filename, 'srt')

  expect(stringify(json)).toEqual(normalize(srt))
})

test.each([fixtures[2]])(
  'stringify fixture to VTT: %s.json',
  async filename => {
    const json = JSON.parse(await getFixture(filename, 'json'))
    const vtt = await getFixture(filename, 'vtt')

    expect(stringify(json, { format: 'vtt' })).toEqual(normalize(vtt))
  }
)

test('stringify the given captions to SRT format', () => {
  const captions = [
    {
      start: 7954647,
      end: 7955489,
      text: 'Hi.'
    },
    {
      start: 7956415,
      end: 7957758,
      text: 'Lois Lane.'
    },
    {
      start: 7958584,
      end: 7960120,
      text: 'Welcome to the Planet.'
    }
  ]

  const expected = `
1
02:12:34,647 --> 02:12:35,489
Hi.

2
02:12:36,415 --> 02:12:37,758
Lois Lane.

3
02:12:38,584 --> 02:12:40,120
Welcome to the Planet.
  `
    .trim()
    .concat('\n')

  expect(stringify(captions)).toBe(expected)
})

test('stringify the given captions to WebVTT format', () => {
  const captions = [
    {
      start: 940647,
      end: 954489,
      text: 'Hi.'
    },
    {
      start: 7956415,
      end: 7957758,
      text: 'Lois Lane.',
      settings: 'align:middle line:90%'
    },
    {
      start: 7958584,
      end: 7960120,
      text: 'Welcome to the Planet.'
    }
  ]

  const expected = `WEBVTT

1
00:15:40.647 --> 00:15:54.489
Hi.

2
02:12:36.415 --> 02:12:37.758 align:middle line:90%
Lois Lane.

3
02:12:38.584 --> 02:12:40.120
Welcome to the Planet.
  `
    .trim()
    .concat('\n')

  expect(stringify(captions, { format: 'vtt' })).toBe(expected)
})
