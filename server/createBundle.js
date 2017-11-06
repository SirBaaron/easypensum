var FS = require('fs');
var REPLACESTREAM = require('replacestream');
var classid = require('./classid-node.js');


const config = require("./config.js");
const environment = require("./environment.js");


const classobj = {
	name: "8D",
	school: "Parhamerplatz",
	tabs: [
		{
			name: "Hasuaufgaben",
			color: "#d68800"
		},
		{
			name: "Lernzielkontrollen",
			color: "#06cec0"
		},
		{
			name: "Tests",
			color: "#fa4596"
		},
		{
			name: "Events",
			color: "#d10a18"
		}
	]
}

const queryResult = {
	Hasuaufgaben: [{
		subject: "Englisch",
		content: "Link: www.google.com§brfull Link: https://www.google.com§brEmail: aaron.laengert@gmail.com",
		date: "2017-08-23",
		color: "gold",
		detail: "Koch",
		interactions: {
			creator: "Aaron Längert",
			created: "2017-08-20 17:43:10",
			changed: [{
				user: "le fugh",
				time: "2017-08-22 03:10"
			}]
		}
	},
	{
		subject: "Mathe",
		content: "10.47| a) b)§br10.53|",
		date: "2017-08-26",
		color: "green",
		detail: "",
		interactions: {
			creator: "Someone else",
			created: "2017-06-10 18:10:43",
			changed: []
		}
	},
	{
		subject: "Mathe",
		content: "10.47| a) b)§br10.53|",
		date: "2017-08-26",
		color: "green",
		detail: "",
		interactions: {
			creator: "Someone else",
			created: "2017-06-10 18:10:43",
			changed: []
		}
	}],
	Lernzielkontrollen: [],
	Tests: [],
	Events: []
}


module.exports = {
	"createBundle": (path, session, cookies) => {
		var jsversion;
		if(cookies["feature-es6"] == true) {
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

		return extraHead.concat(loadmodule("./bundles/" + jsversion + bundle, session, jsversion).replace(/__SSR\("(\s*([\w\-.\\\/]+)\s*)"\);?/g, (m, str) => {
			switch(str) {
				case "cascadingscript":
					var bundle = path.match(/[\w\d-]+\.[\w\d]+$/)[0];
					var scripts = config.entryPoints[session.get("route")].bundles;
					var position = scripts.indexOf(bundle);
					if(position == -1) {
						return "";
					}
					if(position < scripts.length - 1) {
						return `jsinject("bundles/${jsversion}${scripts[position + 1]}");`;
					}
					break;
				case "tabButtons":
					let buttons = "";
					for(i in classobj.tabs) {
						let length = "";
						try {
							length = queryResult[classobj.tabs[i].name.toString()].length;
						}
						catch(err) {}
						buttons += `<button class="${classid("headerButton")}" noSelect${i == 0 ? " selected" : ""}>${classobj.tabs[i].name}<div class="${classid("badge")}">${length}</div><ripple-effect opacity="0.4" cancel-on-move></ripple-effect></button>`
					}
					return buttons;
					break;
				case "queryResult":
					return JSON.stringify(queryResult);
					break;
				case "tabsWidth":
					return classobj.tabs.length * 100;
					break;
				case "tabs":
					let tabs = "";
					for(i in classobj.tabs) {
						tabs += `<div${i == 0 ? " selected" : ""} name="${classobj.tabs[i].name}" color="${classobj.tabs[i].color}"></div>`;
					}
					return tabs;
					break;
			}
			return "";
		}));
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