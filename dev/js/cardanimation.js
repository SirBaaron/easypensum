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

			const sizebefore = this.getBoundingClientRect().height;

			el.style.display = "block";
			el.firstChild.style.transform = "translateY(0%)";
			el.firstChild.style.willChange = "transform";

			const size = el.getBoundingClientRect().height;

			const ratio = sizebefore / (size + sizebefore);

			animation.add({
				el: el.firstChild,
				property: "transform",
				value: (prgs) => {
					return `translateY(${(prgs) * 100}%)`;
				},
				duration: this.animationDuration,
				easing: this.easing
			}).then(_ => {
				el.firstChild.style.willChange = "initial";
				this.animating = false;
			});

			animation.add({
				el: this.shadow,
				property: "transform",
				value: (prgs) => {
					return `scaleY(${(1 - ratio) * prgs + ratio})`;
				},
				duration: this.animationDuration,
				easing: this.easing
			}).then(_ => {
				this.shadow.style.transform = "";
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

			const wholesize = this.getBoundingClientRect().height;
			const size = el.getBoundingClientRect().height;

			const ratio = (wholesize - size) / wholesize;

			el.firstChild.style.willChange = "transform";

			animation.add({
				el: el.firstChild,
				property: "transform",
				value: (prgs) => {
					return `translateY(${(1 - prgs) * 100}%)`;
				},
				duration: this.animationDuration,
				easing: this.easing
			}).then(_ => {
				el.firstChild.parentNode.style.display = "none";
				el.firstChild.style.willChange = "initial";
				this.animating = false;
			});

			animation.add({
				el: this.shadow,
				property: "transform",
				value: (prgs) => {
					return `scaleY(${(1 - ratio) * (1 - prgs) + ratio})`;
				},
				duration: this.animationDuration,
				easing: this.easing
			}).then(_ => {
				this.shadow.style.transform = "";
			});

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
			this.style.willChange = "transform";
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
				this.style.willChange = "initial";
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