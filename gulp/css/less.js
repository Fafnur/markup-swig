'use strict';
/**
 * Compile LESS files
 * @type {Gulp|exports|module.exports}
 */
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    conf = require('../config');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'sourcemaps', 'browser-sync']
});

// Compile LESS
gulp.task(conf.preCSS.task, function () {
    return gulp.src(conf.preCSS.src)
        .pipe($.concat(conf.preCSS.in))
        .pipe($.gulpIf(conf.preCSS.isSourcemaps, $.sourcemaps.init()))
        .pipe($.less())
        .on('error', $.notify.onError(function (error) {
            return '\nError! Look in the console for details.\n' + error;
        }))
        .pipe($.rename(conf.preCSS.out))
        .pipe($.gulpIf(conf.preCSS.isSourcemaps, $.sourcemaps.write()))
        .pipe(gulp.dest(conf.htdocs.css))
        .pipe($.browserSync.reload({stream: true}));
});