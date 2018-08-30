__USE("cssinject.js");

cssinject(`//<-inject:../../elements/subjectselector/subjectselector.css->//<-inject:../../ui/checkbox/checkbox.css->`);

__USE("storagemanager.js");

const subjects = __SSR("subjects");

class SubjectSelector extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.innerHTML = `<div class="${classid("setting_card")}"></div>`;
		this.render();
		this.addEventListener("change", e => {
			if(!e.target.checked) {
				window.storagemanager.arradd("subjectBlackList", e.target.getAttribute("uuid"));
			}
			else {
				window.storagemanager.arrremove("subjectBlackList", e.target.getAttribute("uuid"));
			}
		});
	}

	render() {
		let blacklist = window.storagemanager.retrieve("subjectBlackList", []);
		let subjectlist = subjects.sort((a, b) => {
			if(a.name < b.name) {
				return -1;
			}
			else {
				return 1;
			}
		});
		for(let i in subjectlist) {
			let txt = subjectlist[i].name + ((subjectlist[i].detail.length > 0) ? " - " +  subjectlist[i].detail : "");
			let checked = (blacklist.indexOf(subjectlist[i].uuid) >= 0) ? "" : " checked";
			let el = document.createElement("label");
			el.classList = classid("subject_select_label");
			el.innerHTML = `<input type="checkbox"${checked} class="${classid("materialcheckbox") + " " + classid("subject_select_checkbox")}" uuid="${subjectlist[i].uuid}"></input>${txt}`;
			this.firstChild.appendChild(el);
		}
	}
}

window.customElements.define("subject-selector", SubjectSelector);