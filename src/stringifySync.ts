import { Formatter } from './Formatter'
import { FormatOptions, NodeList } from './types'

export const stringifySync = (
  list: NodeList,
  options: FormatOptions
): string => {
  const formatter = new Formatter(options)

  return list.reduce((buffer, node) => {
    return buffer + formatter.format(node)
  }, '')
}
