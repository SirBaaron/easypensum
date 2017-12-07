__USE("cssinject.js");

cssinject(`//<-inject:../settings/settingspage.css->`);

__USE("elementloader.js");

class SettingsPages extends HTMLElement {
	constructor() {
		super();
	}

	get template() {
		return `//<-inject:../settings/settingspage.html->`;
	}

	connectedCallback() {
		this.innerHTML = this.template;
		this.titleEl = document.getElementById(classid("setting_page_title"));
		this.settingsView = document.getElementById(classid("settings_view"));
		this.elementLoader = document.getElementById(classid("setting_page_element_loader"));

		document.getElementById(classid("setting_page_back")).addEventListener("click", this.close.bind(this));
	}

	open(nameEl) {
		this.scrollBefore = window.scrollY;
		this.titleEl.textContent = nameEl.textContent;
		this.style.transform = "translateX(0)";
		this.settingsView.style.transform = "translateX(-110%)";
		this._animateOpen();
		this._animateTitle(nameEl);
		this.elementLoader.open("subjectselector");
	}

	close() {
		this.style.transform = "translateX(110%)";
		this.settingsView.style.transform = "translateX(0%)";
		this._animateClose();
	}

	_animateTitle() {}

	_animateOpen() {
		window.scrollTo(0, 0);
		this.style.position = "initial";
		this.settingsView.style.position = "fixed";
	}

	_animateClose() {
		window.scrollTo(0, this.scrollBefore);
		this.style.position = "fixed";
		this.settingsView.style.position = "initial";
	}
}

window.customElements.define("setting-pages", SettingsPages);