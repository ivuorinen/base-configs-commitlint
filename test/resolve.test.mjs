import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";

// Resolve the package by its own name so the test exercises the published
// "exports" map (the CJS `require` and ESM `import` conditions), not the raw
// files. A broken entry — e.g. exports.require pointing at a missing file —
// fails here exactly as a real consumer would experience it.
const require = createRequire(import.meta.url);
const PKG = "@ivuorinen/commitlint-config";

function assertValidConfig(config, source) {
  assert.ok(config, `${source}: resolved to a falsy value`);
  assert.ok(Array.isArray(config.extends), `${source}: config.extends should be an array`);
  assert.ok(
    config.extends.includes("@commitlint/config-conventional"),
    `${source}: config should extend @commitlint/config-conventional`,
  );
  assert.ok(
    config.rules && typeof config.rules === "object",
    `${source}: config.rules should be an object`,
  );
}

test("CommonJS require() resolves the config", () => {
  assertValidConfig(require(PKG), "require()");
});

test("ESM import() resolves the config", async () => {
  const mod = await import(PKG);
  assertValidConfig(mod.default, "import() default");
});

test("CJS and ESM entry points return the same config", async () => {
  const cjs = require(PKG);
  const esm = (await import(PKG)).default;
  assert.deepEqual(esm, cjs, "ESM default export should equal the CJS export");
});

test("package.json is reachable through the exports map", () => {
  // `exports` makes a package strict about subpaths: anything not listed is
  // unreachable. Version-detection code reads this file, so it has to stay
  // exported — omitting it yields ERR_PACKAGE_PATH_NOT_EXPORTED, not ENOENT.
  assert.equal(require(`${PKG}/package.json`).name, PKG);
});

test("commitlint accepts the config and enforces body-leading-blank as an error", () => {
  // The shape assertions above cannot catch a rule name commitlint rejects or
  // a level that does not take effect. Run the real CLI the way a consumer
  // does: a body without a leading blank line must fail, not warn.
  const commitlint = require.resolve("@commitlint/cli/cli.js");

  const run = (message) =>
    execFileSync(process.execPath, [commitlint, "--config", ".commitlintrc.json"], {
      input: message,
      encoding: "utf8",
    });

  assert.doesNotThrow(() => run("feat: subject\n\nbody with leading blank line\n"));

  // assert.throws returns undefined, so capture the error to read its stdout.
  let failure;
  try {
    run("feat: subject\nbody without leading blank line\n");
  } catch (error) {
    failure = error;
  }

  assert.ok(failure, "a body without a leading blank line must fail the lint");
  assert.match(failure.stdout, /body-leading-blank/);
  assert.match(failure.stdout, /found 1 problems, 0 warnings/, "must be an error, not a warning");
});
