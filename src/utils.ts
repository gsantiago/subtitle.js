import { Duplex, DuplexOptions } from 'stream'

/**
 * @public
 */
export const padLeft = (value: number, length = 2): string =>
  value.toString().padStart(length, '0')

/**
 * @public
 */
export const createDuplex = (options: DuplexOptions) =>
  new Duplex({
    objectMode: true,
    autoDestroy: false,
    read() {},
    ...options
  })
