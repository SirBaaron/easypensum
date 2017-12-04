__USE("cssinject.js");


__USE("scriptinject.js");

__SSR("cascadingscript");


cssinject(`//<-inject:../settings/settings.css->`);

__USE("header.js");
__USE("header-title.js");

__USE("loading-outro.js");

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
	}
}

window.customElements.define("section-settings", settingsPanel);