var style = document.createElement("style");
style.textContent = `
	//<-inject:../css/ripple.css->
	//<-inject:../css/progressive.css->
	//<-inject:../css/cardanimation.css->
`;
document.head.appendChild(style);

//<-inject:ripple.js->

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
		this.tasks.forEach(task => {
			task.el.style[task.property] = "";
		});

		this.tasks = this.tasks.filter(task => {
			var prgs = Math.min((stmp - task._startime) / task.duration, 1);
			var f = task.easing.yatx(prgs);

			task.el.style[task.property] += task.value(f) + " ";

			
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
var animation = new animationSyncer();

//<-inject:cardanimation.js->