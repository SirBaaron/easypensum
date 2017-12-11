__USE("cssinject.js");

cssinject(`//<-inject:../settings/settingspageanimation.css->`);

Object.defineProperties(SettingsPages.prototype, {
	"_animateTitle": {
		value: function _animateTitle(titleEl) {
			let pos = titleEl.getBoundingClientRect();
			let xModifier = (window.matchMedia("(min-width: 800px)").matches) ? 250 : 0;
			let xTransform = pos.left - (55 + xModifier) + 20;
			let yTransform = pos.top - 56.5 + 17;
			let el = titleEl.cloneNode(true);
			titleEl.style.opacity = 0;
			this.titleEl.style.opacity = 0;
			el.style.padding = "0px";
			el.style.position = "fixed";
			el.style.top = "56.5px";
			el.style.left = `${60 + xModifier}px`;;
			el.style.transform = `translate(${xTransform}px, ${yTransform}px) scale(1)`;
			document.body.appendChild(el);
			el.classList.add(classid("settingspage_animateable_title"));

			window.requestAnimationFrame(_ => window.requestAnimationFrame(_ => {
					el.style.transform = "translate(0px, 0px) scale(1.2)";
			}));

			el.addEventListener("transitionend", e => {
				this.titleEl.style.opacity = 1;
				document.body.removeChild(e.target);
				titleEl.style.opacity = 1;
			});
		}
	},
	"_animateOpen": {
		value: function _animateOpen() {
			this.style.position = "fixed";
			this.settingsView.style.position = "absolute";
			this.setAttribute("animating", "");
			this.lastChild.style.transform = "translateY(0px)";
		}
	},
	"_animateClose": {
		value: function _animateClose() {
			this.lastChild.style.transform = `translateY(-${window.scrollY}px)`;
			this.style.position = "fixed";
			this.settingsView.style.position = "absolute";
			this.setAttribute("animating", "");
			window.scrollTo(0, this.scrollBefore);
		}
	},
	"_addEventListener": {
		value: function _addEventListener() {
			this.addEventListener("transitionend", e => {
				if(e.propertyName != "transform" || e.target != this) {
					return;
				}
				this.removeAttribute("animating");
				if(!this.animationopened) {
					this.style.position = "initial";
					this.settingsView.style.position = "fixed";
					window.scrollTo(0, 0);
					this.animationopened = true;
				}
				else {
					this.removeAttribute("animating");
					this.settingsView.style.position = "initial";
					this.animationopened = false;
				}
			});
		}
	}
});

document.getElementsByTagName("setting-pages")[0]._addEventListener();