__USE("cssinject.js");

cssinject(`//<-inject:../overview/overviewanimation.css->`);




Object.defineProperties(Overview.prototype, {
	"switchSelectedButton": {
		value: function switchSelectedButton(name) {
			const oldbtn = this.buttonRow.querySelector('button[selected]');
			const btn = this._getButtonByText(name);
			
			oldbtn.removeAttribute("selected");
			btn.setAttribute("selected", "");
			this._animateButtonBar(btn, oldbtn);
		}
	},
	"_animateButtonBar": {
		value: function _drawButtonBar(btn, oldbtn) {
			const scrollLeft = this.buttonRow.scrollLeft;
			const btnrect = btn.getBoundingClientRect();
			const oldbtnrect = oldbtn.getBoundingClientRect();

			const invert = oldbtnrect.left > btnrect.left;

			const fullscale = (invert ? (oldbtnrect.left - btnrect.left + oldbtnrect.width) : (btnrect.left - oldbtnrect.left + btnrect.width)) / 100;

			const leftToUse = invert ? btnrect.left : oldbtnrect.left;

			this.buttonBar.style.transition = "transform 0.15s ease-in";
			this.buttonBar.style.transform = `translateX(${leftToUse + scrollLeft}px) scaleX(${fullscale})`;

			const evhandler = e => {
				this.buttonBar.removeEventListener("transitionend", evhandler);
				this.buttonBar.style.transition = "transform 0.15s ease-out";
				this.buttonBar.style.transform = `translateX(${btnrect.left + scrollLeft}px) scaleX(${btnrect.width / 100})`;
			}

			this.buttonBar.addEventListener("transitionend", evhandler);
		}
	}
});

document.getElementsByTagName("section-overview")[0].progressiveConstructor();