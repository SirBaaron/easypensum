var classid = require('./classid-node.js');
var ssr = require('./ssr.js');
var FS = require('fs');
var klass = require('./api/klass.js');


const config = require("./config.js");


getHeaderColor = (route) => {
	let promise = new Promise(resolve => {
		klass.getScopes("27cfc064-714f-408d-adcd-d1747da75fc5").then(s => {
			resolve(s[0].color);
		}).catch(err => {
			resolve(route.headerColor);
		})
	});
	return promise;
}

getCookie = (req) => {
	cookie = "";
	if(!req.session.has("showedCookieConsent")) {
		req.session.put("showedCookieConsent", true);
		var cookie = FS.readFileSync("./templates/cookie-notice.html", "utf-8");
	}
	return cookie;
}

getLinks = (req) => {
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

	return `${linksPrimary}<div class="${classid("seperator")}"></div>${linksSecondary}`;
}


module.exports = {
	"renderIndex": (req) => {
		var route = config.entryPoints[req.path];

		return ssr(FS.readFileSync("./templates/index.html", "utf-8"), /<!--SSR:(\s*([\w]+)\s*)-->/g, {
			"headerHeight": route.headerHeight,
			"headerColor": getHeaderColor(route),
			"script": `<script async src="bundles/${route.bundles[0]}"></script>`,
			"copyright": `Copyright © ${new Date().getFullYear()} Aron Längert`,
			"cookie": getCookie(req),
			"links": getLinks(req)
		});

	}	
}