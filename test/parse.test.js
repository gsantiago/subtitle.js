const test = require('ava')
const fs = require('fs')
const path = require('path')
const promisify = require('pify')
const glob = require('glob-contents')
const { parse } = require('..')

const readFile = promisify(fs.readFile)

test('parse all examples', async t => {
  const subtitles = await glob(path.join(__dirname, '/examples/*.srt'))

  Object.keys(subtitles).forEach(async filepath => {
    const basename = path.basename(filepath, '.srt')
    const value = await readFile(path.join(__dirname, `/examples/${basename}.json`), 'utf8')
    t.deepEqual(subtitles[filepath], parse(value))
  })
})

test('parse captions', t => {
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

test('it should an empty array', t => {
  t.deepEqual(parse(), [])
})
