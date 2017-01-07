/**
 * Dependencies.
 */

const test = require('ava')
const subtitle = require('..')
const { readFile } = require('./helpers')

/**
 * Tests for `parse` method.
 */

test('should parse a small SRT file', t => {
  t.plan(2)

  const promise = readFile('fixtures/sample.srt')

  const expected = [
    {
      index: 1,
      start: '00:00:20,000',
      end: '00:00:24,400',
      duration: 4400,
      text: 'This is the first line\nand this is the second one'
    },
    {
      index: 2,
      start: '00:00:24,600',
      end: '00:00:27,800',
      duration: 3200,
      text: 'Hello, World!'
    }
  ]

  const expectedWithTimeInmilliseconds = expected.map(caption => {
    return Object.assign(caption, {
      start: subtitle.toMS(caption.start),
      end: subtitle.toMS(caption.end)
    })
  })

  promise
  .then(content => {
    const subs = subtitle(content)

    const result = subs.getSubtitles({duration: true})

    const resultWithTimeInmilliseconds = subs.getSubtitles({
      timeFormat: 'ms',
      duration: true
    })

    t.deepEqual(result, expected)
    t.deepEqual(resultWithTimeInmilliseconds, expectedWithTimeInmilliseconds)
  })

  return promise
})

test('should parse a big SRT file without any errors', t => {
  t.plan(1)

  const promise = readFile('fixtures/big.srt')

  promise
  .then(content => {
    const subs = subtitle()
    subs.parse(content)
    t.is(subs.getSubtitles().length, 1298)
  })
  .catch(t.fail)

  return promise
})

test('it should throw an exception if no argument is passed', t => {
  const subs = subtitle()

  t.throws(() => {
    subs.parse()
  })
})
