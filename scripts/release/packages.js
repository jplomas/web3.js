#!/usr/bin/env node

const { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } = require('fs');
const { dirname, join } = require('path');

const workspaceRoots = ['packages', 'tools'];

const readJson = filePath => JSON.parse(readFileSync(filePath, 'utf8'));

const packageDirectories = () =>
	workspaceRoots.flatMap(root => {
		if (!existsSync(root)) return [];
		return readdirSync(root, { withFileTypes: true })
			.filter(entry => entry.isDirectory())
			.map(entry => join(root, entry.name))
			.filter(packagePath => existsSync(join(packagePath, 'package.json')));
	});

const publishablePackages = () =>
	packageDirectories()
		.map(packagePath => {
			const manifest = readJson(join(packagePath, 'package.json'));
			return {
				path: packagePath,
				name: manifest.name,
				version: manifest.version,
				private: manifest.private === true,
				access: manifest.publishConfig?.access,
			};
		})
		.filter(pkg => pkg.name && pkg.version && !pkg.private && pkg.access === 'public')
		.sort((a, b) => a.name.localeCompare(b.name));

const releaseTag = pkg => `${pkg.name}@${pkg.version}`;

const tarballName = pkg => `${pkg.name.replace(/^@/, '').replace('/', '-')}-${pkg.version}.tgz`;

const ensureParentDirectory = filePath => mkdirSync(dirname(filePath), { recursive: true });

const writeJson = (filePath, value) => {
	ensureParentDirectory(filePath);
	writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
};

const writeGithubOutput = values => {
	const outputPath = process.env.GITHUB_OUTPUT;
	if (!outputPath) return;
	const lines = Object.entries(values).map(([key, value]) => `${key}=${value}`);
	writeFileSync(outputPath, `${lines.join('\n')}\n`, { flag: 'a' });
};

const snapshot = outputPath => {
	writeJson(outputPath, publishablePackages());
};

const diff = (beforePath, outputPath) => {
	const before = new Map(readJson(beforePath).map(pkg => [pkg.name, pkg.version]));
	const released = publishablePackages()
		.filter(pkg => before.get(pkg.name) !== pkg.version)
		.map(pkg => ({
			...pkg,
			releaseTag: releaseTag(pkg),
			tarballName: tarballName(pkg),
		}));

	writeJson(outputPath, released);

	const tsvPath = join(dirname(outputPath), 'released-packages.tsv');
	const tsv = released
		.map(pkg => [pkg.path, pkg.name, pkg.version, pkg.releaseTag, pkg.tarballName].join('\t'))
		.join('\n');
	writeFileSync(tsvPath, tsv ? `${tsv}\n` : '');

	writeGithubOutput({
		released: released.length > 0 ? 'true' : 'false',
		count: String(released.length),
		packages: released.map(pkg => pkg.name).join(','),
	});
};

if (require.main === module) {
	const [command, firstArg, secondArg] = process.argv.slice(2);

	if (command === 'snapshot' && firstArg) {
		snapshot(firstArg);
	} else if (command === 'diff' && firstArg && secondArg) {
		diff(firstArg, secondArg);
	} else if (command === 'list') {
		for (const pkg of publishablePackages()) {
			console.log(`${pkg.path}\t${pkg.name}\t${pkg.version}`);
		}
	} else {
		console.error('Usage: packages.js <snapshot output.json | diff before.json output.json | list>');
		process.exitCode = 1;
	}
}

module.exports = {
	publishablePackages,
	releaseTag,
	tarballName,
};
