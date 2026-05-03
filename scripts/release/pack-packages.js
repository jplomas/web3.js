#!/usr/bin/env node

const { mkdirSync, mkdtempSync, writeFileSync } = require('fs');
const { tmpdir } = require('os');
const { resolve } = require('path');
const { execFileSync } = require('child_process');

const { publishablePackages, releaseTag, tarballName } = require('./packages');

const [outputDirectory = 'dist'] = process.argv.slice(2);
const tarballDirectory = resolve(outputDirectory, 'tarballs');
const npmCache = process.env.npm_config_cache || mkdtempSync(resolve(tmpdir(), 'web3-pack-npm-cache-'));

mkdirSync(tarballDirectory, { recursive: true });

const releasedPackages = publishablePackages().map(pkg => ({
	...pkg,
	releaseTag: releaseTag(pkg),
	tarballName: tarballName(pkg),
}));

for (const pkg of releasedPackages) {
	console.log(`Packing ${pkg.name}@${pkg.version}`);
	execFileSync('npm', ['pack', '--pack-destination', tarballDirectory], {
		cwd: pkg.path,
		stdio: 'inherit',
		env: {
			...process.env,
			npm_config_audit: 'false',
			npm_config_fund: 'false',
			npm_config_ignore_scripts: 'true',
			npm_config_cache: npmCache,
		},
	});
}

const tsv = releasedPackages
	.map(pkg => [pkg.path, pkg.name, pkg.version, pkg.releaseTag, pkg.tarballName].join('\t'))
	.join('\n');

writeFileSync(resolve(outputDirectory, 'released-packages.tsv'), `${tsv}\n`);
writeFileSync(resolve(outputDirectory, 'released-packages.json'), `${JSON.stringify(releasedPackages, null, 2)}\n`);

console.log(`Packed ${releasedPackages.length} publishable packages into ${tarballDirectory}`);
