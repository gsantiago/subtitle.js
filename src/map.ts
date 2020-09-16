import { Transform } from 'stream'
import { Node } from '.'

export const map = (mapper: (node: Node, index: number) => any) => {
  let index = 0

  return new Transform({
    objectMode: true,
    autoDestroy: false,
    transform(chunk: Node, _encoding, callback) {
      callback(null, mapper(chunk, index++))
    }
  })
}
