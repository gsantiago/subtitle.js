import { map } from './map'
import { Node } from './types'

export const resync = (time: number) =>
  map((node: Node) => {
    if (node.type === 'cue') {
      return {
        ...node,
        data: {
          ...node.data,
          start: node.data.start + time,
          end: node.data.end + time
        }
      }
    }

    return node
  })
