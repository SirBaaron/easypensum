var gulp = require('gulp');
var connect = require('gulp-connect');



require('require-dir')('./gulp');


gulp.task("serve", () => {
	connect.server({
		name: "dev",
		port: 8000,
		livereload: true
	});

	connect.server({
		name: "dist",
		port: 8001,
		root: "dist/"
	})

	gulp.watch(["dev/**/*"])
	.on("change", function (file) {
	    gulp.src(file.path)
	    .pipe(connect.reload());
	});
});