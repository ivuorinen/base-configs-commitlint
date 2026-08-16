"use strict";

/* eslint no-console: "off", no-undefined: "off" -- CLI app that gives users feedback */

const fs = require("node:fs");
const path = require("node:path");
// noinspection NpmUsedModulesInstalled
const process = require("node:process");

// npm/yarn set INIT_CWD to the consumer's project root during install. Default
// it to the current directory so this script and @ivuorinen/config-checker
// (which also reads INIT_CWD) do not crash when run outside an install.
process.env.INIT_CWD = process.env.INIT_CWD || process.cwd();

const checkConfig = require("@ivuorinen/config-checker");

const CONFIG_NAME = ".commitlintrc.json";

/**
 * Create the starter commitlint config in the consumer's project root, unless
 * the project already has one.
 *
 * Left to throw on purpose — the caller converts any failure into a warning.
 * Every filesystem call here can fail for reasons that are none of the
 * consumer's doing: a read-only project root in a container build, a
 * root-owned checkout installed into as a non-root user, a read-only shared
 * node_modules volume.
 */
function createStarterConfig() {
  const foundConfig = checkConfig("commitlint");

  if (foundConfig.length > 0) {
    console.log("commitlint-config: Found existing commitlint config file, skipping creation.");
    console.log("commitlint-config: If you want to create a new config file, please remove the existing one.");
    console.log(`commitlint-config: Found config files at: ${foundConfig.join(", ")}`);
    return;
  }

  const filePath = path.join(process.env.INIT_CWD, CONFIG_NAME);
  const fileConfigObject = {
    extends: ["@ivuorinen/commitlint-config"],
  };

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(fileConfigObject, undefined, 2));
  }
}

// Never rethrow. This runs as an npm `postinstall` lifecycle script, so an
// uncaught error fails the consumer's entire dependency install — creating an
// optional convenience file is not worth aborting an install over. Degrade to
// a warning that tells the user what to write by hand.
try {
  createStarterConfig();
} catch (error) {
  console.warn(`commitlint-config: could not create ${CONFIG_NAME}: ${error.message}`);
  console.warn(`commitlint-config: create it yourself with {"extends": ["@ivuorinen/commitlint-config"]}`);
}
