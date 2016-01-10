module.exports = function (config) { // http://karma-runner.github.io/0.13/config/configuration-file.html
  'use strict';
  config.set({
    basePath: '', // we don't indicate because the Gulp task will pass the stream.
    frameworks: ['mocha', 'chai', 'sinon'],
    browsers: ['phantomJS'],
    reporters: ['progress', 'coverage'],
    plugins: [
      'karma-coverage',
      'karma-mocha',
      'karma-chai',
      'karma-sinon',
      'karma-phantomjs-launcher'
    ],
    preprocessors: {
      './dist/test/*.test.js': ['coverage']
    },
    port: 9876,
    colors: true,
    autoWatch: false,
    singleRun: false,
    logLevel: config.LOG_INFO
  });
};
