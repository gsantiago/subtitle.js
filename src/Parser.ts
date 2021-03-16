import stripBom from 'strip-bom'
import { Node, RE_TIMESTAMP, parseTimestamps } from '.'

export type Pusher = (node: Node) => void

export interface ParseState {
  expect: 'header' | 'id' | 'timestamp' | 'text' | 'vtt_comment'
  row: number
  hasContentStarted: boolean
  isWebVTT: boolean
  node: Partial<Node>
  buffer: string[]
}

export class Parser {
  private push: Pusher
  private state: ParseState

  constructor({ push }: { push: Pusher }) {
    this.push = push
    this.state = {
      expect: 'header',
      row: 0,
      hasContentStarted: false,
      isWebVTT: false,
      node: {},
      buffer: []
    }
  }

  private isIndex(line: string): boolean {
    return /^\d+$/.test(line.trim())
  }

  private isTimestamp(line: string): boolean {
    return RE_TIMESTAMP.test(line)
  }

  private isVttComment(line: string): boolean {
    return /^NOTE/.test(line)
  }

  private getError(expected: string, index: number, row: string): Error {
    return new Error(
      `expected ${expected} at row ${index + 1}, but received: "${row}"`
    )
  }

  public parseLine(line: string): void {
    const contents = this.state.row === 0 ? stripBom(line) : line

    if (!this.state.hasContentStarted) {
      if (contents.trim()) {
        this.state.hasContentStarted = true
      } else {
        return
      }
    }

    const parse = {
      header: this.parseHeader,
      id: this.parseId,
      timestamp: this.parseTimestamp,
      text: this.parseText,
      vtt_comment: this.parseVttComment
    }[this.state.expect]

    parse.call(this, contents)

    this.state.row++
  }

  public flush(): void {
    if (this.state.buffer.length > 0) {
      this.pushNode()
    }
  }

  private parseHeader(line: string) {
    if (!this.state.isWebVTT) {
      this.state.isWebVTT = /^WEBVTT/.test(line)

      if (this.state.isWebVTT) {
        this.state.node.type = 'header'
      } else {
        this.parseId(line)
        return
      }
    }

    this.state.buffer.push(line)

    if (!line) {
      this.state.expect = 'id'
      return
    }
  }

  private parseId(line: string) {
    this.state.expect = 'timestamp'

    if (this.state.node.type === 'header') {
      this.pushNode()
    }

    if (this.isIndex(line)) return

    if (this.state.isWebVTT && this.isVttComment(line)) {
      this.state.expect = 'vtt_comment'
      return
    }

    this.parseTimestamp(line)
  }

  private parseVttComment(line: string) {
    this.state.expect = 'vtt_comment'

    if (line.trim() === '') {
      this.state.expect = 'id'
    }
  }

  private parseTimestamp(line: string) {
    if (!this.isTimestamp(line)) {
      throw this.getError('timestamp', this.state.row, line)
    }

    this.state.node = {
      type: 'cue',
      data: {
        ...parseTimestamps(line),
        text: ''
      }
    }

    this.state.expect = 'text'
  }

  private parseText(line: string) {
    if (this.state.buffer.length === 0) {
      this.state.buffer.push(line)
      return
    }

    if (this.isTimestamp(line)) {
      const lastIndex = this.state.buffer.length - 1

      if (this.isIndex(this.state.buffer[lastIndex])) {
        this.state.buffer.pop()
      }

      this.pushNode()
      this.parseTimestamp(line)
      return
    }

    if (this.isVttComment(line)) {
      this.pushNode()
      this.parseVttComment(line)
      return
    }

    this.state.buffer.push(line)
  }

  private pushNode(): void {
    if (this.state.node.type === 'cue') {
      while (true) {
        const lastItem = this.state.buffer[this.state.buffer.length - 1]
        if (['', '\n'].includes(lastItem)) {
          this.state.buffer.pop()
        } else {
          break
        }
      }

      while (true) {
        const firstItem = this.state.buffer[0]
        if (['', '\n'].includes(firstItem)) {
          this.state.buffer.shift()
        } else {
          break
        }
      }

      this.state.node.data!.text = this.state.buffer.join('\n')
    }

    if (this.state.node.type === 'header') {
      this.state.node.data = this.state.buffer.join('\n').trim()
    }

    this.push(this.state.node as Node)

    this.state.node = {}
    this.state.buffer = []
  }
}
