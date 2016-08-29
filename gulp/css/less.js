'use strict';
/**
 * Compile LESS files
 */
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    chokidar   = require('chokidar'),
    conf = require('../config'),
    options = conf.watchOptions;

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'sourcemaps', 'browser-sync', 'notify', 'run-sequence']
});
  
gulp.task('less', function () {
    return gulp.src(conf.preCSS.src)
        .pipe($.plumber())
        .pipe($.concat(conf.preCSS.in))
        .pipe($.if(conf.preCSS.isSourcemaps, $.sourcemaps.init()))
        .pipe($.if(conf.preCSS.isCache, $.cached('less')))
        .pipe($.less().on('error', $.notify.onError(function (error) {
            return '\nError compile:' + '\n' + error;
        })))
        .pipe($.if(conf.preCSS.isCache, $.remember('less')))
        .pipe($.rename(conf.preCSS.out))
        .pipe($.if(conf.preCSS.isSourcemaps, $.sourcemaps.write()))
        .pipe($.if(conf.preCSS.isMinify, $.cssnano()))

        .pipe(gulp.dest(conf.htdocs.css))
        .pipe($.browserSync.reload({stream: true}))
        .on('error', $.notify.onError(function (error) {
            return '\nError! Look in the console for details.\n' + error;
        }));
});

gulp.task('build:bootstrap', function () {
    return gulp.src(conf.htdocs.root + '/less/bootstrap/bootstrap.less' )
        .pipe($.if(conf.preCSS.isSourcemaps, $.sourcemaps.init()))
        .pipe($.less().on('error', $.notify.onError(function (error) {
            return '\nError compile:' + '\n' + error;
        })))
        .pipe($.cssnano())
        .pipe($.rename('bootstrap.min.css'))
        .pipe($.if(conf.preCSS.isSourcemaps, $.sourcemaps.write()))
        .pipe(gulp.dest(conf.htdocs.css));
});

gulp.task('build:less',  function(cb) {
    gulp.start('less');
});

gulp.task('watch:less', function(cb) {
    chokidar.watch(conf.preCSS.src, {
        ignored: '',
        persistent: true,
        ignoreInitial: true
    }).on('all', function (event, path) {
        gulp.start('less');
    });
});