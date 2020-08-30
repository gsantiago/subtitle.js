import { Captions } from './types'

export function resync(captions: Captions, time: number): Captions {
  return captions.map(caption => ({
    ...caption,
    start: caption.start + time,
    end: caption.end + time
  }))
}
