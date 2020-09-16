// This file only tests the stream interface.
// `stringify.test` contains the tests for writing/formatting logic.

import { Readable } from 'stream'
import { write, NodeList } from '../src'

test('write SRT files', done => {
  expect.assertions(1)

  const tree: NodeList = [
    {
      type: 'cue',
      data: {
        start: 0,
        end: 1000,
        text: 'Foo Bar Baz Qux'
      }
    }
  ]

  let buffer = ''
  const sourceStream = new Readable({ objectMode: true })
  sourceStream.push(tree[0])
  sourceStream.push(null)

  sourceStream
    .pipe(write({ format: 'srt' }))
    .on('data', chunk => {
      buffer += chunk
    })
    .on('finish', () => {
      expect(buffer).toMatchInlineSnapshot(`
        "1
        00:00:00,000 --> 00:00:01,000
        Foo Bar Baz Qux
        "
      `)
      done()
    })
})
