import { formatTimestamp } from './formatTimestamp'
import { Captions, FormatOptions } from './types'

export function stringify(
  captions: Captions,
  options: FormatOptions = { format: 'srt' }
): string {
  const isVTT = options.format === 'vtt'
  return (
    (isVTT ? 'WEBVTT\n\n' : '') +
    captions
      .map((caption, index) => {
        return (
          (index > 0 ? '\n' : '') +
          [
            index + 1,
            `${formatTimestamp(caption.start, options)} --> ${formatTimestamp(
              caption.end,
              options
            )}${isVTT && caption.settings ? ' ' + caption.settings : ''}`,
            caption.text
          ].join('\n')
        )
      })
      .join('\n') +
    '\n'
  )
}
