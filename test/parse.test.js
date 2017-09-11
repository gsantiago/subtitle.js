/**
 * Dependencies.
 */

const test = require('ava')
const { parse, toMS } = require('..')
const { readFile } = require('./helpers')

/**
 * Tests for `parse` method.
 */

test('should parse a small SRT file', t => {
  t.plan(2)

  const promise = readFile('fixtures/sample.srt')

  const expected = [
    {
      start: '00:00:20,000',
      end: '00:00:24,400',
      duration: 4400,
      text: 'This is the first line\nand this is the second one'
    },
    {
      start: '00:00:24,600',
      end: '00:00:27,800',
      duration: 3200,
      text: 'Hello, World!'
    }
  ]

  const expectedWithTimeInMS = expected.map(caption => {
    return Object.assign({}, caption, {
      start: toMS(caption.start),
      end: toMS(caption.end)
    })
  })

  promise
  .then(content => {
    const result = parse(content)
    const resultWithTimeMS = parse(content, { timeFormat: 'ms' })

    t.deepEqual(result, expected)
    t.deepEqual(resultWithTimeMS, expectedWithTimeInMS)
  })

  return promise
})

test('should parse a big SRT file without any errors', t => {
  t.plan(1)

  const promise = readFile('fixtures/big.srt')

  promise
  .then(content => {
    const subs = parse(content)
    t.is(subs.length, 1298)
  })
  .catch(t.fail)

  return promise
})

test('it should an empty array', t => {
  t.deepEqual(parse(), [])
})
