import { NodeList } from './types'

export function resync(tree: NodeList, time: number): NodeList {
  return tree.map(node => {
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
}
