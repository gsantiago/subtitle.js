import multipipe from 'multipipe'
import split2 from 'split2'
import { createDuplex } from './utils'
import { Parser } from './Parser'

export const parse = () => {
  const parser = new Parser({
    push: node => outputStream.push(node)
  })

  const stream = createDuplex({
    write(chunk, _encoding, next) {
      try {
        parser.parseLine(chunk.toString())
      } catch (err) {
        return next(err)
      }

      next()
    }
  })

  const splitStream = split2()

  splitStream.on('finish', () => {
    parser.flush()
    stream.push(null)
  })

  const outputStream = multipipe(splitStream, stream, {
    objectMode: true
  })

  return outputStream
}
