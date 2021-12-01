import { Node } from '.'
import { Transform } from 'stream'

export const filter = (callback: (node: Node) => boolean) =>
  new Transform({
    objectMode: true,
    autoDestroy: false,
    transform: function transform(chunk, _encoding, next) {
      callback(chunk) ? next(null, chunk) : next()
    }
  })
