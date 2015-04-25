/*!
 * Subtitle.js
 * Parse and manipulate SRT (SubRip)
 * https://github.com/gsantiago/subtitle.js
 *
 * @version 0.0.1
 * @author Guilherme Santiago
*/


/**
 * @constructor
 * @param {String} The SRT content to be parsed
*/
function Subtitle (srt) {
  if (srt) {
    this.srt = srt;
  }
}


/**
 * SRT parser
*/
Subtitle.prototype.parse = function () {
  var subs = [];
  var index;
  var time;
  var text;
  var start;
  var end;
  var srt = this.srt.split('\n');

  srt.forEach(function (line) {
    line = line.toString();

    // if we don't have an index, so we should expect an index
    if (!index) {
      if (/^\d+$/.test(line)) {
        index = parseInt(line);
        return;
      }
    }

    // now we have to check for the time
    if (!time) {
      var match = line.match(/^(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})$/);
      if (match) {
        start = match[1];
        end = match[2];
        time = true;
        return;
      }
    }

    // now we get all the strings until we get an empty line
    if (line.trim() === '') {
      subs.push({
        index: index,
        start: start,
        end: end,
        text: text
      });
      index = time = start = end = text = null;
    } else {
      if (!text) {
        text = line;
      } else {
        text += '\n' + line;
      }
    }

  });

  return subs;
};

module.exports = Subtitle;
