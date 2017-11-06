__USE("cssinject.js");

cssinject(`//<-inject:../second-view/second-view.css->`);


class secondView extends HTMLElement {
	constructor() {
		super();

		this.innerHTML = this.template;

		this.sections = document.getElementById(classid("sections"));
		this.labsvg = this.querySelector("." + classid("sv-labsvg"));
		this.headerBackdrop = this.querySelector("." + classid("sv-header-backdrop"));
		this.main = this.querySelector("." + classid("sv-main"));
		this.titleel = this.querySelector("." + classid("sv-header-title"));
		this.meta = document.getElementsByTagName("meta")[0];


		this.labsvg.addEventListener("click", _ => {
			this.close();
		});

		window.addEventListener("popstate", this._onpopstate.bind(this));
	}

	get template() {
		return `//<-inject:../second-view/second-view.html->`;
	}

	get fullsvgs() {
		return {
			back: '<path d="M6,11H20V13H6V11Z"></path><path d="M4.16,12L12.08,4.08L13.5,5.5L5.58,13.42L4.16,12Z"></path><path d="M5.58,10.58L13.5,18.5L12.08,19.92L4.16,12L5.58,10.58Z"></path>'
		}
	}

	close(shouldpopstate = true) {
		if(!this.opened) return;
		this.opened = false;

		if(shouldpopstate) {
			history.back();
		}

		window.scrollTo(0, this.scrollBefore);

		this.sections.style.position = "relative";
		this.style.display = "none";
	}

	open(name, clickEvent, color, leftActionButton, previousLeftActionButton, title, previousTitle, rightActionButtons, innerHTML) {
		if(this.opened) return;
		this.opened = true;

		history.pushState({
			view: "sv",
			previous: history.state.view
		}, "", "");

		this.style.display = "block";

		this.titleel.innerHTML = title;
		this.headerBackdrop.style.background = color;
		this.headerBackdrop.style.display = "block";

		this.labsvg.innerHTML = this.fullsvgs[leftActionButton];

		this.scrollBefore = document.body.scrollTop;
		
		this.main.style.opacity = 1;

		this.sections.style.position = "fixed";

		window.scrollTo(0, 0);

		this.themecolorbefore = this.meta.getAttribute("content");
		this.meta.setAttribute("content", color);
	}

	_onpopstate(e) {
		if(e.state.view != "sv" && this.opened) {
			this.close(false);
		}
		if(e.state.view == "sv" && !this.opened) {
			history.back();
		}
	}
}

window.customElements.define("second-view", secondView);

window["sv"] = document.getElementsByTagName("second-view")[0];

document.body.setAttribute("feature-sv", "");