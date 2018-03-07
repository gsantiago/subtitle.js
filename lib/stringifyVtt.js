/**
 * Module dependencies.
 */

import toVttTime from './toVttTime'

/**
 * Stringify the given array of captions to WebVTT format.
 * @param {Array} captions
 * @return {String} webVtt
 */

export default function stringifyVtt (captions) {
  return 'WEBVTT\n\n' + captions.map((caption, index) => {
    return (index > 0 ? '\n' : '') + [
      index + 1,
      `${toVttTime(caption.start)} --> ${toVttTime(caption.end)}${caption.settings ? ' ' + caption.settings : ''}`,
      caption.text
    ].join('\n')
  }).join('\n') + '\n'
}
