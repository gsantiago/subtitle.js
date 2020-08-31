import { parseTimestamps, RE_TIMESTAMP } from './parseTimestamps'
import { Captions, Caption } from './types'

interface State {
  expect: 'index' | 'timestamp' | 'text'
  caption: Caption
  captions: Captions
}

const normalize = (str: string) =>
  str
    .trim()
    .concat('\n')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^WEBVTT.*\n(?:.*: .*\n)*\n/, '')
    .split('\n')

const isIndex = (str: string): boolean => /^\d+$/.test(str.trim())

const isTimestamp = (str: string): boolean => RE_TIMESTAMP.test(str)

const throwError = (expected: string, index: number, row: string) => {
  throw new Error(
    `expected ${expected} at row ${index + 1}, but received ${row}`
  )
}

export function parse(input: string): Captions {
  const source = normalize(input)
  const state: State = {
    expect: 'index',
    caption: { start: 0, end: 0, text: '' },
    captions: []
  }

  source.forEach((row, index) => {
    if (state.expect === 'index') {
      state.expect = 'timestamp'
      if (isIndex(row)) {
        return
      }
    }

    if (state.expect === 'timestamp') {
      if (!isTimestamp(row)) {
        throwError('timestamp', index, row)
      }

      state.caption = {
        ...state.caption,
        ...parseTimestamps(row)
      }
      state.expect = 'text'
      return
    }

    if (state.expect === 'text') {
      if (isTimestamp(source[index + 1])) {
        state.expect = 'timestamp'
        state.captions.push(state.caption)
        state.caption = { start: 0, end: 0, text: '' }
        return
      }

      const isLastRow = index === source.length - 1
      const isNextRowCaption =
        isIndex(source[index + 1] || '') && isTimestamp(source[index + 2] || '')

      if (isLastRow || isNextRowCaption) {
        state.expect = 'index'
        state.captions.push(state.caption)
        state.caption = { start: 0, end: 0, text: '' }
      } else {
        state.caption.text = state.caption.text
          ? state.caption.text + '\n' + row
          : row
      }
    }
  })

  return state.captions
}
