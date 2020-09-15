import { Tree } from './types'

export function resync(tree: Tree, time: number): Tree {
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
