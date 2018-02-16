/**
 * Module dependencies.
 */

import toMS from './toMS'

/**
 * Resync the given subtitles.
 * @param captions
 * @param time
 * @returns {Array|*}
 */

export default function resync (captions, time) {
  return captions.map(caption => {
    const start = toMS(caption.start) + time
    const end = toMS(caption.end) + time

    return Object.assign({}, caption, {
      start,
      end
    })
  })
}
