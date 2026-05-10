#!/usr/bin/env node

/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/

const { existsSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const [version] = process.argv.slice(2);

if (!version) {
	console.error('Usage: set-package-version.js <version>');
	process.exit(1);
}

const manifestPath = join(process.cwd(), 'package.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

manifest.version = version;
writeFileSync(manifestPath, `${JSON.stringify(manifest, undefined, '\t')}\n`);

// Keep src/version.ts in sync with package.json. The release pipeline only
// updates package.json by default; any runtime accessor for the package
// version (e.g. Web3PkgInfo) lives in src/version.ts and would otherwise
// drift on every release.
const versionTsPath = join(process.cwd(), 'src', 'version.ts');
if (existsSync(versionTsPath)) {
	const original = readFileSync(versionTsPath, 'utf8');
	const versionLiteralPattern = /(version\s*:\s*)(['"])[^'"]*\2/;
	if (!versionLiteralPattern.test(original)) {
		console.error(
			`set-package-version: ${versionTsPath} exists but contains no \`version: '...'\` literal to update`,
		);
		process.exit(1);
	}
	const updated = original.replace(versionLiteralPattern, `$1$2${version}$2`);
	if (updated !== original) {
		writeFileSync(versionTsPath, updated);
	}
}
