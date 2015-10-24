var gulp        = require('gulp');
var browserSync = require('browser-sync');
var swig        = require('gulp-swig');
var reload      = browserSync.reload;
var chokidar    = require('chokidar');
var less        = require('gulp-less');
var rename      = require('gulp-rename');
var minifyCSS   = require('gulp-minify-css');
var prefix      = require('gulp-autoprefixer');
var concat      = require('gulp-concat');
var path        = require('path');
var notify      = require('gulp-notify');
var rimraf      = require('gulp-rimraf');

var htdocs  = 'web';
//var build   = htdocs + '/build';
var markup  = 'markup';

// Demo Data
var data    = require('./markup/data.js');

var src = {
    less: [
        htdocs + '/less/vars/variables.less',
        htdocs + '/less/vars/mixin.less',
        htdocs + '/less/common/*.less',
        htdocs + '/less/libs/**/*.less',
        htdocs + '/less/libs/**/*.css',
        htdocs + '/less/snippets/**/*.less',
        htdocs + '/less/modules/**/*.less',
        htdocs + '/less/modules/**/**/*.less'
    ],
    swig:  markup + '/**/*.twig',
    pages: markup + '/pages/*.twig',
    css:   htdocs + '/css',
    js:    htdocs + '/js',
    data:  htdocs + '/js/data.js',
    html:  htdocs
};

var config = [
    {path: src.less,  name: 'less'},
    {path: src.swig,  name: 'templates'},
    {path: src.pages, name: 'templates'}
];

//  Server
gulp.task('server', ['less'], function() {

    browserSync({
        server: src.html,
        serveStatic: ['.', '../']
    });

    config.forEach(function (item, i, config) {
        chokidar.watch(item.path, {
            ignored: '',
            persistent: true,
            ignoreInitial: true
        }).on('all', function(event, path) {
            gulp.start(item.name);
        }) .on('error', function(error) { log('Error happened', error); });
    });
});

// Compile Swig
gulp.task('templates', function() {
    return gulp.src(src.pages)
        .pipe(swig({
            defaults: { cache: false, locals: data }
        }))
        .on('error', notify.onError(function (error) {
            return '\nError! Look in the console for details.\n' + error;
        }))
        .pipe(gulp.dest(src.html))
        .pipe(browserSync.reload({stream:true}));
});

// Compile LESS
gulp.task('less', function () {
    return gulp.src(src.less)
        .pipe(concat('style.less'))
        .pipe(less())
        .on('error', notify.onError(function (error) {
            return '\nError! Look in the console for details.\n' + error;
        }))
        .pipe(prefix('Last 15 version'))
        //.pipe(minifyCSS())
        .pipe(rename('template.css'))
        .pipe(gulp.dest(src.css))
        .pipe(browserSync.reload({stream:true}));
});

// Compile JS
gulp.task('js', function () {
    return gulp.src(src.javascript)
        .pipe(concat('scripts.js'))
        .on('error', notify.onError(function (error) {
            return '\nError! Look in the console for details.\n' + error;
        }))
        .pipe(gulp.dest(src.js))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('build', ['less', 'templates']);

gulp.task('default', ['build', 'server']);