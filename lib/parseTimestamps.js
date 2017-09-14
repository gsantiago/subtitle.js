/**
 * Module dependencies.
 */

const toMS = require('./toMS')

/**
 * Timestamp regex
 * @type {RegExp}
 */

const RE = /^(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})$/

/**
 * parseTimestamps
 * @param value
 * @returns {{start: Number, end: Number}}
 */

module.exports = function parseTimestamps (value) {
  const match = value.match(RE)
  return {
    start: toMS(match[1]),
    end: toMS(match[2])
  }
}
