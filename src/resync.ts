import { map, Node } from "."

export const resyncNode = (node: Node, time: number): Node => {
  if (node.type !== "cue") return node

  return {
    ...node,
    data: {
      ...node.data,
      start: node.data.start + time,
      end: node.data.end + time,
    },
  }
}

export const resync = (time: number) =>
  map((node: Node) => resyncNode(node, time))
