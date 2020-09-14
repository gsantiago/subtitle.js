import fs from 'fs'
import path from 'path'

export const fixtures = [
  'LaLaLand',
  'ManOfSteel',
  'WonderWoman'
]

export const getFixture = (filename: string, extension: string): Promise<string> => {
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

export const writeFile = (filename: string, contents: string) => {
  const filepath = path.join(
    __dirname,
    `/test/fixtures/${filename}`
  )

  fs.writeFileSync(filepath, contents)
}
