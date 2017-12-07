__USE("cssinject.js");

cssinject(`//<-inject:../helpers/elementloader.css->`);

__USE("spinner.js");

class ElementLoader extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.elements = [].slice.call(this.childNodes).filter(v => v.nodeType == 1);
		this.loader = document.createElement("div");
		this.loader.innerHTML = "<spinner-element color='#FFC107'></spinner-element>"
		this.loader.classList = classid("element_loader_spinner");
		this.appendChild(this.loader);
	}

	open(name) {
		let el = this.elements.find(v => v.getAttribute("name") == name);
		if(el.constructor == HTMLElement) {
			console.log("not laoded");
			this.loader.style.opacity = 1;
			this.load(name);
		}
		else {
			this._show(name);
		}
	}

	load(resname) {
		let el = document.createElement("script");
		el.src= `/element/${resname}.js`;
		el.onload = () => {
			this.loader.style.opacity = 0;
			this._show(resname, true);
		}
		document.body.appendChild(el);
	}

	_show(name, animate = false) {
		this.elements.forEach(v => v.style.display = "none");
		let el = this.elements.find(v => v.getAttribute("name") == name);
		if(animate) {
			el.style.opacity = 0;
			el.style.display = "block";
			window.requestAnimationFrame(_ => window.requestAnimationFrame(_ => {
				el.style.opacity = 1;
			}));
		}
		else {
			el.style.display = "block";
		}
	}
}

window.customElements.define("element-loader", ElementLoader);