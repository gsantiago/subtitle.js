/**
 * Module Dependencies
*/
var fs = require('fs');
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
      text: 'Devido ao aumento dramático\nno número de crimes em certos bairros'
    },
    {
      index: 2,
      start: '00:00:24,600',
      end: '00:00:27,800',
      text: 'o governo está implantando nova política...'
    }
  ];

  beforeEach(function () {
    srt = fs.readFileSync(__dirname + '/sample.srt', 'utf8');
    subtitle = new Subtitle(srt);
  });

  it('should return an object with the SRT parsed', function () {
    expect(subtitle.parse()).deep.equal(parsedSrt);
  });

});
