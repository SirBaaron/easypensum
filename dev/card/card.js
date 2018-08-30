__USE("cssinject.js");

cssinject(`//<-inject:../card/card.css->`);

__USE("share.js");

__USE("storagemanager.js");

class entryCard extends HTMLElement {
	constructor(param) {
		super();
		this.data = param;

		this.expanded = false;
		this.detailWidth = undefined;
		this.infoOpen = false;
		this.contentHeight = undefined;
		this.infoHeight = undefined;
	}


	get template() {
		return `//<-inject:../card/card.html->`;
	}

	get color() {
		return this.data.color || "red";
	}
	get subject() {
		return this.data.subject || "";
	}
	get detail() {
		return this.data.detail || "";
	}
	get date() {
		return this.data.date || new Date();
	}
	get content() {
		return this.data.content || "";
	}
	get interactions() {
		return this.data.interactions || {};
	}
	get pinned() {
		return this.data.pinned || false;
	}
	get allowDispatch() {
		return this.data.allowDispatch || false;
	}
	get uuid() {
		return this.data.uuid || 0;
	}



	set color(val) {
		this.data.color = val;
		this.header.style.background = val;
	}
	set subject(val) {
		this.data.subject = val;
		this._updateText(this.cardSubject, val);
	}
	set detail(val) {
		this.data.detail = val;
		var txt = ((val.length > 0) ? "- " : "") + val;
		this._updateText(this.cardDetail, txt).then(this._measure.bind(this));
	}
	set date(val) {
		this.data.date = val;
		this._updateText(this.cardDate, this._compileDate(val));
	}
	set content(val) {
		this.data.content = val;
		this._updateText(this.cardContent, this._parseText(val));
	}
	set interactions(val) {
		this.data.interactions = val;
		this._updateText(this.info, this._compileInteractions(val));
	}
	set pinned(val) {
		this.data.pinned = val;
		this._updatePinned(val);
	}
	set allowDispatch(val) {
		this.data.allowDispatch = val;
	}

	connectedCallback() {
		this.innerHTML = this.template;


		this.header = this.querySelector("." + classid("card_header"));
		this.cardDetail = this.querySelector("." + classid("card_detail"));
		this.cardSubject = this.querySelector("." + classid("card_subject"));
		this.cardDate = this.querySelector("." + classid("card_date"));
		this.cardBody = this.querySelector("." + classid("card_body"));
		this.cardContent = this.querySelector("." + classid("card_content"));
		this.wrapper = this.querySelector("." + classid("card_wrapper"));

		this.actionfooter = this.querySelector("." + classid("card_actionfooter"));

		this.infoBody = this.querySelector("." + classid("card_info_body"));
		this.info = this.querySelector("." + classid("card_info"));

		this.shadow = this.querySelector("." + classid("card_shadow"));





		

		this.header.addEventListener("click", this.toggle.bind(this));
		this.header.addEventListener("ripple-click", this.toggle.bind(this));

		this.info.addEventListener("click", this.toggleInfo.bind(this));

		this.actionfooter.addEventListener("click", this.action.bind(this));


		window.setTimeout(this._measure.bind(this), 500);

		window.addEventListener("resize", this._measure.bind(this));

	}

	/**
	 * Gets called when a button from the actionbar gets pressed
	 * @param  {Event} e the click event
	 */
	action(e) {
		if(e.target == this.actionfooter) return;
		switch(e.target.getAttribute("value")) {
			case "info":
				this.toggleInfo();
				break;
			case "done":
				cards.dispatch(this);
				break;
			case "edit":
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

				window.sv.open("edit", e, this.color, "back", previousactionbutton, "Bearbeiten", titleel);
				break;
			case "share":
				let txt = `Bis ${this._compileDate(this.date)} in ${this.subject}:\n${this.content.replace(/§br/g, "\n")}\n\n`;
				window.shareTxt(txt, "Easy Pensum Eintrag");
				break;
			case "pin":
				this.pinned = !this.pinned;
				break;
		}
	}

	_updatePinned(val) {
		this.wrapper.setAttribute("pinned", val);
		if(val == true) {
			window.storagemanager.arradd("pinned", this.uuid);
		}
		else {
			window.storagemanager.arrremove("pinned", this.uuid);
		}

		let all = this.parentNode.childNodes;
		console.log("pinned?: ", val);
		let addBefore = cards.findAddBefore(this, all, val);

		if(addBefore != this.nextSibling) {
			this._reorderPinned(addBefore)
		}
	}

	_reorderPinned(before) {

	}

	remove() {
		this.parentNode.removeChild(this);
	}

	toggleInfo() {
		if(!this.infoHeight) {
			this._measure();
		}

		if(!this.infoOpen) {
			this._expand(this.infoBody, this.infoHeight);
			this.infoOpen = true;
		}
		else {
			this._collapse(this.infoBody, this.infoHeight);
			this.infoOpen = false;
		}
	}

	/**
	 * Measures dimensions so that they don't always have to be calculated
	 */
	_measure() {
		this.cardBody.style.display = "block";
		this.infoBody.style.display = "block";

		this.detailWidth = this.cardDetail.getBoundingClientRect().width;
		this.infoHeight = this.infoBody.getBoundingClientRect().height;
		this.contentHeight = this.cardBody.getBoundingClientRect().height - this.infoHeight;

		if(!this.expanded) {
			this.cardBody.style.display = "none";
		}
		if(!this.infoOpen) {
			this.infoBody.style.display = "none";
		}

		if(this.expanded) {
			this.cardSubject.style.transform = `translateX(${-this.detailWidth + 10}px)`;
		}

	}

	/**
	 * Turns the JSON structure of interactions into readable lines.
	 * @param  {Object} interactions an Object with creation and changes
	 * @return {DOMString}              The readable output
	 */
	_compileInteractions(interactions) {
		var str = `Erstellt: ${this._compileDate(interactions.created, "am ")} um ${this._extractTime(interactions.created)}
					<br>Von: ${interactions.creator}`;

		for(var i in interactions.changed) {
			str += `<br><i>Verändert ${this._compileDate(interactions.changed[i].time, "am ")} um ${this._extractTime(interactions.changed[i].time)}
			 von ${interactions.changed[i].user}</i>`;
		}
		return str;
	}

	/**
	 * extracts the hour and minute component of a dateTime
	 * @param  {String} dte a parseable datetime String
	 * @return {String}     The time in the format hh:mm
	 */
	_extractTime(dte) {
		let p = dte.split(/[^0-9]/);
		let d = new Date(p[0],p[1]-1,(p[2] || 0),(p[3] || 0),(p[4] || 0));
		let h = d.getHours();
		let m = d.getMinutes();
		return `${
			(h > 9) ? "" : "0"
		}${h}:${
			(m > 9) ? "" : "0"
		}${m}`;
	}

	/**
	 * Compiles a Date to a human readable format, with words if possible
	 * @param  {Date}
	 * @return {String}
	 */
	_compileDate(dte, prefix = "") {
		const now = new Date();
		let p = dte.split(/[^0-9]/);
		const date = new Date(p[0],p[1]-1,(p[2] || 0),(p[3] || 0),(p[4] || 0));
		const diff = Math.ceil((date.getTime() - now.getTime()) / 86400000);

		switch(true) {
			case (diff == -7):
				return "Vor einer Woche";
				break;
			case (diff < -2 && diff > -7):
				return `Vor ${Math.abs(diff)} Tagen`;
				break;
			case (diff == -2):
				return "Vorgestern";
				break;
			case (diff == -1):
				return "Gestern";
				break;
			case (diff == 0):
				return "Heute";
				break;
			case (diff == 1):
				return "Morgen";
				break;
			case (diff == 2):
				return "Übermorgen";
				break;
			case (diff > 2 && diff < 7):
				return `in ${diff} Tagen`;
				break;
			case (diff == 7):
				return "In einer Woche";
				break;
			default:
				return `${prefix}${date.getDate()}.${(date.getMonth() + 1)}`;
				break;
		}
	}

	/**
	 * Prevent xss and format links & mail adresses to clickable links
	 * @param  {String}
	 * @return {String}
	 */
	_parseText(txt) {
		return txt
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/§br/g, "<br>")
			.replace(/(?:(https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm, (m, p) => {
				return `<a href='${
					p ? m : "http://" + m
				}' target='_blank' rel='noopener'>${m}</a>`;
			})
			.replace(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/img, "<a target='_blank' rel='noopener' href='mailto:$&'>$&</a>");
	}

	/**
	 * toggle card. Will ignore click events if ripple events are loaded
	 * @param  {Event}
	 */
	toggle(e) {
		if(e.type == "click" && document.createElement("ripple-effect").constructor !== HTMLElement) {
			return;
		}
		if(this.expanded) {
			this.close();
		}
		else {
			this.open();
		}
	}

	/**
	 * Open the card.
	 */
	open() {
		if(this.detailWidth === undefined || this.contentHeight === undefined) {
			this._measure();
		}

		if(this.detail.length > 0) {
			this.cardSubject.style.transform = `translateX(${-this.detailWidth + 10}px)`;
			this.cardDetail.style.transform = "translateX(0%)";
			this.cardDetail.style.opacity = 1;
		}

		this._expand(this.cardBody, (this.contentHeight + (this.infoOpen ? this.infoHeight : 0)));
		this._enlargeshadow();
		
		this.expanded = true;
	}

	/**
	 * Close the card.
	 */
	close() {
		this.cardSubject.style.transform = "translateX(0px)";
		this.cardDetail.style.transform = "translateX(100%)";
		this.cardDetail.style.opacity = 0;

		this._collapse(this.cardBody, (this.contentHeight + (this.infoOpen ? this.infoHeight : 0)));
		this._reduceshadow();

		this.expanded = false;
	}

	_enlargeshadow() {
		this.shadow.style.opacity = 1;
	}

	_reduceshadow() {
		this.shadow.style.opacity = "0.65";

	}

	_expand(el) {
		el.style.display = "block";
	}

	_collapse(el) {
		el.style.display = "none";
	}

	/**
	 * Update text
	 * @param  {Element} The Element which holds the text
	 * @param  {[String]} New Value
	 * @return {[Promise]} Resolves as soon as the text gets replaced
	 */
	_updateText(el, val) {
		el.innerHTML = val;
		return new Promise(resolve => resolve());
	}
}

window.customElements.define("entry-card", entryCard);