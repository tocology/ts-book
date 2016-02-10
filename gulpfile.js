'use-strict';

var glob          = require('glob');
var path          = require('path');

var gulp          = require('gulp');
var tslint        = require('gulp-tslint');
var tsc           = require('gulp-typescript');
var browserSync   = require('browser-sync');
var browserify    = require('browserify'),
    source        = require('vinyl-source-stream'),
    uglify        = require('gulp-uglify'),
    sourcemaps    = require('gulp-sourcemaps'),
    buffer        = require('vinyl-buffer');
var run           = require('gulp-run');
var runSequence   = require('run-sequence');
var karma         = require('gulp-karma');
var docco         = require('gulp-docco');
var header        = require('gulp-header')
var pkg           = require(__dirname + '/package.json');

// options reference: https://www.npmjs.com/package/gulp-typescript
var tsProject = tsc.createProject({
  removeComments: true,
  noImplicitAny: true,
  target: 'ES3',
  module: 'commonjs',
  declarations: false
});

var tsTestProject = tsc.createProject({
  removeComments: true,
  noImplicitAny: true,
  target: 'ES3',
  module: 'commonjs',
  declarations: false
});

gulp.task('lint', function(){
  return gulp.src([
    './source/ts/**/**.ts', './test/**/**.test.ts'
  ]).pipe(tslint())
    .pipe(tslint.report('verbose'));
});

gulp.task('build-source', function(){
  return gulp.src(__dirname + "/source/*.ts")
    .pipe(tsc(tsProject))
    .js.pipe(gulp.dest(__dirname + "/build/source/"));
});

gulp.task('build-test', function(){
  return gulp.src(__dirname + "/teset/*.test.ts")
    .pipe(tsc(tsTestProject))
    .js.pipe(gulp.dest(__dirname + "/build/test/"));
});

// fix vinly-transform with browersify(>=9.0.0) error
gulp.task('bundle-source', function(){
  // return browserify('./temp/source/js/main.js')
  //   .bundle()
  //   .pipe(source('main.js'))
  //   .pipe(buffer())
  //   .pipe(sourcemaps.init({ loadMaps: true }))
  //   .pipe(uglify())
  //   .pipe(sourcemaps.write())
  //   .pipe(gulp.dest('./dist/source/js'));
  var b = browserify({
    standalone: 'demos',
    entries: __dirname + "/build/source/demos.js",
    debug: true
  });

  return b.bundle()
    .pipe(source("demos.js"))
    .pipe(buffer())
    .pipe(gulp.dest(__dirname + "/bundled/source/"));
});

gulp.task('bundle-test', function(){
  // glob('./temp/test/**/**.test.js', function(err, filename){
  //   browserify(filename)
  //   .bundle()
  //   .pipe(source(path.basename(filename)))
  //   .pipe(gulp.dest('./dist/test/'));
  // })
  var b = browserify({
    standalone: 'test',
    entries: __dirname + "/build/test/bdd.test.js",
    debug: true
  });

  return b.bundle()
    .pipe(source("bdd.test.js"))
    .pipe(buffer())
    .pipe(gulp.dest(__dirname + "/bundled/test/"));
});

gulp.task('bundle-e2e-test', function(){
  var b = browserify({
    standalone: 'test',
    entries: __dirname + "/build/test/e2e.test.js",
    debug: true
  });

  return b.bundle()
    .pipe(source("e2e.test.js"))
    .pipe(buffer())
    .pipe(gulp.dest(__dirname + "/bundled/e2e-test/"));
});

gulp.task('run-unit-test', function(cb){
  // gulp.src('./dist/test/**/**.test.js')
  //   .pipe(karma({
  //     configFile: 'karma.conf.js',
  //     action: 'run'
  //   }))
  //   .on('end', cb)
  //   .on('error', function(err){
  //     // Make sure failed tests cause gulp to exit non-zero
  //     throw err;
  //   });
  karma.start({
    configFile: __dirname + "/karma.conf.js",
    singleRun: true
  }, cb);
});

gulp.task('run-e2e-test', function(){
  return gulp.src('')
    .pipe(nightwatch({
      configFile: __dirname + '/nightwatch.json'
    }));
});

gulp.task('build', function(cb) {
  runSequence('lint', ['tsc', 'tsc-tests'], cb);
});

gulp.task('bundle', function(cb){
  runSequence('build', [
    'bundle-js', 'bundle-test'
  ], cb);
});

gulp.task('test', function(cb){
  runSequence('bundle', ['karma'], cb);
});

gulp.task('browser-sync', ['test'], function(){
  browserSync({
    server: {
      baseDir: "./dist"
    }
  });

  return gulp.watch([
    "./dist/source/js/**/*.js",
    "./dist/source/css/**.css",
    "./dist/test/**/**.test.js",
    "./dist/data/**/**",
    "./index.html"
  ], [browserSync.reload]);
})

gulp.task('default', function(cb){
  runSequence(
    'lint',
    ['tsc', 'tsc-tests'],
    ['bundle-js', 'bundle-test'],
    'karma',
    'browser-sync',
    cb
  );
});
