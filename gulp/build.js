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
var copyNodeModule = require('copy-node-modules');

const config = JSON.parse(fs.readFileSync('./gulp/config.json'));

var gutil = require('gulp-util');



gulp.task("build", () => {

	runSequence(
		"prepare",
		"classid",
		"classid-cleanup",
		"html",
		"css",
		"inject",
		"js",
		"index-remove-classid",
		"index",
		"images",
		"server",
		"move",
		"finish"
	);
	

	// runSequence(
	// 	"prepare",
	// 	"classid",
	// 	"html",
	// 	"css",
	// 	"inject",
	// 	"js",
	// 	"index",
	// 	"replace",
	// 	"copyright",
	// 	"images",
	// 	"move",
	// 	"lighthouse",
	// 	"finish"
	// );

});

gulp.task("server", () => {
	var bases = config.files.server.map(v => {
		return "build/" + v;
	});

	var replace = [
		["const PORT = 8000;", "const PORT = 80;"],
		["var classid = require('./classid-node.js');", ""]
	]

	return gulp.src(bases, {
		base: "build/"
	})
	.pipe(replaceBatch(replace))
	.pipe(gulp.dest("build/"));
})

gulp.task("inject", () => {	

	var bases = config.files.js.map(v => {
		return "build/" + v;
	});

	
	return gulp.src(bases)
	.pipe(injectfile({
		pattern: config.injectPattern
	}))
	.pipe(gulp.dest("build/bundles/"));
});

gulp.task("prepare", () => {
	del(["dist/**/*"]);

	var everyfin = [];

	for(var i in config.files) {
		everyfin = everyfin.concat(config.files[i]);
	}
	
	return gulp.src(everyfin, {
		base: "./"
	})
	.pipe(gulp.dest("build/"));
});

gulp.task("classid", () => {
	var files = [];
	for(var type in config.files) {
		if(type == "js" || type == "html" || type == "css" || type == "server") {
			files = files.concat(config.files[type].map(v => {
				return "build/" + v;
			}))
		}
	}
	var cmd = "python classid.py " + files.join(" ") + " --save-pairs";
	return gulp.src("")
	.pipe(run(cmd));
});

gulp.task("classid-cleanup", () => {
	const pairs = JSON.parse(fs.readFileSync('./classid-pairs.json'));

	var replace = [
		["toogleDrawerCheckbox", pairs.toogleDrawerCheckbox]
	];

	return gulp.src("build/dev/index.html")
	.pipe(replaceBatch(replace))
	.pipe(gulp.dest("build/dev/"));
})

gulp.task("html", () => {
	var files = config.files.html.map(v => {
		return "build/" + v;
	});
	files.splice(files.indexOf("build/dev/index.html"), 1);

	return gulp.src(files, {
		base: "	build/"
	})
	.pipe(htmlmin({
		collapseWhitespace: true,
		removeComments: true
	}))
	.pipe(gulp.dest("build/"));
});

gulp.task("css", () => {
	var files = config.files.css.map(v => {
		return "build/" + v;
	});

	return gulp.src(files, {
		base: "build/"
	})
	.pipe(autoprefixer('last 1 version'))
	.pipe(csso())
	.pipe(gulp.dest("build/"));
});

gulp.task("js", () => {
	return gulp.src("build/bundles/*.js")
	.pipe(babel())
	.on("error", err => {
		gutil.log(err);
	})
	.pipe(uglify({
		output: {
			comments: false
		},
		compress: {
			sequences: false
		}
	}))
	.on("error", err => {
		gutil.log(err);
	})
	.pipe(gulp.dest("build/bundles"));
});

gulp.task("index", () => {
	return gulp.src("build/dev/index.html")
	.pipe(inlinesource())
	.pipe(minifyInline())
	.pipe(htmlmin({
		collapseWhitespace: true,
		removeComments: true,
		ignoreCustomComments: [/SSR:/]
	}))
	.pipe(gulp.dest("build/templates"))
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

gulp.task("index-remove-classid", () => {
	var replace = [
		['<script src="classid.js"></script>', '']
	];

	return gulp.src("build/dev/index.html")
	.pipe(replaceBatch(replace))
	.pipe(gulp.dest("build/dev/"));
});

gulp.task("move", () => {
	var stream = require('merge-stream')();

	copyNodeModule("./", "./dist/", {}, (err, results) => {});

	for(i in config.move) {
		stream.add(gulp.src(config.move[i], {
			base: "build/"
		})
		.pipe(gulp.dest("dist/")));
	}
	

	return stream.isEmpty() ? null : stream;
});

gulp.task("finish", () => {
	del(["build/*"]);
	console.log(color("       .::::::,         \n       :       :        \n    ::::       :::,     \n   ::::::::::::::::,    \n  .::.............::    \n  .::             ::    \n  .::            ", "yellow") + color(",", "cyan") + color("::    \n  .:: ", "yellow") + color("::::::::    :::", "cyan") + color("   \n  .:: ", "yellow") + color("::.``...   :", "cyan") + color("::", "yellow") + color("::", "cyan") + color("  \n  .:: ", "yellow") + color("::        ,::", "cyan") + color(":", "yellow") + color(" ::", "cyan") + color(" \n  .:: ", "yellow") + color("::        ::", "cyan") + color("::", "yellow") + color(" ,:", "cyan") + color(" \n  .:: ", "yellow") + color("::        ::", "cyan") + color("::", "yellow") + color(" ::", "cyan") + color(" \n  .:: ", "yellow") + color(":::::::: :::::::", "cyan") + color("  \n  .:: ", "yellow") + color(":::::::: ::", "cyan") + color(" ::    \n  .:: ", "yellow") + color("::       ::", "cyan") + color(" ::    \n  .:: ", "yellow") +color( "::      ::", "cyan") + color("  ::    \n  .:: ", "yellow") + color("::      ::", "cyan") + color("  ::    \n  .:: ", "yellow") + color("::,  .,::`", "cyan") + color("  ::    \n  .:: ", "yellow") + color(":::::::::", "cyan") + color("   ::    \n  .::            .::    \n  .::           .:::    \n  .::         .:::::    \n   :::::::::::::::::    \n   .:::::::::::::::     ", "yellow"));
});