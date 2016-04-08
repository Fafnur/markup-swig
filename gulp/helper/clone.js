'use strict';
/**
 * Compile LESS files
 */
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    fs   = require('fs'),
    args = require('yargs').argv,
    conf = require('../config');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'del','vinyl-paths','js-yaml']
});


function toCamelCase(str) {
    return str.toLowerCase()
        // Replaces any - or _ characters with a space
        .replace( /[-_]+/g, ' ')
        // Removes any non alphanumeric characters
        .replace( /[^\w\s]/g, '')
        // Uppercases the first character in each group immediately following a space
        // (delimited by spaces)
        .replace( / (.)/g, function($1) { return $1.toUpperCase(); })
        // Removes spaces
        .replace( / /g, '' );
}

function replaceTwigTags(str, to) {
    return str.replace(/\{\{[\s\S]*?\}\}/g, function (str) {
        return str.replace(new RegExp(to, 'g'), toCamelCase(to));
    }).replace(/\{\%[\s\S]*?\%\}/g, function (str) {
        return str.replace(new RegExp(to, 'g'), toCamelCase(to));
    }).replace(/\{\#[\s\S]*?\#\}/g, function (str) {
        return str.replace(new RegExp(to, 'g'), toCamelCase(to));
    });
}

// Clone
gulp.task('clone:tpl', function () {

    var from       = args.from,
        ver        = args.ver,
        to         = args.to || from,
        page       = args.page || 'index',
        components = null,
        basePath   = null,
        config     = null,
        tpl        = null;

    for(var i = 0; i < conf.templates.length; i++) {
        if (fs.existsSync(conf.templates[i] + '/' + from + '/' + ver + '/config.yml')) {
            components = conf.templates[i];
            basePath = components + '/' + from + '/' + ver;
            var s = fs.readFileSync(basePath + '/config.yml', 'utf8');
            config = $.jsYaml.safeLoad(s);
            tpl = config.tpl || from;
            break;
        }
    }

    if(config) {
        try {
            // Move and rename less files
            gulp.src(basePath + '/less/*.less')
                .pipe($.rename(function (path) {
                    path.basename = path.basename.replace(tpl, to);
                    path.extname  = ".less"
                }))
                .pipe($.replace(tpl, to))
                .pipe(gulp.dest(conf.htdocs.less + '/modules/' + to))
            ;

            // Rename and insert html from twig files
            gulp.src(basePath + '/twig/*.twig')
                .pipe($.tap(function(file) {
                    var data = fs.readFileSync(file.path, 'utf8').replace(new RegExp(tpl, 'g'), to);
                    data = replaceTwigTags(data,to);
                    fs.appendFile( conf.markup.views + '/default/index.html.twig', '\n' + data);
                }))
            ;

            // Insert data
            gulp.src(basePath + '/data/*.js')
                .pipe($.tap(function(file) {
                    var content = fs.readFileSync(file.path, 'utf8').replace(new RegExp(toCamelCase(tpl), 'g'), toCamelCase(to));
                    content = content.replace( /\'[\s\S]*?\'/g ,function (str) {
                        return str.replace(new RegExp(toCamelCase(to), 'g'), to);
                    });
                    fs.appendFile(conf.markup.models + '/common.js', '\n' +  content );
                }))
            ;

            // Move images
            gulp.src(basePath + '/images/**/*')
                .pipe(gulp.dest(conf.htdocs.images + '/' + to))
            ;
            // Rename and insert js
            gulp.src(basePath + '/js/*.js')
                .pipe($.replace(tpl, to))
                .pipe($.tap(function(file) {
                    var data = fs.readFileSync(file.path, 'utf8')
                        .replace(new RegExp(tpl, 'g'), to)
                        .replace(new RegExp(toCamelCase(tpl), 'g'), toCamelCase(to));
                    fs.appendFile( conf.markup.views + '/default/index.html.twig', '\n<script>\n' + data +'\n</script>' );
                }))
            ;
        } catch (e) {
            console.log(e);
        }
    } else {
        console.log('Not found template: ' + from + '/' + ver + "\n");
    }
});
