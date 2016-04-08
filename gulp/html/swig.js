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

gulp.task('watch:twig', function() {
    $.watch(conf.markup.views, options, function (vinyl) {
        gulp.start('twig');
    });

    $.watch(conf.htdocs.data + '/**/*', options, function (vinyl) {
        gulp.start('rebuild:data');
    });
});