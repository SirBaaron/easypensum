__USE("cssinject.js");

__USE("animationsyncer.js");

__USE("cubicbezier.js");

cssinject(`//<-inject:../toast/toastanimation.css->`);



Object.defineProperties(toastManager.prototype, {
	"easeIn": {
		value: new cubicBezier([0, 0, .2, 1])
	},
	"easeOut": {
		value: new cubicBezier([.4, 0, 1, 1])
	},
	"animationDuration": {
		value: 150
	},
	"domAdd": {
		value: function domAdd(el) {
			this.appendChild(el);
			let height = el.getBoundingClientRect().height + 10;
			[].slice.call(this.childNodes).forEach(n => {
				animation.add({
					el: n,
					property: "transform",
					value: (prgs) => {
						return `translateY(${height * (1 - prgs)}px)`
					},
					duration: this.animationDuration,
					easing: this.easeIn
				});
			});
		}
	},
	"remove": {
		value: function remove(toast) {
			clearTimeout(toast.timer);
			let height = toast.getBoundingClientRect().height + 10;
			if(this.lastChild == toast) {
				[].slice.call(this.childNodes).forEach(n => {
					animation.add({
						el: n,
						property: "transform",
						value: (prgs) => {
							return `translateY(${(height) * prgs}px)`
						},
						duration: this.animationDuration,
						easing: this.easeOut
					}).then(el => {
						if(el == toast) {
							this.removeChild(toast);
						}
						else {
							el.style.transform = "";
						}
					});
				});
			}
			else {
				let nodes = [].slice.call(this.childNodes);
				nodes = nodes.slice(0, nodes.indexOf(toast));
				nodes.forEach(n => {
					animation.add({
						el: n,
						property: "transform",
						value: (prgs) => {
							return `translateY(${(height) * prgs}px)`
						},
						duration: this.animationDuration,
						easing: this.easeOut
					});
				});
				toast.addEventListener("transitionend", _ => {
					this.removeChild(toast);
					[].slice.call(this.childNodes).forEach(n => {
						n.style.transform = "";
					})
				});
				toast.style.opacity = 0;
			}
		}
	}
})