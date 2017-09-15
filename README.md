# subtitle.js

[![Build Status](https://travis-ci.org/gsantiago/subtitle.js.svg?branch=master)](https://travis-ci.org/gsantiago/subtitle.js)
[![Code Climate](https://codeclimate.com/github/gsantiago/subtitle.js/badges/gpa.svg)](https://codeclimate.com/github/gsantiago/subtitle.js)
[![Coverage Status](https://coveralls.io/repos/github/gsantiago/subtitle.js/badge.svg?branch=master)](https://coveralls.io/github/gsantiago/subtitle.js?branch=master)
[![npm version](https://badge.fury.io/js/subtitle.svg)](http://badge.fury.io/js/subtitle)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Parse and manipulate SRT (SubRip) format.

>["Thanks for this rad package!"](https://github.com/gsantiago/subtitle.js/pull/15#issuecomment-282879854)  
>John-David Dalton, creator of Lodash

## Installation

`npm install subtitle --save`

For browser usage, you can copy the script `subtitle.browser.js`
from the `browser` folder.

## API

The API is minimal and provide only five functions:

* [`parse`](#parsesrt-string---array)
* [`stringify`](#stringifysubtitles-array---string)
* [`resync`](#resyncsubtitles-array-time-number---object)
* [`toMS`](#tomstimestamp-string---number)
* [`toSrtTime`](#tosrttimetimestamp-number---string)

```js
// ES6
const { parse, stringify, resync, toMS, toSrtTime } = require('subtitle')

// ES5
var subtitle = require('subtitle')
subtitle.parse
subtitle.stringify
subtitle.resync
subtitle.toMS
subtitle.toSrtTime

// Global
window.Subtitle.parse
window.Subtitle.stringify
window.Subtitle.resync
window.Subtitle.toMS
window.Subtitle.toSrtTime
```

### `parse(srt: String) -> Array`

Parses a SRT string and returns an array:

```js
parse(mySrtContent)
[
  {
    start: 20000, // time in ms
    end: 24400,
    text: 'Bla Bla Bla Bla'
  },
  {
    start: 24600,
    end: 27800,
    text: 'Bla Bla Bla Bla'
  }
]
```

### `stringify(captions: Array) -> String`

The reverse of `parse`. It gets an array with subtitles and converts it to a valid SRT string.

```js
const subtitles = [
  {
    start: '00:00:20,000',
    end: '00:00:24,400',
    text: 'Bla Bla Bla Bla'
  },
  {
    start: 24600, // timestamp in milliseconds is supported as well
    end: 27800,
    text: 'Bla Bla Bla Bla'
  }
]

const srt = stringify(subtitles)
// returns the following string:
/*
1
00:00:20,000 --> 00:00:24,400
Bla Bla Bla Bla

2
00:00:24,600 --> 00:00:27,800
Bla Bla Bla Bla
*/
```

### `resync(captions: Array, time: Number) -> Object`

Resync all captions at once.

```js
const subtitles = [
  {
    start: '00:00:20,000',
    end: '00:00:24,400',
    text: 'Bla Bla Bla Bla'
  },
  {
    start: 24600, // timestamp in millseconds is supported as well
    end: 27800,
    text: 'Bla Bla Bla Bla'
  }
]

// Advance 1s
const newSubtitles = resync(subtitles, 1000)

// Delay 250ms
const newSubtitles = resync(subtitles, -250) //

// Then, you can stringify your new subtitles:
stringify(newSubtitles)
```

### `toMS(timestamp: String) -> Number`

Convert a SRT timestamp to milliseconds:

```js
toMS('00:00:24,400')
// 24400
```

### `toSrtTime(timestamp: Number) -> String`

Convert a time from milliseconds to a SRT timestamp:

```js
toSrtTime(24400)
// '00:00:24,400'
```

## Tests

Subtitle.js uses [AVA](https://github.com/avajs/ava) for running tests and [nyc](https://github.com/istanbuljs/nyc) for code coverage.

If you want to run these tests, you need to install all devDependencies:

`npm install`

Now you can run the tests with the following command:

`npm test`

**Code Coverage**

You can check the code coverage by running the following command:

`npm run coverage`

If you want a pretty HTML report, run the following:

`npm run report`

Your report will be available in the `coverage` folder.

## License

MIT
