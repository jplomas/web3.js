# @theqrl/web3

![ES Version](https://img.shields.io/badge/ES-2020-yellow)
![Node Version](https://img.shields.io/badge/node-%3E%3D20-green)
[![NPM Package](https://img.shields.io/npm/v/@theqrl/web3)](https://www.npmjs.com/package/@theqrl/web3)
[![Downloads](https://img.shields.io/npm/dy/@theqrl/web3)](https://www.npmjs.com/package/@theqrl/web3)

This is the main package of [QRL Web3.js](https://github.com/theQRL/web3.js).

`@theqrl/web3` contains the ideal setup for a QRL Web3.js package.

## Installation

Published releases will be available from [npm](https://www.npmjs.com/package/@theqrl/web3). After the first audited release:

```bash
npm install @theqrl/web3
```

```bash
pnpm add @theqrl/web3
```

## Getting Started

-   If you have questions [submit an issue](https://github.com/theQRL/web3.js/issues/new) or join us on [Discord](https://theqrl.org/discord).
    ![Discord](https://img.shields.io/discord/357604137204056065.svg?label=Discord&logo=discord)

## Prerequisites

-   [NodeJS](https://nodejs.org/) (20 or newer)
-   [pnpm](https://pnpm.io/) and [Turbo](https://turbo.build/)

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

## QRL Web3.js Packages

Use individual `@theqrl/*` packages where possible to keep applications lightweight. The full package list is maintained in the [repository README](https://github.com/theQRL/web3.js#architecture-overview).

[docs]: https://docs.theqrl.org/
[repo]: https://github.com/theQRL/web3.js/tree/main/packages/web3
[npm-image]: https://img.shields.io/github/package-json/v/theqrl/web3.js/main?filename=packages%2Fweb3%2Fpackage.json
[npm-url]: https://npmjs.org/package/@theqrl/web3
[downloads-image]: https://img.shields.io/npm/dm/@theqrl/web3?label=npm%20downloads
