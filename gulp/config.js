'use strict';
/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */

var gutil = require('gulp-util');

/**
 * Root folder web-app
 */
var htdocs = {
    root:   'web',
    css:    'web/css',
    js:     'web/js',
    images: 'web/images'
};
exports.htdocs = htdocs;

/**
 * Root folder src
 */
var markup = {
    root:  'markup',
    model: 'markup/models',
    view:  'markup/views',
    ctrl:  'markup/contollers'
};
exports.markup = markup;

/**
 * Path watchers files
 */
var mvc = {
    model: markup.model + '/**/*.js',
    views: markup.view + '/**/*.twig',
    ctrls: markup.ctrl + '/**/*.js',
    task: 'compile:twig'
};
exports.markup = mvc;

/**
 * Options for Swig.js compiler
 */
var swig = {
    usePostfix: true,
    useLodader: true,
    src: mvc.views
};
exports.swig  = swig;

/**
 * Preprocessor css
 */
var preCSS = {
    name: 'less',
    src: [
        htdocs.root + '/less/vars/variables.less',
        htdocs.root + '/less/vars/mixin.less',
        htdocs.root + '/less/common/*.less',
        htdocs.root + '/less/libs/**/*.less',
        htdocs.root + '/less/libs/**/*.css',
        htdocs.root + '/less/snippets/**/*.less',
        htdocs.root + '/less/modules/**/*.less',
        htdocs.root + '/less/modules/**/**/*.less',
        htdocs.root + '/less/components/**/*.less'
    ],
    modules:      '/less/components/**/*.less',
    in:           'template.less',
    out:          'template.css',
    isSourcemaps: false,
    task:         'compile:less'
};
exports.preCSS = preCSS;

/**
 * Custom system templates for web-app
 */
exports.markupTemplates = [
    htdocs + '/components/markup-templates/templates',
    'E:\\domains\\layouts\\templates'
];

/**
 * List watchers for web-app
 */
exports.watchers = {
    preprocessor: {
        path: preCSS.src,
        task: preCSS.task
    },
    models: {
        path: mvc.model,
        task: mvc.task
    },
    controllers: {
        path: mvc.ctrls,
        task: mvc.task
    },
    views: {
        path: mvc.views,
        task: mvc.task
    }
};

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function(title) {
    'use strict';

    return function(err) {
        gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
        this.emit('end');
    };
};