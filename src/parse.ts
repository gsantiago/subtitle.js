import { Readable } from 'stream'
import { read } from './read'
import { Tree } from './types'

export const parse = (input: string): Promise<Tree> =>
  new Promise((resolve, reject) => {
    const stream = new Readable({ read() {} })
    const nodes: Tree = []

    stream.push(input)
    stream.push(null)

    stream
      .pipe(read())
      .on('data', chunk => nodes.push(chunk))
      .on('error', err => reject(err))
      .on('finish', () => resolve(nodes))
  })
