import { Readable } from 'stream'
import { write, NodeList, FormatOptions } from '.'

export const stringify = (
  tree: NodeList,
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
