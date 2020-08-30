import { toSrtTime } from './toSrtTime'
import { toVttTime } from './toVttTime'
import { Captions } from './types'

export interface StringifyOptions {
  format: 'srt' | 'vtt'
}

export function stringify(
  captions: Captions,
  options: StringifyOptions = { format: 'srt' }
): string {
  const isVTT = options.format === 'vtt'
  const formatTime = isVTT ? toVttTime : toSrtTime

  return (
    (isVTT ? 'WEBVTT\n\n' : '') +
    captions
      .map((caption, index) => {
        return (
          (index > 0 ? '\n' : '') +
          [
            index + 1,
            `${formatTime(caption.start)} --> ${formatTime(caption.end)}${
              isVTT && caption.settings ? ' ' + caption.settings : ''
            }`,
            caption.text
          ].join('\n')
        )
      })
      .join('\n') +
    '\n'
  )
}
