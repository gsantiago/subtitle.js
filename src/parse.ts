import { Readable } from 'stream'
import { read } from './read'
import { Tree } from './types'

export const parse = (input: string): Promise<Tree> =>
  new Promise((resolve, reject) => {
    const stream = new Readable({ read() {} })
    const captions: Tree = []

    stream.push(input)
    stream.push(null)

    read(stream)
      .on('data', chunk => captions.push(chunk))
      .on('error', err => reject(err))
      .on('end', () => resolve(captions))
  })
