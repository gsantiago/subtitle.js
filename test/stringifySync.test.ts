import { fixtures, getFixture } from '../test-utils'
import { stringifySync, NodeList } from '../src'
import { stripBom } from '../src/Parser'

const normalize = (str: string) => stripBom(str.replace(/\r\n/g, '\n'))

test.each(fixtures)('stringify fixture SRT: %s.json', async filename => {
  const json = JSON.parse(await getFixture(filename, 'srt.json'))
  const srt = await getFixture(filename, 'srt')

  expect(stringifySync(json, { format: 'SRT' })).toEqual(normalize(srt))
})

test.each(fixtures)('stringify fixture to VTT: %s.json', async filename => {
  const json = JSON.parse(await getFixture(filename, 'vtt.json'))
  const vtt = await getFixture(filename, 'vtt')

  expect(stringifySync(json, { format: 'WebVTT' })).toEqual(normalize(vtt))
})

test('stringify to SRT format', () => {
  const tree: NodeList = [
    {
      type: 'cue',
      data: {
        start: 7954647,
        end: 7955489,
        text: 'Hi.'
      }
    },
    {
      type: 'cue',
      data: {
        start: 7956415,
        end: 7957758,
        text: 'Lois Lane.'
      }
    },
    {
      type: 'cue',
      data: {
        start: 7958584,
        end: 7960120,
        text: 'Welcome to the Planet.'
      }
    }
  ]

  const expected = `
1
02:12:34,647 --> 02:12:35,489
Hi.

2
02:12:36,415 --> 02:12:37,758
Lois Lane.

3
02:12:38,584 --> 02:12:40,120
Welcome to the Planet.
  `
    .trim()
    .concat('\n')

  expect(stringifySync(tree, { format: 'SRT' })).toBe(expected)
})

test('stringify to WebVTT', () => {
  const tree: NodeList = [
    {
      type: 'cue',
      data: {
        start: 940647,
        end: 954489,
        text: 'Hi.'
      }
    },
    {
      type: 'cue',
      data: {
        start: 7956415,
        end: 7957758,
        text: 'Lois Lane.',
        settings: 'align:middle line:90%'
      }
    },
    {
      type: 'cue',
      data: {
        start: 7958584,
        end: 7960120,
        text: 'Welcome to the Planet.'
      }
    }
  ]

  const expected = `WEBVTT

1
00:15:40.647 --> 00:15:54.489
Hi.

2
02:12:36.415 --> 02:12:37.758 align:middle line:90%
Lois Lane.

3
02:12:38.584 --> 02:12:40.120
Welcome to the Planet.
  `
    .trim()
    .concat('\n')

  expect(stringifySync(tree, { format: 'WebVTT' })).toBe(expected)
})

test('stringify to WebVTT with custom header', () => {
  const tree: NodeList = [
    {
      type: 'header',
      data:
        'WEBVTT - This is a custom header\nBy Michael Scott\nThe Best Boss In The World'
    },
    {
      type: 'cue',
      data: {
        start: 0,
        end: 3000,
        text: 'Hi there'
      }
    },
    {
      type: 'cue',
      data: {
        start: 3000,
        end: 4000,
        text: 'How are you?'
      }
    }
  ]

  expect(stringifySync(tree, { format: 'WebVTT' })).toMatchInlineSnapshot(`
    "WEBVTT - This is a custom header
    By Michael Scott
    The Best Boss In The World

    1
    00:00:00.000 --> 00:00:03.000
    Hi there

    2
    00:00:03.000 --> 00:00:04.000
    How are you?
    "
  `)
})
