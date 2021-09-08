const base = require('@dcl/dcl-rollup/libs.config')
const builtins = require('rollup-plugin-node-builtins')
const commonjs = require('@rollup/plugin-commonjs')

base.default.plugins.push(
  commonjs({
    ignoreGlobal: true,
    include: [/node_modules/],
  })
)
base.default.plugins.push(builtins({ fs: false, crypto: false }))

module.exports = base.default
