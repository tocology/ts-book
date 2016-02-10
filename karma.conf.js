// http://karma-runner.github.io/0.8/config/configuration-file.html
module.exports = function (config) {
  'use strict';
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    browsers: ['PhantomJS'],
    reporters: ['progress', 'coverage'],
    plugins: [
      'karma-coverage',
      'karma-mocha',
      'karma-chai',
      'karma-sinon',
      'karma-phantomjs-launcher'
    ],
    preprocessors: {
      './bundled/test/*.test.js': ['coverage']
    },
    files: [
      {
        pattern: "/bundled/test/bdd.test.js",
        included: true
      },
      {
        pattern: "/node_modules/jquery/dist/jquery.min.js",
        included: true
      },
      {
        pattern: "/node_modules/bootstrap/dist/js/bootstrap.min.js",
        included: true
      }
    ],
    client: {
      mocha: {
        ui: "bdd"
      }
    },
    port: 9876,
    colors: true,
    autoWatch: false,
    singleRun: false,
    logLevel: config.DEBUG
  });
};
