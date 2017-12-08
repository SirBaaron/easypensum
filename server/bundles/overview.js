var db = require('./../db.js');
var classid = require('./../classid-node.js');
var klass = require('./../api/klass.js');
var entries = require('./../api/entries.js');


const queryResult = {
	Hausaufgaben: [{
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

getTabButtons = (scopes, queryResult) => {
	let buttons = "";
	for(i in scopes) {
		let length = "";
		try {
			length = queryResult[scopes[i].name].length;
		}
		catch(err) {}
		buttons += `<button class="${classid("headerButton")}" noSelect${i == 0 ? " selected" : ""}>${scopes[i].name}<div class="${classid("badge")}">${length}</div><ripple-effect opacity="0.4" cancel-on-move></ripple-effect></button>`
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
				"tabButtons": getTabButtons(scopes, queryResult),
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