# subtitle.js

[![Build Status](https://img.shields.io/travis/gsantiago/subtitle.js/master?style=flat-square)](https://travis-ci.org/gsantiago/subtitle.js)
[![Code Climate](https://img.shields.io/codeclimate/maintainability/gsantiago/subtitle.js?style=flat-square)](https://codeclimate.com/github/gsantiago/subtitle.js)
[![Coverage Status](https://img.shields.io/coveralls/github/gsantiago/subtitle.js?style=flat-square)](https://coveralls.io/github/gsantiago/subtitle.js?branch=master)
![npm](https://img.shields.io/npm/v/subtitle?style=flat-square)
[![downloads](https://img.shields.io/npm/dm/subtitle?style=flat-square)](https://www.npmjs.com/package/subtitle)

Parse, manipulate and stringify SRT (SubRip) format. WebVTT as input is
also supported.

>["Thanks for this rad package!"](https://github.com/gsantiago/subtitle.js/pull/15#issuecomment-282879854)
>John-David Dalton, creator of Lodash

## Installation

`npm install subtitle --save`

## API

The API is minimal and provide only five functions, two of which have SRT and WebVTT variants:

* [`parse`](#parsesrt-string---array)
* [`stringify`](#stringifycaptions-array---string)
* [`stringifyVtt`](#stringifycaptions-array---string)
* [`resync`](#resynccaptions-array-time-number---object)
* [`toMS`](#tomstimestamp-string---number)
* [`toSrtTime`](#tosrttimetimestamp-number---string)
* [`toVttTime`](#tovtttimetimestamp-number---string)

### `parse(srt: String) -> Array`

Parses a SRT or WebVTT string and returns an array:

```js
parse(mySrtOrVttContent)
[
  {
    start: 20000, // time in ms
    end: 24400,
    text: 'Bla Bla Bla Bla'
  },
  {
    start: 24600,
    end: 27800,
    text: 'Bla Bla Bla Bla',
    settings: 'align:middle line:90%' // WebVTT only
  }
]
```

### `stringify(captions: Array) -> String`

The reverse of `parse`. It gets an array with subtitles and converts it to a valid SRT string.

The `stringifyVtt(captions: Array) -> String` function is also available for converting to a
valid WebVTT string.

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
    text: 'Bla Bla Bla Bla',
    settings: 'align:middle line:90%' // Ignored in SRT format
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

const vtt = stringifyVtt(subtitles)
// returns the following string:
/*
WEBVTT

1
00:00:20.000 --> 00:00:24.400
Bla Bla Bla Bla

2
00:00:24.600 --> 00:00:27.800 align:middle line:90%
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

Convert a SRT or WebVTT timestamp to milliseconds:

```js
toMS('00:00:24,400')
// 24400

toMS('00:24.400')
// 24400
```

### `toSrtTime(timestamp: Number) -> String`

Convert a time from milliseconds to a SRT timestamp:

```js
toSrtTime(24400)
// '00:00:24,400'
```


### `toVttTime(timestamp: Number) -> String`

Convert a time from milliseconds to a WebVTT timestamp:

```js
toVttTime(24400)
// '00:00:24.400'
```

## Tests

Subtitle.js uses Jest for tests.

If you want to run these tests, you need to install all devDependencies:

`npm install`

Now you can run the tests with the following command:

`npm test`

**Code Coverage**

You can check the code coverage by running the following command:

`npm run test:coverage`

Your report will be available in the `coverage` folder.

## License

MIT
