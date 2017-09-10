var FS = require('fs');
var REPLACESTREAM = require('replacestream');



module.exports = {
	"createBundle": (path, session) => {
		console.log(path);
		return loadmodule(path, session);
	}
}

function loadmodule(path, session) {
	return FS.readFileSync("./" + path, "utf-8").replace(/\/\/<-use:(\s*([\w\-.\\\/]+)\s*)->/g, (m, module) => {
		const loadedModules = session.get("loadedModules") || [];
		console.log(module, loadedModules);
		if(loadedModules.indexOf(module) > -1) {
			return "";
		}
		session.push("loadedModules", module);
		return loadmodule("./bundles/" + module, session);
	});
}