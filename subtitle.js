'use strict'

/**
 * Module dependencies.
 */

const toMS = require('./lib/toMS')
const toSrtTime = require('./lib/toSrtTime')
const parse = require('./lib/parse')
const stringify = require('./lib/stringify')
const resync = require('./lib/resync')

/**
 * Export modules.
 */

module.exports = {
  parse,
  stringify,
  resync,
  toMS,
  toSrtTime
}
