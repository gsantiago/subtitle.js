/**
 * Dependencies.
 */

const test = require('ava')
const subtitle = require('..')
const { readFile } = require('./helpers')

/**
 * Tests for `stringify` method.
 */

test('should return the stringified version of the subtitles', t => {
  const promise = readFile('fixtures/sample.srt')

  promise
  .then(content => {
    const subs = subtitle()

    subs
    .add({
      start: '00:00:20,000',
      end: '00:00:24,400',
      text: 'This is the first line\nand this is the second one'
    })
    .add({
      start: '00:00:24,600',
      end: '00:00:27,800',
      text: 'Hello, World!'
    })

    const result = subs.stringify()
    const expected = content

    t.is(result, expected)
  })

  return promise
})
