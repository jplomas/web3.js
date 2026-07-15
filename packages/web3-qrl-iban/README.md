# @theqrl/web3.js - IBAN

![ES Version](https://img.shields.io/badge/ES-2020-yellow)
![Node Version](https://img.shields.io/badge/node-%3E%3D20-green)
[![NPM Package](https://img.shields.io/npm/v/@theqrl/web3-qrl-iban)](https://www.npmjs.com/package/@theqrl/web3-qrl-iban)
[![Downloads](https://img.shields.io/npm/dm/@theqrl/web3-qrl-iban)](https://www.npmjs.com/package/@theqrl/web3-qrl-iban)

This is a sub-package of [@theqrl/web3.js](https://github.com/theqrl/web3.js).

`@theqrl/web3-qrl-iban` This package converts QRL addresses to IBAN addresses a vice versa.

> **⚠️ Deprecated.** The IBAN/ICAP namespace is deprecated and kept only for API
> compatibility, mirroring the deprecation of IBAN/ICAP in Ethereum web3.js.
> Direct address ↔ IBAN conversion is not feasible for 64-byte post-quantum QRL
> addresses (a 512-bit SHAKE-256 hash cannot round-trip through a ≤34-char IBAN),
> so `fromAddress` / `toAddress` / `toIban` throw. If this is ever revived, the
> intended approach is the standards-compliant **indirect** IBAN form — encoding
> a QRNS name that resolves to the address (via `@theqrl/web3-qrl-qrns`), not the
> raw address. See the `@deprecated` note on the `Iban` class for details.

## Installation

You can install the package either using [NPM](https://www.npmjs.com/package/@theqrl/web3-qrl-iban) or using [pnpm](https://pnpm.io/)

### Using NPM

```bash
npm install @theqrl/web3-qrl-iban
```

### Using pnpm

```bash
pnpm add @theqrl/web3-qrl-iban
```

## Getting Started

-   :writing_hand: If you have questions [submit an issue](https://github.com/theqrl/web3.js/issues/new) or join us on [Discord](https://theqrl.org/discord)
    ![Discord](https://img.shields.io/discord/357604137204056065.svg?label=Discord&logo=discord)

## Prerequisites

-   :gear: [NodeJS](https://nodejs.org/) (20 or newer)
-   :toolbox: [pnpm](https://pnpm.io/) and [Turbo](https://turbo.build/)

## Package.json Scripts

| Script           | Description                                        |
| ---------------- | -------------------------------------------------- |
| clean            | Uses `rimraf` to remove `dist/`                    |
| build            | Uses `tsc` to build package and dependent packages |
| lint             | Uses `eslint` to lint package                      |
| lint:fix         | Uses `eslint` to check and fix any warnings        |
| format           | Uses `prettier` to format the code                 |
| test             | Uses `jest` to run unit tests                      |
| test:integration | Uses `jest` to run tests under `/test/integration` |
| test:unit        | Uses `jest` to run tests under `/test/unit`        |

[docs]: https://docs.theqrl.org/
[repo]: https://github.com/theqrl/web3.js/tree/main/packages/web3-qrl-iban
[npm-image]: https://img.shields.io/github/package-json/v/theqrl/web3.js/main?filename=packages%2Fweb3-qrl-iban%2Fpackage.json
[npm-url]: https://npmjs.org/package/@theqrl/web3-qrl-iban
[downloads-image]: https://img.shields.io/npm/dm/@theqrl/web3-qrl-iban?label=npm%20downloads
