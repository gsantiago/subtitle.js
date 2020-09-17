import { Node } from '.'
import { createDuplex } from './utils'

export const filter = (callback: (node: Node) => boolean) =>
  createDuplex({
    write(chunk, _encoding, next) {
      if (callback(chunk)) {
        this.push(chunk)
      }
      next()
    }
  })
