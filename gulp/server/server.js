'use strict';
/**
 * Compile LESS files
 */
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    chokidar = require('chokidar'),
    browserSync = require('browser-sync'),
    conf = require('../config')
    ;

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'run-sequence']
});

gulp.task('serve', ['watch:less', 'watch:twig'], function() {
    browserSync({
        server: 'web',
        files: ['web/css/*.css', 'web/js/*.js', 'web/*.html']
    });
});

gulp.task('build', function(cb) {
    $.runSequence(
        ['build:less', 'build:twig'], 
        cb
    );
});