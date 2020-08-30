import { fixtures, getFixture } from '../test-utils'
import { stringifyVtt } from '../src/stringifyVtt'

test.each(fixtures)('stringify fixture: %s.json', async filename => {
  const json = JSON.parse(await getFixture(filename, 'json'))
  const vtt = await getFixture(filename, 'vtt')
  const normalizedVtt = vtt
    .trim()
    .concat('\n')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')

  expect(stringifyVtt(json)).toEqual(normalizedVtt)
})

test('stringify captions with timestamp in WebVTT format', () => {
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

  expect(stringifyVtt(captions)).toBe(expected)
})
