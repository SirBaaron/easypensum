console.log("loaded #1: ", performance.now());

__USE("scriptinject.js");

__SSR("cascadingscript");

__USE("cssinject.js");

cssinject(`//<-inject:../overview/overview.css-> //<-inject:../overview/overviewHeader.css-> //<-inject:../header/header-title.css->`);

__USE("loading-outro.js");

window["mobile"] = /(Android)|(webOS)|(iPhone)|(BlackBerry)|(Windows Phone)/ig.test(navigator.userAgent);

class Overview extends HTMLElement {
	constructor() {
		super();
	}

	get template() {
		return `//<-inject:../overview/overview.html->`;
	}

	connectedCallback() {
		loadingOutro();
		try {
			

			history.replaceState({
				view: "main",
				previous: ""
			}, "", "");
		}
		catch(err) {}

		this.innerHTML = this.template;

		this.tabshell = document.getElementsByTagName("tab-view")[0];
		this.header = document.getElementById(classid("overview_header"));
		this.headerone = document.getElementById(classid("overview_header_one"));

		this.headerone.style.opacity = this.header.style.opacity = 1;
		this.tabshell.style.display = "block";
	}

	
}
window.customElements.define("section-overview", Overview);

__USE("tabs.js");

__USE("card.js");

__USE("cardmanager.js");


cards.render([{
	"subject": "Englisch",
	"content": "Link: www.google.com§brfull Link: https://www.google.com§brEmail: aaron.laengert@gmail.com",
	"date": "2017-08-23",
	"color": "gold",
	"detail": "Koch",
	"interactions": {
		"creator": "Aaron Längert",
		"created": "2017-08-20 17:43:10",
		"changed": [{
			"user": "le fugh",
			"time": "2017-08-22 03:10"
		}]
	}
},
{
	"subject": "Mathe",
	"content": "10.47| a) b)§br10.53|",
	"date": "2017-08-26",
	"color": "green",
	"detail": "",
	"interactions": {
		"creator": "Someone else",
		"created": "2017-06-10 18:10:43",
		"changed": []
	}
},
{
	"subject": "Mathe",
	"content": "10.47| a) b)§br10.53|",
	"date": "2017-08-26",
	"color": "green",
	"detail": "",
	"interactions": {
		"creator": "Someone else",
		"created": "2017-06-10 18:10:43",
		"changed": []
	}
}]);