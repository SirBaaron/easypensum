console.log("loaded #1: ", performance.now());

__USE("scriptinject.js");

__SSR("cascadingscript");

__USE("cssinject.js");

cssinject(`//<-inject:../overview/overview.css-> //<-inject:../overview/overviewHeader.css->`);



window["mobile"] = /(Android)|(webOS)|(iPhone)|(BlackBerry)|(Windows Phone)/ig.test(navigator.userAgent);

class Overview extends HTMLElement {
	constructor() {
		super();
	}

	get template() {
		return `//<-inject:../overview/overview.html->`;
	}

	connectedCallback() {
		try {
			this.splashheader = document.getElementById(classid("splashheader"));
			this.splashloadinganimation = document.getElementById(classid("splashloadinganimation"));

			const splashdim = this.splashheader.getBoundingClientRect();
			const loaderdim = this.splashloadinganimation.getBoundingClientRect();
			
			this.splashheader.style.position = this.splashloadinganimation.style.position = "absolute";
			this.splashheader.style.left = this.splashloadinganimation.style.left = `${splashdim.left}px`;
			this.splashloadinganimation.style.top = `${loaderdim.top}px`;
			this.splashloadinganimation.style.right = this.splashloadinganimation.style.bottom = this.splashheader.style.top = this.splashheader.style.right = "0px";

			this.splashloadinganimation.style.opacity = 1;
			this.splashloadinganimation.style.transition = this.splashheader.style.transition = "opacity 0.2s linear";
			this.splashloadinganimation.style.opacity = 0;

			const evhandler = e => {
				this.splashheader.parentNode.removeChild(this.splashheader);
				e.target.parentNode.removeChild(e.target);
			}


			this.splashloadinganimation.addEventListener("transitionend", evhandler);

			
			this.splashheader.style.opacity = 0;

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