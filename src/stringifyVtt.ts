import { toVttTime } from './toVttTime'
import { Captions } from './types'

export function stringifyVtt(captions: Captions): string {
  return (
    'WEBVTT\n\n' +
    captions
      .map((caption, index) => {
        return (
          (index > 0 ? '\n' : '') +
          [
            index + 1,
            `${toVttTime(caption.start)} --> ${toVttTime(caption.end)}${
              caption.settings ? ' ' + caption.settings : ''
            }`,
            caption.text
          ].join('\n')
        )
      })
      .join('\n') +
    '\n'
  )
}
