/**
 * Module dependencies.
 */

const toMS = require('./toMS')

/**
 * Parse SRT string.
 * @param {String} srt
 * @return {Array} subtitles
 */

module.exports = function parse (srt) {
  if (!srt) return []

  const source = srt
    .trim()
    .concat('\n')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')

  return source.reduce((captions, row, index) => {
    const caption = captions[captions.length - 1]

    if (!caption.index) {
      if (/^\d+$/.test(row)) {
        caption.index = parseInt(row, 10)
        return captions
      }
    }

    if (!caption.start) {
      const match = row.match(/^(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})$/)
      if (match) {
        caption.start = toMS(match[1])
        caption.end = toMS(match[2])
        return captions
      }
    }

    if (row.trim() === '') {
      delete caption.index
      if (index !== source.length - 1) {
        captions.push({})
      }
    } else {
      caption.text = caption.text
        ? caption.text + '\n' + row
        : row
    }

    return captions
  }, [{}])
}
