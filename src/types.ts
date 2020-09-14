export interface Timestamp {
  start: number
  end: number
  settings?: string
}

export interface Cue extends Timestamp {
  text: string
}

export interface FormatOptions {
  format: 'srt' | 'vtt'
}

export interface NodeHeader {
  type: 'header'
  data: string
}

export interface NodeCue {
  type: 'cue'
  data: Cue
}

export type Node = NodeHeader | NodeCue

export type Tree = Node[]
