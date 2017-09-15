/**
 * Module dependencies.
 */

const toSrtTime = require('./toSrtTime')

/**
 * Stringify the given array of captions.
 * @param {Array} captions
 * @return {String} srt
 */

module.exports = function stringify (captions) {
  return captions.map((caption, index) => {
    return (index > 0 ? '\n' : '') + [
      index + 1,
      `${toSrtTime(caption.start)} --> ${toSrtTime(caption.end)}`,
      caption.text
    ].join('\n')
  }).join('\n') + '\n'
}
