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
        .pipe($.plumber({
            errorHandler: function (error) {
                console.log('\nError in less compile\n'  + error);
            }
        }))
        .pipe($.concat(conf.preCSS.in))
        .pipe($.if(conf.preCSS.isSourcemaps, $.sourcemaps.init()))
        .pipe($.less())
        .on('error', $.notify.onError(function (error) {
            return '\nError! Look in the console for details.\n' + error;
        }))
        .pipe($.rename(conf.preCSS.out))
        .pipe($.if(conf.preCSS.isSourcemaps, $.sourcemaps.write()))
        .pipe($.if(conf.preCSS.isMinify, $.cssnano()))
        .pipe(gulp.dest(conf.htdocs.css))
        .pipe($.browserSync.reload({stream: true}));
});

gulp.task('build:bootstrap', function () {
    return gulp.src(conf.htdocs.root + '/less/bootstrap/bootstrap.less' )
        .pipe($.plumber({
            errorHandler: function (error) {
                console.log('\nError in less/bootstrap/bootstrap.less file\n'  + error);
            }
        }))
        .pipe($.if(conf.preCSS.isSourcemaps, $.sourcemaps.init()))
        .pipe($.less())
        .pipe($.cssnano())
        .pipe($.rename('bootstrap.min.css'))
        .pipe($.if(conf.preCSS.isSourcemaps, $.sourcemaps.write()))
        .pipe(gulp.dest(conf.htdocs.css))
        .on('error', $.notify.onError(function (error) {
            return '\nError compile: ' + conf.htdocs.root + '/less/bootstrap/bootstrap.less' + '\n' + error;
        }));
});

gulp.task('build:less',  function(cb) {
    gulp.start('less');
});

gulp.task('watch:less',  function(cb) {
    $.watch(conf.preCSS.src, options, function (vinyl) {
        gulp.start('less');
    });
});