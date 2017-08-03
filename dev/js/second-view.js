
class secondView extends HTMLElement {
	constructor() {
		super();

		var css = document.createElement("style");
		css.innerHTML = this.css;
		document.head.appendChild(css);

		this.innerHTML = this.template;

		this.color = "";
		this.titletxt = "";

		this.sections = document.getElementById(classid("sections"));
		this.ripple = this.querySelector("." + classid("sv-ripple"));
		this.labsvg = this.querySelector("." + classid("sv-labsvg"));
		this.headerBackdrop = this.querySelector("." + classid("sv-header-backdrop"));
		this.main = this.querySelector("." + classid("sv-main"));
		this.titleel = this.querySelector("." + classid("sv-header-title"));




		this.ripple.addEventListener("transitionend", this._onrippletransitionend.bind(this));
		this.titleel.addEventListener("transitionend", this._ontitletransitionend.bind(this));
	}

	get template() {
		return `
			//<-inject:../html/second-view.html->
		`;
	}
	get css() {
		return `
			//<-inject:../css/second-view.css->
		`;
	}

	get svgs() {
		return {
			back: [
				{
					d: "M6,11H20V13H6V11Z",
					transition: {
						"burger": "translate(-1px, 0) scale(1.2854, 1)"
					}
				},
				{
					d: "M4.16,12L12.08,4.08L13.5,5.5L5.58,13.42L4.16,12Z",
					transition: {
						"burger": "translate(3.17px, -1.75px) scale(1.6071, 0.9959) rotate(45deg)"
					}
				},
				{
					d: "M5.58,10.58L13.5,18.5L12.08,19.92L4.16,12L5.58,10.58Z",
					transition: {
						"burger": "translate(3.17px, 1.75px) scale(1.6071, 0.9959) rotate(-45deg)"
					}
				}
			]
		}
	}

	open(name, clickEvent, color, leftActionButton, previousLeftActionButton, title, previousTitle, rightActionButtons, innerHTML) {
		this.color = color;

		this.style.display = "block";

		this._spawnRipple(clickEvent.pageX, clickEvent.pageY, color);
		this._handleLab(leftActionButton, previousLeftActionButton);
		this._switchtitle(title, previousTitle);

		document.getElementsByTagName("meta")[0].setAttribute("content", color);
	}

	_ontitletransitionend(e) {
		if(e.propertyName == "opacity") {
			if(e.target.style.opacity == 0) {
				e.target.innerHTML = this.titletxt;
				e.target.style.transition = "transform 0.4s cubic-bezier(.4, 0, .2, 1), opacity 0.15s cubic-bezier(0, 0, .2, 1)";
				e.target.style.opacity = 1;
			}
		}
	}

	_switchtitle(title, previousTitle) {
		try {
			previousTitle.style.opacity = 0;
		}
		catch(err) {}

		var previous = previousTitle.textContent || "";

		const target = this.titleel.getBoundingClientRect();
		const before = previousTitle.getBoundingClientRect();

		this.titleel.style.transition = "none";
		var horizontaldiff = before.left - target.left;
		var verticaldiff = before.top - target.top;

		this.titleel.style.transform = `translate(${horizontaldiff}px, ${verticaldiff}px)`;

		this.titleel.innerHTML = previous;

		window.requestAnimationFrame(_ => window.requestAnimationFrame(_ => {
			this.titleel.style.transition = "transform 0.4s cubic-bezier(.4, 0, .2, 1), opacity 0.15s cubic-bezier(.4, 0, 1, 1)";
			this.titleel.style.transform = "";
			this.titleel.style.opacity = 0;
		}));

		this.titletxt = title;
	}

	_onrippletransitionend(e) {
		if(e.propertyName == "transform") {
			this.main.style.display = "block";

			this.headerBackdrop.style.background = this.color;
			this.headerBackdrop.style.display = "block";

			this.sections.style.display = "none";

			window.scrollTo(0, 0);
			this.style.position = "relative";

			this.ripple.style.opacity = 0;
		}
	}

	_handleLab(leftActionButton, previousLeftActionButton) {
		this.labsvg.removeAttribute("translate");

		try {
			previousLeftActionButton.el.style.opacity = 0;
		}
		catch(err) {}

		for(let i in this.svgs[leftActionButton]) {
			var obj = this.svgs[leftActionButton][i];

			var el = document.createElementNS("http://www.w3.org/2000/svg", "path");
			el.setAttribute("d", obj.d);

			try {
				el.style.transform = obj.transition[previousLeftActionButton.type];
			}
			catch(err) {
				console.log("dsfd");
				el.style.opacity = 0;
			}
			

			this.labsvg.appendChild(el);
		}

		window.requestAnimationFrame(_ => window.requestAnimationFrame(_ => this.labsvg.setAttribute("translate", "")));
	}

	_spawnRipple(x, y, color) {
		var rect = this.getBoundingClientRect();

		this.ripple.style.transform = "translate(-50%, -50%) scale(0)";

		this.ripple.style.background = color;
		this.ripple.style.left = (x - rect.left) + "px";
		this.ripple.style.top = y + "px";

		let up = y;
		let down = rect.height - y;
		let left = x - rect.left;
		let right = rect.width - x;

		let d = Math.max(Math.sqrt(up ** 2 + right ** 2), Math.sqrt(right ** 2 + down ** 2), Math.sqrt(down ** 2 + left ** 2), Math.sqrt(left ** 2 + up ** 2));
			
		this.ripple.style.height = this.ripple.style.width = Math.ceil(d) * 2 + "px";

		this.ripple.style.transform = "translate(-50%, -50%) scale(1)";
	}
}

window.customElements.define("second-view", secondView);

window["sv"] = document.getElementsByTagName("second-view")[0];