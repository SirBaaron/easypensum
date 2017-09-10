var gulp = require('gulp');
var run = require('gulp-run');
var open = require('gulp-open');
var argv = require('yargs').argv;





gulp.task("lighthouse", () => {
  if(argv.nolighthouse || argv.l) {
    return;
  }


})