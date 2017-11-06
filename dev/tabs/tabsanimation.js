__USE("cssinject.js");

cssinject(`//<-inject:../tabs/tabsanimation.css->`);



Object.defineProperties(tabView.prototype, {
	"_animateSwitch": {
		value: function _animateSwitch(name, color, goalscroll, currentscroll) {
			this.overview.switchHeaderColor(color);
			this.overview.switchSelectedButton(name);

			return new Promise(resolve => {
				const start = performance.now();
				
				// scrap when smooth scrolling comes
				const frame = stamp => {
					var progress = Math.min((stamp - start) / 250, 1);

					var scroll = currentscroll + (goalscroll - currentscroll) * progress;

					window.scrollTo(0, scroll);

					if(stamp - start > 250) {
						resolve();
						return;
					}
					window.requestAnimationFrame(frame);
				}

				window.requestAnimationFrame(frame);
			})
		}
	}
})