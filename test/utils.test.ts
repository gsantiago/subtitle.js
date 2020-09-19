import * as utils from '../src/utils'

test.each([
  [[1], '01'],
  [[50], '50'],
  [[123, 5], '00123']
])('padLeft with %j should return %s', (args, expected) => {
  const [value, length] = args
  expect(utils.padLeft(value, length)).toBe(expected)
})
