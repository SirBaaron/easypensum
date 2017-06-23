var style = document.createElement("style");
style.textContent = `
	ripple-effect {
		display:block;
		height:2000px;
		width:2000px;
		position:absolute;
		top:0px;
		left:0px;
		border-radius:50%;
		pointer-events:none;
		will-change:transform;
		transform:scale(0);
	}
	*[noSelect] {
	    user-select: none;
		-webkit-touch-callout: none;
	    -webkit-user-select: none;
	    -khtml-user-select: none;
	    -moz-user-select: none;
	    -ms-user-select: none;
	    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
	}
	.card_detail, .card_subject {
		transition: opacity 0.2s cubic-bezier(.4,0,1,1), transform 0.3s cubic-bezier(.4,0,.2,1);
		will-change: transform;
	}
`;
document.head.appendChild(style);

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

		this.parentNode.addEventListener("touchstart", this.start.bind(this));
		this.parentNode.addEventListener("touchmove", this.move.bind(this));
		this.parentNode.addEventListener("touchend", this.release.bind(this));

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

class animationSyncer {
	constructor() {
		this.tasks = [];
		this.running = false;

		this.frame = this.frame.bind(this);
	}

	add(job) {
		return new Promise((resolve) => {
			job._startime = performance.now();
			job._resolve = resolve;


			this.tasks.push(job);

			if(!this.running) {
				this.running = true;
				window.requestAnimationFrame(this.frame);
			}
		});
	}

	frame(stmp) {
		this.tasks = this.tasks.filter(task => {
			var prgs = Math.min((stmp - task._startime) / task.duration, 1);
			var f = task.easing.yatx(prgs);

			task.el.style[task.property] = task.value(f);

			
			if(prgs == 1) {
				task._resolve();
				return false;
			}

			return true;
		});

		if(this.tasks.length) {
			window.requestAnimationFrame(this.frame);
		}
		else {
			this.running = false;
		}
	}
}
animation = new animationSyncer();

//DOTO: actually make easing
class cubicBezier {
	constructor(controlpoints) {

	}
	yatx(x) {
		return x;
	}
}




Object.defineProperties(entryCard.prototype, {
	"progressiveConstructor": {
		/**
		 * runs when the element gets upgraded
		 */
		value: function progressiveConstructor() {
			this.easing = new cubicBezier([.4, 0, .2, 1]);
			this.animationDuration = 200;
		}
	},
	"_expand": {
		/**
		 * Expand an element and reveal by sliding down
		 * @param  {Element} The container of the element that should get expanded
		 */
		value: function _expand(el) {
			if(this.animating) {
				return;
			}
			this.animating = true;
			el.style.display = "block";
			el.firstChild.style.transform = "translateY(-100%)";
			el.firstChild.style.willChange = "transform";

			const size = el.getBoundingClientRect().height;

			animation.add({
				el: el.firstChild,
				property: "transform",
				value: (prgs) => {
					return `translateY(-${(1 - prgs) * 100}%)`;
				},
				duration: this.animationDuration,
				easing: this.easing
			}).then(_ => {
				el.firstChild.style.willChange = "initial";
				this.animating = false;
			});

			this.followingSiblings.forEach(n => {
				n.fakeMove(-size, 0);
			});
		}
	},
	"_collapse": {
		/**
		 * Collapses Elements by sliding up
		 * @param  {Element} The element that should get collapsed
		 */
		value: function _collapse(el) {
			if(this.animating) {
				return;
			}
			this.animating = true;

			const size = el.getBoundingClientRect().height;

			el.firstChild.style.willChange = "transform";

			animation.add({
				el: el.firstChild,
				property: "transform",
				value: (prgs) => {
					return `translateY(-${prgs * 100}%)`;
				},
				duration: this.animationDuration,
				easing: this.easing
			}).then(_ => {
				el.firstChild.parentNode.style.display = "none";
				el.firstChild.style.willChange = "initial";
				this.animating = false;
			})

			this.followingSiblings.forEach(n => {
				n.fakeMove(0, -size);
			});
		}
	},
	"fakeMove": {
		/**
		 * Fake translate Element with transfrom from start to end. When finished, element will aways get to 0 translate
		 * @param  {Number} Position to start from
		 * @param  {Number}	Position to get to
		 */
		value: function fakeMove(from, to) {
			this.style.transform = `translateY(${from}px)`;
			
			animation.add({
				el: this,
				property: "transform",
				value: (prgs) => {
					return `translateY(${to * prgs + from * (1 - prgs)}px)`;
				},
				duration: this.animationDuration,
				easing: this.easing
			}).then(_ => {
				this.style.transform = "translateY(0px)";
			})
		}
	},
	"_updateText": {
		/**
		 * Update text with transition effect (fade out - change text- fade in)
		 * @param  {Element} The Element which holds the text
		 * @param  {[String]} New Value
		 * @return {[Promise]} Resolves as soon as the text gets replaced
		*/
		value: function _updateText(el, val) {
			return new Promise((resolve, reject) => {
				//if opacity == 0 transition events won't fire
				if(window.getComputedStyle(el).getPropertyValue("opacity") > 0) {
					const before = window.getComputedStyle(el).getPropertyValue("transition");

					el.style.transition = "opacity 0.15s cubic-bezier(.4, 0, 1, 1)";
					el.style.opacity = 0;

					var state = false;

					const listener = () => {
						if(!state) {
							el.innerHTML = val;
							el.style.transition = "opacity 0.15s cubic-bezier(0, 0, .2, 1)";
							el.style.opacity = 1;
							state = !state;
						}
						else {
							el.style.transition = before;
							el.removeEventListener("transitionend", listener);
							resolve();
						}
					}

					el.addEventListener("transitionend", listener);
				}

				else {
					el.innerHTML = val;
					resolve();
				}
			});
		}
	},
	"followingSiblings": {
		/**
		 * Get alle following cards in the current parent element
		 * @return {Array Node}
		 */
		get: function followingSiblings() {
			var nodes = [].slice.call(this.parentNode.childNodes).filter(v => {
				return v.nodeType == 1;
			});
			return nodes.splice(nodes.indexOf(this) + 1);
		}
	}
});

[].slice.call(document.getElementsByTagName("entry-card")).forEach(v => v.progressiveConstructor());