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

test('it should an empty array', t => {
  t.deepEqual(parse(), [])
})
