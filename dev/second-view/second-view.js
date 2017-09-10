//<-use:cssinject.js->

cssinject(`//<-inject:../second-view/second-view.css->`);


class secondView extends HTMLElement {
	constructor() {
		super();

		this.innerHTML = this.template;

		this.color = "";
		this.titletxt = "";
		this.opened = false;
		this.previouslab = null;
		this.previoustitle = null;
		this.labtype = "";
		this.title = "";
		this.scrollBefore = 0;
		this.themecolorbefore = "";

		this.sections = document.getElementById(classid("sections"));
		this.ripple = this.querySelector("." + classid("sv-ripple"));
		this.labsvg = this.querySelector("." + classid("sv-labsvg"));
		this.headerBackdrop = this.querySelector("." + classid("sv-header-backdrop"));
		this.main = this.querySelector("." + classid("sv-main"));
		this.titleel = this.querySelector("." + classid("sv-header-title"));
		this.meta = document.getElementsByTagName("meta")[0];




		this.ripple.addEventListener("transitionend", this._onrippletransitionend.bind(this));
		this.titleel.addEventListener("transitionend", this._ontitletransitionend.bind(this));
		this.main.addEventListener("transitionend", this._onmaintransitionend.bind(this));

		this.labsvg.addEventListener("click", this.close.bind(this));

		window.addEventListener("popstate", this._onpopstate.bind(this));
	}

	get template() {
		return `//<-inject:../second-view/second-view.html->`;
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

	get svgtransform() {
		return {
			back: {
				burger: "rotate(180deg)"
			}
		}
	}

	close(shouldpopstate = true) {
		if(!this.opened) return;
		this.opened = false;

		if(shouldpopstate) {
			history.back();
		}

		var scroll = document.body.scrollTop;

		this.style.position = "fixed";
		this.sections.style.position = "initial";

		this.main.style.transform = `translateY(-${scroll}px)`;

		this.headerBackdrop.style.opacity = 0;

		this.main.style.transition = "opacity 0.4s cubic-bezier(.4, 0, 1, 1)";
		this.main.style.opacity = 0;

		window.scrollTo(0, this.scrollBefore);

		this._closinglab(this.previouslab, this.labtype);
		this._switchtitle(this.title, this.previoustitle, true);

		this.meta.setAttribute("content", this.themecolorbefore);
	}

	open(name, clickEvent, color, leftActionButton, previousLeftActionButton, title, previousTitle, rightActionButtons, innerHTML) {
		if(this.opened) return;

		this.opened = true;

		this.previouslab = previousLeftActionButton;
		this.previoustitle = previousTitle;
		this.labtype = leftActionButton;
		this.title = title;

		history.pushState({
			view: "sv",
			previous: history.state.view
		}, "", "");

		this.color = color;

		this.style.display = "block";

		this._spawnRipple(clickEvent.clientX, clickEvent.clientY, color);
		this._handleLab(leftActionButton, previousLeftActionButton);
		this._switchtitle(title, previousTitle);

		this.themecolorbefore = this.meta.getAttribute("content");
		this.meta.setAttribute("content", color);
	}

	_onmaintransitionend(e) {
		try {
			this.previoustitle.style.opacity = 1;
			this.previouslab.el.style.opacity = 1;
		}
		catch(err) {}

		this.headerBackdrop.style.display = "none";
		this.headerBackdrop.style.opacity = 1;

		this.style.display = "none";

		this.ripple.style.opacity = 1;
		this.ripple.style.transform = "translate(-50%, -50%) scale(0)";
		this.titleel.style.transform = "";
		this.main.style.transform = "none";

		this.labsvg.innerHTML = "";
	}

	_closinglab(previouslab, labtype) {
		if(previouslab == null) {
			[].slice.call(this.labsvg.childNodes).forEach(n => {
				n.style.opacity = 0;
			});
		}

		this.labsvg.removeAttribute("translate");
	}

	_onpopstate(e) {
		if(e.state.view != "sv" && this.opened) {
			this.close(false);
		}
		if(e.state.view == "sv" && !this.opened) {
			history.back();
		}
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

	_switchtitle(title, previousTitle, reverse) {
		try {
			previousTitle.style.opacity = 0;
		}
		catch(err) {}

		var previous = reverse ? title : previousTitle.textContent || "";

		const target = this.titleel.getBoundingClientRect();
		const before = previousTitle.getBoundingClientRect();


		var x = before.left - target.left;
		var y = before.top - target.top;

		if(!reverse) {
			this.titleel.style.transition = "none";
			this.titleel.style.transform = `translate(${x}px, ${y}px)`;

			this.titleel.innerHTML = previous;

			window.requestAnimationFrame(_ => window.requestAnimationFrame(_ => {
				this.titleel.style.transition = "transform 0.4s cubic-bezier(.4, 0, .2, 1), opacity 0.15s cubic-bezier(.4, 0, 1, 1)";
				this.titleel.style.transform = "";
				this.titleel.style.opacity = 0;
			}));
			this.titletxt = title;
		}
		else {
			this.titleel.style.transition = "transform 0.4s cubic-bezier(.4, 0, .2, 1), opacity 0.15s cubic-bezier(.4, 0, 1, 1)";
			
			this.titleel.style.transform = `translate(${x}px, ${y}px)`;
			this.titleel.style.opacity = 0;

			this.titletxt = previousTitle.textContent || "";
		}

	}

	_onrippletransitionend(e) {
		if(e.propertyName == "transform") {
			this.scrollBefore = document.body.scrollTop;

			this.main.style.transition = "none";
			this.main.style.opacity = 1;

			this.headerBackdrop.style.background = this.color;
			this.headerBackdrop.style.display = "block";

			this.sections.style.position = "fixed";

			window.scrollTo(0, 0);
			this.style.position = "relative";

			this.ripple.style.opacity = 0;
		}
	}

	_handleLab(leftActionButton, previousLeftActionButton) {
		try {
			this.labsvg.style.transition = "none";
			this.labsvg.style.transform = this.svgtransform[leftActionButton][previousLeftActionButton.type];
		}
		catch(err) {}

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
				el.style.opacity = 0;
			}
			

			this.labsvg.appendChild(el);
		}


		window.requestAnimationFrame(_ => window.requestAnimationFrame(_ => {
			this.labsvg.style.transition = "transform 0.4s cubic-bezier(.4, 0, .2, 1)";
			this.labsvg.setAttribute("translate", "");
		}));
	}

	_spawnRipple(x, y, color) {
		var rect = this.getBoundingClientRect();

		this.ripple.style.background = color;
		this.ripple.style.left = (x - rect.left) + "px";
		this.ripple.style.top = y + "px";

		let up = y;
		let down = window.innerHeight - y;
		let left = x - rect.left;
		let right = rect.width - x;

		let d = Math.max(Math.sqrt(up ** 2 + right ** 2), Math.sqrt(right ** 2 + down ** 2), Math.sqrt(down ** 2 + left ** 2), Math.sqrt(left ** 2 + up ** 2));
			
		this.ripple.style.height = this.ripple.style.width = Math.ceil(d) * 2 + "px";

		this.ripple.style.transform = "translate(-50%, -50%) scale(1)";
	}
}

window.customElements.define("second-view", secondView);

window["sv"] = document.getElementsByTagName("second-view")[0];