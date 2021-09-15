/**
 * @public
 */
export interface Timestamp {
  start: number
  end: number
  settings?: string
}

/**
 * @public
 */
export interface Cue extends Timestamp {
  text: string
}

/**
 * @public
 */
export type Format = 'SRT' | 'WebVTT'

/**
 * @public
 */
export interface FormatOptions {
  format: Format
}

/**
 * @public
 */
export interface NodeHeader {
  type: 'header'
  data: string
}

/**
 * @public
 */
export interface NodeCue {
  type: 'cue'
  data: Cue
}

/**
 * @public
 */
export type Node = NodeHeader | NodeCue

/**
 * @public
 */
export type NodeList = Node[]

/**
 * @public
 */
export type SubtitleStream = {}
