//DOTO: actually make easing
class cubicBezier {
	constructor(controlpoints) {

	}
	yatx(x) {
		return x;
	}
}


Object.defineProperties(entryCard.prototype, {
	"easing": {
		value: new cubicBezier([0.4, 0, 0.2, 1])
	},
	"animationDuration": {
		value: 200
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

			this.animationStart = performance.now();
			window.requestAnimationFrame(stmp => {
				this._openframe(stmp, el.firstChild);
			});

			this.followingSiblings.forEach(n => {
				n.fakeMove(-size, 0);
			});
		}
	},
	"_openframe": {
		value: function _openframe(stmp, el) {
			var prgs = Math.min((stmp - this.animationStart) / this.animationDuration, 1);
			var f = this.easing.yatx(prgs);

			el.style.transform = `translateY(-${(1 - f) * 100}%)`;

			if(prgs < 1) {
				window.requestAnimationFrame(stmp => {
					this._openframe(stmp, el);
				});
			}
			else {
				this.animating = false;
				el.style.willChange = "initial";
			}
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

			this.animationStart = performance.now();
			window.requestAnimationFrame(stmp => {
				this._closeframe(stmp, el.firstChild);
			});

			this.followingSiblings.forEach(n => {
				n.fakeMove(0, -size);
			});
		}
	},
	"_closeframe": {
		value: function _closeframe(stmp, el) {
			var prgs = Math.min((stmp - this.animationStart) / this.animationDuration, 1);
			var f = this.easing.yatx(prgs);

			el.style.transform = `translateY(-${f * 100}%)`;

			if(prgs < 1) {
				window.requestAnimationFrame(stmp => {
					this._closeframe(stmp, el);
				});
			}
			else {
				el.parentNode.style.display = "none";
				el.style.willChange = "initial";
				this.animating = false;
			}
		}
	},
	"fakeMove": {
		/**
		 * Fake translate Element with transfrom from start to end. When finished, element will aways get to 0 translate
		 * @param  {Number} Position to start from
		 * @param  {Number}	Position to get to
		 */
		value: function fakeMove(from, to) {
			var cur = (this.style.transform.length > 0) ? this.style.transform.match(/\d+/g)[0] : 0;
			this.style.transform = `translateY(${cur + from}px)`;
			
			if(!this.moveque) {
				this.moveque = [];
			}
			this.moveque.push({
				from: from,
				to: to,
				start: performance.now()
			});
			if(!this.activeMove) {
				window.requestAnimationFrame(this._moveFrame.bind(this));
				this.activeMove = true;
			}
		}
	},
	"_moveFrame": {
		value: function _moveFrame(stmp) {
			var tot = 0;

			this.moveque = this.moveque.filter(m => {
				var prgs = Math.min((stmp - m.start) / this.animationDuration, 1);
				var f = this.easing.yatx(prgs);
				tot += m.to * f + m.from * (1 -f);
				if(prgs == 1) {
					return false;
				}
				return true;
			});
			
			this.style.transform = `translateY(${tot}px)`;
			
			if(this.moveque.length > 0) {
				window.requestAnimationFrame(this._moveFrame.bind(this));
			}
			else {
				this.style.transform = "translateY(0px)";
				this.activeMove = false;
			}

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