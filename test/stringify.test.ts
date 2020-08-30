import { fixtures, getFixture } from '../test-utils'
import { stringify } from '../src/stringify'

test.each(fixtures)('stringify fixture: %s.json', async filename => {
  const json = JSON.parse(await getFixture(filename, 'json'))
  const str = await getFixture(filename, 'srt')
  const normalizedSrt = str
    .trim()
    .concat('\n')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')

  expect(stringify(json)).toEqual(normalizedSrt)
})

test('stringify captions with timestamp in SRT format', () => {
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
