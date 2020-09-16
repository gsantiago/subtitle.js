import { Duplex } from 'stream'
import { Node } from '.'

export const filter = (callback: (node: Node) => boolean) =>
  new Duplex({
    objectMode: true,
    read() {},
    write(chunk, _encoding, next) {
      if (callback(chunk)) {
        this.push(chunk)
      }
      next()
    }
  })
