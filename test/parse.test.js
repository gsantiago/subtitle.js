const test = require('ava')
const { parse, toMS } = require('..')
const { readFile } = require('./helpers')

test('should parse a small SRT file', t => {
  t.plan(1)

  const promise = readFile('fixtures/sample.srt')

  const expected = [
    {
      start: '00:00:20,000',
      end: '00:00:24,400',
      text: 'This is the first line\nand this is the second one'
    },
    {
      start: '00:00:24,600',
      end: '00:00:27,800',
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
    const resultWithTimeMS = parse(content)
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
