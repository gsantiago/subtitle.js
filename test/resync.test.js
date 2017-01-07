/**
 * Dependencies.
 */

const test = require('ava')
const subtitle = require('..')

/**
 * Helper function that creates some subs.
 */

function createSubs () {
  const subs = subtitle()

  subs
  .add({
    start: '00:00:10,100',
    end: '00:00:10,500',
    text: 'Text'
  })
  .add({
    start: '00:00:20,650',
    end: '00:00:23,300',
    text: 'Text'
  })
  .add({
    start: '00:05:00,000',
    end: '00:05:10,150',
    text: 'Text'
  })

  return subs
}

/**
 * Tests for `resync` method.
 */

test('delay 100ms', t => {
  const subs = createSubs()

  subs.resync(-100)

  const result = subs.getSubtitles()[0]
  const expected = {
    index: 1,
    start: '00:00:10,000',
    end: '00:00:10,400',
    text: 'Text'
  }

  t.deepEqual(result, expected)
})

test('advance 1s', t => {
  const subs = createSubs()

  subs.resync(1000)

  const result = subs.getSubtitles()[1]
  const expected = {
    index: 2,
    start: '00:00:21,650',
    end: '00:00:24,300',
    text: 'Text'
  }

  t.deepEqual(result, expected)
})

test('delay 2 hours', t => {
  const subs = createSubs()

  subs.resync(2 * 60 * 1000 * -1)

  const result = subs.getSubtitles()[2]
  const expected = {
    index: 3,
    start: '00:03:00,000',
    end: '00:03:10,150',
    text: 'Text'
  }

  t.deepEqual(result, expected)
})

test('resync should always return the instance itself', t => {
  const subs1 = createSubs()
  const subs2 = createSubs()
  const subs3 = createSubs()

  const return1 = subs1.resync(0)
  const return2 = subs2.resync(100)
  const return3 = subs3.resync(-100)

  t.is(return1, subs1)
  t.is(return2, subs2)
  t.is(return3, subs3)
})

test('invalid argument should throw an exception', t => {
  const subs = createSubs()

  t.throws(() => {
    subs.resync()
  })

  t.throws(() => {
    subs.resync('INVALID TIME')
  })

  t.throws(() => {
    subs.resync({})
  })

  t.throws(() => {
    subs.resync(null)
  })

  t.throws(() => {
    subs.resync([])
  })
})
