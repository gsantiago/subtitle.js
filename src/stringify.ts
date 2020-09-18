import { map, FormatOptions, Node } from '.'
import { Formatter } from './Formatter'

export const stringify = (options: FormatOptions) => {
  const formatter = new Formatter(options)
  return map((chunk: Node) => formatter.format(chunk))
}
