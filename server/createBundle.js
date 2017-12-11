var FS = require('fs');
var ssr = require('./ssr.js');


const config = require("./config.js");
const environment = require("./environment.js");


getCascadingscript = (path, session, jsversion) => {
	var bundle = path.match(/[\w\d-]+\.[\w\d]+$/)[0];
	var scripts = config.entryPoints[session.get("route")].bundles;
	var position = scripts.indexOf(bundle);
	if(position == -1) {
		return "";
	}
	if(position < scripts.length - 1) {
		return `jsinject("bundles/${jsversion}${scripts[position + 1]}");`;
	}
}


module.exports = {
	"createBundle": (path, session, cookies) => {
		let jsversion;
		if(cookies["feature-es6"] == "true") {
			jsversion = environment.es6Path;
		}
		else {
			jsversion = environment.es5Path;
		}
		var bundle = path.match(/[\w\d-]+\.[\w\d]+$/)[0];

		var firstBundles = [];
		for(i in config.entryPoints) {
			firstBundles.push(config.entryPoints[i].bundles[0]);
		}
		var extraHead = "";
		if(firstBundles.indexOf(bundle) > -1 && cookies["feature-customElements"]) {
			extraHead = FS.readFileSync("./node_modules/@webcomponents/custom-elements/custom-elements.min.js", "utf-8");
		}

		var ssrObjects = {
			"cascadingscript": getCascadingscript(path, session, jsversion)
		}
		var ssrExtra = [];

		try {
			let bundlespecificSSR = require('./bundles/' + bundle);
			Object.assign(ssrObjects, bundlespecificSSR.getSSR());
			ssrExtra = ssrExtra.concat(bundlespecificSSR.getExtra());
		}
		catch(err) {}

		return ssr(extraHead + loadmodule("./bundles/" + jsversion + bundle, session, jsversion), /__SSR\("(\s*([\w\-.\\\/]+)\s*)"\);?/g, ssrObjects, ssrExtra);
	}
}

function loadmodule(path, session, jsversion) {
	return FS.readFileSync("./" + path, "utf-8").replace(/__USE\("(\s*([\w\-.\\\/]+)\s*)"\);/g, (m, module) => {
		const loadedModules = session.get("loadedModules") || [];
		if(loadedModules.indexOf(module) > -1) {
			return "";
		}
		session.push("loadedModules", module);
		return loadmodule("./bundles/" + jsversion + module, session, jsversion);
	});
}