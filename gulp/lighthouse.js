var gulp = require('gulp');
var run = require('gulp-run');
var open = require('gulp-open');
var argv = require('yargs').argv;




gulp.task("lighthouse", () => {
  if(argv.nolighthouse || argv.l) {
    return;
  }

  return gulp.src("")
  .pipe(run("lighthouse http://localhost:8001/ --output=html --output-path=report/lighthouse.html --quiet")).on("end", () => {
		gulp.src("report/lighthouse.html")
		.pipe(open({
	  		app: "chrome"
	 	}));
  	});
})