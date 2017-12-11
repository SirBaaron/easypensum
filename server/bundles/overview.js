var db = require('./../db.js');
var classid = require('./../classid-node.js');
var klass = require('./../api/klass.js');
var entries = require('./../api/entries.js');


getTabButtons = (scopes) => {
	let buttons = "";
	for(i in scopes) {
		buttons += `<button class="${classid("headerButton")}" noSelect${i == 0 ? " selected" : ""}>${scopes[i].name}<div class="${classid("badge")}"></div><ripple-effect opacity="0.4" cancel-on-move></ripple-effect></button>`
	}
	return buttons;
}

getTabs = (scopes) => {
	let tabs = "";
	for(i in scopes) {
		tabs += `<div${i == 0 ? " selected" : ""} name="${scopes[i].name}" color="${scopes[i].color}"></div>`;
	}
	return tabs;
}

getDBRelated = () => {
	return new Promise(resolve => {
		
		Promise.all([
			klass.getScopes("27cfc064-714f-408d-adcd-d1747da75fc5"),
			entries.access("27cfc064-714f-408d-adcd-d1747da75fc5")
		]).then(res => {
			let scopes = res[0];
			let queryResult = res[1];

			resolve({
				"tabs": getTabs(scopes),
				"tabButtons": getTabButtons(scopes),
				"queryResult": JSON.stringify(queryResult),
				"tabsWidth": scopes.length * 100,
				"headerColor": scopes[0].color
			});
		}).catch(err => {
			console.log("something went wrong: ", err)
			resolve({});
		});

	});
}

module.exports = {
	"getSSR": () => {
		return {};
	},
	"getExtra": () => {
		return [getDBRelated()];
	}
}