import { Readable } from 'stream'
import { read } from './read'
import { Captions } from './types'

export const parse = (input: string): Promise<Captions> =>
  new Promise((resolve, reject) => {
    const stream = new Readable({ read() {} })
    const captions: Captions = []

    stream.push(input)
    stream.push(null)

    read(stream)
      .on('data', chunk => captions.push(chunk))
      .on('error', err => reject(err))
      .on('end', () => resolve(captions))
  })
