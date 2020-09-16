import { Cue, Node, FormatOptions, formatTimestamp, map } from '.'

export const write = (options: FormatOptions) => {
  const isVTT = options.format === 'vtt'
  let hasReceivedHeader = false
  let index = 1

  return map((chunk: Node) => {
    let buffer = ''

    if (chunk.type === 'header' && isVTT) {
      hasReceivedHeader = true
      buffer += `${chunk.data}\n\n`
    }

    if (chunk.type === 'cue') {
      if (!hasReceivedHeader && isVTT) {
        hasReceivedHeader = true
        buffer += 'WEBVTT\n\n'
      }

      buffer += formatCue(chunk.data, index++, options)
    }

    return buffer
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
