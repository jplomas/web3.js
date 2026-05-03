# Symlink Template Policy

This repository uses symlinks to keep repeated package configuration and shared
test fixtures aligned across the pnpm workspace.

## Allowed Symlink Targets

Tracked symlinks may point to:

- Shared TypeScript configs under `config/`.
- Shared package templates under `templates/`.
- Shared local test fixtures under `scripts/` and `fixtures/`.
- Package-local shared fixture directories used by integration tests.

Symlinks must:

- Use relative targets.
- Resolve inside this repository.
- Resolve to an existing path.
- Avoid generated output directories such as `lib/`, `dist/`, `coverage/`, and
  docs build output.

## Removed Template Families

ESLint now uses root flat config via `eslint.config.cjs` and the shared config
package under `tools/eslint-config-base-web3`. Do not restore package-level
`.eslintrc*` or `.eslintignore` symlinks or templates.

## Enforcement

`pnpm run hygiene` enforces the symlink rules above. It fails on broken symlinks,
absolute symlink targets, symlinks that point outside the repository, and links
to removed ESLint legacy templates.

When adding a package, prefer linking to the existing shared configs/templates
rather than copying them. If a package needs to diverge from a shared template,
document why in the package README or the pull request.

