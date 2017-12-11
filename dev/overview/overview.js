console.log("loaded #1: ", performance.now());

__USE("scriptinject.js");

__SSR("cascadingscript");

__USE("cssinject.js");

cssinject(`//<-inject:../overview/overview.css-> //<-inject:../overview/overviewHeader.css->`);

__USE("header-title.js");

__USE("loading-outro.js");

window["mobile"] = /(Android)|(webOS)|(iPhone)|(BlackBerry)|(Windows Phone)/ig.test(navigator.userAgent);

history.replaceState({
	view: "main"
}, "", "");

class Overview extends HTMLElement {
	constructor() {
		super();
	}

	get template() {
		return `//<-inject:../overview/overview.html->`;
	}

	connectedCallback() {
		loadingOutro();

		this.innerHTML = this.template;

		this.tabshell = document.getElementsByTagName("tab-view")[0];
		this.buttonRow = document.getElementById(classid("header_row_3"));
		this.headerOne = document.getElementById(classid("overview_header_one"));
		this.header = document.getElementById(classid("overview_header"));
		this.buttonBar = document.getElementById(classid("button_bar"));
		this.meta = document.getElementsByTagName("meta")[0];

		window.addEventListener("resize", _ => {
			this._drawButtonBar(this.buttonRow.querySelector('button[selected]'));
		});

		this.buttonRow.addEventListener("click", this._ontabnav.bind(this));
		this.buttonRow.addEventListener("ripple-click", this._ontabnav.bind(this));

		this._drawButtonBar(this.buttonRow.querySelector('button[selected]'));
	}

	_ontabnav(e) {
		if(e.type == "click" && document.createElement("ripple-effect").constructor !== HTMLElement) {
			return;
		}
		this.tabshell.switchTab(e.target.firstChild.textContent);
	}

	switchHeaderColor(color) {
		this.headerOne.style.background = this.header.style.background = color;
		this.meta.setAttribute("content", color);
	}

	switchSelectedButton(name) {
		this.buttonRow.querySelector('button[selected]').removeAttribute("selected");
		const btn = this._getButtonByText(name);
		
		btn.setAttribute("selected", "");
		this._drawButtonBar(btn);
	}

	setButtonCount(index, count) {
		this.buttonRow.childNodes[index].querySelector("." + classid("badge")).textContent = count;
	}

	_drawButtonBar(btn) {
		const rect = btn.getBoundingClientRect();
		const scrollLeft = this.buttonRow.scrollLeft;
		this.buttonBar.style.transition = "none";
		this.buttonBar.style.transform = `translateX(${rect.left + scrollLeft}px) scaleX(${rect.width / 100})`;
	}

	_getButtonByText(txt) {
		return [].slice.call(this.buttonRow.childNodes).find(n => {
			return n.firstChild.textContent == txt;
		});
	}
}
window.customElements.define("section-overview", Overview);

__USE("tabs.js");

__USE("card.js");

__USE("cardmanager.js");



cards.render(__SSR("queryResult"));