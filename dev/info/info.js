__USE("cssinject.js");

cssinject(`//<-inject:../info/info.css-> //<-inject:../header/header-title.css-> //<-inject:../header/header.css->`);

__USE("loading-outro.js");

class infoPanel extends HTMLElement {
	constructor() {
		super();
	}

	get template() {
		return `//<-inject:../info/info.html->`;
	}

	connectedCallback() {
		this.innerHTML = this.template;
		loadingOutro();
	}
}

window.customElements.define("section-info", infoPanel);