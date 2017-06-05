


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
			<button class="card_header" noSelect style="background:${this.color}">
				<span class="card_date">${this._compileDate(this.date)}</span>
				<span class="card_subject">${this.subject}</span>
				<span class="card_detail">${((this.detail.length > 0) ? "- " : "") + this.detail}</span>
				<ripple-effect opacity="0.4" cancel-on-move></ripple-effect>
			</button>
			<div class="card_body"><div class="card_container">
					<div class="card_content">${this._parseText(this.content)}</div>
				</div>
			</div>
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

class tabView {
	constructor() {
		this.selected = 0;
		this.tabWidth = 0;
		this.shell = document.getElementById(classid("tab_scrollshell"));
		this.host = document.getElementById(classid("tabhost"));

		window.addEventListener("resize", this.measure.bind(this));

		this.measure();
	}

	measure() {
		this.tabWidth = this.shell.getBoundingClientRect().width;
		this.tabs = [].slice.call(this.host.childNodes).filter(v => {
			return v.nodeType == 1; 
		});

		this.tabs.forEach(v => {
			var dim = v.getBoundingClientRect();
			v.height = dim.height;
		});

		this.host.style.transform = `translateZ(0) translateX(-${this.tabWidth * this.selected}px)`;
	}

	switchTab(index) {

		this.host.style.transform = `translateZ(0) translateX(-${this.tabWidth * index}px)`;
		

		const start = performance.now();

		const currentscroll = this.tabs[this.selected].scrollpos = window.scrollY;
		const goalscroll = this.tabs[index].scrollpos || 0;


		this.shell.style.height = `${Math.max(this.tabs[index].height, this.tabs[this.selected].height)}px`;
		
		//scrap when smooth scrolling comes
		const frame = stamp => {
			var progress = Math.min((stamp - start) / 250, 1);

			var scroll = currentscroll + (goalscroll - currentscroll) * progress;

			window.scrollTo(0, scroll);

			if(stamp - start > 250) {
				finish();
				return;
			}
			window.requestAnimationFrame(frame);
		}

		window.requestAnimationFrame(frame);

		const finish = () => {
			this.shell.style.height = `${this.tabs[index].height}px`;
			this.selected = index;
		}
	}
}

var tabManager;

class Overview {
	constructor() {
		this.shell = document.getElementById(classid("overview"));
		this.splashheader = document.getElementById(classid("splashheader"));
		this.splashloadinganimation = document.getElementById(classid("splashloadinganimation"));

		this.init();
	}

	get template() {
		return `
			<div id="overview_header_one">
				<svg class="drawerToggle" viewBox="0 0 24 24">
					<path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"></path>
				</svg>
				<span class="section_title">Übersicht</span>
			</div>
			<div id="overview_header">
				<div style="height: 32px; display: flex">
					<div id="updateinfo">Zuletzt aktualisiert vor 20 Minuten</div>
					<div id="update">
						<svg viewBox="0 0 24 24">
							<path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"></path>
						</svg>
					</div>
				</div>
				<div id="header_row_3">
					<button class="headerButton" noSelect>Hausaufgaben<ripple-effect opacity="0.4" cancel-on-move></ripple-effect></button>
					<button class="headerButton" noSelect>Zeug<ripple-effect opacity="0.4" cancel-on-move></ripple-effect></button>
					<button class="headerButton" noSelect>fsdgefg dsfghdeh dhd<ripple-effect opacity="0.4" cancel-on-move></ripple-effect></button>
				</div>
			</div>
			<div id="tab_scrollshell">
				<div id="tabhost" style="width: 300%;">
					<div>
						<entry-card subject="subject" content="Link: www.google.com§brfull Link: https://www.google.com§brEmail: aaron.laengert@gmail.com" date="2017-04-23" color="pink" detail="test"></entry-card>
						<entry-card subject="zu Faul" content="blob" date="2017-04-17" color="gold" detail="idk"></entry-card>
						<entry-card subject="Mathe" content="some serious stuff §br and newlines§br§br§br§br§br§br§br§brloooong post.." date="2017-06-12" color="blue" detail=""></entry-card>
					</div>
					<div></div>
					<div></div>
				</div>
			</div>
		`;
	}

	get css() {
		return `
			#tab_scrollshell {
				width: 100%;
				overflow: hidden;
				display: none;
				animation: cards-intro 0.4s cubic-bezier(0, 0, .2, 1);
			}
			
			#tabhost {
				display: flex;
				overflow: hidden;
				transform: translateZ(0);
				transition: transform 0.25s ease-in-out;
				align-items: flex-start;
			}
			
			#tabhost > div {
				flex: 1;
			}
			
			
			button, button:active {
				background: transparent;
				border: none;
				outline: none;
			}
			#overview_header_one {
				height: 32px;
				position: fixed;
				top: 0px;
				right: 0px;
				left: 0px;
				z-index: 2;
				background: #D68800;
				white-space: nowrap;
				transform: translateZ(0);
				opacity: 0;
			}
			
			@media screen and (min-width: 800px) {
				#overview_header_one, #overview_header {
					left: 250px;
				}
			}
			
			#overview_header {
				height: 72px;
				background: #D68800;
				position: -webkit-sticky;
				position: sticky;
				top: 0px;
				margin-top: 32px;
				overflow: hidden;
				z-index: 1;
				transform: translateZ(0);
				opacity: 0;
			}
			
			.drawerToggle {
				height: 40px;
				width: 28px;
				padding-left: 10px;
				fill: white;
				float: left;
			}
			
			svg > path {
				pointer-events: none !important;
			}
			
			.section_title {
				display: inline;
				padding-left: 15px;
				line-height: 40px;
				font-size: 150%;
				color: white;
			}
			
			#updateinfo {
				width: 100%;
				text-align: right;
				line-height: 32px;
				font-size: 75%;
				color: #E0F2F1;
				padding-right: 7px;
				white-space: nowrap;
				max-width: calc(100% - 45px);
				overflow: hidden;
				text-overflow: ellipsis;
			}
			
			#update {
				margin-right: 10px;
				width: 25px;
				height: 25px;
				align-self: center;
				fill: white;
				flex-shrink: 0;
			}
			
			#header_row_3 {
				height: 40px;
				overflow: auto;
				white-space: nowrap;
				display: flex;
				position: relative;
			}
			
			.headerButton {
				flex: auto;
				font-size: 19px;
				line-height: 38px;
				cursor: pointer;
				padding: 0 20px;
				color: white;
				font-family: "Comic Sans MS";
				display: inline-block;
				flex-shrink: 0;
				text-align: center;
			}
			
			entry-card {
				margin: 10px 5px;
				box-sizing: border-box;
				display: block;
				overflow: hidden;
				contain: content;
			}
			
			.card_header {
				height: 55px;
				box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12), 0 3px 1px -2px rgba(0,0,0,.2);
				padding-left: 12px;
				overflow: hidden;
				position: relative;
				display: flex;
				transition: background 0.3s cubic-bezier(.4, 0, .2, 1);
				cursor: pointer;
				z-index: 1;
				width: 100%;
			}
			
			.card_header > span {
				color: white;
				font: 20px/55px 'Comic Sans MS';
				pointer-events: none;
				white-space: nowrap;
				overflow: hidden;
			}
			
			.card_subject {
				text-overflow: ellipsis;
				text-align: right;
				flex: 1;
			}
			
			.card_detail {
				position: absolute;
				right: 0px;
				transform: translateX(100%);
				box-sizing: border-box;
				opacity: 0;
			}
			
			.card_detail, .card_subject {
				padding-right: 16px;
			}
			
			
			.card_body {
				display: none;
				background: white;
			}
			
			.card_content {
				padding: 10px 15px;
				word-wrap: break-word;
			}
			
			.card_body a:link, .card_body a:visited {
				color: #FFC107;
				font-style: italic;
				text-decoration: none;
			}
			
			.card_body a:hover {
				font-style: normal;
			}
			
			.card_body a:active {
				opacity: 0.7;
			}
			
			@keyframes cards-intro {
				0% {
					opacity: 0;
					transform: translateY(20px);
				}
				100% {
					opacity: 1;
					transform: translateY(0px);
				}
			}
		`;
	}

	/**
	 * Those files will be loaded async
	 * @return {Array String}
	 */
	get lazyLoad() {
		return ["bundles/progressive.js"];
	}

	init() {
		var css = document.createElement("style");
		css.innerHTML = this.css;
		document.head.appendChild(css);

		this.lazyLoad.forEach(src => {
			var el = document.createElement("script");
			el.src = src;
			el.async = true;
			document.head.appendChild(el);
		});

		const splashdim = this.splashheader.getBoundingClientRect();
		const loaderdim = this.splashloadinganimation.getBoundingClientRect();
		
		this.splashheader.style.position = this.splashloadinganimation.style.position = "absolute";
		this.splashheader.style.left = this.splashloadinganimation.style.left = `${splashdim.left}px`;
		this.splashloadinganimation.style.top = `${loaderdim.top}px`;
		this.splashloadinganimation.style.right = this.splashloadinganimation.style.bottom = this.splashheader.style.top = this.splashheader.style.right = "0px";

		this.splashloadinganimation.style.opacity = 1;
		this.splashheader.style.transition = this.splashloadinganimation.style.transition = "transform 0.3s ease-in-out, opacity 0.2s linear";
		this.splashheader.style.transformOrigin = "top";
		this.splashheader.style.transform = "scaleY(2.08)";
		this.splashloadinganimation.style.opacity = 0;

		const evhandler = e => {
			if(e.propertyName == "transform") {
				e.target.style.opacity = 0;
				this.headerone.style.opacity = this.header.style.opacity = 1;
				this.tabshell.style.display = "block";
			}
			if(e.propertyName == "opacity") {
				e.target.parentNode.removeChild(e.target);
			}
		}

		this.splashheader.addEventListener("transitionend", evhandler);
		this.splashloadinganimation.addEventListener("transitionend", evhandler);

		this.shell.innerHTML = this.template;

		this.headerone = document.getElementById(classid("overview_header_one"));
		this.header = document.getElementById(classid("overview_header"));
		this.tabshell = document.getElementById(classid("tab_scrollshell"));

		tabManager = new tabView();
	}

	
}
new Overview();


// cubicBezier = (x, points) => {
// 	// return (Math.pow((1 - x), 3) * points[0]) + (3 * Math.pow((1 - x), 2) * x * points[1]) + (3 * (1 - x) * Math.pow(x, 2) * points[2]) + (Math.pow(x, 3) * points[3]);
// 	//u^3(c0 + 3c1 -3c2 +c3) + u^2(3c0 -6c1 +3c2) + u(-3c0 +3c1) + c0
// 	// return Math.pow(x, 3) * (points[0] + 3 * points[1] - 3 * points[2] + points[3]) + Math.pow(x, 2) * (3 * points[0] - 6 * points[1] + 3 * points[2]) + x * (-3 * points[0] + 3 * points[1]) + points[0];
// 	//((1 - x)³ * a) + (3 * (1 - x)² * x * 	b) + (3 * (1 - x) * x² * c) + (x³ * d)
// }

// class cubicBezier {
// 	constructor(controlpoints) {
// 		//controlpoints: [p1x, p1y, p2x, p2y]
// 		this.C1x = 3 * controlpoints[0];
// 		this.C1y = 3 * controlpoints[1];
// 		this.C2x = 3 * controlpoints[2] - 6 * controlpoints[0];
// 		this.C2y = 3 * controlpoints[3] - 6 * controlpoints[1];
// 		this.C3x = 3 * controlpoints[0] - 3 * controlpoints[2] + 1;
// 		this.C3y = 3 * controlpoints[1] - 3 * controlpoints[3] + 1;
// 	}

// 	yatx(x) {
// 		if(x == 0) {
// 			return 0;
// 		}
// 		const p = 3 * this.C3x * this.C1x - this.C2x ** 2;
// 		const q = 2 * this.C2x ** 3 - 9 * this.C3x * this.C2x * this.C1x + 27 * this.C3x ** 2 * -x;

// 		const d = q ** 2 + 4 * p ** 3;

// 		console.log(d);

// 		if(d > 0) {
// 			const a = 4 * Math.sqrt(q ** 2 + 4 * p **3);
// 			console.log(a);

// 			const u = .5 * (-4 * q + a) ** (1 / 3)
// 			const v = -.5 * Math.abs(-4 * q - a) ** (1 / 3)

// 			console.log("test: ", (-4 * q - a));
// 			console.log(u, v);

// 			const y = u + v;

// 			return (y - this.C2x) / (3 * this.C3x);
// 		}

// 		// var a, b, c;
// 		// if(this.C3x == 0) {
// 		// 	a = this.C2x;
// 		// 	b = this.C1x;
// 		// 	c = -x
// 		// }
// 		// else {
// 		// 	a = this.C2x / this.C3x;
// 		// 	b = this.C1x / this.C3x;
// 		// 	c = -x / this.C3x;
// 		// }

// 		// const p = b - ((a ** 2) / 3);
// 		// const q = ((2 * (a ** 3)) / 27) - ((a * b) / 3) + c;


// 		// const delta = ((q / 2) ** 2) + ((p / 3) ** 3);	//no cubic square, instead to the power of 1 / root

// 		// var t;
// 		// // console.log("delta", delta);

// 		// if(delta > 0) {
// 		// 	// console.log("first fall D > 0");
// 		// 	const u = (-(q / 2) + Math.sqrt(delta) ** (1 / 3));
// 		// 	const v = -((Math.abs(-(q / 2) - Math.sqrt(delta))) ** (1 / 3));	//Can't pow a negative number, so pow the abs and negate it afterwards

// 		// 	t = u + v - (this.C2x / (3 * this.C3x));
// 		// }
// 		// else if(delta < 0) {
// 		// 	// console.log("third fall D < 0");

// 		// 	// console.log((-q / 2) * Math.sqrt(27 / (Math.abs(p) ** 3)));

// 		// 	t = Math.sqrt(-(4 / 3) * p) * Math.cos((1 / 3) * Math.acos(-(q / 2) * Math.sqrt(-(27 / (p ** 3))))) - (this.C2x / (3 * this.C3x));



// 		// 	// t = Math.sqrt((-4 / 3) * p) * Math.cos((1 / 3) * Math.acos((-q / 2) * Math.sqrt(27 / (Math.abs(p) ** 3))) + (Math.PI / 3)) - (this.C2x / (3 * this.C3x));

// 		// }
// 		// else {
// 		// 	alert("D == 0 !");
// 		// }

		

// 		// const y = (t ** 3) * this.C3y + (t ** 2) * this.C2y + t * this.C1y;
		
// 		// return y;


// 	}

// }

// const bezier = [0.4, 0, 0.2, 1];
// const bezier = [0, 0, 1, 1];


// const cs = new cubicBezier(bezier);

// console.log(cs.yatx(0.5));

// document.body.innerHTML = `<canvas height=500 width=500 style="border: 2px red solid" id="test"></canvas>`;

// var canvas = document.getElementById("test").getContext("2d");
// canvas.fillStyle = "green";
// canvas.strokeStyle = "rgba(0, 0, 255, 0.6)";

// canvas.beginPath();

// canvas.moveTo(0, 500);
// canvas.bezierCurveTo(bezier[0] * 500, 500 - bezier[1] * 500, bezier[2] * 500, 500 - bezier[3] * 500, 500, 0);

// canvas.stroke();

// for(var i = 0; i < 1; i += 0.02) {
// 	canvas.beginPath();
// 	canvas.arc(i * 500, 500 - cs.yatx(i) * 500, 3, 0, 2 * Math.PI);
// 	canvas.fill();
// }