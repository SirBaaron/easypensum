__USE("cssinject.js");

cssinject(`//<-inject:../tabs/tabs.css->`);



class tabView extends HTMLElement {
	constructor() {
		super();

		this.selected = 0;
		this.tabWidth;

		this.ratioMax = 0.6;
		this.minX = 30;
	}

	get template() {
		return `//<-inject:../tabs/tabs.html->`;
	}

	connectedCallback() {

		this.innerHTML = this.template;

		this.host = document.getElementById(classid("tabhost"));
		this.overview = document.getElementsByTagName("section-overview")[0];

		window.addEventListener("resize", this.measure.bind(this), {passive: true});
		this.addEventListener("touchmove", this._touchmove.bind(this), {passive: true});
		this.addEventListener("touchstart", this._touchstart.bind(this), {passive: true});
		this.addEventListener("selectstart", _ => {
			this.touchstart = null;
		}, {passive: true})

		window.setTimeout(this.measure.bind(this), 100);
	}

	_touchstart(e) {
		this.touchstart = e.touches[0];
	}

	_touchmove(e) {
		if(this.touchstart == null) {
			return;
		}
		let xdiff = e.touches[0].screenX - this.touchstart.screenX;
		let ydiff = e.touches[0].screenY - this.touchstart.screenY;
		
		if(Math.abs(ydiff / xdiff) < this.ratioMax && Math.abs(xdiff) > this.minX) {
			this.touchstart = null;
			let newIndex = xdiff < 0 ? this.selected + 1 : this.selected - 1;
			if(newIndex < 0 || newIndex >= this.tabs.length) {
				return;
			}
			let name = this.tabs[newIndex].getAttribute("name");
			this.switchTab(name);
		}
	}

	measure() {
		this.tabWidth = this.getBoundingClientRect().width;
		this.tabs = [].slice.call(this.host.childNodes);

		this.tabs.forEach(v => {
			v.height = v.getBoundingClientRect().height;
		});

		this.host.style.transform = `translateZ(0) translateX(-${this.tabWidth * this.selected}px)`;
	}

	switchTab(name) {
		var index = this.tabs.map(v => {
			return v.getAttribute("name");
		}).indexOf(name);

		if(index == this.selected || index < 0) {
			return;
		}

		this.host.style.transform = `translateZ(0) translateX(-${this.tabWidth * index}px)`;
		this.tabs[index].setAttribute("selected", "");

		const color = this.tabs[index].getAttribute("color");
		const currentscroll = this.tabs[this.selected].scrollpos = window.scrollY;
		const goalscroll = this.tabs[index].scrollpos || 0;


		this._animateSwitch(name, color, goalscroll, currentscroll).then(_ => {
			this.tabs[this.selected].removeAttribute("selected");
			this.selected = index;
		});

		

	}

	_animateSwitch(name, color, scroll) {
		window.scrollTo(0, scroll);
		this.overview.switchHeaderColor(color);
		this.overview.switchSelectedButton(name);
		return new Promise(resolve => resolve());
	}
}

window.customElements.define("tab-view", tabView);