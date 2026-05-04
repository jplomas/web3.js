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

const { execFileSync } = require('child_process');
const { publishablePackages, releaseTag } = require('./packages');

const [baselineRef = 'v0.4.0', baselineVersion = '0.4.0'] = process.argv.slice(2);

const git = args =>
	execFileSync('git', args, {
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'pipe'],
	}).trim();

const refExists = ref => {
	try {
		git(['rev-parse', '--verify', '--quiet', ref]);
		return true;
	} catch {
		return false;
	}
};

const ensureBaselineRef = () => {
	if (refExists(`${baselineRef}^{commit}`)) return;
	console.error(`Cannot backfill package tags because ${baselineRef} is not available locally.`);
	process.exit(1);
};

const packages = publishablePackages();
const missing = packages.filter(pkg => !refExists(`refs/tags/${releaseTag(pkg)}`));

if (missing.length === 0) {
	console.info('Package release tags already exist; no backfill needed.');
	process.exit(0);
}

const wrongVersion = missing.filter(pkg => pkg.version !== baselineVersion);
if (wrongVersion.length > 0) {
	console.error(
		[
			`Refusing to backfill package tags from ${baselineRef}.`,
			`Missing tags are only bootstrapped for packages still at ${baselineVersion}:`,
			...wrongVersion.map(pkg => `- ${pkg.name}@${pkg.version}`),
		].join('\n')
	);
	process.exit(1);
}

ensureBaselineRef();

for (const pkg of missing) {
	const tag = releaseTag(pkg);
	git(['tag', tag, baselineRef]);
	console.info(`Backfilled ${tag} at ${baselineRef}`);
}
