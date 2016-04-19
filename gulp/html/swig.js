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
    loader = require('./loader'),
    options = conf.watchOptions;

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*','browser-sync','plumber','notify', 'require-without-cache', 'run-sequence']
});

gulp.task('clean:html', function() {
    return gulp.src(conf.markup.root + '/*.html')
        .pipe($.rimraf());
});

gulp.task('clean:data', function () {
    return gulp.src( conf.markup.data + '/all.js')
        .pipe($.rimraf())
});

gulp.task('compress:data', function() {
    return gulp.src(conf.markup.data + '/**/*.js')
        .pipe($.concat('all.js'))
        .pipe(gulp.dest(conf.markup.data));
});

gulp.task('build:data', function(cb) {
    $.runSequence(
        'clean:data',
        'compress:data',
        cb
    );
});
  
gulp.task('twig', function() {
    
    function merge_options(objs){
        var ret = {};
        for (var key in objs) {
            if(objs.hasOwnProperty(key)) {
                var obj = objs[key];
                for (var attr in obj) {
                    if(obj.hasOwnProperty(attr)) {
                        ret[attr] = obj[attr];
                    }
                }
            }
        }
        return ret;
    }

    return gulp.src(conf.markup.views + '/pages/*.twig')
        .pipe($.plumber({
            errorHandler: function (error) {
                console.log('\nError in twig file:\n'  + error);
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

gulp.task('build:twig', function(cb) {
    $.runSequence(
        ['clean:html', 'build:data'],
        'twig',
        cb
    );
});

gulp.task('rebuild:data', function(cb) {
    $.runSequence(
        ['build:data'],
        'twig',
        cb
    );
});

gulp.task('watch:twig', ['build:twig'], function(cb) {
 
    chokidar.watch(conf.markup.views, {
        ignored: '',
        persistent: true,
        ignoreInitial: true
    }).on('all', function (event, path) {
        gulp.start('twig');
    });

    chokidar.watch([
        conf.markup.data + '/*',
        conf.markup.data + '/**/*',
        !conf.markup.data + '/all.js'
    ], {
        ignored: 'all.js',
        persistent: true,
        ignoreInitial: true
    }).on('all', function (event, path) {
        gulp.start('rebuild:data');
    });
});