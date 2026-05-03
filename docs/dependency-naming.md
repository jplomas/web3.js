# Dependency Naming

This document records decisions about externally named dependencies whose
package names may not match QRL branding.

## Policy

Do not keep a dependency solely because it was inherited from upstream web3.js.
For each dependency with externally specific naming:

- Remove it if it is unused.
- Keep it when it provides a protocol-compatible primitive with no lower-risk
  QRL-maintained replacement in the current codebase.
- Document why the name remains acceptable and what would need to be true before
  replacing it.

## Current Decisions

### `@ethereumjs/rlp`

Keep `@ethereumjs/rlp` as a runtime dependency of `@theqrl/web3-qrl-accounts`.

Reasons:

- QRL typed transaction serialization currently uses RLP for transaction payload
  encoding and decoding.
- `packages/web3-qrl-accounts/src/tx/eip1559Transaction.ts` imports
  `@ethereumjs/rlp` directly for `RLP.decode` and `RLP.encode`.
- The dependency is small, focused on the RLP codec, and does not imply that the
  public package remains Ethereum-branded.
- Replacing it would require an audited alternative RLP codec or a local
  implementation with fixture coverage for signed and unsigned transaction
  serialization.

`@ethereumjs/rlp` was removed from `@theqrl/web3-qrl-abi` because that package
does not import it directly.

### `ethereum-cryptography`

Remove `ethereum-cryptography` as a direct dependency of
`@theqrl/web3-qrl-abi`.

Reasons:

- No source or test file imports it directly.
- QRL hashing/signing code now uses QRL-owned wrappers such as
  `@theqrl/qrl-cryptography` and package-local wallet helpers.
- Keeping an unused Ethereum-named direct dependency would make package review
  noisier without providing runtime value.

It may still appear transitively in the lockfile through third-party
dependencies. Those transitive appearances are tracked through the lockfile and
supply-chain audit process rather than first-party branding cleanup.

