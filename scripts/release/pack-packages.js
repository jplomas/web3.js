#!/usr/bin/env node

const { mkdirSync, writeFileSync } = require('fs');
const { resolve } = require('path');
const { execFileSync } = require('child_process');

const { publishablePackages, releaseTag, tarballName } = require('./packages');

const [outputDirectory = 'dist'] = process.argv.slice(2);
const tarballDirectory = resolve(outputDirectory, 'tarballs');

mkdirSync(tarballDirectory, { recursive: true });

const releasedPackages = publishablePackages().map(pkg => ({
	...pkg,
	releaseTag: releaseTag(pkg),
	tarballName: tarballName(pkg),
}));

// `pnpm pack` (unlike `npm pack`) replaces the `workspace:` protocol on
// dependencies with the resolved version range, so the tarballs install
// cleanly under any package manager.
for (const pkg of releasedPackages) {
	console.log(`Packing ${pkg.name}@${pkg.version}`);
	execFileSync('pnpm', ['pack', '--pack-destination', tarballDirectory], {
		cwd: pkg.path,
		stdio: 'inherit',
	});
}

const tsv = releasedPackages
	.map(pkg => [pkg.path, pkg.name, pkg.version, pkg.releaseTag, pkg.tarballName].join('\t'))
	.join('\n');

writeFileSync(resolve(outputDirectory, 'released-packages.tsv'), `${tsv}\n`);
writeFileSync(resolve(outputDirectory, 'released-packages.json'), `${JSON.stringify(releasedPackages, null, 2)}\n`);

console.log(`Packed ${releasedPackages.length} publishable packages into ${tarballDirectory}`);
