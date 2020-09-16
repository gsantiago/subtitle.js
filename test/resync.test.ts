import { Readable } from 'stream'
import { resync, NodeList, Node } from '../src'

const cues: NodeList = [
  {
    type: 'cue',
    data: {
      start: 10100,
      end: 10500,
      text: 'Text'
    }
  },
  {
    type: 'cue',
    data: {
      start: 20650,
      end: 23300,
      text: 'Text'
    }
  },
  {
    type: 'cue',
    data: {
      start: 300000,
      end: 310150,
      text: 'Text'
    }
  }
]

const createStream = () => {
  const stream = new Readable({ objectMode: true, read() {} })
  cues.forEach(node => stream.push(node))
  stream.push(null)
  return stream
}

const pipeline = (stream: Readable): Promise<NodeList> =>
  new Promise((resolve, reject) => {
    const buffer: NodeList = []
    stream.on('data', (chunk: Node) => buffer.push(chunk))
    stream.on('error', reject)
    stream.on('finish', () => resolve(buffer))
  })

test('delay 100ms', async () => {
  const expected = {
    start: 10000,
    end: 10400,
    text: 'Text'
  }

  const result = await pipeline(createStream().pipe(resync(-100)))

  expect(result[0].data).toEqual(expected)
})

test('advance 1s', async () => {
  const expected = {
    start: 21650,
    end: 24300,
    text: 'Text'
  }

  const result = await pipeline(createStream().pipe(resync(1000)))

  expect(result[1].data).toEqual(expected)
})

test('delay 2 hours', async () => {
  const expected = {
    start: 180000,
    end: 190150,
    text: 'Text'
  }

  const result = await pipeline(createStream().pipe(resync(2 * 60 * 1000 * -1)))

  expect(result[2].data).toEqual(expected)
})
