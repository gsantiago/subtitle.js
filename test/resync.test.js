/**
 * Dependencies.
 */

const test = require('ava')
const { resync } = require('..')

/**
 * Helper function that creates some subs.
 */

const subs = [
  {
    start: '00:00:10,100',
    end: '00:00:10,500',
    text: 'Text'
  },
  {
    start: '00:00:20,650',
    end: '00:00:23,300',
    text: 'Text'
  },
  {
    start: '00:05:00,000',
    end: '00:05:10,150',
    text: 'Text'
  }
]

/**
 * Tests for `resync` method.
 */

test('delay 100ms', t => {
  const result = resync(subs, -100)[0]
  const expected = {
    start: '00:00:10,000',
    end: '00:00:10,400',
    text: 'Text'
  }

  t.deepEqual(result, expected)
})

test('advance 1s', t => {
  const result = resync(subs, 1000)[1]
  const expected = {
    start: '00:00:21,650',
    end: '00:00:24,300',
    text: 'Text'
  }

  t.deepEqual(result, expected)
})

test('delay 2 hours', t => {
  const result = resync(subs, 2 * 60 * 1000 * -1)[2]
  const expected = {
    start: '00:03:00,000',
    end: '00:03:10,150',
    text: 'Text'
  }

  t.deepEqual(result, expected)
})
