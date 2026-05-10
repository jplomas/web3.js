#!/usr/bin/env node

const { publishablePackages } = require('./packages');

const REGISTRY = process.env.npm_config_registry || 'https://registry.npmjs.org';

const cmpSemver = (a, b) => {
	const parts = s =>
		s.split(/[.\-+]/).map(p => (Number.isFinite(Number(p)) ? Number(p) : p));
	const pa = parts(a);
	const pb = parts(b);
	for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
		if (pa[i] === pb[i]) continue;
		if (pa[i] === undefined) return -1;
		if (pb[i] === undefined) return 1;
		if (typeof pa[i] !== typeof pb[i]) return typeof pa[i] === 'number' ? -1 : 1;
		return pa[i] < pb[i] ? -1 : 1;
	}
	return 0;
};

const fetchPublished = async name => {
	const url = `${REGISTRY}/${encodeURIComponent(name).replace('%40', '@')}`;
	const res = await fetch(url, { headers: { accept: 'application/json' } });
	if (res.status === 404) return { latest: null, versions: [] };
	if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
	const data = await res.json();
	const versions = Object.keys(data.versions || {});
	return { latest: data['dist-tags']?.latest ?? null, versions };
};

const status = (local, latest) => {
	if (latest === null) return 'unpublished';
	if (local === latest) return 'in-sync';
	const cmp = cmpSemver(local, latest);
	if (cmp > 0) return 'ahead-of-npm';
	if (cmp < 0) return 'behind-npm';
	return 'in-sync';
};

(async () => {
	const packages = publishablePackages();
	const rows = await Promise.all(
		packages.map(async pkg => {
			try {
				const { latest, versions } = await fetchPublished(pkg.name);
				const localPublished = versions.includes(pkg.version);
				return {
					name: pkg.name,
					local: pkg.version,
					npm: latest ?? '—',
					status: status(pkg.version, latest),
					note: !localPublished && latest !== null ? `local ${pkg.version} not on npm` : '',
				};
			} catch (err) {
				return { name: pkg.name, local: pkg.version, npm: 'ERROR', status: 'error', note: err.message };
			}
		}),
	);

	const widths = {
		name: Math.max(7, ...rows.map(r => r.name.length)),
		local: Math.max(5, ...rows.map(r => r.local.length)),
		npm: Math.max(11, ...rows.map(r => r.npm.length)),
		status: Math.max(6, ...rows.map(r => r.status.length)),
	};
	const pad = (s, n) => String(s).padEnd(n);

	console.log(
		`${pad('PACKAGE', widths.name)}  ${pad('LOCAL', widths.local)}  ${pad('NPM LATEST', widths.npm)}  ${pad('STATUS', widths.status)}  NOTE`,
	);
	for (const r of rows) {
		console.log(
			`${pad(r.name, widths.name)}  ${pad(r.local, widths.local)}  ${pad(r.npm, widths.npm)}  ${pad(r.status, widths.status)}  ${r.note}`,
		);
	}

	const counts = rows.reduce((acc, r) => {
		acc[r.status] = (acc[r.status] || 0) + 1;
		return acc;
	}, {});
	console.log(
		`\n${rows.length} publishable packages. ${Object.entries(counts).map(([k, v]) => `${k}=${v}`).join('  ')}`,
	);
})().catch(err => {
	console.error(err);
	process.exit(1);
});
