__USE("cssinject.js");

cssinject(`//<-inject:../spinner/spinner.css->`);

class spinnerElement extends HTMLElement {
	constructor() {
		super();
		this.connected = false;
	}
	
	static get observedAttributes() {
		return ["color", "thickness"];
	}

	get template() {
		return `//<-inject:../spinner/spinner.html->`;
	}

	connectedCallback() {
		this.innerHTML = this.template;
		this.connected = true;
		this._updateColor(this.getAttribute("color") || "#fff");
	}

	attributeChangedCallback(attribute, oldVal, newVal) {
		if(!this.connected) return;
		switch(attribute) {
			case "color":
				this._updateColor(newVal || "#fff");
				break;
			case "thickness":
				this._updateThickness(newVal || 5);
				break;
		}
	}

	_updateThickness() {}

	_updateColor(color) {
		this.firstChild.style.fill = color;
	}
}

window.customElements.define("spinner-element", spinnerElement);

document.body.setAttribute("feature-spinner", "");