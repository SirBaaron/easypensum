var FS = require('fs');
var REPLACESTREAM = require('replacestream');
var classid = require('./classid-node.js');

const config = require("./config.js");



module.exports = {
	"renderIndex": (path) => {
		var route = config.entryPoints[path];

		const scripts = route.bundles.map(r => {
				return `<script src="bundles/${r}"></script>`;
			}).join("");

		var linksPrimary = "";
		var linksSecondary = "";
		for(i in config.entryPoints) {
			let entrypoint = config.entryPoints[i];
			let current = path == i;
			let str = `<a${
				current ? "" : ` href="${i}"`
			} class="${
				(entrypoint.primarySection) ? classid("primary") : classid("secondary")
			}"${
				current ? " style='font-weight:bold'" : ""
			}>${entrypoint.name}</a>`;
			(entrypoint).primarySection ? linksPrimary += str : linksSecondary += str;
		}

		var links = `${linksPrimary}<div class="${classid("seperator")}"></div>${linksSecondary}`;

		return FS.createReadStream("./templates/index.html") 
			.pipe(REPLACESTREAM("<!--SSR:headerHeight-->", route.headerHeight))
			.pipe(REPLACESTREAM("<!--SSR:headerColor-->", route.headerColor))
			.pipe(REPLACESTREAM("<!--SSR:links-->", links))
			.pipe(REPLACESTREAM("<!--SSR:scripts-->", scripts));
	}
}