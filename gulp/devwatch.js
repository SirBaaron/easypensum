var gulp = require('gulp');
var injectfile = require("gulp-inject-file");
var fs = require('fs');
var inlinesource = require('gulp-inline-source');


const config = JSON.parse(fs.readFileSync('./gulp/config.json'));


gulp.task("watch", () => {
	var filesTypes = ["js", "css", "html"];
	var paths = [];
	filesTypes.forEach(t => {
		paths = paths.concat(config.files[t].map(v => {
			return "dev/" + v;
		}))
	});

	gulp.watch(paths, ["inline_for_dev"]);
});

gulp.task("inline_for_dev", () => {
	var bases = config.files.js.map(v => {
		return "dev/" + v;
	});

	
	return gulp.src(bases)
	.pipe(injectfile({
		pattern: config.injectPattern
	}))
	.pipe(gulp.dest("bundles/")).on("end", _ => {
		return gulp.src("dev/index.html")
		.pipe(inlinesource())
		.pipe(gulp.dest("templates/"));
	});
});