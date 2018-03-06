import test from 'ava'
import fs from 'fs'
import path from 'path'
import promisify from 'pify'
import glob from 'glob-contents'
import { stringifyVtt } from '..'

const readFile = promisify(fs.readFile)

test('stringify all examples', async t => {
  const vtt = await glob(path.join(__dirname, '/examples/*.vtt'))

  await Promise.all(
    Object.keys(vtt).map(async filepath => {
      const basename = path.basename(filepath, '.vtt')
      const json = await readFile(path.join(__dirname, `/examples/${basename}.json`), 'utf8')
      const subtitles = JSON.parse(json)
      const normalizedVtt = vtt[filepath]
        .trim()
        .concat('\n')
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')

      t.deepEqual(stringifyVtt(subtitles), normalizedVtt)
    })
  )
})

test('stringify captions with timestamp in WebVTT format', t => {
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
  `.trim().concat('\n')

  t.is(stringifyVtt(captions), expected)
})
