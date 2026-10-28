"use strict";

/* eslint no-console: "off", no-undefined: "off" -- CLI app that gives users feedback */

const { writeStarterConfig } = require("@ivuorinen/config-checker");

const CONFIG_NAME = ".commitlintrc.json";

// This runs as an npm `postinstall` lifecycle script, so an uncaught error fails
// the consumer's entire dependency install — creating an optional convenience
// file is not worth aborting an install over. writeStarterConfig never throws:
// it falls back to the working directory when INIT_CWD is unset, creates the
// file with "wx" so a config a concurrent install wrote is never clobbered, and
// returns a failed write for this script to report. Writes fail for reasons that
// are none of the consumer's doing: a read-only project root in a container
// build, a root-owned checkout installed into as a non-root user.
const result = writeStarterConfig(
  "commitlint",
  CONFIG_NAME,
  JSON.stringify({ extends: ["@ivuorinen/commitlint-config"] }, undefined, 2),
);

if (result.status === "found") {
  console.log("commitlint-config: Found existing commitlint config file, skipping creation.");
  console.log("commitlint-config: If you want to create a new config file, please remove the existing one.");
  console.log(`commitlint-config: Found config files at: ${result.found.join(", ")}`);
} else if (result.status === "failed") {
  console.warn(`commitlint-config: could not create ${CONFIG_NAME}: ${result.error.message}`);
  console.warn(`commitlint-config: create it yourself with {"extends": ["@ivuorinen/commitlint-config"]}`);
}
