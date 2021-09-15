import { FormatOptions, Node } from './types'
import { Formatter } from './Formatter'
import { map } from './map'

/**
 * @public
 */
export const stringify = (options: FormatOptions) => {
  const formatter = new Formatter(options)
  return map((chunk: Node) => formatter.format(chunk))
}
