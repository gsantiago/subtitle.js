/**
 * Module Dependencies
*/
var fs = require('fs');
var join = require('path').join;
var expect = require('chai').expect;
var Subtitle = require('../subtitle');


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

    expect(sub.subtitles).deep.equal([
      {
        index: 1,
        start: '00:02:11,031',
        end: '00:02:14,979',
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

    expect(sub.subtitles).deep.equal([
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

    expect(sub.subtitles).deep.equal([
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
      text: 'This is the first line\nand this is the second one'
    },
    {
      index: 2,
      start: '00:00:24,600',
      end: '00:00:27,800',
      text: 'Hello, World!'
    }
  ];

  describe('Small SRT', function () {
    beforeEach(function () {
      srt = fs.readFileSync(join(__dirname, 'fixtures/sample.srt'), 'utf8');
      subtitle = new Subtitle(srt);
    });

    it('should return an object with the SRT parsed', function () {
      expect(subtitle.subtitles).deep.equal(parsedSrt);
    });
  })

  describe('Big SRT', function () {
    beforeEach(function () {
      srt = fs.readFileSync(join(__dirname, 'fixtures/big.srt'), 'utf8');
      subtitle = new Subtitle();
    });

    it('should parse a big SRT without errors', function () {
      //subtitle.parse(srt);
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
