# subtitle.js

[![Build Status](https://travis-ci.org/gsantiago/subtitle.js.svg?branch=master)](https://travis-ci.org/gsantiago/subtitle.js)
[![Code Climate](https://codeclimate.com/github/gsantiago/subtitle.js/badges/gpa.svg)](https://codeclimate.com/github/gsantiago/subtitle.js)
[![Coverage Status](https://coveralls.io/repos/github/gsantiago/subtitle.js/badge.svg?branch=master)](https://coveralls.io/github/gsantiago/subtitle.js?branch=master)
[![npm version](https://badge.fury.io/js/subtitle.svg)](http://badge.fury.io/js/subtitle)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Parse and manipulate SRT (SubRip) format.

## Installation

`npm install subtitle --save`

For browser usage, you can copy the script `subtitle.browser.js`
from the `browser` folder.

## API

This lib provides four functions: [`parse`](#parsesrt-string-options-object---array), [`stringify`](#stringifysubtitles-array---string), [`resync`](#resyncsubtitles-array-time-number---object) and [`createSubtitles`](#createsubtitlesinitialsubtitles-arraystring---object):

```js
// ES6
const { parse, stringify, resync, createSubtitles } = require('subtitle')

// ES5
var subtitle = require('subtitle')
subtitle.parse
subtitle.stringify
subtitle.resync
subtitle.createSubtitles

// Global
window.subtitle.parse
window.subtitle.stringify
window.subtitle.resync
window.subtitle.createSubtitles
```

### `parse(srt: String, [options: Object]) -> Array`

Parses a SRT string and returns an array:

```js
parse(mySrtContent)

// returns an array like this:
[
  {
    index: 1,
    start: '00:00:20,000',
    end: '00:00:24,400',
    duration: 4400,
    text: 'Bla Bla Bla Bla'
  },
  {
    index: 2,
    start: '00:00:24,600',
    end: '00:00:27,800',
    duration: 4400,
    text: 'Bla Bla Bla Bla'
  }
]

// with timestamp in millseconds:
parse(mySrtContent, { timeFormat: 'ms' })
[
  {
    index: 1,
    start: 20000,
    end: 24400,
    duration: 4400,
    text: 'Bla Bla Bla Bla'
  },
  {
    index: 2,
    start: 24600,
    end: 27800,
    duration: 3200,
    text: 'Bla Bla Bla Bla'
  }
]
```

#### Options

| Option | Description | Default |
| ------ | ----------- | ------- |
| `timeFormat` | The timestamp format. It supports `"srt"` ('00:00:24,600') and `"ms"` for milleseconds. | `"srt"`

### `stringify(subtitles: Array) -> String`

The reverse of `parse`. It gets an array with subtitles and converts it to a valid SRT string.

```js
const subtitles = [
  {
    {
      index: 1,
      start: '00:00:20,000',
      end: '00:00:24,400',
      duration: 4400, // OPTIONAL
      text: 'Bla Bla Bla Bla'
    },
    {
      {
        index: 2,
        start: 24600, // timestamp in millseconds is supported as well
        end: 27800,
        text: 'Bla Bla Bla Bla'
      }
    }
  }
]

const srt = stringify(subtitles)
// returns the following string:
`
1
00:00:20,000 --> 00:00:24,400
Bla Bla Bla Bla

2
00:00:24,600 --> 00:00:27,800
Bla Bla Bla Bla
``
```

### `resync(subtitles: Array, time: Number) -> Object`

Resync all captions at once.

```js
const subtitles = [
  {
    {
      index: 1,
      start: '00:00:20,000',
      end: '00:00:24,400',
      duration: 4400, // OPTIONAL
      text: 'Bla Bla Bla Bla'
    },
    {
      {
        index: 2,
        start: 24600, // timestamp in millseconds is supported as well
        end: 27800,
        text: 'Bla Bla Bla Bla'
      }
    }
  }
]

// Advance 1s
const newSubtitles = resync(subtitles, 1000)

// Delay 250ms
const newSubtitles = resync(subtitles, 250) //

// Then, you can stringify your new subtitles:
stringify(newSubtitles)
```

### `createSubtitles(initialSubtitles: Array|String) -> Object`

TODO

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

## Roadmap
* [x] Basic SRT parser
* [x] Basic manipulation
* [x] Stringify
* [x] Time conversion
* [x] Duration property
* [x] Browser support
* [ ] Stream interface
* [ ] WebVTT support
* [ ] Better docs
