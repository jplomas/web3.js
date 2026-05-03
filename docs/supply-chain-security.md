# Supply Chain Security

This repository uses pnpm 10 with a committed `pnpm-lock.yaml`. Dependency
changes must be reviewed as code changes because they affect the release
artefacts and the transitive code executed during docs, package, and test
builds.

## Install Policy

The workspace install policy is defined in `pnpm-workspace.yaml`:

- `minimumReleaseAge: 10080` prevents installing package versions published in
  the last seven days.
- `blockExoticSubdeps: true` blocks transitive dependencies that resolve through
  exotic specifiers.
- `strictDepBuilds: true` fails installs when dependencies have unreviewed build
  scripts.
- `allowBuilds` is the reviewed allowlist of dependencies whose install-time
  build scripts are expected for the current lockfile.

Do not widen `allowBuilds`, add pnpm overrides, or relax these settings without
explaining the reason in the pull request.

Known install warnings and the current remediation plan are tracked in
[`docs/dependency-warning-triage.md`](dependency-warning-triage.md).

## Audit Gate

The required local and CI audit command is:

```sh
pnpm run audit:supply-chain
```

This runs `pnpm audit --prod --audit-level high`. High and critical
vulnerabilities in the production dependency graph are release blockers unless a
maintainer documents why the affected dependency is unreachable and records a
time-bounded follow-up.

Development-only vulnerabilities are reviewed through Dependabot and the
Dependency Review workflow. If a development vulnerability can execute in CI,
release packaging, docs generation, or local developer install/build paths, it
must be treated as release-relevant even if it is not part of package runtime
dependencies.

## Pull Request Dependency Review

`.github/workflows/dependency-review.yml` runs GitHub's Dependency Review Action
on pull requests. It fails dependency changes that introduce high or critical
vulnerabilities in runtime, development, or unknown scopes.

Every pull request that changes `package.json`, `pnpm-lock.yaml`,
`pnpm-workspace.yaml`, `.npmrc`, workflow dependencies, or release tooling must
include:

- The reason for the dependency change.
- The relevant lockfile diff reviewed by a maintainer.
- The output of `pnpm install --frozen-lockfile --ignore-scripts`.
- The output of `pnpm run audit:supply-chain`.
- Any new build-script allowlist entries and why they are needed.

## Overrides

pnpm overrides are allowed only for narrow, documented security or compatibility
fixes. Prefer removing the override once the direct dependency has released a
compatible fixed version.

Current overrides:

- `@docusaurus/*@3.10.0` keeps the docs stack on the mature Docusaurus release
  line while `3.10.1` is still inside the seven-day release quarantine window.
- `baseline-browser-mapping@2.8.9` and `browserslist@4.26.3` keep browser
  target resolution on mature metadata while the newest browser mapping package
  is still inside the seven-day release quarantine window.
- `es-module-lexer@2.0.0` keeps webpack's lexer dependency on a mature
  version while `es-module-lexer@2.1.0` is still inside the seven-day release
  quarantine window.
- `express@4.21.2` keeps the Express 4 dependency line on mature transitive
  dependencies while `body-parser@1.20.5` is still inside the seven-day release
  quarantine window.
- `loader-runner@4.3.1` keeps webpack's loader runner dependency on a mature
  version while `loader-runner@4.3.2` is still inside the seven-day release
  quarantine window.
- `path-to-regexp@0.1.13` forces Express 4 transitive dependencies onto the
  patched version for GHSA-37ch-88jc-xwx2.
- `schema-utils@4>ajv@8.17.1` keeps modern schema validation dependencies on a
  mature Ajv 8 version while avoiding old loader stacks that require Ajv 6.
- `serialize-javascript@7.0.5` forces the Docusaurus/webpack transitive graph
  onto a patched version for GHSA-5c6j-r48x-rmvq.
- `socks@2.8.7` keeps npm registry proxy support on a mature transitive version
  while `socks@2.8.8` is still inside the seven-day release quarantine window.
- `webpack@5.105.4` keeps Docusaurus on a mature webpack version compatible
  with `webpackbar@6.0.1`; `webpack@5.106.x` validates progress-plugin options
  after webpackbar mutates them.
- `webpack-sources@3.3.3` keeps webpack on a mature source-map dependency while
  `webpack-sources@3.4.1` is still inside the seven-day release quarantine
  window.
