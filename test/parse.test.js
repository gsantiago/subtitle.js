import test from 'ava'
import fs from 'fs'
import path from 'path'
import promisify from 'pify'
import glob from 'glob-contents'
import { parse } from '..'

const readFile = promisify(fs.readFile)

test('parse all examples', async t => {
  const srt = await glob(path.join(__dirname, '/examples/*.srt'))

  await Promise.all(
    Object.keys(srt).map(async filepath => {
      const basename = path.basename(filepath, '.srt')
      const json = await readFile(path.join(__dirname, `/examples/${basename}.json`), 'utf8')
      const subtitles = JSON.parse(json)
      t.deepEqual(parse(srt[filepath]), subtitles)
    })
  )
})

test('parse SRT captions', t => {
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

  t.deepEqual(value, expected)
})

test('parse VTT captions', t => {
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

  t.deepEqual(value, expected)
})

test('parse VTT caption with headers', t => {
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

  t.deepEqual(value, expected)
})

test('it should return an empty array', t => {
  t.deepEqual(parse(), [])
})

test('parse 00:00:00,000 caption', t => {
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

  t.deepEqual(value, expected)
})

test('parse text that contains only empty space', t => {
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

  t.deepEqual(value, expected)
})

test('parse separated texts', t => {
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

  t.deepEqual(value, expected)
})
