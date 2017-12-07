class SubjectSelector extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.innerHTML = "Hello World";
	}
}

window.customElements.define("subject-selector", SubjectSelector);