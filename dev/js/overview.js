
//<-inject:../js/card.js->

//<-inject:../js/tabs.js->

class Overview {
	constructor() {
		this.shell = document.getElementById(classid("overview"));
		this.splashheader = document.getElementById(classid("splashheader"));
		this.splashloadinganimation = document.getElementById(classid("splashloadinganimation"));

		this.init();
	}

	get template() {
		return `
			//<-inject:../html/overview.html->
		`;
	}

	get css() {
		return `
			//<-inject:../css/overview.css->
			//<-inject:../css/overviewHeader.css->
			//<-inject:../css/card.css->
		`;
	}

	/**
	 * Those files will be loaded async
	 * @return {Array String}
	 */
	get lazyLoad() {
		return ["bundles/progressive.js"];
	}

	init() {
		var css = document.createElement("style");
		css.innerHTML = this.css;
		document.head.appendChild(css);

		this.lazyLoad.forEach(src => {
			var el = document.createElement("script");
			el.src = src;
			el.async = true;
			document.head.appendChild(el);
		});

		const splashdim = this.splashheader.getBoundingClientRect();
		const loaderdim = this.splashloadinganimation.getBoundingClientRect();
		
		this.splashheader.style.position = this.splashloadinganimation.style.position = "absolute";
		this.splashheader.style.left = this.splashloadinganimation.style.left = `${splashdim.left}px`;
		this.splashloadinganimation.style.top = `${loaderdim.top}px`;
		this.splashloadinganimation.style.right = this.splashloadinganimation.style.bottom = this.splashheader.style.top = this.splashheader.style.right = "0px";

		this.splashloadinganimation.style.opacity = 1;
		this.splashheader.style.transition = this.splashloadinganimation.style.transition = "transform 0.3s ease-in-out, opacity 0.2s linear";
		this.splashheader.style.transformOrigin = "top";
		this.splashheader.style.transform = "scaleY(2.08)";
		this.splashloadinganimation.style.opacity = 0;

		const evhandler = e => {
			if(e.propertyName == "transform") {
				e.target.style.opacity = 0;
				this.headerone.style.opacity = this.header.style.opacity = 1;
				this.tabshell.style.display = "block";
			}
			if(e.propertyName == "opacity") {
				e.target.parentNode.removeChild(e.target);
			}
		}

		this.splashheader.addEventListener("transitionend", evhandler);
		this.splashloadinganimation.addEventListener("transitionend", evhandler);

		this.shell.innerHTML = this.template;

		this.headerone = document.getElementById(classid("overview_header_one"));
		this.header = document.getElementById(classid("overview_header"));
		this.tabshell = document.getElementById(classid("tab_scrollshell"));

		tabManager = new tabView();
	}

	
}
new Overview();


// cubicBezier = (x, points) => {
// 	// return (Math.pow((1 - x), 3) * points[0]) + (3 * Math.pow((1 - x), 2) * x * points[1]) + (3 * (1 - x) * Math.pow(x, 2) * points[2]) + (Math.pow(x, 3) * points[3]);
// 	//u^3(c0 + 3c1 -3c2 +c3) + u^2(3c0 -6c1 +3c2) + u(-3c0 +3c1) + c0
// 	// return Math.pow(x, 3) * (points[0] + 3 * points[1] - 3 * points[2] + points[3]) + Math.pow(x, 2) * (3 * points[0] - 6 * points[1] + 3 * points[2]) + x * (-3 * points[0] + 3 * points[1]) + points[0];
// 	//((1 - x)³ * a) + (3 * (1 - x)² * x * 	b) + (3 * (1 - x) * x² * c) + (x³ * d)
// }

// class cubicBezier {
// 	constructor(controlpoints) {
// 		//controlpoints: [p1x, p1y, p2x, p2y]
// 		this.C1x = 3 * controlpoints[0];
// 		this.C1y = 3 * controlpoints[1];
// 		this.C2x = 3 * controlpoints[2] - 6 * controlpoints[0];
// 		this.C2y = 3 * controlpoints[3] - 6 * controlpoints[1];
// 		this.C3x = 3 * controlpoints[0] - 3 * controlpoints[2] + 1;
// 		this.C3y = 3 * controlpoints[1] - 3 * controlpoints[3] + 1;
// 	}

// 	yatx(x) {
// 		if(x == 0) {
// 			return 0;
// 		}
// 		const p = 3 * this.C3x * this.C1x - this.C2x ** 2;
// 		const q = 2 * this.C2x ** 3 - 9 * this.C3x * this.C2x * this.C1x + 27 * this.C3x ** 2 * -x;

// 		const d = q ** 2 + 4 * p ** 3;

// 		console.log(d);

// 		if(d > 0) {
// 			const a = 4 * Math.sqrt(q ** 2 + 4 * p **3);
// 			console.log(a);

// 			const u = .5 * (-4 * q + a) ** (1 / 3)
// 			const v = -.5 * Math.abs(-4 * q - a) ** (1 / 3)

// 			console.log("test: ", (-4 * q - a));
// 			console.log(u, v);

// 			const y = u + v;

// 			return (y - this.C2x) / (3 * this.C3x);
// 		}

// 		// var a, b, c;
// 		// if(this.C3x == 0) {
// 		// 	a = this.C2x;
// 		// 	b = this.C1x;
// 		// 	c = -x
// 		// }
// 		// else {
// 		// 	a = this.C2x / this.C3x;
// 		// 	b = this.C1x / this.C3x;
// 		// 	c = -x / this.C3x;
// 		// }

// 		// const p = b - ((a ** 2) / 3);
// 		// const q = ((2 * (a ** 3)) / 27) - ((a * b) / 3) + c;


// 		// const delta = ((q / 2) ** 2) + ((p / 3) ** 3);	//no cubic square, instead to the power of 1 / root

// 		// var t;
// 		// // console.log("delta", delta);

// 		// if(delta > 0) {
// 		// 	// console.log("first fall D > 0");
// 		// 	const u = (-(q / 2) + Math.sqrt(delta) ** (1 / 3));
// 		// 	const v = -((Math.abs(-(q / 2) - Math.sqrt(delta))) ** (1 / 3));	//Can't pow a negative number, so pow the abs and negate it afterwards

// 		// 	t = u + v - (this.C2x / (3 * this.C3x));
// 		// }
// 		// else if(delta < 0) {
// 		// 	// console.log("third fall D < 0");

// 		// 	// console.log((-q / 2) * Math.sqrt(27 / (Math.abs(p) ** 3)));

// 		// 	t = Math.sqrt(-(4 / 3) * p) * Math.cos((1 / 3) * Math.acos(-(q / 2) * Math.sqrt(-(27 / (p ** 3))))) - (this.C2x / (3 * this.C3x));



// 		// 	// t = Math.sqrt((-4 / 3) * p) * Math.cos((1 / 3) * Math.acos((-q / 2) * Math.sqrt(27 / (Math.abs(p) ** 3))) + (Math.PI / 3)) - (this.C2x / (3 * this.C3x));

// 		// }
// 		// else {
// 		// 	alert("D == 0 !");
// 		// }

		

// 		// const y = (t ** 3) * this.C3y + (t ** 2) * this.C2y + t * this.C1y;
		
// 		// return y;


// 	}

// }

// const bezier = [0.4, 0, 0.2, 1];
// const bezier = [0, 0, 1, 1];


// const cs = new cubicBezier(bezier);

// console.log(cs.yatx(0.5));

// document.body.innerHTML = `<canvas height=500 width=500 style="border: 2px red solid" id="test"></canvas>`;

// var canvas = document.getElementById("test").getContext("2d");
// canvas.fillStyle = "green";
// canvas.strokeStyle = "rgba(0, 0, 255, 0.6)";

// canvas.beginPath();

// canvas.moveTo(0, 500);
// canvas.bezierCurveTo(bezier[0] * 500, 500 - bezier[1] * 500, bezier[2] * 500, 500 - bezier[3] * 500, 500, 0);

// canvas.stroke();

// for(var i = 0; i < 1; i += 0.02) {
// 	canvas.beginPath();
// 	canvas.arc(i * 500, 500 - cs.yatx(i) * 500, 3, 0, 2 * Math.PI);
// 	canvas.fill();
// }