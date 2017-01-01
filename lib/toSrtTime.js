/**
 * Returns the given millisecond as SRT timestamp.
 * @param {Integer} milliseconds
 * @return {String} srtTimestamp
 */

module.exports = function toSrtTime (milliseconds) {
  if (!/^\d+$/.test(milliseconds.toString())) {
    throw new Error('Time should be an Integer value in milliseconds')
  }

  milliseconds = parseInt(milliseconds)

  var date = new Date(0, 0, 0, 0, 0, 0, milliseconds)

  var hours = date.getHours() < 10
    ? '0' + date.getHours()
    : date.getHours()

  var minutes = date.getMinutes() < 10
    ? '0' + date.getMinutes()
    : date.getMinutes()

  var seconds = date.getSeconds() < 10
    ? '0' + date.getSeconds()
    : date.getSeconds()

  var ms = milliseconds - ((hours * 3600000) + (minutes * 60000) + (seconds * 1000))

  if (ms < 100 && ms >= 10) {
    ms = '0' + ms
  } else if (ms < 10) {
    ms = '00' + ms
  }

  var srtTime = hours + ':' + minutes + ':' + seconds + ',' + ms

  return srtTime
}
