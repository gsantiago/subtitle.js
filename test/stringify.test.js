const test = require('ava')
const fs = require('fs')
const path = require('path')
const promisify = require('pify')
const glob = require('glob-contents')
const { stringify } = require('..')

const readFile = promisify(fs.readFile)

test('stringify all examples', async t => {
  const subtitles = await glob(path.join(__dirname, '/examples/*.json'))

  Object.keys(subtitles).forEach(async filepath => {
    const basename = path.basename(filepath, '.json')
    const value = await readFile(path.join(__dirname,  `/examples/${basename}.srt`), 'utf8')
    const expected = JSON.parse(subtitles[filepath])
    t.deepEqual(expected, stringify(value))
  })
})
