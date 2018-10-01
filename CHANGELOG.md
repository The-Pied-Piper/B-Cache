# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
- Adding callback triggers when a Vertex's property is changed

## [0.2.8] - 2018-10-01
- Forgot to update changelog for previous releases, doing so now. No functional changes

## [0.2.7] - 2018-10-01
- Updating some dependency versions and tests only. No functional changes.

## [0.2.6] - 2018-10-01
### Fixed
- When the id for a vertex contained the '}' character the graph did not index it properly.


## [0.2.5] - 2018-03-07
### Fixed
- Bug where edges were not inherited from parent classes.

## [0.2.4] - 2018-03-06
### Changed
- Private property multipledges of class Edge renamed to multiEdges

### Fixed
- CHANGELOG date for [0.2.3] release from 2018-06-03 to 2018-03-06


## [0.2.3] - 2018-03-06
### Fixed
- A vertex type of '' (empty string) no longer results in type being undefined

### Added
- CHANGELOG.md file.
- types section to the package.json file so that typescript types are properly loaded.

### Changed
- Changed some wording in the README.md file for clarity
