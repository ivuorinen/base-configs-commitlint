---
id: deps-5f3eafa2
auditor: deps
severity: low
category: maintainability
area: package.json
status: open
found: 2026-10-27
location: package.json:64
location_sha: 1481ae7085077bc4
---

# conventionalcommits devDependency and <10 hold only hoist 9.x

## Problem

The conventional-changelog-conventionalcommits ^9.3.1 devDependency, and the Renovate hold that keeps it below 10, exist
so that 9.x is hoisted to the root of this repository's tree, where the published @ivuorinen/semantic-release-config's
plugins resolve their preset by name.

## Evidence

This repository releases with @ivuorinen/semantic-release-config 3.0.9 from its lockfile, which still passes `preset:
"conventionalcommits"`; without the devDependency the root copy is the 10.x that @commitlint/config-conventional depends
on and generateNotes fails. base-configs-semantic-release f9b6c8b loads the preset by path, which makes the root copy
irrelevant, but it is not published yet.

## Impact

A workaround to maintain until removed.

## Fix

After semantic-release-config publishes f9b6c8b: raise the `@ivuorinen/semantic-release-config` devDependency to that
version, drop this devDependency and its Renovate hold, and confirm release notes still render in this tree.
