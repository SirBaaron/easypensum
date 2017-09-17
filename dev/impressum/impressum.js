__USE("cssinject.js");

cssinject(`//<-inject:../impressum/impressum.css-> //<-inject:../header/header-title.css-> //<-inject:../header/header.css->`);

__USE("loading-outro.js");

class infoPanel extends HTMLElement {
	constructor() {
		super();
	}

	get template() {
		return `//<-inject:../impressum/impressum.html->`;
	}

	connectedCallback() {
		this.innerHTML = this.template;
		loadingOutro();
	}
}

window.customElements.define("section-impressum", infoPanel);