__USE("cssinject.js");

cssinject(`//<-inject:../settings/settingspageanimation.css->`);

Object.defineProperties(SettingsPages.prototype, {
	"_animateTitle": {
		value: function _animateTitle(titleEl) {
			let pos = titleEl.getBoundingClientRect();
			let xModifier = (window.matchMedia("(min-width: 800px)").matches) ? 250 : 0;
			let xTransform = pos.left - (45 + xModifier) + 25;
			let yTransform = pos.top - 56.5 + 17;
			let el = titleEl.cloneNode(true);
			titleEl.style.opacity = 0;
			this.titleEl.style.opacity = 0;
			el.style.position = "fixed";
			el.style.top = "39.5px";
			el.style.left = `${20 + xModifier}px`;;
			el.style.transform = `translate(${xTransform}px, ${yTransform}px)`;
			document.body.appendChild(el);
			el.classList.add(classid("settingspage_animateable_title"));

			window.requestAnimationFrame(_ => {
					el.style.transform = "translate(0px, 0px)";
			});

			el.addEventListener("transitionend", _ => {
				document.body.removeChild(el);
				this.titleEl.style.opacity = 1;
				titleEl.style.opacity = 1;
			});
		}
	}
});