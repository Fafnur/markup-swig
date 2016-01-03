'use strict';
/**
 * Compress images
 */
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    conf = require('../config');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'del','vinyl-paths','imagemin-pngquant']
});

gulp.task('compress:images:clean', function() {
    return gulp.src(conf.htdocs.root + '/compress-images')
        .pipe($.vinylPaths($.del));
});

gulp.task('compress:images', ['compress:images:clean'], function () {
    console.log(conf.htdocs.images);
    return gulp.src(conf.htdocs.images + '/**/*')
        .pipe($.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [$.imageminPngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(conf.htdocs.root + '/compress-images'));
});