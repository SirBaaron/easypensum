

class entryCard extends HTMLElement {
	constructor() {
		super();
		this.expanded = false;
		this.detailWidth = undefined;

		this.attached = false;
	}

	static get observedAttributes() {
		return ["content", "subject", "color", "date", "detail"];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if(!this.attached) {
			return;
		}
		this[name] = newValue;
	}

	get template() {
		return `
			//<-inject:../html/card.html->
		`;
	}


	get content() {
		return this.getAttribute("content") || "";
	}
	get subject() {
		return this.getAttribute("subject") || "";
	}
	get color() {
		return this.getAttribute("color") || "#009688";
	}
	get date() {
		return this.getAttribute("date") || new Date();
	}
	get detail() {
		return this.getAttribute("detail") || "";
	}

	set color(val) {
		this.header.style.background = val;
	}
	set subject(val) {
		this._updateText(this.cardSubject, val);
	}
	set detail(val) {
		var txt = ((val.length > 0) ? "- " : "") + val;
		this._updateText(this.cardDetail, txt).then(this._measure.bind(this));
	}
	set date(val) {
		this._updateText(this.cardDate, this._compileDate(val));
	}
	set content(val) {
		this._updateText(this.cardContent, this._parseText(val));
	}

	connectedCallback() {
		this.innerHTML = this.template;

		this.header = this.querySelector("." + classid("card_header"));
		this.cardDetail = this.querySelector("." + classid("card_detail"));
		this.cardSubject = this.querySelector("." + classid("card_subject"));
		this.cardDate = this.querySelector("." + classid("card_date"));
		this.cardContainer = this.querySelector("." + classid("card_container"));
		this.cardBody = this.querySelector("." + classid("card_body"));
		this.cardContent = this.querySelector("." + classid("card_content"));

		

		this.header.addEventListener("click", this.toggle.bind(this));
		this.header.addEventListener("ripple-click", this.toggle.bind(this));

		this.attached = true;
		window.setTimeout(this._measure.bind(this), 500);
	}

	/**
	 * Measures dimensions needed for detail animation so that they don't always have to be calculated
	 */
	_measure() {
		this.detailWidth = this.cardDetail.getBoundingClientRect().width;
		if(this.expanded) {
			this.cardSubject.style.transform = `translateX(${-this.detailWidth + 10}px)`;
		}
	}

	/**
	 * Compiles a Date to a human readable format also with words if possible
	 * @param  {Date}
	 * @return {String}
	 */
	_compileDate(dte) {
		const now = new Date();
		const date = new Date(dte);
		const diff = Math.ceil((date.getTime() - now.getTime()) / 86400000);

		switch(true) {
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
				return `${date.getDate()}.${(date.getMonth() + 1)}`;
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
		if(this.detailWidth === undefined) {
			this._measure();
		}
		this.expanded = true;

		if(this.detailWidth > 16) {
			this.cardSubject.style.transform = `translateX(${-this.detailWidth + 10}px)`;
			this.cardDetail.style.transform = "translateX(0%)";
			this.cardDetail.style.opacity = 1;
		}

		this._expand(this.cardBody, this);
	}

	/**
	 * Close the card.
	 */
	close() {
		this.expanded = false;

		this.cardSubject.style.transform = "translateX(0px)";
		this.cardDetail.style.transform = "translateX(100%)";
		this.cardDetail.style.opacity = 0;

		this._collapse(this.cardBody);
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