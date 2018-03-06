import test from 'ava'
import fs from 'fs'
import path from 'path'
import promisify from 'pify'
import glob from 'glob-contents'
import { stringify } from '..'

const readFile = promisify(fs.readFile)

test('stringify all examples', async t => {
  const srt = await glob(path.join(__dirname, '/examples/*.srt'))

  await Promise.all(
    Object.keys(srt).map(async filepath => {
      const basename = path.basename(filepath, '.srt')
      const json = await readFile(path.join(__dirname, `/examples/${basename}.json`), 'utf8')
      const subtitles = JSON.parse(json)
      const normalizedSrt = srt[filepath]
        .trim()
        .concat('\n')
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')

      t.deepEqual(stringify(subtitles), normalizedSrt)
    })
  )
})

test('stringify captions with timestamp in SRT format', t => {
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
  `.trim().concat('\n')

  t.is(stringify(captions), expected)
})
