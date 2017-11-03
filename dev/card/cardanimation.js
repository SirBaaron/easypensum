__USE("cssinject.js");

__USE("animationsyncer.js");

__USE("cubicbezier.js");

cssinject(`//<-inject:../card/cardanimation.css->`);




Object.defineProperties(entryCard.prototype, {
	"easing": {
		value: new cubicBezier([.4, 0, .2, 1])
	},
	"animationDuration": {
		value: 200
	},
	"closeanimationduration": {
		value: 250
	},
	"remove": {
		value: function remove() {
			const size = 55 + this.contentHeight + (this.infoOpen ? this.infoHeight : 0) + 10;
			this.wrapper.style.willChange = "transform";
			animation.add({
				el: this.wrapper,
				property: "transform",
				value: (prgs) => {
					return `scale(${1 - prgs})`;
				},
				duration: this.closeanimationduration,
				easing: this.easing
			}).then(_ => {
				this.parentNode.removeChild(this);
			});

			this.followingSiblings.forEach(n => {
				n.fakeMove(0, -size, this.closeanimationduration);
			});
		}
	},
	"_expand": {
		/**
		 * Expand an element and reveal by sliding down
		 * @param  {Element} The container of the element that should get expanded
		 */
		value: function _expand(el, size) {
			if(this.animating) {
				return;
			}
			this.animating = true;

			const sizebefore = this.expanded ? 55 + this.contentHeight : 55;

			el.style.display = "block";
			el.firstChild.style.transform = "translateY(0%)";
			el.firstChild.style.willChange = this.shadow.style.willChange = "transform";

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
				this.shadow.style.willChange = "initial";
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
		value: function _collapse(el, size) {
			if(this.animating) {
				return;
			}
			this.animating = true;

			const wholesize = 55 + this.contentHeight + (this.infoOpen ? this.infoHeight : 0);

			const ratio = (wholesize - size) / wholesize;

			el.firstChild.style.willChange = this.shadow.style.willChange = "transform";

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
				this.shadow.style.willChange = "initial";
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
		value: function fakeMove(from, to, duration = this.animationDuration) {
			this.wrapper.style.willChange = "transform";
			this.wrapper.style.transform = `translateY(${from}px)`;
			
			animation.add({
				el: this.wrapper,
				property: "transform",
				value: (prgs) => {
					return `translateY(${to * prgs + from * (1 - prgs)}px)`;
				},
				duration: duration,
				easing: this.easing
			}).then(_ => {
				this.wrapper.style.transform = "translateY(0px)";
				this.wrapper.style.willChange = "initial";
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