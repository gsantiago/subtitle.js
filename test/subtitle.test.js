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
