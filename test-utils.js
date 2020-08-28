import fs from 'fs'
import path from 'path'

export const fixtures = [
  'La.La.Land.2016.1080p.BluRay.x264-SPARKS.EN',
  'Man.Of.Steel.2013.720p.BluRay.x264.YIFI',
  'Wonder Woman 2017 (BluRay 1080p x265 10bit 7.1)_track3_eng'
]

export const getFixture = (filename, extension) => {
  const filepath = path.join(
    __dirname,
    `/test/fixtures/${filename}.${extension}`
  )

  return new Promise((resolve, reject) =>
    fs.readFile(filepath, 'utf8', (err, contents) => {
      if (err) reject(err)
      resolve(contents)
    })
  )
}
