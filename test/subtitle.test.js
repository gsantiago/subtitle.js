/**
 * Module Dependencies
*/
var fs = require('fs');
var join = require('path').join;
var expect = require('chai').expect;
var Subtitle = require('../subtitle');
var _ = require('underscore');


/**
 * Add new captions
*/
describe('Add captions', function () {

  var sub;

  beforeEach(function () {
    sub = new Subtitle();
  });

  it('should add a new caption', function () {
    sub.add({
      start: '00:02:11,031',
      end: '00:02:14,979',
      text: 'No. Everybody here is already dead.'
    });

    expect(sub.getSubtitles({duration: true})).deep.equal([
      {
        index: 1,
        start: '00:02:11,031',
        end: '00:02:14,979',
        duration: 3948,
        text: 'No. Everybody here is already dead.'
      }
    ]);

  });


  it('should add three captions', function () {
    sub
      .add({
      start: '00:02:11,031',
      end: '00:02:14,979',
      text: 'No. Everybody here is already dead.'
    })
      .add({
      start: '00:03:27,174',
      end: '00:03:28,209',
      text: 'These lawmakers...'
    })
      .add({
      start: '00:04:52,259',
      end: '00:04:54,261',
      text: 'Lara, you have to ready the launch.'
    });

    expect(sub.getSubtitles()).deep.equal([
      {
        index: 1,
        start: '00:02:11,031',
        end: '00:02:14,979',
        text: 'No. Everybody here is already dead.'
      },
      {
        index: 2,
        start: '00:03:27,174',
        end: '00:03:28,209',
        text: 'These lawmakers...'
      },
      {
        index: 3,
        start: '00:04:52,259',
        end: '00:04:54,261',
        text: 'Lara, you have to ready the launch.'
      }
    ])
  });

  it('should accept caption with time in ms', function () {
    var time1 = '00:02:22,542';
    var time1ms = 120000 + 22000 + 542;

    var time2 = '01:51:58,219';
    var time2ms = 3600000 + 3060000 + 58000 + 219;

    sub.add({
      start: time1ms,
      end: time2ms,
      text: 'The world is about to come to an end.'
    });

    expect(sub.getSubtitles()).deep.equal([
      {
        index: 1,
        start: time1,
        end: time2,
        text: 'The world is about to come to an end.'
      }
    ]);
  });

});


/**
 * Suit for parsing
*/
describe('Parser SRT', function () {

  var srt;
  var subtitle;
  var parsedSrt = [
    {
      index: 1,
      start: '00:00:20,000',
      end: '00:00:24,400',
      duration: 4400,
      text: 'This is the first line\nand this is the second one'
    },
    {
      index: 2,
      start: '00:00:24,600',
      end: '00:00:27,800',
      duration: 3200,
      text: 'Hello, World!'
    }
  ];


  describe('Small SRT', function () {
    beforeEach(function () {
      srt = fs.readFileSync(join(__dirname, 'fixtures/sample.srt'), 'utf8');
      subtitle = new Subtitle(srt);
    });

    it('should return an object with the SRT parsed and duration property', function () {
      expect(subtitle.getSubtitles({duration: true})).deep.equal(parsedSrt);
    });

    it('should return an object with the SRT parsed, with time in MS', function () {
      var parsedSrtMS = _.map(parsedSrt, function (caption) {
        caption.start = Subtitle.toMS(caption.start);
        caption.end = Subtitle.toMS(caption.end);
        return caption;
      });

      expect(subtitle.getSubtitles({timeFormat: 'ms', duration: true})).deep.equal(parsedSrtMS);
    });
  })

  describe('Big SRT', function () {
    beforeEach(function () {
      srt = fs.readFileSync(join(__dirname, 'fixtures/big.srt'), 'utf8');
      subtitle = new Subtitle();
    });

    it('should parse a big SRT without errors', function () {
      subtitle.parse(srt);
    });
  });

});


/**
 * Suit for Time Conversion
*/
describe('Time Conversion', function () {

  var time1 = '00:02:22,542';
  var time1ms = 120000 + 22000 + 542;

  var time2 = '01:51:58,219';
  var time2ms = 3600000 + 3060000 + 58000 + 219;

  var time3 = '00:00:00,000';

  describe('SRT time format to milliseconds', function () {

    it('should return ' + time1ms + 'ms', function () {
      expect(Subtitle.toMS(time1)).equal(time1ms);
    });

    it('should return ' + time2ms + 'ms', function () {
      expect(Subtitle.toMS(time2)).equal(time2ms);
    });

    it('should return 0ms', function () {
      expect(Subtitle.toMS(time3)).equal(0);
    });

    it('invalid format should throw an error', function () {
      var fn = function () {
        Subtitle.toMS('12,34:56,78');
      }
      expect(fn).throw(Error);
    });

  });


  describe('milliseconds to SRT time format', function () {

    it('should return ' + time1, function () {
      expect(Subtitle.toSrtTime(time1ms)).equal(time1);
    });

    it('should return ' + time2, function () {
      expect(Subtitle.toSrtTime(time2ms)).equal(time2);
    });

    it('should return ' + time3, function () {
      expect(Subtitle.toSrtTime(0)).equal(time3);
    });

    it('non-Integer and should throw errors', function () {
      var fn = function () {
        Subtitle.toSrtTime('test');
      }

      var fn2 = function () {
        Subtitle.toSrtTime('10abc');
      }

      var fn3 = function () {
        Subtitle.toSrtTime(-100);
      }

      expect(fn).throw(Error);
      expect(fn2).throw(Error);
      expect(fn3).throw(Error);
    });

  });

});

/**
 * Suit for Stringfy
*/
describe('Stringfy', function () {

  var srt;
  var subtitle;

  beforeEach(function () {
    srt = fs.readFileSync(join(__dirname, 'fixtures/sample.srt'), 'utf8');
    srt = srt.replace(/\r\n/g, '\n');
    subtitle = new Subtitle();
  });

  it('should return the stringfied version of the subtitles', function () {

    subtitle.add({
      start: '00:00:20,000',
      end: '00:00:24,400',
      text: 'This is the first line\nand this is the second one'
    });

    subtitle.add({
      start: '00:00:24,600',
      end: '00:00:27,800',
      text: 'Hello, World!'
    });

    expect(subtitle.stringfy()).equal(srt);

  });

});


/**
 * Suit for Resync method
*/
describe('Resync', function () {
  var subtitle;

  beforeEach(function () {
    subtitle = new Subtitle();

    subtitle.add({
      start: '00:00:10,100',
      end: '00:00:10,500',
      text: 'Text'
    });

    subtitle.add({
      start: '00:00:20,650',
      end: '00:00:23,300',
      text: 'Text'
    });

    subtitle.add({
      start: '00:05:00,000',
      end: '00:05:10,150',
      text: 'Text'
    });
  });

  it('should delay 100ms', function () {
    subtitle.resync(-100);

    expect(subtitle.getSubtitles()[0]).deep.equal({
      index: 1,
      start: '00:00:10,000',
      end: '00:00:10,400',
      text: 'Text'
    });
  });

  it('should advance 1s', function () {
    subtitle.resync(1000);

    expect(subtitle.getSubtitles()[1]).deep.equal({
      index: 2,
      start: '00:00:21,650',
      end: '00:00:24,300',
      text: 'Text'
    });
  });

  it('should delay two hours', function () {
    subtitle.resync(2*60*1000*-1);

    expect(subtitle.getSubtitles()[2]).deep.equal({
      index: 3,
      start: '00:03:00,000',
      end: '00:03:10,150',
      text: 'Text'
    });
  });

});
