import { Duplex } from 'stream'
import multipipe from 'multipipe'
import split2 from 'split2'
import stripBom from 'strip-bom'
import { parseTimestamps, RE_TIMESTAMP, Node } from '.'
import { createDuplex } from './utils'

export interface ParseState {
  expect: 'header' | 'id' | 'timestamp' | 'text'
  row: number
  hasContentStarted: boolean
  isWebVTT: boolean
  node: Partial<Node>
  buffer: string[]
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

export const read = (): Duplex => {
  const stream = createDuplex({
    write(chunk, _encoding, next) {
      const chunkString = chunk.toString()
      const line = state.row === 0 ? stripBom(chunkString) : chunkString

      if (!state.hasContentStarted) {
        if (line.trim()) {
          state.hasContentStarted = true
        } else {
          return next()
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

      next()
    }
  })

  const state: ParseState = {
    row: 0,
    hasContentStarted: false,
    isWebVTT: false,
    expect: 'header',
    node: {},
    buffer: [],
    outputStream: stream
  }

  const splitStream = split2()

  const outputStream = multipipe(splitStream, stream, {
    objectMode: true
  })

  splitStream.on('finish', () => {
    if (state.buffer.length > 0) {
      pushNode(state)
    }

    stream.push(null)
  })

  return outputStream
}

const parseHeader = ({ line, state }: ParseObject) => {
  if (!state.isWebVTT) {
    state.isWebVTT = /^WEBVTT/.test(line)

    if (state.isWebVTT) {
      state.node.type = 'header'
    } else {
      parseId({ line, state })
      return
    }
  }

  state.buffer.push(line)

  if (!line) {
    state.expect = 'id'
    return
  }
}

const parseId = ({ state, line }: ParseObject) => {
  state.expect = 'timestamp'

  if (state.node.type === 'header') {
    pushNode(state)
  }

  if (!isIndex(line)) {
    parseTimestamp({ state, line })
  }
}

const parseTimestamp = ({ line, state }: ParseObject) => {
  if (!isTimestamp(line)) {
    state.outputStream.emit('error', getError('timestamp', state.row, line))
    return
  }

  state.node = {
    type: 'cue',
    data: {
      ...parseTimestamps(line),
      text: ''
    }
  }

  state.expect = 'text'
}

const parseText = ({ line, state }: ParseObject) => {
  if (state.buffer.length > 0 && isTimestamp(line)) {
    const lastIndex = state.buffer.length - 1

    if (isIndex(state.buffer[lastIndex])) {
      state.buffer.pop()
    }

    pushNode(state)
    parseTimestamp({ line, state })
  } else {
    state.buffer.push(line)
  }
}

const pushNode = (state: ParseState) => {
  if (state.node.type === 'cue') {
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

    state.node.data!.text = state.buffer.join('\n')
  }

  if (state.node.type === 'header') {
    state.node.data = state.buffer.join('\n').trim()
  }

  state.outputStream.push(state.node)

  state.node = {}
  state.buffer = []
}
