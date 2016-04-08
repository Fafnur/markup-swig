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
    pattern: ['gulp-*', 'del','vinyl-paths','imagemin-pngquant']
});

// BEM less
gulp.task('generate:bem', function () {
    var block     = args.b || null,
        elements  = args.e || null,
        modifiers = args.m || null,
        //page      = args.page || 'index',
        path      = args.path || block,
        less,
        html;

    elements  = elements ? elements.replace(/\s+/g, '').split(',') : [];
    modifiers  = modifiers ? modifiers.replace(/\s+/g, '').split(',') : [];

    try {
        less = '.' + block + ' {\n';
        html = '\n<div class="' + block + '">\n';

        for(var element in elements) {
            if(elements.hasOwnProperty(element)) {
                less = less  + '    &__' + elements[element] + ' {}\n';
                html = html + '    <div class="' + block + '__' + elements[element] + '"></div>\n';
            }
        }
        for(var modifier in modifiers) {
            if(modifiers.hasOwnProperty(modifier)) {
                less = less + '    &_' + modifiers[modifier] + ' {}\n';
            }
        }
        less = less + '}';
        html = html + '</div>';

        if( !fs.existsSync(conf.htdocs.less + '/modules/' + path)) {
            fs.mkdirSync(conf.htdocs.less + '/modules/' + path);
        }
        fs.writeFile(conf.htdocs.less + '/modules/' + path + '/' + block + '.less');
        fs.appendFile( conf.markup.views + '/default/index.html.twig', html);

    } catch (e) {
        console.log(e);
    }
});