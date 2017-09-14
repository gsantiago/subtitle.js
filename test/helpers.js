const fs = require('fs-promise')
const { join } = require('path')

exports.readFile = file => {
  file = join(__dirname, file)
  return fs.readFile(file, 'utf8')
}
