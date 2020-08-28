import fs from 'fs'
import path from 'path'
import promisify from 'pify'
import glob from 'glob-contents'
import { parse } from '../lib'

const readFile = promisify(fs.readFile)

test('parse all examples', async () => {
  const srt = await glob(path.join(__dirname, '/examples/*.srt'))

  await Promise.all(
    Object.keys(srt).map(async filepath => {
      const basename = path.basename(filepath, '.srt')
      const json = await readFile(path.join(__dirname, `/examples/${basename}.json`), 'utf8')
      const subtitles = JSON.parse(json)
      expect(parse(srt[filepath])).toEqual(subtitles)
    })
  )
})

test('parse SRT captions', () => {
  const srt = `
1
02:12:34,647 --> 02:12:35,489
Hi.

2
02:12:36,415 --> 02:12:37,758
Lois Lane.

3
02:12:38,584 --> 02:12:40,120
Welcome to the Planet.
  `.trim().concat('\n')

  const value = parse(srt)

  const expected = [
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

  expect(value).toEqual(expected)
})

test('parse VTT captions', () => {
  const vtt = `
WEBVTT - Test VTT cues

1
12:34.647 --> 12:35.489 align:middle line:90%
Hi.

2
12:36.415 --> 02:12:37.758 align:start line:90%
Lois Lane.

02:12:38.584 --> 02:12:40.120
Welcome to the Planet.
  `.trim().concat('\n')

  const value = parse(vtt)

  const expected = [
    {
      start: 754647,
      end: 755489,
      settings: 'align:middle line:90%',
      text: 'Hi.'
    },
    {
      start: 756415,
      end: 7957758,
      settings: 'align:start line:90%',
      text: 'Lois Lane.'
    },
    {
      start: 7958584,
      end: 7960120,
      text: 'Welcome to the Planet.'
    }
  ]

  expect(value).toEqual(expected)
})

test('parse VTT caption with headers', () => {
  const vtt = `
WEBVTT - Test VTT cues
Kind: captions
Language: en-US

1
12:34.647 --> 12:35.489 align:middle line:90%
Hi.

2
12:36.415 --> 02:12:37.758 align:start line:90%
Lois Lane.

02:12:38.584 --> 02:12:40.120
Welcome to the Planet.
  `.trim().concat('\n')

  const value = parse(vtt)

  const expected = [
    {
      start: 754647,
      end: 755489,
      settings: 'align:middle line:90%',
      text: 'Hi.'
    },
    {
      start: 756415,
      end: 7957758,
      settings: 'align:start line:90%',
      text: 'Lois Lane.'
    },
    {
      start: 7958584,
      end: 7960120,
      text: 'Welcome to the Planet.'
    }
  ]

  expect(value).toEqual(expected)
})

test('it should return an empty array', () => {
  expect(parse()).toEqual([])
})

test('parse 00:00:00,000 caption', () => {
  const srt = `
1
00:00:00,000 --> 00:00:00,100
Hi.
`
  const value = parse(srt)
  const expected = [
    {
      start: 0,
      end: 100,
      text: 'Hi.'
    }
  ]

  expect(value).toEqual(expected)
})

test('parse text that contains only empty space', () => {
  const srt = `
1
00:00:00,000 --> 00:00:00,100
Something something something... dark side
 

2
00:00:00,100 --> 00:00:00,200
Hi.`
  const value = parse(srt)
  const expected = [
    {
      start: 0,
      end: 100,
      text: 'Something something something... dark side\n '
    }, {
      start: 100,
      end: 200,
      text: 'Hi.'
    }
  ]

  expect(value).toEqual(expected)
})

test('parse separated texts', () => {
  const srt = `
1
00:00:00,000 --> 00:00:00,100
Dear Michael. Of course it's you.

Who else could they send?

2
00:00:00,100 --> 00:00:00,200
Who else could be trusted?`
  const value = parse(srt)
  const expected = [
    {
      start: 0,
      end: 100,
      text: 'Dear Michael. Of course it\'s you.\nWho else could they send?\n'
    }, {
      start: 100,
      end: 200,
      text: 'Who else could be trusted?'
    }
  ]

  expect(value).toEqual(expected)
})
