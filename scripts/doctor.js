#!/usr/bin/env node

const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const failures = [];
const warnings = [];

const expectedNodeRange = '>=20';
const expectedPackageManager = 'pnpm@10.27.0';
const expectedPnpmMajor = '10.';

const isWindows = process.platform === 'win32';
const localBin = name => path.join(root, 'node_modules', '.bin', `${name}${isWindows ? '.cmd' : ''}`);

const fail = message => failures.push(message);
const warn = message => warnings.push(message);

const exists = relativePath => fs.existsSync(path.join(root, relativePath));
const readText = relativePath => fs.readFileSync(path.join(root, relativePath), 'utf8');
const readJson = relativePath => JSON.parse(readText(relativePath));

function run(command, args, options = {}) {
	return spawnSync(command, args, {
		cwd: root,
		encoding: 'utf8',
		shell: false,
		...options,
	});
}

function checkCommand(command, args, label, required = true) {
	const result = run(command, args);
	if (result.status === 0) return result.stdout.trim();

	const message = `${label} is unavailable or failed to run`;
	if (required) fail(message);
	else warn(message);
	return '';
}

function listPackageJsonFiles() {
	try {
		return Array.from(
			new Set(
				execFileSync(
					'git',
					[
						'ls-files',
						'package.json',
						'packages/*/package.json',
						'tools/*/package.json',
						'docs/package.json',
						'packages/web3/test/*_black_box/package.json',
					],
					{ cwd: root, encoding: 'utf8' },
				)
					.trim()
					.split('\n')
					.filter(Boolean),
			),
		);
	} catch (error) {
		fail('Unable to list package manifests with git');
		return [];
	}
}

const nodeMajor = Number(process.versions.node.split('.')[0]);
if (!Number.isInteger(nodeMajor) || nodeMajor < 20) {
	fail(`Node ${process.versions.node} does not satisfy ${expectedNodeRange}`);
}

const rootPackage = readJson('package.json');
if (rootPackage.packageManager !== expectedPackageManager) {
	fail(`Root packageManager must be ${expectedPackageManager}`);
}

if (!rootPackage.engines || rootPackage.engines.node !== expectedNodeRange) {
	fail(`Root package.json must declare engines.node as ${expectedNodeRange}`);
}

if (!rootPackage.engines || rootPackage.engines.pnpm !== '>=10.27.0') {
	fail('Root package.json must declare engines.pnpm as >=10.27.0');
}

const pnpmVersion = checkCommand('pnpm', ['--version'], 'pnpm');
if (pnpmVersion && !pnpmVersion.startsWith(expectedPnpmMajor)) {
	fail(`pnpm ${pnpmVersion} is not pnpm 10.x`);
}

if (!exists('pnpm-workspace.yaml')) {
	fail('Missing pnpm-workspace.yaml');
} else {
	const workspaceYaml = readText('pnpm-workspace.yaml');
	for (const required of ['linkWorkspacePackages: true', 'nodeLinker: hoisted']) {
		if (!workspaceYaml.includes(required)) fail(`pnpm-workspace.yaml must include ${required}`);
	}
}

if (!exists('.npmrc')) {
	fail('Missing .npmrc');
} else {
	const npmrc = readText('.npmrc');
	for (const required of ['engine-strict=true']) {
		if (!npmrc.includes(required)) fail(`.npmrc must include ${required}`);
	}
}

if (!exists('pnpm-lock.yaml')) {
	fail('Missing root pnpm-lock.yaml');
}

for (const unsupportedLockfile of ['package-lock.json', 'yarn.lock', 'docs/yarn.lock']) {
	if (exists(unsupportedLockfile)) fail(`${unsupportedLockfile} is unsupported in this pnpm-managed repo`);
}

for (const lockfile of [
	'packages/web3/test/cjs_black_box/yarn.lock',
	'packages/web3/test/esm_black_box/yarn.lock',
	'packages/web3/test/cjs_black_box/pnpm-lock.yaml',
	'packages/web3/test/esm_black_box/pnpm-lock.yaml',
]) {
	if (exists(lockfile)) {
		fail(`${lockfile} should be generated during black-box tests, not committed`);
	}
}

for (const manifestPath of listPackageJsonFiles()) {
	const manifest = readJson(manifestPath);
	if (!manifest.engines || manifest.engines.node !== expectedNodeRange) {
		fail(`${manifestPath} must declare engines.node as ${expectedNodeRange}`);
	}
	if (manifest.engines && Object.prototype.hasOwnProperty.call(manifest.engines, 'npm')) {
		fail(`${manifestPath} still declares an npm engine`);
	}
}

for (const [name, args] of [
	['turbo', ['--version']],
	['eslint', ['--version']],
	['tsc', ['--version']],
	['jest', ['--version']],
]) {
	if (!fs.existsSync(localBin(name))) {
		fail(`Missing local ${name}; run pnpm install --frozen-lockfile`);
		continue;
	}
	checkCommand('pnpm', ['exec', name, ...args], name);
}

checkCommand('git', ['--version'], 'git');
checkCommand('bash', ['--version'], 'bash');
checkCommand('curl', ['--version'], 'curl', false);
checkCommand('docker', ['--version'], 'docker', false);

for (const message of warnings) {
	console.warn(`WARN ${message}`);
}

if (failures.length > 0) {
	for (const message of failures) {
		console.error(`FAIL ${message}`);
	}
	process.exit(1);
}

console.log('Environment checks passed');
