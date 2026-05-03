#!/usr/bin/env node

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const failures = [];

const excludedDirs = new Set(['.git', 'node_modules', '.pnpm-store', 'dist']);

const fail = message => failures.push(message);

const toPosix = value => value.split(path.sep).join('/');

function pathExists(relativePath) {
	return fs.existsSync(path.join(root, relativePath));
}

function trackedFiles() {
	try {
		const output = execFileSync('git', ['ls-files', '-z', '--cached'], {
			cwd: root,
			encoding: 'utf8',
		});

		return output
			.split('\0')
			.filter(Boolean)
			.filter(relativePath => pathExists(relativePath));
	} catch {
		fail('Unable to list tracked files with git');
		return [];
	}
}

function walk(relativeDir, visitor) {
	const absoluteDir = path.join(root, relativeDir);
	let entries;

	try {
		entries = fs.readdirSync(absoluteDir, { withFileTypes: true });
	} catch {
		fail(`Unable to read ${relativeDir || '.'}`);
		return;
	}

	for (const entry of entries) {
		if (excludedDirs.has(entry.name)) continue;

		const relativePath = path.join(relativeDir, entry.name);
		visitor(relativePath, entry);

		if (entry.isDirectory()) {
			walk(relativePath, visitor);
		}
	}
}

function checkTrackedForbiddenFiles() {
	const forbiddenExactPaths = new Set([
		'yarn.lock',
		'docs/yarn.lock',
		'packages/web3/test/cjs_black_box/.yarnrc',
		'packages/web3/test/cjs_black_box/yarn.lock',
		'packages/web3/test/esm_black_box/.yarnrc',
		'packages/web3/test/esm_black_box/yarn.lock',
		'packages/web3/test/fixtures/transactions copy.json',
	]);

	for (const relativePath of trackedFiles()) {
		const posixPath = toPosix(relativePath);
		const baseName = path.posix.basename(posixPath);

		if (forbiddenExactPaths.has(posixPath)) {
			fail(`${posixPath} must not be tracked`);
		}

		if (baseName === '.secrets.json') {
			fail(`${posixPath} must not be tracked`);
		}

		if (baseName === '.yarnrc' || baseName === 'yarn.lock') {
			fail(`${posixPath} is a Yarn artifact in a pnpm-managed repo`);
		}

		if (/(^|\/)coverage\//.test(posixPath)) {
			fail(`${posixPath} is generated coverage output and must not be tracked`);
		}

		if (/^packages\/[^/]+\/(lib|dist)\//.test(posixPath)) {
			fail(`${posixPath} is generated package output and must not be tracked`);
		}

		if (/ copy\.[^/]+$/.test(baseName)) {
			fail(`${posixPath} looks like an accidental copied file`);
		}
	}
}

function checkWorkspaceTree() {
	walk('', (relativePath, entry) => {
		const absolutePath = path.join(root, relativePath);
		const posixPath = toPosix(relativePath);
		const baseName = path.posix.basename(posixPath);

		if (baseName === '.secrets.json') {
			fail(`${posixPath} must not exist in the repository tree`);
		}

		if (baseName === '.yarnrc' || baseName === 'yarn.lock') {
			fail(`${posixPath} is a Yarn artifact in a pnpm-managed repo`);
		}

		if (/ copy\.[^/]+$/.test(baseName)) {
			fail(`${posixPath} looks like an accidental copied file`);
		}

		if (!entry.isSymbolicLink()) return;

		const target = fs.readlinkSync(absolutePath);
		const absoluteTarget = path.isAbsolute(target)
			? target
			: path.resolve(path.dirname(absolutePath), target);

		if (path.isAbsolute(target)) {
			fail(`${posixPath} must use a relative symlink target, not ${target}`);
		}

		const relativeTarget = path.relative(root, absoluteTarget);
		if (relativeTarget.startsWith('..') || path.isAbsolute(relativeTarget)) {
			fail(`${posixPath} points outside the repository -> ${target}`);
		}

		if (/\.eslint(ignore|rc)(\.|$)/.test(target)) {
			fail(`${posixPath} points at a removed ESLint legacy template -> ${target}`);
		}

		if (!fs.existsSync(absoluteTarget)) {
			fail(`${posixPath} is a broken symlink -> ${target}`);
		}
	});
}

checkTrackedForbiddenFiles();
checkWorkspaceTree();

if (failures.length > 0) {
	for (const message of failures) {
		console.error(`FAIL ${message}`);
	}
	process.exit(1);
}

console.info('Repository hygiene checks passed');
