# subtitle

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

The API is minimal and provide only six pure functions:

* [`parse`](#parse)
* [`stringify`](#stringify)
* [`resync`](#resync)
* [`parseTimestamp`](#parseTimestamp)
* [`parseTimestamps`](#parseTimestamps)
* [`formatTimestamp`](#formatTimestamp)

### parse

- `parse(input: string): Caption[]`

It receives a string containing a SRT or VTT content and returns
an array of captions:

```ts
import { parse } from 'subtitle'
import fs from 'fs'

const input = fs.readFileSync('awesome-movie.srt', 'utf8')

parse(input)

// returns an array like this:
[
  {
    start: 20000, // milliseconds
    end: 24400,
    text: 'Bla Bla Bla Bla'
  },
  {
    start: 24600,
    end: 27800,
    text: 'Bla Bla Bla Bla',
    settings: 'align:middle line:90%'
  },
  // ...
]
```

### stringify

- `stringify(captions: Caption[], options?: { format: 'srt' | 'vtt }): string`

It receives an array of captions and returns a string in SRT (default), but it also supports VTT format through the options.

```ts
import { stringify } from 'subtitle'

stringify(captions)
// returns a string in SRT format

stringify(options, { format: 'vtt' })
// returns a string in VTT format
```

### resync

- `resync(captions: Caption[], time: number): Caption[]`

Resync all the given captions at once:

```ts
import { resync } from 'subtitle'

// Advance subtitles by 1s
const newCaptions = resync(captions, 1000)

// Delay 250ms
const newCaptions = resync(captions, -250)
```

### parseTimestamp

### parseTimestamps

### formatTimestamp

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

## License

MIT
