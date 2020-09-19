import { fixtures, getFixtureStream, getFixture, pipeline } from '../test-utils'
import { parse } from '../src'

test.each(fixtures)('parse SRT fixture: %s', async fixture => {
  const buffer = await pipeline(getFixtureStream(fixture, 'srt').pipe(parse()))
  const expected = JSON.parse(await getFixture(fixture, 'srt.json'))

  expect(buffer).toEqual(expected)
})

test.each(fixtures)('parse VTT fixture: %s', async fixture => {
  const buffer = await pipeline(getFixtureStream(fixture, 'vtt').pipe(parse()))
  const expected = JSON.parse(await getFixture(fixture, 'vtt.json'))

  expect(buffer).toEqual(expected)
})
