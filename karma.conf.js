// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'client/bower_components/jquery/dist/jquery.js',
      'client/bower_components/angular/angular.js',
      'client/bower_components/angular-resource/angular-resource.js',
      'client/bower_components/angular-cookies/angular-cookies.js',
      'client/bower_components/angular-sanitize/angular-sanitize.js',
      'client/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'client/bower_components/lodash/lodash.js',
      'client/bower_components/angular-ui-router/release/angular-ui-router.js',
      'client/bower_components/api-check/dist/api-check.js',
      'client/bower_components/angular-formly/dist/formly.js',
      'client/bower_components/ng-file-upload/ng-file-upload.js',
      'client/bower_components/angular-animate/angular-animate.js',
      'client/bower_components/html5shiv/dist/html5shiv.js',
      'client/bower_components/respondJS/dest/respond.src.js',
      'client/bower_components/rangy/rangy-core.js',
      'client/bower_components/rangy/rangy-classapplier.js',
      'client/bower_components/rangy/rangy-highlighter.js',
      'client/bower_components/rangy/rangy-selectionsaverestore.js',
      'client/bower_components/rangy/rangy-serializer.js',
      'client/bower_components/rangy/rangy-textrange.js',
      'client/bower_components/textAngular/dist/textAngular.js',
      'client/bower_components/textAngular/dist/textAngular-sanitize.js',
      'client/bower_components/textAngular/dist/textAngularSetup.js',
      'client/bower_components/angular-loading-bar/build/loading-bar.js',
      'client/bower_components/angularjs-toaster/toaster.js',
      'client/bower_components/nya-bootstrap-select/dist/js/nya-bs-select.js',
      'client/bower_components/angular-strap/dist/angular-strap.js',
      'client/bower_components/angular-strap/dist/angular-strap.tpl.js',
      'client/bower_components/angular-translate/angular-translate.js',
      'client/bower_components/easy-form-generator/dist/js/eda.stepway.min.js',
      'client/bower_components/angular-mocks/angular-mocks.js',
      // endbower
      'client/bower_components/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap.min.js',
      'client/app/app.js',
      'client/app/app.coffee',
      'client/app/**/*.js',
      'client/app/**/*.coffee',
      'client/components/**/*.js',
      'client/components/**/*.coffee',
      'client/app/**/*.jade',
      'client/components/**/*.jade',
      'client/app/**/*.html',
      'client/components/**/*.html'
    ],

    preprocessors: {
      '**/*.jade': 'ng-jade2js',
      '**/*.html': 'html2js',
      'client/app/**/*.js': 'babel',
      '**/*.coffee': 'coffee',
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'client/'
    },

    ngJade2JsPreprocessor: {
      stripPrefix: 'client/'
    },


    babelPreprocessor: {
      options: {
        sourceMap: 'inline'
      },
      filename: function (file) {
        return file.originalPath.replace(/\.js$/, '.es5.js');
      },
      sourceFileName: function (file) {
        return file.originalPath;
      }
    },


    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
