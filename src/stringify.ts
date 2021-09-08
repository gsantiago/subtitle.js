import { FormatOptions, Node } from './types'
import { Formatter } from './Formatter'
import { map } from './map'

export const stringify = (options: FormatOptions) => {
  const formatter = new Formatter(options)
  return map((chunk: Node) => formatter.format(chunk))
}
