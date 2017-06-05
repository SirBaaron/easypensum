var gulp = require('gulp');
var injectfile = require("gulp-inject-file");
var fs = require('fs');

const config = JSON.parse(fs.readFileSync('./gulp/config.json'));


gulp.task("watch", () => {
	var paths = [];
	config.bundles.forEach(v => {
		var a = v.sources.map(c => {
			return "dev/" + c;
		});
		var b = "dev/" + v.base;
		a.push(b);
		paths = paths.concat(a);
	});

	gulp.watch(paths, ["inline_for_dev"]);
});

gulp.task("inline_for_dev", () => {
	var bases = config.bundles.map(v => {
		return "dev/" + v.base;
	});

	
	return gulp.src(bases)
	.pipe(injectfile({
		pattern: config.injectPattern
	}))
	.pipe(gulp.dest("dev/bundles/"));
});