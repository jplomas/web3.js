#!/usr/bin/env node

const { randomBytes } = require('crypto');
const { writeFileSync } = require('fs');
const { join } = require('path');

const { publishablePackages } = require('./packages');

const markerName = '.release-touch';
const marker = `${new Date().toISOString()}\n${randomBytes(16).toString('hex')}\n`;

for (const pkg of publishablePackages()) {
	writeFileSync(join(pkg.path, markerName), marker);
	console.info(`Touched ${pkg.name}`);
}
