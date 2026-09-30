# Architecture Profile

Generated: 2026-09-25

Confidence: none — manual review required

## Detected Patterns

Detected: none.

No catalogued pattern reaches Low confidence. Structural evidence:

- Source is three files: `index.cjs` (extends `@commitlint/config-conventional`, one rule override), `wrapper.mjs`
  (ESM re-export of `index.cjs`) and `scripts/postinstall.cjs` (install-time starter-file writer).
- Import edges: `wrapper.mjs` → `./index.cjs`; `scripts/postinstall.cjs` → `@ivuorinen/config-checker` and Node
  built-ins. The config reaches `@commitlint/config-conventional` only as an `extends` string resolved by commitlint.
- `package.json` `exports` routes `.` (`import` → `wrapper.mjs`, `require`/`default` → `index.cjs`) and
  `./package.json`; `@commitlint/cli` is an optional peer.
- Tests in `test/` consume the package through its own name (self-reference) and a subprocess, not through relative
  imports.

Shape, for orientation (descriptive, not a catalogued pattern): shareable-config package — declarative data behind a
dual-format entry point, plus one install-time script with a side effect outside its own tree (`INIT_CWD`).

## Detected Combination

None.

## Inferred Structural Rules

None.

## Ambiguities & Contradictions

None.
