import fs from 'fs'
import path from 'path'
import { Readable } from 'stream'
import { NodeList, Node } from './src'

export const fixtures = [
  'LaLaLand',
  'ManOfSteel',
  'WonderWoman'
]

export const getFilePath = (filename: string, extension: string): string =>
  path.join(
    __dirname,
    `/test/fixtures/${filename}.${extension}`
  )

export const getFixture = (filename: string, extension: string): Promise<string> =>
  new Promise((resolve, reject) =>
    fs.readFile(getFilePath(filename, extension), 'utf8', (err, contents) => {
      if (err) reject(err)
      resolve(contents)
    })
  )

export const getFixtureStream = (filename: string, extension: string): Readable =>
  fs.createReadStream(getFilePath(filename, extension))

export const writeFile = (filename: string, contents: string) => {
  const filepath = path.join(
    __dirname,
    `/test/fixtures/${filename}`
  )

  fs.writeFileSync(filepath, contents)
}

export const createStreamFrom = (contents: any) => {
  const stream = new Readable({
    read() {}
  })

  stream.push(contents)
  stream.push(null)

  return stream
}

export const createStreamFromNodes = (nodes: NodeList) => {
  const stream = new Readable({ objectMode: true, read() {} })
  nodes.forEach(node => stream.push(node))
  stream.push(null)
  return stream
}

export const pipeline = (stream: Readable): Promise<NodeList> =>
  new Promise((resolve, reject) => {
    const buffer: NodeList = []
    stream.on('data', (chunk: Node) => buffer.push(chunk))
    stream.on('error', reject)
    stream.on('finish', () => resolve(buffer))
  })
