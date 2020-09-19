import { map, Node } from '.'

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
