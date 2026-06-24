import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

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
