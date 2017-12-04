__USE("cssinject.js");


__USE("scriptinject.js");

__SSR("cascadingscript");


cssinject(`//<-inject:../settings/settings.css->`);

__USE("header.js");
__USE("header-title.js");

__USE("loading-outro.js");

__USE("settingspage.js");

class settingsPanel extends HTMLElement {
	constructor() {
		super();
	}

	get template() {
		return `//<-inject:../settings/settings.html->`;
	}

	connectedCallback() {
		this.innerHTML = this.template;
		loadingOutro();

		this.settingPages = document.getElementsByTagName("setting-pages")[0];
		document.getElementById(classid("settings_view")).addEventListener("ripple-click", this.openPage.bind(this));
		document.getElementById(classid("settings_view")).addEventListener("click", this.openPage.bind(this));
	}

	openPage(e) {
		if(e.type == "click" && document.createElement("ripple-effect").constructor !== HTMLElement) {
			return;
		}
		if(!e.target.hasAttribute("pageopener")) {
			return;
		}
		this.settingPages.open(e.target.querySelector("." + classid("settings_box_title")));
	}
}

window.customElements.define("section-settings", settingsPanel);