'use strict';
/**
 * Compile LESS files
 */
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    fs   = require('fs'),
    chokidar   = require('chokidar'),
    conf = require('../config'),
    loader = require('./loader')
    ;

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*','browser-sync','plumber','notify', 'require-without-cache', 'del','vinyl-paths']
});

gulp.task('compile:clean:html', function() {
    return gulp.src(conf.markup.root + '/*.html')
        .pipe($.vinylPaths($.del));
});

gulp.task('compile:data:del', function () {
    return gulp.src( conf.markup.data + '/all.js')
        .pipe($.vinylPaths($.del))
});

gulp.task('compile:data:all',['compile:data:del'], function() {
    return gulp.src(conf.markup.data + '/**/*.js')
        .pipe($.concat('all.js'))
        .pipe(gulp.dest(conf.markup.data));
});

// Compile Swig
gulp.task('compile:twig', function() {

    function merge_options(objs){
        var ret = {};
        for (var key in objs) {
            var obj = objs[key];
            for (var attr in obj) {
                ret[attr] = obj[attr];
            }
        }
        return ret;
    }

    return gulp.src(conf.markup.views + '/pages/*.twig')
        .pipe($.plumber({
            errorHandler: function (error) {
                console.log('\nError in twig file:' + ctrl.tpl + '\n'  + error);
            }
        }))
        .pipe($.swig({
            defaults: {
                loader: loader(),
                cache: false,
                locals: merge_options([
                   $.requireWithoutCache(conf.root + path.sep + conf.markup.data.replace('\/',path.sep) + path.sep + 'all.js', require)
                ])
            }
        }))
        .pipe($.rename(function (path) {
            path.basename = path.basename.replace(/\..+$/, '');
        }))
        .pipe(gulp.dest(conf.htdocs.root))
        .on('error', $.notify.onError(function (error) {
            return '\nError! Look in the console for details.\n' + error;
        }))
        .pipe($.browserSync.reload({stream:true}));
});

gulp.task('compile:build:twig', ['compile:clean:html', 'compile:data:all'], function() {
    gulp.start('compile:twig');
});

gulp.task('compile:rebuild:data', ['compile:data:all'], function() {
    gulp.start('compile:twig');
});

gulp.task('compile:watch:twig', ['compile:clean:html'], function() {
    gulp.start('compile:build:twig');

    chokidar.watch(conf.markup.views, {
        ignored: '',
        persistent: true,
        ignoreInitial: true
    }).on('all', function (event, path) {
        gulp.start('compile:twig');
    });

    chokidar.watch(conf.htdocs.data + '/**/*', {
        ignored: 'all.js',
        persistent: true,
        ignoreInitial: true
    }).on('all', function (event, path) {
        gulp.start('compile:rebuild:data');
    });
});