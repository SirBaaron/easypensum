__USE("cssinject.js");

cssinject(`//<-inject:../datenschutz/datenschutz.css->`);

__USE("header.js");
__USE("header-title.js");

__USE("loading-outro.js");

class infoPanel extends HTMLElement {
	constructor() {
		super();
	}

	get template() {
		return `//<-inject:../datenschutz/datenschutz.html->`;
	}

	connectedCallback() {
		this.innerHTML = this.template;
		loadingOutro();
	}
}

window.customElements.define("section-datenschutz", infoPanel);