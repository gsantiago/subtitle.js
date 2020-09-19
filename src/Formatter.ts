import { FormatOptions, Node, Cue, formatTimestamp } from '.'

export class Formatter {
  private options: FormatOptions
  private isVTT: boolean
  private hasReceivedHeader: boolean
  private index: number

  constructor(options: FormatOptions) {
    this.options = options
    this.hasReceivedHeader = false
    this.isVTT = options.format === 'WebVTT'
    this.index = 1
  }

  public format(node: Node): string {
    let buffer = ''

    if (node.type === 'header' && this.isVTT) {
      this.hasReceivedHeader = true
      buffer += `${node.data}\n\n`
    }

    if (node.type === 'cue') {
      if (!this.hasReceivedHeader && this.isVTT) {
        this.hasReceivedHeader = true
        buffer += 'WEBVTT\n\n'
      }

      buffer += this.formatCue(node.data, this.index++, this.options)
    }

    return buffer
  }

  private formatCue(cue: Cue, index: number, options: FormatOptions) {
    return [
      `${index > 1 ? '\n' : ''}${index}`,
      `${formatTimestamp(cue.start, options)} --> ${formatTimestamp(
        cue.end,
        options
      )}${
        options.format === 'WebVTT' && cue.settings ? ' ' + cue.settings : ''
      }`,
      cue.text,
      ''
    ].join('\n')
  }
}
