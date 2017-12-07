__USE("cssinject.js");


__USE("scriptinject.js");

__SSR("cascadingscript");


cssinject(`//<-inject:../settings/settings.css->`);

__USE("header.js");
__USE("header-title.js");

__USE("loading-outro.js");

__USE("settingspage.js");

__USE("storagemanager.js");

const totalSubjects = __SSR("totalSubjects");

class settingsPanel extends HTMLElement {
	constructor() {
		super();
		window.storagemanager.addHook("dispatch", newVal => {
			document.getElementById(classid("reset_dispatch_hint")).innerHTML = this.resetDispatchHint;
		});

		window.storagemanager.addHook("subjectBlackList", newVal => {
			document.getElementById(classid("subject_select_hint")).innerHTML = this.subjectSelectHint;
		});
	}

	get template() {
		return `//<-inject:../settings/settings.html->`;
	}

	get subjectSelectHint() {
		return `${totalSubjects - window.storagemanager.retrieve("subjectBlackList", []).length} von ${totalSubjects} Fächern ausgewählt`;
	}

	get resetDispatchHint() {
		let list = window.storagemanager.retrieve("dispatch", []);
		return `${list.length} ${(list.length == 1) ? "Eintrag" : "Einträge"} als erledigt markiert`;
	}

	connectedCallback() {
		this.innerHTML = this.template;
		loadingOutro();

		this.settingPages = document.getElementsByTagName("setting-pages")[0];
		
		document.getElementById(classid("settings_view")).addEventListener("ripple-click", this.clickAction.bind(this));
		document.getElementById(classid("settings_view")).addEventListener("click", this.clickAction.bind(this));
	}

	clickAction(e) {
		if(e.type == "click" && document.createElement("ripple-effect").constructor !== HTMLElement) {
			return;
		}
		if(e.target.hasAttribute("pageopener")) {
			this.settingPages.open(e.target.querySelector("." + classid("settings_box_title")));
		}
		if(e.target.hasAttribute("clickable")) {
			switch(e.target.getAttribute("action")) {
				case "resetDispatch":
					window.storagemanager.set("dispatch", []);
					break;
			}
		}
	}
}

window.customElements.define("section-settings", settingsPanel);