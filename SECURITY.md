# Security Policy

## Supported Versions

This fork is in pre-release cleanup for audit and subsequent release.

| Version | Supported |
| ------- | --------- |
| `main` / unreleased | Yes |
| Published packages before the first audited release | No |

After the first audited release, this table should be updated to list the
supported published release lines.

## Reporting a Vulnerability

Please report suspected vulnerabilities privately to `security@theqrl.org`.

Do not open a public GitHub issue, pull request, discussion, or social-media
thread for a suspected vulnerability. Public disclosure before a fix is
available can increase the risk to users and downstream projects.

Please include as much of the following as possible:

- Affected package name and version, commit, or branch.
- A clear description of the issue and its impact.
- Reproduction steps, proof-of-concept code, logs, or test cases.
- Any known prerequisites or affected environments.
- Whether the issue may affect published packages, `main`, or both.

The QRL team will triage private reports, coordinate fixes, and publish
security advisories or release notes when appropriate.

## Scope

This policy covers first-party code in this repository. Dependency security
issues should also be reported upstream to the affected dependency maintainers
when the issue is not caused by this repository's use of that dependency.

For the current audit-prep phase, generated build output, local `node_modules`
directories, local secrets files, and other ignored artefacts are not considered
first-party policy files.
