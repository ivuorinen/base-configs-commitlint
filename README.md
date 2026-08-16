# @ivuorinen/commitlint-config <!-- omit in toc -->

[![npm package][npm-badge]][npm-link] [![license MIT][license-badge]][license-link] [![ivuorinen's Code Style][style-badge]][style-link]

> ivuorinen's shareable configuration for [`CommitLint`][commitlint-link].

## Table of Contents <!-- omit in toc -->

- [Installation](#installation)
- [Configuration](#configuration)
- [Documentations](#documentations)
- [Dependency pins](#dependency-pins)
- [Contributing](#contributing)
- [Changelog](#changelog)
- [License](#license)

## Installation

Install `this config` and the commitlint CLI as _`devDependencies`_:

```sh
# npm
npm install @ivuorinen/commitlint-config @commitlint/cli --save-dev

# Yarn
yarn add @ivuorinen/commitlint-config @commitlint/cli --dev
```

`@commitlint/cli` is an optional peer dependency, so your own version wins instead of a second copy being installed alongside it.

After installing it, a _`.commitlintrc.json`_ file is created in the project's root folder with the configuration below — unless a
commitlint config already exists, in which case the existing one is left untouched. Install with `--ignore-scripts` to skip this
step entirely.

```json
{
  "extends": ["@ivuorinen/commitlint-config"]
}
```

## Configuration

Extends [`@commitlint/config-conventional`][config-conventional-link] with one override:

| Rule | This config | `@commitlint/config-conventional` |
| --- | --- | --- |
| `body-leading-blank` | `[2, "always"]` — error | `[1, "always"]` — warning |

A commit body that does not start with a blank line fails the lint here, where upstream only warns. Everything else is inherited unchanged.

Requires Node.js `>=22.12.0`, the floor set by commitlint 21.

## Documentations

Read the [CommitLint docs][commitlint-docs-link] for more information.

## Dependency pins

`resolutions` in _`package.json`_ pins transitive packages with published advisories. It is Yarn-specific and applies to this
repository's own install tree only — consumers of the published package resolve transitives themselves from the `dependencies`
ranges, so these pins are not a control that reaches them. The gate that does is the `osv-scanner` step in
_`.github/workflows/test.yml`_; check locally with:

```sh
osv-scanner scan source --lockfile=yarn.lock
```

Drop a pin once the fix is inside the range the direct dependency itself requires.

## Contributing

If you are interested in helping contribute, please take a look at our [contribution guidelines][contributing-link] and open an [issue][issue-link] or [pull request][pull-request-link].

## Changelog

See [CHANGELOG][changelog-link] for a human-readable history of changes.

## License

Distributed under the MIT License. See [LICENSE][license-link] for more information.

[changelog-link]: https://github.com/ivuorinen/base-configs-commitlint/releases
[commitlint-docs-link]: https://commitlint.js.org
[config-conventional-link]: https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional
[commitlint-link]: https://github.com/conventional-changelog/commitlint
[contributing-link]: https://github.com/ivuorinen/.github/blob/main/CONTRIBUTING.md
[issue-link]: https://github.com/ivuorinen/base-configs-commitlint/issues
[license-badge]: https://img.shields.io/github/license/ivuorinen/base-configs-commitlint?style=flat-square&labelColor=292a44&color=663399
[license-link]: ./LICENSE.md
[npm-badge]: https://img.shields.io/npm/v/@ivuorinen/commitlint-config?style=flat-square&labelColor=292a44&color=663399
[npm-link]: https://www.npmjs.com/package/@ivuorinen/commitlint-config
[pull-request-link]: https://github.com/ivuorinen/base-configs-commitlint/pulls
[style-badge]: https://img.shields.io/badge/code_style-ivuorinen%E2%80%99s-663399.svg?labelColor=292a44&style=flat-square
[style-link]: https://github.com/ivuorinen/base-configs-commitlint
