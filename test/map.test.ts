import { createStreamFromString } from '../test-utils'
import { parse, map, NodeList, Node } from '../src'

test('map nodes', done => {
  const stream = createStreamFromString(`
1
02:12:34,647 --> 02:12:35,489
Hi.

2
02:12:36,415 --> 02:12:37,758
Lois Lane.

3
02:12:38,584 --> 02:12:40,120
Welcome to the Planet.\n`)

  let count: number = 0

  const callback = (node: Node, index: number) => {
    count = index

    if (node.type === 'cue') {
      return {
        ...node,
        data: {
          ...node.data,
          text: node.data.text.toUpperCase()
        }
      }
    }

    return node
  }

  const buffer: NodeList = []

  expect.assertions(2)

  stream
    .pipe(parse())
    .pipe(map(callback))
    .on('data', (chunk: Node) => {
      buffer.push(chunk)
    })
    .on('finish', () => {
      expect(buffer).toMatchInlineSnapshot(`
        Array [
          Object {
            "data": Object {
              "end": 7955489,
              "start": 7954647,
              "text": "HI.",
            },
            "type": "cue",
          },
          Object {
            "data": Object {
              "end": 7957758,
              "start": 7956415,
              "text": "LOIS LANE.",
            },
            "type": "cue",
          },
          Object {
            "data": Object {
              "end": 7960120,
              "start": 7958584,
              "text": "WELCOME TO THE PLANET.",
            },
            "type": "cue",
          },
        ]
      `)
      expect(count).toEqual(2)
      done()
    })
})
