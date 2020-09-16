import { Duplex } from 'stream'
import { Cue, FormatOptions, formatTimestamp } from '.'

export const write = (options: FormatOptions) => {
  const isVTT = options.format === 'vtt'
  let index = 1
  let hasReceivedHeader = false

  return new Duplex({
    objectMode: true,
    write(chunk, _encoding, next) {
      if (chunk.type === 'header' && isVTT) {
        hasReceivedHeader = true
        this.push(`${chunk.data}\n\n`)
      }

      if (chunk.type === 'cue') {
        if (!hasReceivedHeader && isVTT) {
          hasReceivedHeader = true
          this.push('WEBVTT\n\n')
        }

        this.push(formatCue(chunk.data, index, options))

        index++
      }

      next()
    },
    read() {}
  })
}

const formatCue = (cue: Cue, index: number, options: FormatOptions) =>
  [
    `${index > 1 ? '\n' : ''}${index}`,
    `${formatTimestamp(cue.start, options)} --> ${formatTimestamp(
      cue.end,
      options
    )}${options.format === 'vtt' && cue.settings ? ' ' + cue.settings : ''}`,
    cue.text,
    ''
  ].join('\n')
