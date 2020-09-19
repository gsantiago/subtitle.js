import * as utils from '../test-utils'
import { parse } from '../src'

test.each(utils.fixtures)('parse SRT fixture: %s', async fixture => {
  const buffer = await utils.pipeline(
    utils.getFixtureStream(fixture, 'srt').pipe(parse())
  )
  const expected = JSON.parse(await utils.getFixture(fixture, 'srt.json'))

  expect(buffer).toEqual(expected)
})

test.each(utils.fixtures)('parse VTT fixture: %s', async fixture => {
  const buffer = await utils.pipeline(
    utils.getFixtureStream(fixture, 'vtt').pipe(parse())
  )
  const expected = JSON.parse(await utils.getFixture(fixture, 'vtt.json'))

  expect(buffer).toEqual(expected)
})

test('error handling', done => {
  const stream = utils.createStreamFromString(`
1
Foo Bar
{{ THIS IS A INVALID TIMESTAMP }}
`)

  stream.pipe(parse()).on('error', err => {
    expect(err).toEqual(
      new Error(`expected timestamp at row 2, but received: "Foo Bar"`)
    )
    done()
  })
})
