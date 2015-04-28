
# subtitle.js

[![Build Status](https://travis-ci.org/gsantiago/subtitle.js.svg?branch=master)](https://travis-ci.org/gsantiago/subtitle.js)
[![Code Climate](https://codeclimate.com/github/gsantiago/subtitle.js/badges/gpa.svg)](https://codeclimate.com/github/gsantiago/subtitle.js)
[![Test Coverage](https://codeclimate.com/github/gsantiago/subtitle.js/badges/coverage.svg)](https://codeclimate.com/github/gsantiago/subtitle.js)
[![npm version](https://badge.fury.io/js/subtitle.svg)](http://badge.fury.io/js/subtitle)

Parse and manipulate SRT (SubRip) format.

## Installing

`npm install subtitle --save`

## Usage

```javascript
var Subtitle = require('subtitle');

var captions = new Subtitle();

captions.parse('your srt here');

console.log(captions.subtitles)



console.log(subtitle.parse('your srt here));
```

It's gonna return an array like this:

```javascript
[
  {
    index: 1,
    start: '00:00:20,000',
    end: '00:00:24,400',
    text: 'Bla Bla Bla Bla'
  },
  {
    index: 2,
    start: '00:00:24,600',
    end: '00:00:27,800',
    text: 'Bla Bla Bla Bla'
  }
]
```

## Tests

`npm test`

## Roadmap
* [x] Basic SRT parser
* [ ] Basic manipulation
* [ ] Stringfy
* [x] Time conversion
* [ ] Duration property
* [ ] WebVTT support
* [ ] Browser support (including for Browserify)
* [ ] Better docs
