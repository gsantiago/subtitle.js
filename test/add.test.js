/**
 * Dependencies.
 */

const test = require('ava')
const subtitle = require('..')

/**
 * Tests for `add` method.
 */

test('add captions and get them with duration', t => {
  const subs = subtitle()

  subs.add({
    start: '00:02:11,031',
    end: '00:02:14,979',
    text: 'No. Everybody here is already dead.'
  })

  const result = subs.getSubtitles({
    duration: true
  })

  const expected = [
    {
      index: 1,
      start: '00:02:11,031',
      end: '00:02:14,979',
      duration: 3948,
      text: 'No. Everybody here is already dead.'
    }
  ]

  t.deepEqual(result, expected)
})

test('add captions and get them without duration', t => {
  const subs = subtitle()

  subs.add({
    start: '00:02:11,031',
    end: '00:02:14,979',
    text: 'No. Everybody here is already dead.'
  })

  const result = subs.getSubtitles()

  const expected = [
    {
      index: 1,
      start: '00:02:11,031',
      end: '00:02:14,979',
      text: 'No. Everybody here is already dead.'
    }
  ]

  t.deepEqual(result, expected)
})

test('add three captions', t => {
  const subs = subtitle()

  subs
  .add({
    start: '00:02:11,031',
    end: '00:02:14,979',
    text: 'No. Everybody here is already dead.'
  })
  .add({
    start: '00:03:27,174',
    end: '00:03:28,209',
    text: 'These lawmakers...'
  })
  .add({
    start: '00:04:52,259',
    end: '00:04:54,261',
    text: 'Lara, you have to ready the launch.'
  })

  const result = subs.getSubtitles()

  const expected = [
    {
      index: 1,
      start: '00:02:11,031',
      end: '00:02:14,979',
      text: 'No. Everybody here is already dead.'
    },
    {
      index: 2,
      start: '00:03:27,174',
      end: '00:03:28,209',
      text: 'These lawmakers...'
    },
    {
      index: 3,
      start: '00:04:52,259',
      end: '00:04:54,261',
      text: 'Lara, you have to ready the launch.'
    }
  ]

  t.deepEqual(result, expected)
})

test('add caption with time in milliseconds', t => {
  const subs = subtitle()

  const time1 = {
    srt: '00:02:22,542',
    ms: 120000 + 22000 + 542
  }

  const time2 = {
    srt: '01:51:58,219',
    ms: 3600000 + 3060000 + 58000 + 219
  }

  subs.add({
    start: time1.ms,
    end: time2.ms,
    text: 'The world is about to come to an end.'
  })

  const result = subs.getSubtitles()

  const expected = [
    {
      index: 1,
      start: time1.srt,
      end: time2.srt,
      text: 'The world is about to come to an end.'
    }
  ]

  t.deepEqual(result, expected)
})
