import { Duplex, DuplexOptions } from 'stream'

export const padLeft = (value: number, length = 2): string =>
  value.toString().padStart(length, '0')

export const createDuplex = (options: DuplexOptions) =>
  new Duplex({
    objectMode: true,
    autoDestroy: false,
    read() {},
    ...options
  })
