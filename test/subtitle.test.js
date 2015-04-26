/**
 * Module Dependencies
*/
var fs = require('fs');
var join = require('path').join;
var expect = require('chai').expect;
var Subtitle = require('../subtitle');

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
      expect(subtitle.parse()).deep.equal(parsedSrt);
    });
  })

  describe('Big SRT', function () {
    beforeEach(function () {
      srt = fs.readFileSync(join(__dirname, 'fixtures/big.srt'), 'utf8');
      subtitle = new Subtitle(srt);
    });

    it('should parse a big SRT without errors', function () {
      var bigSrt = subtitle.parse();
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
