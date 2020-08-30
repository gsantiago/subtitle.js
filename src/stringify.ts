import { toSrtTime } from './toSrtTime'
import { Captions } from './types'

export function stringify(captions: Captions): string {
  return (
    captions
      .map((caption, index) => {
        return (
          (index > 0 ? '\n' : '') +
          [
            index + 1,
            `${toSrtTime(caption.start)} --> ${toSrtTime(caption.end)}`,
            caption.text
          ].join('\n')
        )
      })
      .join('\n') + '\n'
  )
}
