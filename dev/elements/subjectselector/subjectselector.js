__USE("cssinject.js");

cssinject(`//<-inject:../../elements/subjectselector/subjectselector.css->//<-inject:../../ui/checkbox/checkbox.css->`);

const subjects = __SSR("subjects");

class SubjectSelector extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		console.log(subjects);
		this.innerHTML = `<div class="${classid("setting_card")}"></div>`;
		this.render();
	}

	render() {
		let subjectlist = subjects.sort((a, b) => {
			if(a.name < b.name) {
				return -1;
			}
			else {
				return 1;
			}
		});
		for(let i in subjectlist) {
			let el = document.createElement("label");
			el.classList = classid("subject_select_label");
			el.innerHTML = `<input type="checkbox" class="${classid("materialcheckbox") + " " + classid("subject_select_checkbox")}"></input>${subjectlist[i].name}`;
			this.firstChild.appendChild(el);
		}
	}
}

window.customElements.define("subject-selector", SubjectSelector);