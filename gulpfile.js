var gulp        = require('gulp');
var tslint      = require('gulp-tslint');
var ts          = require('gulp-typescript');

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

gulp.task('tsc-test', function(){
  return gulp.src('./test/**/**.test.ts')
    .pipe(ts(tsProject))
    .js.pipe(gulp.dest('./temp/test/'));
});

gulp.task('default', ['lint', 'tsc', 'tsc-tests']);
