/*!
 * Subtitle.js
 * Parse and manipulate SRT (SubRip)
 * https://github.com/gsantiago/subtitle.js
 *
 * @version 0.1.0
 * @author Guilherme Santiago
*/


/**
 * Dependencies
*/
var _ = require('underscore');


/**
 * @constructor
 * @param {String} Optional SRT content to be parsed
*/
function Subtitle (srt) {
  this._subtitles = [];

  if (srt) {
    this.parse(srt);
  }
}


/**
 * SRT parser
 *
 * @public
 * @param {String} SRT
*/
Subtitle.prototype.parse = function (srt) {
  var subs = [];
  var index;
  var time;
  var text;
  var start;
  var end;

  if (!srt) {
    throw new Error('No SRT to parse');
  }

  srt = srt.replace(/\r\n/g, '\n').split('\n');

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
        duration: Subtitle.toMS(end) - Subtitle.toMS(start),
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

  this._subtitles = subs;

  return this;
};


/**
 * Add a caption
 * You have to pass an object containing the following data:
 * start - The start time
 * end - The end time
 * text - The caption text
 *
 * The start and end time support two patterns:
 * The SRT: '00:00:24,400'
 * Or a positive integer representing milliseconds
 *
 * @public
 * @param {Object} Caption data
*/
Subtitle.prototype.add = function (caption) {
  if (!caption.start || !caption.end || !caption.text) {
    throw new Error('Invalid caption data');
  }

  for (var prop in caption) {
    if (!caption.hasOwnProperty(prop) || prop === 'text') {
      continue;
    }

    if (prop === 'start' || prop === 'end') {
      if (/^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/.test(caption[prop])) {
        continue;
      }
      if (/^\d+$/.test(caption[prop])) {
        caption[prop] = Subtitle.toSrtTime(caption[prop]);
      } else {
        throw new Error('Invalid caption time format');
      }
    }
  }

  this._subtitles.push({
    index: this._subtitles.length + 1,
    start: caption.start,
    end: caption.end,
    duration: Subtitle.toMS(caption.end) - Subtitle.toMS(caption.start),
    text: caption.text
  });

  return this;
};


/**
 * Convert the SRT time format to milliseconds
 *
 * @static
 * @param {String} SRT time format
*/
Subtitle.toMS = function (time) {
  var match = time.match(/^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/);

  if (!match) {
    throw new Error('Invalid SRT time format');
  }

  var hours = parseInt(match[1], 10);
  var minutes = parseInt(match[2], 10);
  var seconds = parseInt(match[3], 10);
  var milliseconds = parseInt(match[4], 10);

  hours *= 3600000;
  minutes *= 60000;
  seconds *= 1000;

  return hours + minutes + seconds + milliseconds;
};


/**
 * Convert milliseconds to SRT time format
 *
 * @static
 * @param {Integer} Milleseconds
*/
Subtitle.toSrtTime = function (time) {
  if (!/^\d+$/.test(time.toString())) {
    throw new Error('Time should be an Integer value in milliseconds');
  }

  time = parseInt(time);

  var date = new Date(0, 0, 0, 0, 0, 0, time);

  var hours = date.getHours() < 10
    ? '0' + date.getHours()
    : date.getHours();

  var minutes = date.getMinutes() < 10
    ? '0' + date.getMinutes()
    : date.getMinutes();

  var seconds = date.getSeconds() < 10
    ? '0' + date.getSeconds()
    : date.getSeconds();

  var ms = time - ((hours * 3600000) + (minutes * 60000) + (seconds * 1000));

  if (ms < 100 && ms >= 10) {
    ms = '0' + ms;
  } else if (ms < 10) {
    ms = '00' + ms;
  }

  var srtTime = hours + ':' + minutes + ':' + seconds + ',' + ms;

  return srtTime;
};


/**
 * Return the subtitles
 *
 * @param {Object} Options
 * @returns {Array} Subtitles
*/
Subtitle.prototype.getSubtitles = function (options) {
  var subtitles = this._subtitles;

  var defaults = {
    timeFormat: 'srt',
    duration: false
  };

  options = _.extendOwn(defaults, options);

  if (options.timeFormat === 'ms') {
    subtitles = _.map(subtitles, function (caption) {
      caption.start = Subtitle.toMS(caption.start);
      caption.end = Subtitle.toMS(caption.end);
      return caption;
    });
  }

  if (!options.duration) {
    subtitles = _.map(subtitles, function (caption) {
      delete caption.duration;
      return caption;
    });
  }

  return subtitles;
};


/**
 * Returns the subtitles in SRT string
 * @returns {String} srt
*/
Subtitle.prototype.stringify = function () {
  var self = this;
  var buffer = '';

  this._subtitles.forEach(function (caption, index) {
    if (index > 0) {
      buffer += '\n';
    }
    buffer += caption.index;
    buffer += '\n';
    buffer += caption.start + ' --> ' + caption.end;
    buffer += '\n';
    buffer += caption.text;
    buffer += '\n';
  });

  return buffer;
};


/**
 * Resync the captions
 * @param {Integer} Time in milleseconds
*/
Subtitle.prototype.resync = function (time) {
  if (!/(-|\+)?\d+/.test(time.toString())) {
    throw new Error('Invalid time: ' + time + '.Expected a valid integer');
  }

  time = parseInt(time, 10);

  this._subtitles = _.map(this._subtitles, function (caption) {
    var start = Subtitle.toMS(caption.start);
    var end = Subtitle.toMS(caption.end);

    start = start + time;
    end = end + time;

    caption.start = start < 0
      ? Subtitle.toSrtTime(0)
      : Subtitle.toSrtTime(start);

    caption.end = end < 0
      ? Subtitle.toSrtTime(0)
      : Subtitle.toSrtTime(end);

    return caption;
  });

  return this;
};

module.exports = Subtitle;
