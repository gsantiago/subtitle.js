// This file only tests the stream interface.
// `parse.test` contains the tests for the parsing logic.

import fs from 'fs'
import { read } from '../src/read'

test('read SRT content', done => {
  fs.createReadStream('./test/fixtures/LaLaLand.srt')
    .pipe(read())
    .on('data', _chunk => {
      // console.log(chunk)
    })
    .on('finish', done)
})
