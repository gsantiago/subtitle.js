import { fixtures, getFixture } from '../test-utils'
import { parse } from '../src'

test.each(fixtures)('parse SRT fixture: %s.srt', async filename => {
  expect(await parse(await getFixture(filename, 'srt'))).toEqual(
    JSON.parse(await getFixture(filename, 'json'))
  )
})

test.each(fixtures)('parse VTT fixture: %s.vtt', async filename => {
  expect(await parse(await getFixture(filename, 'srt'))).toEqual(
    JSON.parse(await getFixture(filename, 'json'))
  )
})

test('parse SRT captions', async () => {
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

  expect(await parse(srt)).toMatchInlineSnapshot(`
    Array [
      Object {
        "end": 7955489,
        "start": 7954647,
        "text": "Hi.",
      },
      Object {
        "end": 7957758,
        "start": 7956415,
        "text": "Lois Lane.",
      },
      Object {
        "end": 7960120,
        "start": 7958584,
        "text": "Welcome to the Planet.",
      },
    ]
  `)
})

test('parse VTT captions', async () => {
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

  expect(await parse(vtt)).toMatchInlineSnapshot(`
    Array [
      Object {
        "end": 755489,
        "settings": "align:middle line:90%",
        "start": 754647,
        "text": "Hi.",
      },
      Object {
        "end": 7957758,
        "settings": "align:start line:90%",
        "start": 756415,
        "text": "Lois Lane.",
      },
      Object {
        "end": 7960120,
        "start": 7958584,
        "text": "Welcome to the Planet.",
      },
    ]
  `)
})

test('parse VTT caption with headers', async () => {
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

  expect(await parse(vtt)).toMatchInlineSnapshot(`
    Array [
      Object {
        "end": 755489,
        "settings": "align:middle line:90%",
        "start": 754647,
        "text": "Hi.",
      },
      Object {
        "end": 7957758,
        "settings": "align:start line:90%",
        "start": 756415,
        "text": "Lois Lane.",
      },
      Object {
        "end": 7960120,
        "start": 7958584,
        "text": "Welcome to the Planet.",
      },
    ]
  `)
})

test('parse 00:00:00,000 caption', async () => {
  const srt = `
1
00:00:00,000 --> 00:00:00,100
Hi.
`

  expect(await parse(srt)).toMatchInlineSnapshot(`
    Array [
      Object {
        "end": 100,
        "start": 0,
        "text": "Hi.",
      },
    ]
  `)
})

test('parse text that contains only empty space', async () => {
  const srt = `
1
00:00:00,000 --> 00:00:00,100
Something something something... dark side
 

2
00:00:00,100 --> 00:00:00,200
Hi.`

  expect(await parse(srt)).toMatchInlineSnapshot(`
    Array [
      Object {
        "end": 100,
        "start": 0,
        "text": "Something something something... dark side
     ",
      },
      Object {
        "end": 200,
        "start": 100,
        "text": "Hi.",
      },
    ]
  `)
})

test('parse separated texts', async () => {
  const srt = `
1
00:00:00,000 --> 00:00:00,100
Dear Michael. Of course it's you.

Who else could they send?

2
00:00:00,100 --> 00:00:00,200
Who else could be trusted?`

  expect(await parse(srt)).toMatchInlineSnapshot(`
    Array [
      Object {
        "end": 100,
        "start": 0,
        "text": "Dear Michael. Of course it's you.

    Who else could they send?",
      },
      Object {
        "end": 200,
        "start": 100,
        "text": "Who else could be trusted?",
      },
    ]
  `)
})

test('correctly parse captions with empty first lines', async () => {
  const srt = `
1
00:00:00,000 --> 00:00:00,100

[Music]

2
00:00:00,100 --> 00:00:00,200
Fora Bolsonaro`
  const value = await parse(srt)
  expect(value).toMatchInlineSnapshot(`
    Array [
      Object {
        "end": 100,
        "start": 0,
        "text": "[Music]",
      },
      Object {
        "end": 200,
        "start": 100,
        "text": "Fora Bolsonaro",
      },
    ]
  `)
})

test('indexes should be optional', async () => {
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

  expect(await parse(srt)).toMatchInlineSnapshot(`
    Array [
      Object {
        "end": 7955489,
        "start": 7954647,
        "text": "Hi.",
      },
      Object {
        "end": 7957758,
        "start": 7956415,
        "text": "Lois Lane.",
      },
      Object {
        "end": 7960120,
        "start": 7958584,
        "text": "Welcome to the Planet.",
      },
    ]
  `)
})

test('invalid timestamps should throw an error', async () => {
  const srt = `
Invalid timestamp
  `

  await expect(parse(srt)).rejects.toEqual(
    new Error('expected timestamp at row 1, but received: "Invalid timestamp"')
  )

  const srt2 = `
1
999Foo
Invalid timestamp
  `

  await expect(parse(srt2)).rejects.toEqual(
    new Error('expected timestamp at row 2, but received: "999Foo"')
  )
})
