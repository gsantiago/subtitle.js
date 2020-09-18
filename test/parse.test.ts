// This file only tests the stream interface.
// `parseSync.test` contains the tests for the parsing logic.

import fs from 'fs'
import { parse } from '../src'

test('read SRT content', done => {
  fs.createReadStream('./test/fixtures/LaLaLand.srt')
    .pipe(parse())
    .on('data', _chunk => {
      // console.log(chunk)
    })
    .on('finish', done)
})
