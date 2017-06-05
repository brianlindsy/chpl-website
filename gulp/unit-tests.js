'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var karma = require('karma');

var pathSrcHtml = [
    path.join(conf.paths.src, '/**/*.html')
];

var pathSrcJs = [
    //path.join(conf.paths.src, '/**/!(*.spec).js')
    path.join(conf.paths.src, '/**/!(*.spec|cap*|certid*|swagger*|st*).js')
];

function runTests (singleRun, done) {
    var reporters = ['dots', 'junit', 'growl', 'html', 'coverage'];
    var preprocessors = {};

    pathSrcHtml.forEach(function(path) {
        preprocessors[path] = ['ng-html2js'];
    });

    pathSrcJs.forEach(function(path) {
        preprocessors[path] = ['coverage'];
    });

    var localConfig = {
        configFile: path.join(__dirname, '/../karma.conf.js'),
        singleRun: singleRun,
        autoWatch: !singleRun,
        reporters: reporters,
        preprocessors: preprocessors,
        coverageReporter: {
            dir: 'test_reports/coverage',
            reporters: [
                { type: 'lcov', subdir: '.' },
                { type: 'text-summary' }
            ]
        },
        growlReporter: { prefix: 'CHPL Unit Tests\n' },
        htmlReporter: {
            groupSuites: true,
            outputFile: 'test_reports/units.html',
            useCompactStyle: true
        },
        junitReporter: {
            outputDir: 'test_reports',
            suite: 'unit'
        }
    };

    var server = new karma.Server(localConfig, function(failCount) {
        done(failCount ? new Error("Failed " + failCount + " tests.") : null);
    })
    server.start();
}

gulp.task('test', ['scripts'], function(done) {
    runTests(true, done);
});

gulp.task('test:auto', ['watch'], function(done) {
    runTests(false, done);
});