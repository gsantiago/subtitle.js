import { parseTimestamps } from './parseTimestamps'

/**
 * Parse a SRT or WebVTT string.
 * @param {String} srtOrVtt
 * @return {Array} subtitles
 */

export function parse(srtOrVtt) {
  if (!srtOrVtt) return []

  const source = srtOrVtt
    .trim()
    .concat('\n')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^WEBVTT.*\n(?:.*: .*\n)*\n/, '')
    .split('\n')

  return source.reduce(
    (captions, row, index) => {
      const caption = captions[captions.length - 1]

      if (!caption.index) {
        if (/^\d+$/.test(row)) {
          caption.index = parseInt(row, 10)
          return captions
        }
      }

      if (!caption.hasOwnProperty('start')) {
        const timestamp = parseTimestamps(row)
        if (timestamp) {
          Object.assign(caption, timestamp)
        } else if (captions.length > 1) {
          captions[captions.length - 2].text += '\n' + row
        }
        return captions
      }

      if (row === '') {
        delete caption.index
        if (index !== source.length - 1) {
          captions.push({})
        }
      } else {
        caption.text = caption.text ? caption.text + '\n' + row : row
      }

      return captions
    },
    [{}]
  )
}
