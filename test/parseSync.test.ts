import { fixtures, getFixture } from '../test-utils'
import { parseSync } from '../src'

test.each(fixtures)('parse SRT fixture: %s.srt', async filename => {
  expect(parseSync(await getFixture(filename, 'srt'))).toEqual(
    JSON.parse(await getFixture(filename, 'srt.json'))
  )
})

test.each(fixtures)('parse VTT fixture: %s.vtt', async filename => {
  expect(parseSync(await getFixture(filename, 'vtt'))).toEqual(
    JSON.parse(await getFixture(filename, 'vtt.json'))
  )
})

test('parse SRT captions', () => {
  const srt = `
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

  expect(parseSync(srt)).toMatchInlineSnapshot(`
    Array [
      Object {
        "data": Object {
          "end": 7955489,
          "start": 7954647,
          "text": "Hi.",
        },
        "type": "cue",
      },
      Object {
        "data": Object {
          "end": 7957758,
          "start": 7956415,
          "text": "Lois Lane.",
        },
        "type": "cue",
      },
      Object {
        "data": Object {
          "end": 7960120,
          "start": 7958584,
          "text": "Welcome to the Planet.",
        },
        "type": "cue",
      },
    ]
  `)
})

test('parse VTT captions', () => {
  const vtt = `
WEBVTT - Test VTT cues

1
12:34.647 --> 12:35.489 align:middle line:90%
Hi.

2
12:36.415 --> 02:12:37.758 align:start line:90%
Lois Lane.

02:12:38.584 --> 02:12:40.120
Welcome to the Planet.
  `
    .trim()
    .concat('\n')

  expect(parseSync(vtt)).toMatchInlineSnapshot(`
    Array [
      Object {
        "data": "WEBVTT - Test VTT cues",
        "type": "header",
      },
      Object {
        "data": Object {
          "end": 755489,
          "settings": "align:middle line:90%",
          "start": 754647,
          "text": "Hi.",
        },
        "type": "cue",
      },
      Object {
        "data": Object {
          "end": 7957758,
          "settings": "align:start line:90%",
          "start": 756415,
          "text": "Lois Lane.",
        },
        "type": "cue",
      },
      Object {
        "data": Object {
          "end": 7960120,
          "start": 7958584,
          "text": "Welcome to the Planet.",
        },
        "type": "cue",
      },
    ]
  `)
})

test('parse VTT caption with headers', () => {
  const vtt = `
WEBVTT - Test VTT cues
Kind: captions
Language: en-US

1
12:34.647 --> 12:35.489 align:middle line:90%
Hi.

2
12:36.415 --> 02:12:37.758 align:start line:90%
Lois Lane.

02:12:38.584 --> 02:12:40.120
Welcome to the Planet.
  `
    .trim()
    .concat('\n')

  expect(parseSync(vtt)).toMatchInlineSnapshot(`
    Array [
      Object {
        "data": "WEBVTT - Test VTT cues
    Kind: captions
    Language: en-US",
        "type": "header",
      },
      Object {
        "data": Object {
          "end": 755489,
          "settings": "align:middle line:90%",
          "start": 754647,
          "text": "Hi.",
        },
        "type": "cue",
      },
      Object {
        "data": Object {
          "end": 7957758,
          "settings": "align:start line:90%",
          "start": 756415,
          "text": "Lois Lane.",
        },
        "type": "cue",
      },
      Object {
        "data": Object {
          "end": 7960120,
          "start": 7958584,
          "text": "Welcome to the Planet.",
        },
        "type": "cue",
      },
    ]
  `)
})

// https://w3c.github.io/webvtt/#introduction-comments
test('parse VTT caption and ignore comments', () => {
  const vtt = `
WEBVTT - Test VTT Comments

NOTE
This file was written by Jill. I hope
you enjoy reading it. Some things to
bear in mind:
- I was lip-reading, so the cues may
not be 100% accurate
- I didn’t pay too close attention to
when the cues should start or end.

00:01.000 --> 00:04.000
Never drink liquid nitrogen.

NOTE check next cue

00:05.000 --> 00:09.000 align:middle line:90%
— It will perforate your stomach.
— You could die.

NOTE end of file
  `
    .trim()
    .concat('\n')

  expect(parseSync(vtt)).toMatchInlineSnapshot(`
    Array [
      Object {
        "data": "WEBVTT - Test VTT Comments",
        "type": "header",
      },
      Object {
        "data": Object {
          "end": 4000,
          "start": 1000,
          "text": "Never drink liquid nitrogen.",
        },
        "type": "cue",
      },
      Object {
        "data": Object {
          "end": 9000,
          "settings": "align:middle line:90%",
          "start": 5000,
          "text": "— It will perforate your stomach.
    — You could die.",
        },
        "type": "cue",
      },
    ]
  `)
})

test('parse 00:00:00,000 caption', () => {
  const srt = `
1
00:00:00,000 --> 00:00:00,100
Hi.
`
  expect(parseSync(srt)).toMatchInlineSnapshot(`
    Array [
      Object {
        "data": Object {
          "end": 100,
          "start": 0,
          "text": "Hi.",
        },
        "type": "cue",
      },
    ]
  `)
})

test('parse text that contains only empty space', () => {
  const srt = `
1
00:00:00,000 --> 00:00:00,100
Something something something... dark side
 

2
00:00:00,100 --> 00:00:00,200
Hi.`
  expect(parseSync(srt)).toMatchInlineSnapshot(`
    Array [
      Object {
        "data": Object {
          "end": 100,
          "start": 0,
          "text": "Something something something... dark side
     ",
        },
        "type": "cue",
      },
      Object {
        "data": Object {
          "end": 200,
          "start": 100,
          "text": "Hi.",
        },
        "type": "cue",
      },
    ]
  `)
})

test('parse separated texts', () => {
  const srt = `
1
00:00:00,000 --> 00:00:00,100
Dear Michael. Of course it's you.

Who else could they send?

2
00:00:00,100 --> 00:00:00,200
Who else could be trusted?`
  expect(parseSync(srt)).toMatchInlineSnapshot(`
    Array [
      Object {
        "data": Object {
          "end": 100,
          "start": 0,
          "text": "Dear Michael. Of course it's you.

    Who else could they send?",
        },
        "type": "cue",
      },
      Object {
        "data": Object {
          "end": 200,
          "start": 100,
          "text": "Who else could be trusted?",
        },
        "type": "cue",
      },
    ]
  `)
})

test('correctly parse captions with empty first lines', () => {
  const srt = `
1
00:00:00,000 --> 00:00:00,100

[Music]

2
00:00:00,100 --> 00:00:00,200
Fora Bolsonaro`
  expect(parseSync(srt)).toMatchInlineSnapshot(`
    Array [
      Object {
        "data": Object {
          "end": 100,
          "start": 0,
          "text": "[Music]",
        },
        "type": "cue",
      },
      Object {
        "data": Object {
          "end": 200,
          "start": 100,
          "text": "Fora Bolsonaro",
        },
        "type": "cue",
      },
    ]
  `)
})

test('indexes should be optional', () => {
  const srt = `
02:12:34,647 --> 02:12:35,489
Hi.

2
02:12:36,415 --> 02:12:37,758
Lois Lane.

02:12:38,584 --> 02:12:40,120
Welcome to the Planet.
  `
    .trim()
    .concat('\n')

  expect(parseSync(srt)).toMatchInlineSnapshot(`
    Array [
      Object {
        "data": Object {
          "end": 7955489,
          "start": 7954647,
          "text": "Hi.",
        },
        "type": "cue",
      },
      Object {
        "data": Object {
          "end": 7957758,
          "start": 7956415,
          "text": "Lois Lane.",
        },
        "type": "cue",
      },
      Object {
        "data": Object {
          "end": 7960120,
          "start": 7958584,
          "text": "Welcome to the Planet.",
        },
        "type": "cue",
      },
    ]
  `)
})

test('invalid timestamps should throw an error', () => {
  const srt = `
Invalid timestamp
  `

  expect(() => parseSync(srt)).toThrow(
    new Error('expected timestamp at row 1, but received: "Invalid timestamp"')
  )

  const srt2 = `
1
999Foo
Invalid timestamp
  `

  expect(() => parseSync(srt2)).toThrow(
    new Error('expected timestamp at row 2, but received: "999Foo"')
  )
})

test('last captions with more than one line', () => {
  const srt = `
02:12:34,647 --> 02:12:35,489
Hi.

2
02:12:36,415 --> 02:12:37,758
Lois Lane.

02:12:38,584 --> 02:12:40,120
Welcome to the Planet.
To the Earth Planet.
The most beautiful planet in the whole universe.
`

  expect(parseSync(srt)).toMatchInlineSnapshot(`
    Array [
      Object {
        "data": Object {
          "end": 7955489,
          "start": 7954647,
          "text": "Hi.",
        },
        "type": "cue",
      },
      Object {
        "data": Object {
          "end": 7957758,
          "start": 7956415,
          "text": "Lois Lane.",
        },
        "type": "cue",
      },
      Object {
        "data": Object {
          "end": 7960120,
          "start": 7958584,
          "text": "Welcome to the Planet.
    To the Earth Planet.
    The most beautiful planet in the whole universe.",
        },
        "type": "cue",
      },
    ]
  `)
})
