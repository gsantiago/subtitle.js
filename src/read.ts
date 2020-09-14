import readline, { Interface as ReadlineInterface } from 'readline'
import { Duplex } from 'stream'

import { parseTimestamps, RE_TIMESTAMP } from './parseTimestamps'
import { Caption } from './types'

export interface ParseState {
  expect: 'header' | 'id' | 'timestamp' | 'text'
  row: number
  hasContentStarted: boolean
  isWebVTT: boolean
  caption: Partial<Caption>
  buffer: string[]
  inputStream: ReadlineInterface
  outputStream: Duplex
}

export interface ParseObject {
  state: ParseState
  line: string
}

const isIndex = (str: string): boolean => /^\d+$/.test(str.trim())

const isTimestamp = (str: string): boolean => RE_TIMESTAMP.test(str)

const getError = (expected: string, index: number, row: string) => {
  return new Error(
    `expected ${expected} at row ${index + 1}, but received: "${row}"`
  )
}

export const read = (input: NodeJS.ReadableStream): Duplex => {
  const inputStream = readline.createInterface({
    input,
    crlfDelay: Infinity
  })

  const outputStream = new Duplex({
    objectMode: true,
    read() {}
  })

  const state: ParseState = {
    row: 0,
    hasContentStarted: false,
    isWebVTT: false,
    expect: 'header',
    caption: {},
    buffer: [],
    inputStream,
    outputStream
  }

  inputStream.on('line', line => {
    if (!state.hasContentStarted) {
      if (line.trim()) {
        state.hasContentStarted = true
      } else {
        return
      }
    }

    const parse = {
      header: parseHeader,
      id: parseId,
      timestamp: parseTimestamp,
      text: parseText
    }[state.expect]

    parse({ state, line })

    state.row++
  })

  inputStream.on('close', () => {
    if (state.buffer.length > 0) {
      pushCaption(state)
    }

    outputStream.emit('end')
  })

  return outputStream
}

const parseHeader = ({ line, state }: ParseObject) => {
  if (!state.isWebVTT) {
    state.isWebVTT = /^WEBVTT/.test(line)
    if (!state.isWebVTT) {
      parseId({ line, state })
      return
    }
  }

  if (!line) {
    state.expect = 'id'
    return
  }
}

const parseId = ({ state, line }: ParseObject) => {
  state.expect = 'timestamp'

  if (!isIndex(line)) {
    parseTimestamp({ state, line })
  }
}

const parseTimestamp = ({ line, state }: ParseObject) => {
  if (!isTimestamp(line)) {
    state.outputStream.emit('error', getError('timestamp', state.row, line))
    return
  }

  state.caption = {
    ...state.caption,
    ...parseTimestamps(line)
  }

  state.expect = 'text'
}

const parseText = ({ line, state }: ParseObject) => {
  if (state.buffer.length > 0 && isTimestamp(line)) {
    const lastIndex = state.buffer.length - 1

    if (isIndex(state.buffer[lastIndex])) {
      state.buffer.pop()
    }

    pushCaption(state)
    parseTimestamp({ line, state })
  } else {
    state.buffer.push(line)
  }
}

const pushCaption = (state: ParseState) => {
  while (true) {
    const lastItem = state.buffer[state.buffer.length - 1]
    if (['', '\n'].includes(lastItem)) {
      state.buffer.pop()
    } else {
      break
    }
  }

  while (true) {
    const firstItem = state.buffer[0]
    if (['', '\n'].includes(firstItem)) {
      state.buffer.shift()
    } else {
      break
    }
  }

  const text = state.buffer.join('\n')

  state.outputStream.push({
    ...state.caption,
    text
  })

  state.caption = {}
  state.buffer = []
}
