# Upstream Reference Triage

This document records the current review of inherited upstream, Ethereum, and
Zond references. It is intended to distinguish stale branding from references
that remain technically useful for QRL compatibility work.

## Current Decision

The repository should not use upstream Ethereum service names, ChainSafe
branding, `web3-eth`, or `web3-zond` package names in first-party docs,
metadata, or release paths.

The following references are acceptable when they include QRL context:

- `zond` as the QRL hardfork identifier used by runtime config, schemas, and
  tests.
- EIP links and Ethereum execution API links when the QRL JSON-RPC surface is
  explicitly based on or compatible with those specifications.
- `Ethereum-Contract-ABI` links where documenting the inherited ABI format or
  the ethers-derived ABI coder.
- Sepolia references inside inherited `Common` hardfork tests until those test
  fixtures are replaced with QRL-only equivalents.

## Cleanup Completed

- Removed stale `web3-zond*` cleanup paths from `scripts/clean.sh`.
- Removed a stale `packages/web3-zond-accounts` source-link comment.
- Reworded provider-specific comments that named Infura or Ganache where the
  exact provider was not important.

## Follow-Up

- Replace inherited Sepolia/Common fixture tests with QRL-native fixtures when
  the account/common compatibility layer is refactored.
- Keep dependency-name decisions for `@ethereumjs/rlp` and
  `ethereum-cryptography` in
  [`docs/dependency-naming.md`](dependency-naming.md).
