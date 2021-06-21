const path = require('path');
const fs = require('fs');
const exec = require('child_process').execSync;

const package = require('./package.json');

function parseVersion(ver) {
	if ( typeof ver !== "string" ) return false;

	const sVer = ver.split('.');
	if ( sVer.length === 3 ) {
		return {
			app:   parseInt(sVer[0], 10),
			major: parseInt(sVer[1], 10),
			minor: parseInt(sVer[2], 10),
		};
	}
	return false;
}

function verCompaire(ver1, ver2) {
	const v1 = parseVersion(ver1);
	const v2 = parseVersion(ver2);

	if ( v1 === false || v2 === false ) return;

	if ( v1.app === v2.app ) {
		if ( v1.major === v2.major ) {
			if ( v1.minor === v2.minor ) {
				return 0;
			} else {
				return (v1.minor < v2.minor ? -1 : 1);
			}
		} else {
			return (v1.major < v2.major ? -1 : 1);
		}
	} else {
		return (v1.app < v2.app ? -1 : 1);
	}
}

function checkVersionUp() {
	const pdir = path.resolve(__dirname, 'product');
	const vfile = path.join(pdir, 'version.json');
	if ( fs.existsSync(pdir) && fs.existsSync(vfile) ) {
		const version = require(vfile);
		if ( verCompaire(package.version, version,version) > 0 ) {
			return true;
		}
	} else {
		return true;
	}
	return false;
}

function productSite(type) {
	exec(`npm run ${type}:build`);

	fs.writeFileSync(
		path.resolve(__dirname, type, 'version.json'),
		JSON.stringify({
			version: package.version,
		}),
		'utf-8'
	);

	fs.writeFileSync(path.resolve(__dirname, 'type_' + type), '시발!!');

	exec(`site-product.sh ${type}`);
}


console.log('checking version');

if ( checkVersionUp() ) {
	// product
	productSite('product');
}

// always build preview site
productSite('preview');
