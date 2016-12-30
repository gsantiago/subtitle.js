/**
 * Dependencies.
 */

const fs = require('fs-promise')
const { join } = require('path')

/**
 * readFile helper.
 */

exports.readFile = file => {
  file = join(__dirname, file)
  return fs.readFile(file, 'utf8')
}
