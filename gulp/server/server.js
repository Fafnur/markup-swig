'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    conf = require('../config')
    ;

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'run-sequence', 'browser-sync']
});

gulp.task('serve', function() {
    gulp.start('watch:less');
    gulp.start('watch:twig');
    $.browserSync({
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