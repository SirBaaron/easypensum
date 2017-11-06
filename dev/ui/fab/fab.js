__USE("cssinject.js");

cssinject(`//<-inject:../fab/fab.css->`);


class fab extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.addEventListener("click", this._onClick.bind(this));
	}

	_onClick(e) {
		let el = document.getElementById(classid("toogleDrawerLabel"));				
		let display = window.getComputedStyle(el).getPropertyValue("display");
		let titleel = document.getElementById(classid("overview_section_title"));


		var previousactionbutton = {
			el: el.firstChild,
			type: "burger"
		}
		if(display == "none") {
			previousactionbutton = null;
		}

		window.sv.open("create", e, "#FFC107", "back", previousactionbutton, "Erstellen", titleel);
	}
}

window.customElements.define("fab-create", fab);