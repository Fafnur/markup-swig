'use strict';
/**
 * Compress CSS file
 */
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    conf = require('../config');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'del','vinyl-paths']
});

gulp.task('compress:css:clean', function() {
    return gulp.src(conf.htdocs.css + '/' + conf.preCSS.outMin)
        .pipe($.vinylPaths($.del));
});

// Compress CSS
gulp.task('compress:css', ['compress:css:clean'], function () {
    return gulp.src(conf.htdocs.css + '/' + conf.preCSS.out)
        .pipe($.autoprefixer())
        .pipe($.minifyCss())
        .pipe($.rename(conf.preCSS.outMin))
        .pipe(gulp.dest(conf.htdocs.css));
});
