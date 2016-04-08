'use strict';

var gutil = require('gulp-util');
var env = require('process').env;

exports.root = process.env.INIT_CWD;


/**
 * Root folder web-app
 */
var htdocs = {
    root:   'web',
    css:    'web/css',
    less:   'web/less',
    js:     'web/js',
    images: 'web/images'
};
exports.htdocs = htdocs;

/**
 * Root folder src
 */
var markup = {
    root:  'markup',
    views: 'markup/views',
    data:  'markup/data'
};
exports.markup = markup;

/**
 * Options for Swig.js compiler
 */
var swig = {
    usePostfix: true,
    useLodader: true
};
exports.swig  = swig;

/**
 * Preprocessor css
 */
var preCSS = {
    name: 'less',
    src: [
        htdocs.less + '/vars/variables.less',
        htdocs.less + '/vars/mixin.less',
        htdocs.less + '/common/*.less',
        htdocs.less + '/libs/**/*.less',
        htdocs.less + '/libs/**/*.css',
        htdocs.less + '/snippets/**/*.less',
        htdocs.less + '/modules/**/*.less',
        htdocs.less + '/modules/**/**/*.less',
        htdocs.less + '/components/**/*.less'
    ],
    modules:      htdocs.less + '/components/**/*.less',
    in:           'template.less',
    out:          'template.css',
    outMin:       'template.min.css',
    isSourcemaps: false,
    isMinify: false
};
exports.preCSS = preCSS;

/**
 * Custom system templates for web-app
 */
exports.templates = [
    htdocs.root + '/components/markup-templates/templates'
];

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

exports.watchOptions = {
    usePolling: env.USEPOLLING || false,
    verbose: true
};