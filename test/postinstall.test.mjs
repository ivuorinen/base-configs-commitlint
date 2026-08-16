import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Drive the script as a real subprocess against a real directory. The whole
// point of this file is the filesystem behaviour a consumer's `npm install`
// triggers, so mocking fs would test nothing that can actually break.
const SCRIPT = fileURLToPath(new URL("../scripts/postinstall.cjs", import.meta.url));
const CONFIG_NAME = ".commitlintrc.json";

/** Fresh temp directory standing in for a consumer's project root. */
function tempRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "commitlint-config-"));
}

/** Run the postinstall script as npm would, with INIT_CWD pointing at `cwd`. */
function run(cwd) {
  return execFileSync(process.execPath, [SCRIPT], {
    env: { ...process.env, INIT_CWD: cwd },
    encoding: "utf8",
  });
}

test("writes .commitlintrc.json when the project has no commitlint config", () => {
  const root = tempRoot();

  run(root);

  const written = JSON.parse(fs.readFileSync(path.join(root, CONFIG_NAME), "utf8"));
  assert.deepEqual(written, { extends: ["@ivuorinen/commitlint-config"] });
});

test("leaves an existing config untouched", () => {
  const root = tempRoot();
  const existing = path.join(root, CONFIG_NAME);
  const original = '{"extends":["mine"]}';
  fs.writeFileSync(existing, original);

  const output = run(root);

  assert.equal(fs.readFileSync(existing, "utf8"), original, "existing config must not be rewritten");
  assert.match(output, /skipping creation/, "the skip must be reported to the user");
});

test("does not fail the install when the config cannot be written", () => {
  // Regression guard: an uncaught write error here aborts the consumer's
  // entire `npm install`, not just the config creation.
  //
  // The unwritable root is modelled with a regular file rather than a 0555
  // directory. A permission-based guard only holds for an unprivileged user —
  // root bypasses the check via CAP_DAC_OVERRIDE and would create the file,
  // failing the assertion below in any root container. ENOTDIR comes from path
  // resolution, so it holds at every uid.
  const root = path.join(tempRoot(), "not-a-directory");
  fs.writeFileSync(root, "");

  try {
    assert.doesNotThrow(() => run(root));
    assert.equal(fs.existsSync(path.join(root, CONFIG_NAME)), false);
  } finally {
    fs.unlinkSync(root);
  }
});
