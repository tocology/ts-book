'use-strict';

var gulp        = require('gulp');
var tslint      = require('gulp-tslint');
var ts          = require('gulp-typescript');
var browserify  = require('browserify'),
    source      = require('vinyl-source-stream'),
    uglify      = require('gulp-uglify'),
    sourcemaps  = require('gulp-sourcemaps'),
    buffer      = require('vinyl-buffer');

// options reference: https://www.npmjs.com/package/gulp-typescript
var tsProject = ts.createProject({
  removeComments: true,
  noImplicitAny: true,
  target: 'ES3',
  module: 'commonjs',
  declarations: false
})

gulp.task('lint', function(){
  return gulp.src([
    './source/ts/**/**.ts', './test/**/**.test.ts'
  ]).pipe(tslint())
    .pipe(tslint.report('verbose'));
});

gulp.task('tsc', function(){
  return gulp.src('./source/ts/**/**.ts')
    .pipe(ts(tsProject))
    .js.pipe(gulp.dest('./temp/source/js'));
});

gulp.task('tsc-tests', function(){
  return gulp.src('./test/**/**.test.ts')
    .pipe(ts(tsProject))
    .js.pipe(gulp.dest('./temp/test/'));
});

gulp.task('bundle-js', function(){
  // var browserified = transform(function(filename) {
  //   var b = browserify({ entries: filename, debug: true });
  //   return b.bundle();
  // });
  var browserified = function(filename) {
    var b = rowserify({ entries: filename, debug: true });
    return b.bundle();
  }

  return gulp.src('./temp/source/js/main.js')
    .pipe(browserified)
    .pipe(source())
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/source/js/'));
});

gulp.task('default', ['lint', 'tsc', 'tsc-tests', 'bundle-js']);
