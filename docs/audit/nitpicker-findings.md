# Nitpicker Findings

Generated: 2026-06-25
Last validated: 2026-06-25

## Summary

- Total: 6 | Open: 1 | Fixed: 5 | Invalid: 0

## Open Findings

### Low

#### [NIT-5] No test verifies the package entry points resolve

Category: tests
Area: package.json:41-43 (no `test` script; no test files)
Problem: There is no test asserting that the package can be loaded via both `require()` and `import()`. The NIT-1 packaging bug would have been caught by a one-line resolution test.
Evidence: `git ls-files | grep -iE 'test|spec'` → none; `scripts` contains only `postinstall`.
Impact: Packaging/entry-point regressions ship undetected.
Fix: Add a minimal test (e.g. a `test` script running a node script that `require`s and dynamically `import`s the package and asserts `config.extends` is present), and wire it into CI.

## Fixed

### Pass 1 — 2026-06-25

#### [NIT-1] `exports.require` points to a non-existent `./index.js`

Fixed: 2026-06-25
Notes: Changed `package.json` `exports.require` from `./index.js` to `./index.cjs`. Verified a CJS `require("@ivuorinen/commitlint-config")` now resolves (previously `MODULE_NOT_FOUND`) and the ESM `import()` path still works.

#### [NIT-2] `postinstall` crashes when `INIT_CWD` is unset

Fixed: 2026-06-25
Notes: Root cause was deeper than first diagnosed — the crash originated in the `@ivuorinen/config-checker` dependency (`checkConfig("commitlint")` at line 10), which also reads `INIT_CWD`, before the script's own `path.join`. Fixed by normalizing `process.env.INIT_CWD = process.env.INIT_CWD || process.cwd()` at the top of the script, before `checkConfig` is called. Verified all three scenarios (no config / existing config / explicit INIT_CWD) now exit 0 without throwing.

#### [NIT-3] README license links target `./LICENSE`, but the file is `LICENSE.md`

Fixed: 2026-06-25
Notes: Updated `[license-link]: ./LICENSE` to `./LICENSE.md` (resolves the broken MIT badge link and License-section link).

#### [NIT-4] `.mega-linter.yml` references a non-existent `.eslintrc.json`

Fixed: 2026-06-25
Notes: Removed the dangling `JAVASCRIPT_ES_CONFIG_FILE` and `TYPESCRIPT_ES_CONFIG_FILE` lines that pointed at a missing `.eslintrc.json`; the JS/TS linters now use MegaLinter's bundled default config instead of referencing an absent file.

#### [NIT-6] `peerDependencies.typescript >=4` is spurious for a JSON config

Fixed: 2026-06-25
Notes: Removed the `peerDependencies` block (only the unused `typescript` peer). Left `@types/node` devDependency in place.

## Invalid
