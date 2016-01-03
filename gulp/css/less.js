'use strict';
/**
 * Compile LESS files
 */
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    chokidar   = require('chokidar'),
    conf = require('../config');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'sourcemaps', 'browser-sync', 'notify', 'del','vinyl-paths']
});

gulp.task('compile:clean:css', function() {
    return gulp.src(conf.markup.root + '/css/' + conf.preCSS.out)
        .pipe($.vinylPaths($.del));
});

gulp.task('compile:less', function () {
    return gulp.src(conf.preCSS.src)
        .pipe($.concat(conf.preCSS.in))
        .pipe($.if(conf.preCSS.isSourcemaps, $.sourcemaps.init()))
        .pipe($.less())
        .on('error', $.notify.onError(function (error) {
            return '\nError! Look in the console for details.\n' + error;
        }))
        .pipe($.rename(conf.preCSS.out))
        .pipe($.if(conf.preCSS.isSourcemaps, $.sourcemaps.write()))
        .pipe(gulp.dest(conf.htdocs.css))
        .pipe($.browserSync.reload({stream: true}))
        ;
});

gulp.task('compile:less:bootstrap', function () {
    return gulp.src(conf.htdocs.root + '/less/bootstrap/bootstrap.less' )
        .pipe($.if(conf.preCSS.isSourcemaps, $.sourcemaps.init()))
        .pipe($.less())
        .pipe($.minifyCss())
        .pipe($.rename('bootstrap.min.css'))
        .pipe($.if(conf.preCSS.isSourcemaps, $.sourcemaps.write()))
        .pipe(gulp.dest(conf.htdocs.css))
        .on('error', $.notify.onError(function (error) {
            return '\nError compile: ' + conf.htdocs.root + '/less/bootstrap/bootstrap.less' + '\n' + error;
        }));
});

gulp.task('compile:watch:less', ['compile:clean:css'], function() {
    gulp.start('compile:less');

    chokidar.watch(conf.preCSS.src, {
        ignored: '',
        persistent: true,
        ignoreInitial: true
    }).on('all', function (event, path) {
        gulp.start('compile:less');
    });
});