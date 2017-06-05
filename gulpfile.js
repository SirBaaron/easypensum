var gulp = require('gulp');
var connect = require('gulp-connect');



require('require-dir')('./gulp');


gulp.task("serve", () => {
	connect.server({
		port: 8000,
		livereload: true
	});

	gulp.watch(["dev/**/*"])
	.on("change", function (file) {
	    gulp.src(file.path)
	    .pipe(connect.reload());
	});
});