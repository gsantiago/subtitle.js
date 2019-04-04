# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.3] - 2019-04-04
### Added
- Add ESM module field to package.json

## [2.0.2] - 2019-01-22
### Added
- Support separated texts in subtitles #36

## [2.0.1] - 2018-10-24
### Added
- Support for WebVTT headers support #32

## [2.0.0] - 2018-06-22
### Changed
- Fix parsing of the text with the new line and whitespace at the end #25

## [1.2.0] - 2018-03-07
### Added
- `toVttTime` and `stringifyVtt` functions #24
### Changed
- Fix broken tests #21

## [1.1.1] - 2018-02-16
### Added
- Webpack instead of Browserify.
- Fix #18 and #19.
- ES2015 modules.

## [1.1.0] - 2018-02-15
### Added
- Support for both SRT and WebVTT input strings #21

## [1.0.1] - 2017-10-13
### Changed
- Fix parsing of 00:00:00,000 timestamp #17

## [1.0.0] - 2017-09-18
### Changed
- Almost everything. Subtitle.js has a new API now.
- Code rewritten to ES6.
- Tests improved.

## [0.1.5] - 2017-02-27
### Changed
- Ensure `text` is an empty string instead of `null` or `undefined`, #15

## [0.1.4] - 2017-02-27
### Changed
- Normalize extra newlines, #44

## [0.1.3] - 2017-01-11
### Added
- .npmignore
- .codeclimate.yml
- Additional tests.
- Code Coverage with coveralls.
- Changelog.

### Changed
- Use AVA and nyc instead of Mocha, Chai and Istanbul.
- Improve code organization.

## [0.1.2] - 2016-09-09
### Added
- [Standard](https://github.com/feross/standard).

### Changed
- Use NPM scripts instead of Make.
- Use `xtend` module instead of `underscore`.
- Change code style to [Standard](https://github.com/feross/standard) rules.

## [0.1.1] - 2016-01-12
### Changed
- Rename `stringfy` method to `stringify`.

## Old Versions
Old versions are undocumented.
