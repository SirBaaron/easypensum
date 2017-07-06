/*
FLAGS:
--noimagecompression || -i			won't compress images, duh
--nolighthouse  || -l					skip lighthouse report
*/

var gulp = require('gulp');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var inlinesource = require('gulp-inline-source');
var run = require('gulp-run');
var runSequence = require('run-sequence');
var color = require('gulp-color');
var headerComment = require('gulp-header-comment');
var image = require('gulp-image');
var del = require('del');
var minifyInline = require('gulp-minify-inline-scripts');
var injectfile = require('gulp-inject-file');
var replaceBatch = require('gulp-batch-replace');
var fs = require('fs');
var argv = require('yargs').argv;

var gutil = require('gulp-util');


const config = JSON.parse(fs.readFileSync('./gulp/config.json'));


gulp.task("build", () => {
	runSequence(
		"prepare",
		"classid",
		"html",
		"css",
		"inject",
		"js",
		"index",
		"replace",
		"copyright",
		"images",
		"move",
		"lighthouse",
		"finish"
	);
});


gulp.task("prepare", () => {
	del(["dist/*"]);
	
	return gulp.src("dev/**")
	.pipe(gulp.dest("build"));
});

gulp.task("classid", () => {
	var files = [];
	for(var type in config.files) {
		if(type == "js" || type == "html" || type == "css") {
			files = files.concat(config.files[type].map(v => {
				return "build/" + v;
			}))
		}
	}
	var cmd = "python classid.py " +files.join(" ");
	return gulp.src("")
	.pipe(run(cmd));
});

gulp.task("inject", () => {
	var stream = require('merge-stream')();
	var files = config.bundles.map(v => {
		return "build/" + v.base;
	});

	for(i in files) {
		stream.add(gulp.src(files[i])
			.pipe(injectfile({
				pattern: config.injectPattern
			}))
			.pipe(gulp.dest("build/bundles/")));
		}

	return stream.isEmpty() ? null : stream;
});

gulp.task("html", () => {
	var files = config.files.html.map(v => {
		return "build/" + v;
	});
	files.splice(files.indexOf("build/index.html"), 1);

	return gulp.src(files)
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest("build/html"));
});

gulp.task("css", () => {
	var files = config.files.css.map(v => {
		return "build/" + v;
	});


	return gulp.src(files)
	.pipe(autoprefixer('last 1 version'))
	.pipe(csso())
	.pipe(gulp.dest("build/css"));
});

gulp.task("js", () => {
	return gulp.src("build/bundles/**")
	.pipe(babel())
	.on("error", err => {
		gutil.log(err);
	})
	.pipe(uglify())
	.on("error", err => {
		gutil.log(err);
	})
	.pipe(gulp.dest("build/bundles"));
});

gulp.task("index", () => {
	return gulp.src("build/index.html")
	.pipe(inlinesource())
	.pipe(minifyInline())
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest("build"))
});

gulp.task("images", () => {
	if(argv.noimagecompression || argv.i) {
		return;
	}

	var files = config.files.img.map(v => {
		return "build/" + v;
	});

	return gulp.src(files)
	.pipe(image())
	.pipe(gulp.dest("build/static/"))
});

gulp.task("copyright", () => {
	var files = config.addCopyright.map(v => {
		return "build/" + v;
	});

	return gulp.src(files, {
		base: "build/"
	})
	.pipe(headerComment("Copyright (c) <%= moment().format('YYYY') %> Aron Längert"))
	.pipe(gulp.dest("build/"));
});

gulp.task("replace", () => {
	var files = Object.keys(config.output).map(v => {
		return "build/" + v;
	}).filter(v => {
		return v.indexOf("png") < 0;
	});
	var replace = [];
	for(var before in config.rename) {
		replace.push([before, config.rename[before]]);
	}


	return gulp.src(files, {
		base: "build/"
	})
	.pipe(replaceBatch(replace))
	.pipe(gulp.dest("build/"));
});

gulp.task("move", () => {
	var stream = require('merge-stream')();
	for(src in config.output) {
		stream.add(gulp.src("build/" + src, {
			base: ("build/" + src)
		})
		.pipe(gulp.dest("dist/" + config.output[src])).on("error", () => {
			console.log("DF");
		}));
	}

	return stream.isEmpty() ? null : stream;
});

gulp.task("finish", () => {
	del(["build/*"]);
	console.log(color("       .::::::,         \n       :       :        \n    ::::       :::,     \n   ::::::::::::::::,    \n  .::.............::    \n  .::             ::    \n  .::            ", "yellow") + color(",", "cyan") + color("::    \n  .:: ", "yellow") + color("::::::::    :::", "cyan") + color("   \n  .:: ", "yellow") + color("::.``...   :", "cyan") + color("::", "yellow") + color("::", "cyan") + color("  \n  .:: ", "yellow") + color("::        ,::", "cyan") + color(":", "yellow") + color(" ::", "cyan") + color(" \n  .:: ", "yellow") + color("::        ::", "cyan") + color("::", "yellow") + color(" ,:", "cyan") + color(" \n  .:: ", "yellow") + color("::        ::", "cyan") + color("::", "yellow") + color(" ::", "cyan") + color(" \n  .:: ", "yellow") + color(":::::::: :::::::", "cyan") + color("  \n  .:: ", "yellow") + color(":::::::: ::", "cyan") + color(" ::    \n  .:: ", "yellow") + color("::       ::", "cyan") + color(" ::    \n  .:: ", "yellow") +color( "::      ::", "cyan") + color("  ::    \n  .:: ", "yellow") + color("::      ::", "cyan") + color("  ::    \n  .:: ", "yellow") + color("::,  .,::`", "cyan") + color("  ::    \n  .:: ", "yellow") + color(":::::::::", "cyan") + color("   ::    \n  .::            .::    \n  .::           .:::    \n  .::         .:::::    \n   :::::::::::::::::    \n   .:::::::::::::::     ", "yellow"));
});