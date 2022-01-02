import { createStreamFromString, pipeline, streamToString } from '../test-utils'
import { filter, parse, stringify } from '../src'

test('filter nodes', async () => {
  const stream = createStreamFromString(`
1
02:12:34,647 --> 02:12:35,489
Hi.

2
02:12:36,415 --> 02:12:37,758
𝅘𝅥𝅮 Some Music 𝅘𝅥𝅮

3
02:12:38,584 --> 02:12:40,120
Welcome to the Planet.\n`)

  const data = await pipeline(
    stream
      .pipe(parse())
      .pipe(
        filter(node => !(node.type === 'cue' && node.data.text.includes('𝅘𝅥𝅮')))
      )
  )

  expect(data).toMatchInlineSnapshot(`
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
          "end": 7960120,
          "start": 7958584,
          "text": "Welcome to the Planet.",
        },
        "type": "cue",
      },
    ]
  `)
})

test('filter nodes and forward to the next stream', async () => {
  const stream = createStreamFromString(`
1
02:12:34,647 --> 02:12:35,489
Hi.

2
02:12:36,415 --> 02:12:37,758
𝅘𝅥𝅮 Some Music 𝅘𝅥𝅮

3
02:12:38,584 --> 02:12:40,120
Welcome to the Planet.\n`)

  const data = await streamToString(
    stream
      .pipe(parse())
      .pipe(
        filter(node => !(node.type === 'cue' && node.data.text.includes('𝅘𝅥𝅮')))
      )
      .pipe(stringify({ format: 'WebVTT' }))
  )

  expect(data).toMatchInlineSnapshot(`
    "WEBVTT

    1
    02:12:34.647 --> 02:12:35.489
    Hi.

    2
    02:12:38.584 --> 02:12:40.120
    Welcome to the Planet.
    "
  `)
})
