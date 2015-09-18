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
var clean       = require('gulp-clean');

// Demo Data
var data        = require('./markup/static/js/data.js');

var htdocs      = 'web/dev';

var src = {
    less: [
        './markup/static/less/vars/variables.less',
        './markup/static/less/vars/mixin.less',
        './markup/static/less/common/*.less',
        './markup/static/less/libs/**/*.less',
        './markup/static/less/libs/**/*.css',
        './markup/static/less/snippets/**/*.less',
        './markup/static/less/modules/**/*.less',
        './markup/static/less/modules/**/**/*.less'
    ],
    swig:  './markup/views/**/*.twig',
    pages: './markup/views/pages/*.twig',
    staticFiles: 'markup/static/**/*',
    css:   htdocs + '/css',
    js:    htdocs + '/js',
    img:   htdocs + '/images',
    fonts: htdocs + '/fonts',
    libs:  htdocs + '/libs',
    video: htdocs + '/video',
    data:  htdocs + '/js/data.js',
    html:  htdocs

};

var config = [
    {
        path: src.less,  name: 'less'
    },
    {
        path: src.swig,  name: 'templates'
    },
    {
        path: src.pages, name: 'templates'
    },
    {
        path: src.staticFiles, name: 'static-files'
    }
];

//  Server
gulp.task('server', ['less'], function() {

    browserSync({
        server: src.html,
        files: ["dev/*.html", "dev/css/*.css", "dev/js/*.js"]
    });

    config.forEach(function (item, i, config) {
        chokidar.watch(item.path, {
            ignored: '',
            persistent: true,
            ignoreInitial: true
        }).on('all', function(event, path) {
            gulp.start(item.name);
        });
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

// Move static files
gulp.task('static-files', function () {
    return gulp.src(src.staticFiles)
        .on('error', notify.onError(function (error) {
            return '\nError! Look in the console for details.\n' + error;
        }))
        .pipe(gulp.dest(src.html))
        .pipe(browserSync.reload({stream:true}));
});

// Clean htdocs
gulp.task('clean', function () {
    return gulp.src(src.html, {read: false})
        .pipe(clean());
});

gulp.task('default', [ 'clean', 'static-files', 'server', 'less', 'templates' ]);