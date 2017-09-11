var FS = require('fs');
var REPLACESTREAM = require('replacestream');

const config = require("./config.js");


module.exports = {
	"createBundle": (path, session) => {
		return loadmodule(path, session).replace(/__SSR\("(\s*([\w\-.\\\/]+)\s*)"\);/g, (m, str) => {
			switch(str) {
				case "cascadingscript":
					var bundle = path.replace("/bundles/", "");
					var scripts = config.entryPoints[session.get("route")].bundles;
					var position = scripts.indexOf(bundle);
					if(position == -1) {
						return "";
					}
					if(position < scripts.length - 1) {
						return `jsinject("bundles/${scripts[position + 1]}");`;
					}
					break;
			}
			return "";
		})
	}
}

function loadmodule(path, session) {
	return FS.readFileSync("./" + path, "utf-8").replace(/__USE\("(\s*([\w\-.\\\/]+)\s*)"\);/g, (m, module) => {
		const loadedModules = session.get("loadedModules") || [];
		if(loadedModules.indexOf(module) > -1) {
			return "";
		}
		session.push("loadedModules", module);
		return loadmodule("./bundles/" + module, session);
	});
}