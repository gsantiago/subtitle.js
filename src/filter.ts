import { Node, SubtitleStream } from './types'
import { createDuplex } from './utils'

export const filter = (callback: (node: Node) => boolean): SubtitleStream =>
  createDuplex({
    write(chunk, _encoding, next) {
      if (callback(chunk)) {
        this.push(chunk)
      }
      next()
    }
  })
