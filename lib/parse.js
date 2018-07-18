/**
 * Module dependencies.
 */

import parseTimestamps from './parseTimestamps'

/**
 * Parse a SRT or WebVTT string.
 * @param {String} srtOrVtt
 * @return {Array} subtitles
 */

export default function parse (srtOrVtt, options) {
  if (!srtOrVtt) return []
  options = options || {
    skipInvalidCaptions: false,
    errorHandler: null,
    skipContiguousErrors: true
  }

  const source = srtOrVtt
    .trim()
    .concat('\n')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^WEBVTT.*\n{2}/, '')
    .split('\n')

  var lastWasSuccessful = true

  return source.reduce((captions, row, index) => {
    const caption = captions[captions.length - 1]

    try {
      if (!caption.index) {
        if (/^\d+$/.test(row)) {
          caption.index = parseInt(row, 10)
          return captions
        }
      }

      if (!caption.hasOwnProperty('start')) {
        Object.assign(caption, parseTimestamps(row))
        return captions
      }

      if (row === '') {
        delete caption.index
        if (index !== source.length - 1) {
          captions.push({})
        }
      } else {
        caption.text = caption.text
          ? caption.text + '\n' + row
          : row
      }

      lastWasSuccessful = true
    } catch (error) {
      if (!options.skipInvalidCaptions) {
        throw error
      }

      if (lastWasSuccessful || !options.skipContiguousErrors) {
        if (typeof options.errorHandler === 'function') {
          options.errorHandler({index: index, row: row, error: error})
        }
      }

      lastWasSuccessful = false

      captions[captions.length - 1] = {}
    }

    return captions
  }, [{}])
}
