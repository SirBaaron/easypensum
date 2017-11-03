/*
	Taken from this Stack Overflow question: https://stackoverflow.com/a/11697909/5203474
 */

class cubicBezier {
	get epsilon() {
		return 1e-6;
	}

	constructor(controlpoints) {
		// pre-calculate the polynomial coefficients
	    // First and last control points are implied to be (0,0) and (1.0, 1.0)
	    this.cx = 3.0 * controlpoints[0];
	    this.bx = 3.0 * (controlpoints[2] - controlpoints[0]) - this.cx;
	    this.ax = 1.0 - this.cx -this.bx;

	    this.cy = 3.0 * controlpoints[1];
	    this.by = 3.0 * (controlpoints[3] - controlpoints[1]) - this.cy;
	    this.ay = 1.0 - this.cy - this.by;
	}

	sampleCurveX(t) {
	    return ((this.ax * t + this.bx) * t + this.cx) * t;
	}

	sampleCurveY(t) {
	    return ((this.ay * t + this.by) * t + this.cy) * t;
	}

	sampleCurveDerivativeX(t) {
	    return (3.0 * this.ax * t + 2.0 * this.bx) * t + this.cx;
	}

	solveCurveX(x, epsilon) {
    	var t0; 
	    var t1;
	    var t2;
	    var x2;
	    var d2;
	    var i;

	    // First try a few iterations of Newton's method -- normally very fast.
	    for (t2 = x, i = 0; i < 8; i++) {
	        x2 = this.sampleCurveX(t2) - x;
	        if (Math.abs (x2) < epsilon)
	            return t2;
	        d2 = this.sampleCurveDerivativeX(t2);
	        if (Math.abs(d2) < epsilon)
	            break;
	        t2 = t2 - x2 / d2;
	    }

	    // No solution found - use bi-section
	    t0 = 0.0;
	    t1 = 1.0;
	    t2 = x;

	    if (t2 < t0) return t0;
	    if (t2 > t1) return t1;
	    console.log(epsilon);
	    while (t0 < t1) {
	        x2 = this.sampleCurveX(t2);
	        if (Math.abs(x2 - x) < epsilon)
	            return t2;
	        if (x > x2) t0 = t2;
	        else t1 = t2;

	        t2 = (t1 - t0) * .5 + t0;
	    }

	    // Give up
	    return t2;
	}

	yatx(x) {
	    return this.sampleCurveY( this.solveCurveX(x, this.epsilon) );
	}
}