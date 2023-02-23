# Change Log

## [Unreleased]

## [0.0.7] - 2023-02-23

### Added

* combine local CSS with CSS from `@veramo-community/react-components`
* support for `did:3`
* support for `did:key`
* support for `did:pkh`
* support for `JSON-LD` credentials
* code lens shows issuer did

### Changed

* renamed some config item names, added descriptions
* using `yaml` to display credential verification results
* did resolution hover uses `yaml` to display resolution result
* upgrade to `@veramo/*@5.0.0`
* use `pnpm`
* switch to ESM

### Fixed

* status bar item edge cases


## [0.0.6] - 2023-01-17

### Added

* support for `yaml` credentials
* sign markdown files using front matter


## [0.0.5] - 2023-01-16

### Added

* Rendering Verifiable Credentials using [@veramo-community/react-components](https://github.com/veramolabs/react-components) 
* examples from IIW35
* hover over didUrl to get resolution result
* verified status bar item
* did url decorator
* codeLens provider for markdown code blocks
* remote instance
* show did in status bar
* sign credential
* sign credential in a selection
* sign any file and store VCs in context dir

### Changed

* Upgrade to `@veramo/*@4.2.0`

## [0.0.4] - 2022-11-04

### Added
* ability to verify full credentials (not just the JWT part)

## [0.0.2] - 2022-05-04

### Added

* ability to preview and verify `vc+jwt` code blocks in markdown files
* ability to resolve DIDs

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.