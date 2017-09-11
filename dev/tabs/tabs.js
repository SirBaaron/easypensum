__USE("cssinject.js");

cssinject(`//<-inject:../tabs/tabs.css->`);



class tabView extends HTMLElement {
	constructor() {
		super();

		this.selected = 0;
		this.tabWidth = 0;
	}

	get template() {
		return `//<-inject:../tabs/tabs.html->`;
	}

	connectedCallback() {

		this.innerHTML = this.template;

		this.host = document.getElementById(classid("tabhost"));

		window.addEventListener("resize", this.measure.bind(this));

		this.measure();
	}

	measure() {
		this.tabWidth = this.getBoundingClientRect().width;
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


		this.style.height = `${Math.max(this.tabs[index].height, this.tabs[this.selected].height)}px`;
		
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
			this.style.height = `${this.tabs[index].height}px`;
			this.selected = index;
		}
	}
}

window.customElements.define("tab-view", tabView);