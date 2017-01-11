/**
 * Stringify the given array of subtitles.
 * @param {Array} subtitles
 * @return {String} srt
 */

module.exports = function stringify (subtitles) {
  var buffer = ''

  subtitles.forEach(function (caption, index) {
    if (index > 0) {
      buffer += '\n'
    }
    buffer += caption.index
    buffer += '\n'
    buffer += caption.start + ' --> ' + caption.end
    buffer += '\n'
    buffer += caption.text
    buffer += '\n'
  })

  return buffer
}
