var gulp = require('gulp');
var tslint = require('gulp-tslint');
var ts = require('gulp-typescript');
var tsProject = ts.createproject({  // ref: https://github.com/ivogabe/gulp-typescript
  removecomments : true, // do not emit comments to output.
  noimplicitany : true, // warn on expressions and declarations with an implied 'any' type.
  target: 'ES3', // specify ecmascript target version: 'es3' (default), 'es5' or 'es6'.
  module: 'commonjs', // specify module code generation: 'commonjs', 'amd', 'umd' or 'system'.
  declarationfiles: false // declaration (boolean) - generates corresponding .d.ts files. you need to pipe the dts streams to save these files.
});
var tsTestProject = ts.createproject({
  removecomments : true,
  noimplicitany : true,
  target: 'ES3',
  module: 'commonjs',
  declarationfiles: false
});

gulp.task('default', ['lint', 'tsc', 'tsc-tests']);

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
             .pipe(ts(tsTestProject))
             .js.pipe(gulp.dest('./temp/test'));
});
