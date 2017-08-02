/*
expandfunction:
er(x) = 1 / (-1.0015 ^ x) + 1
er'(x) = (1.0015 ^ -x) * log(1.0015)


releasefunction:
rr(x) = 1 / (1.001 ^ -x)  || 1 / (1.001 ^ (-x -diffx)) + diffy
rr'(x) = (1.001 ^ x) * log(1.001)
x = (-log(rr') + log(log(1.001)) / log(1000) - log(1001))
*/

class rippleEffect extends HTMLElement {
	constructor() {
		super();
		this.expandBasis = 3;
		this.releaseparameter = 10;
		this.collapseparameter = -15;



		this.attached = false;
		this.state = 0; //0: hidden, 1: expanding, 2: retrieving, 3: releasing
		this.endStart = null;
		this.a = 0;
		this.b = 0;
		this.releaseDuration = 300;
	}

	static get observedAttributes() {
		return ["color", "opacity"];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if(!this.attached) {
			return;
		}
		this[name] = newValue;
	}


	get color() {
		return this.getAttribute("color") || "#fff";
	}
	get opacity() {
		return this.getAttribute("opacity") || 0.6;
	}
	get cancelOnMove() {
		return this.hasAttribute("cancel-on-move");
	}

	set color(val) {
		this.style.background = val;
	}
	set opacity(val) {
		this.style.opacity = val;
	}

	connectedCallback() {
		this.parentNode.style.overflow = "hidden";
		this.parentNode.style.position = "relative";
		this.style.background = this.color;
		this.style.opacity = this.opacity;

		this.parentNode.addEventListener("mousedown", this.start.bind(this));
		this.parentNode.addEventListener("mouseup", this.release.bind(this));
		this.parentNode.addEventListener("mouseleave", this.collapse.bind(this));

		this.parentNode.addEventListener("mousemove", this.move.bind(this));

		this.parentNode.addEventListener("touchstart", this.start.bind(this), {passive: true});
		this.parentNode.addEventListener("touchmove", this.move.bind(this), {passive: true});
		this.parentNode.addEventListener("touchend", this.release.bind(this), {passive: true});

		this.attached = true;
	}

	/**
	 * starts a ripple based on the touch / click event. Prevents spamming
	 * @param  {Event}
	 */
	start(e) {
		if(this.state !== 0) {
			return;
		}
		this.state = 1;

		const size = e.target.getBoundingClientRect();

		if(e.type == "touchstart") {
			e.offsetX = e.touches[0].pageX - size.left - pageXOffset;
			e.offsetY = e.touches[0].pageY - size.top - pageYOffset;
		}


		const d1 = Math.sqrt(e.offsetX ** 2 + e.offsetY ** 2);
		const d2 = Math.sqrt((size.width - e.offsetX) ** 2 + e.offsetY ** 2);
		const d3 = Math.sqrt((size.width - e.offsetX) ** 2 + (size.height - e.offsetY) ** 2);
		const d4 = Math.sqrt(e.offsetX ** 2 + (size.height - e.offsetY) ** 2);

		this.coverRadius = Math.max(d1, d2, d3, d4);


		this.offset = `translate(calc(${e.offsetX}px - 50%), calc(${e.offsetY}px - 50%))`;
		this.style.opacity = this.opacity;

		this.startTime = performance.now();
		window.requestAnimationFrame(this.frame.bind(this));
	}

	release() {
		if(this.state != 1) {
			return;
		}
		this.state = 3;
		this.parentNode.dispatchEvent(new Event("ripple-click"));
	}

	collapse() {
		if(this.state != 1) {
			return;
		}
		this.state = 2;
	}

	move(e) {
		if(e.type == "touchmove") {
			var container = e.target.getBoundingClientRect();
			var x = e.touches[0].pageX - pageXOffset;
			var y = e.touches[0].pageY - pageYOffset;

			if(x < container.left || x > container.width + container.left || y < container.top || y > container.height + container.top) {
				this.collapse();
				return;
			}
		}

		if(e.movementX == 0 && e.movementY == 0) {
			return;
		}

		if(this.cancelOnMove) {
			this.collapse();
		}
	}

	frame(stmp) {
		var x = (stmp - this.startTime) / 1000;
		if(this.state != 1 && !this.endStart) {
			this.endStart = stmp;
			this._calcFunction(x);
		}
		var f;
		var elapsedTime = stmp - this.endStart

		if(this.state == 1) {
			f = (-1 / Math.pow(this.expandBasis, x)) + 1;
		}
		if(this.state == 2) {
			f = Math.max((Math.pow((x - this.a), 2) * this.collapseparameter) + this.b, 0);
		}
		if(this.state == 3) {
			f = (Math.pow((x - this.a), 2) * this.releaseparameter) + this.b;
			this.style.opacity = (1 - (elapsedTime / this.releaseDuration)) * this.opacity;
		}

		this.style.transform = `${this.offset} scale(${this.coverRadius * f / 1000})`;



		if((this.state == 3 && elapsedTime > this.releaseDuration) || (this.state == 2 && f == 0)) {
			this.state = 0;
			this.endStart = null;
			return;
		}

		window.requestAnimationFrame(this.frame.bind(this));
	}

	_calcFunction(x) {
		var xatelevation, yatelevation;
		const elevation = Math.pow(this.expandBasis, x * -1) * Math.log(this.expandBasis);
		if(this.state == 3) {
			xatelevation = elevation / (this.releaseparameter * 2);
		}
		else {
			xatelevation = elevation / (this.collapseparameter * 2);
		}


		const yatx = (-1 / Math.pow(this.expandBasis, x)) + 1;
		if(this.state == 3) {
			yatelevation = Math.pow(xatelevation, 2) * this.releaseparameter;
		}
		else {
			yatelevation = Math.pow(xatelevation, 2) * this.collapseparameter;
		}

		this.a = x - xatelevation;
		this.b = yatx - yatelevation;
	}
}

window.customElements.define("ripple-effect", rippleEffect);