var FS = require('fs');
var REPLACESTREAM = require('replacestream');
var classid = require('./classid-node.js');

const config = require("./config.js");



module.exports = {
	"renderIndex": (req) => {
		var route = config.entryPoints[req.path];

		const script = `<script async src="bundles/${route.bundles[0]}"></script>`;

		cookie = "";
		if(!req.session.has("showedCookieConsent")) {
			req.session.put("showedCookieConsent", true);
			var cookie = FS.readFileSync("./templates/cookie-notice.html", "utf-8");
		}


		var linksPrimary = "";
		var linksSecondary = "";
		for(i in config.entryPoints) {
			let entrypoint = config.entryPoints[i];
			let current = req.path == i;
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

		const copyright = `Copyright © ${new Date().getFullYear()} Aron Längert`;

		return FS.createReadStream("./templates/index.html") 
			.pipe(REPLACESTREAM("<!--SSR:headerHeight-->", route.headerHeight))
			.pipe(REPLACESTREAM("<!--SSR:headerColor-->", route.headerColor))
			.pipe(REPLACESTREAM("<!--SSR:links-->", links))
			.pipe(REPLACESTREAM("<!--SSR:script-->", script))
			.pipe(REPLACESTREAM("<!--SSR:cookie-->", cookie))
			.pipe(REPLACESTREAM("<!--SSR:copyright-->", copyright));

	}
}