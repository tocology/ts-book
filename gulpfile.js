var gulp         = require('gulp');
var tslint       = require('gulp-tslint');
var ts           = require('gulp-typescript');
var browserify   = require('browserify'),
    transform    = require('vinyl-transform'), // has an error (ref: https://github.com/substack/node-browserify/issues/1191)
    source       = require('vinyl-source-stream'),
    buffer       = require('vinyl-buffer'),
    uglify       = require('gulp-uglify'),
    sourcemaps   = require('gulp-sourcemaps');
var runSequence  = require('run-sequence');
var karma        = require('gulp-karma');
var browserSync  = require('browser-sync');

// create typescript project (using tsconfig.json, not yet)
var tsProject = ts.createProject({  // ref: https://github.com/ivogabe/gulp-typescript
  removecomments : true, // do not emit comments to output.
  noimplicitany : true, // warn on expressions and declarations with an implied 'any' type.
  target: 'ES3', // specify ecmascript target version: 'es3' (default), 'es5' or 'es6'.
  module: 'commonjs', // specify module code generation: 'commonjs', 'amd', 'umd' or 'system'.
  declarationfiles: false // declaration (boolean) - generates corresponding .d.ts files. you need to pipe the dts streams to save these files.
});
var tsTestProject = ts.createProject({
  removecomments : true,
  noimplicitany : true,
  target: 'ES3',
  module: 'commonjs',
  declarationfiles: false
});

var browserified = transform(function(filename){
  var b = browserify({ entries: filename, debug: true });
  return b.bundle();
})

gulp.task('default', function(cb){  // Next: https://github.com/gulpjs/gulp/blob/master/docs/README.md
  runSequence(
    'lint',                       // lint
    ['tsc', 'tsc-tests'],         // compile
    ['bundle-js', 'bundle-test'], // optimize
    'karma',                      // test
    'browser-sync',               // serve
    cb                            // callback
  );
});

// lint task
gulp.task('lint', function(){
  return gulp.src([
              './source/ts/**/**.ts', './test/**/**.test.ts'
           ]).pipe(tslint())
             .pipe(tslint.report('verbose'));
});

// compile task
gulp.task('tsc', function(){
  return gulp.src('./source/ts/**/**.ts')
             .pipe(ts(tsProject))
             .js.pipe(gulp.dest('./temp/source/js'));
});

gulp.task('tsc-tests', function(){
  return gulp.src('./test/**/**.test.ts')
             .pipe(ts(tsTestProject))
             .js.pipe(gulp.dest('./temp/test'));
});

// bundle task
gulp.task('bundle', function(cb){
  runSequence('build', [
    'bundle-js', 'bundle-test'
  ], cb);
});

gulp.task('bundle-js', function(){
  /**
  return gulp.src('./temp/source/js/main.js')
             .pipe(browserified)
             .pipe(sourcemaps.init({ loadMaps: true }))
             .pipe(uglify())
             .pipe(sourcemaps.write('./'))
             .pipe(gulp.dest('./dist/source/js/'));
             */
  return browserify({ entries: './temp/source/js/main.js', debug: true }).bundle()
         .pipe(source('main.js'))
         .pipe(buffer())
         .pipe(sourcemaps.init({ loadMaps: true }))
         .pipe(uglify())
         .pipe(sourcemaps.write('./'))
         .pipe(gulp.dest('./dist/source/js/'));
});

gulp.task('bundle-test', function(){
  // return gulp.src('./temp/test/**/**.test.js')
  //            .pipe(browserified)
  //            .pipe(gulp.dest('./dist/test/'));
  return browserify({ entries: './temp/test/**/**.test.js', debug: true }).bundle()
         .pipe(source('main.test.js'))
         .pipe(buffer())
         .pipe(gulp.dest('./dist/test/'));
});

// test task
gulp.task('test', function(cb){
  runSequence('bundle', ['karma'], cb);
});

gulp.task('karma', function(cb){
  gulp.src('./dist/test/**/**.test.js')
      .pipe(karma({
        configFile: 'karma.conf.js',
        action: 'run'
      }))
      .on('end', cb)
      .on('error', function(err){
        // Make sure failed tests cause gulp to exit non-zero
        throw err;
      });
});

// serve task (browser-sync)
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
});
