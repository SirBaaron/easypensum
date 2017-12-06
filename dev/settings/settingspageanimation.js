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

			window.requestAnimationFrame(_ => {
					el.style.transform = "translate(0px, 0px) scale(1.2)";
			});

			el.addEventListener("transitionend", _ => {
				document.body.removeChild(el);
				this.titleEl.style.opacity = 1;
				titleEl.style.opacity = 1;
			});
		}
	}
});