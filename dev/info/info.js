__USE("cssinject.js");

cssinject(`//<-inject:../info/info.css->`);


class infoPanel extends HTMLElement {
	constructor() {
		super();
	}

	get template() {
		return `//<-inject:../info/info.html->`;
	}

	connectedCallback() {
		this.innerHTML = this.template;
	}
}

window.customElements.define("section-info", infoPanel);