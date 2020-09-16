import { Readable } from 'stream'
import { read, NodeList } from '.'

export const parse = (input: string): Promise<NodeList> =>
  new Promise((resolve, reject) => {
    const stream = new Readable({ read() {} })
    const nodes: NodeList = []

    stream.push(input)
    stream.push(null)

    stream
      .pipe(read())
      .on('data', chunk => nodes.push(chunk))
      .on('error', err => reject(err))
      .on('finish', () => resolve(nodes))
  })
