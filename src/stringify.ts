import { Readable } from 'stream'
import { write } from './write'
import { Tree, FormatOptions } from './types'

export const stringify = (
  tree: Tree,
  options: FormatOptions
): Promise<string> =>
  new Promise((resolve, reject) => {
    const stream = new Readable({
      objectMode: true,
      read() {}
    })

    let buffer = ''

    tree.forEach(node => {
      stream.push(node)
    })

    stream.push(null)

    stream
      .pipe(write(options))
      .on('data', chunk => {
        buffer += chunk
      })
      .on('error', reject)
      .on('finish', () => {
        resolve(buffer)
      })
  })
