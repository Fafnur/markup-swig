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

// Demo Data
var data        = require('./markup/static/js/data.js');

var prefix_dir = 'web/dev';

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
    css:   prefix_dir + '/css',
    js:    prefix_dir + '/js',
    img:   prefix_dir + '/images',
    fonts: prefix_dir + '/fonts',
    libs:  prefix_dir + '/libs',
    video: prefix_dir + '/video',
    html:  prefix_dir + '',
    data:  prefix_dir + 'dev/js/data.js',
    staticJs:  'markup/static/js/*.*',
    staticCss: 'markup/static/css/*.*',
    staticImg: [
        'markup/static/images/*.*',
        'markup/static/images/**/*.*',
        'markup/static/images/**/**/*.*'
    ],
    staticFonts:    'markup/static/fonts/*.*',
    staticLibs:     'markup/static/libs/**/*',
    staticVideo:     [
        'markup/static/video/**/*.*',
        'markup/static/video/*.*'
    ]
};

var config = [
	{
        isTask: false,
		path: src.less,
		name: 'less'
	},
	{
        isTask: false,
		path: src.swig,
		name: 'templates'
	},
	{
        isTask: false,
		path: src.pages,
		name: 'templates'
	},
	{
        isTask: true,
		path: src.staticCss,
        dest: src.css,
		name: 'static-css'
	},
	{
        isTask: true,
		path: src.staticJs,
        dest: src.js,
		name: 'static-js'
	},
	{
        isTask: true,
		path: src.staticImg,
        dest: src.img,
		name: 'static-img'
	},
	{
        isTask: true,
		path: src.staticFonts,
        dest: src.fonts,
		name: 'static-fonts'
	},
	{
        isTask: true,
		path: src.staticLibs,
        dest: src.libs,
		name: 'static-libs'
	},
	{
        isTask: true,
		path: src.staticVideo,
        dest: src.video,
		name: 'static-video'
	}
];

// Add move static files
config.forEach(function (item, i, config) {
    if(item.isTask) {
        gulp.task(item.name, function () {
            return gulp.src(item.path)
                .on('error', notify.onError(function (error) {
                    return '\nError! Look in the console for details.\n' + error;
                }))
                .pipe(gulp.dest(item.dest))
                .pipe(browserSync.reload({stream:true}));
        });
    }
});

//  Server + watching less/html files
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

// Swig modules
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

gulp.task('default', ['server', 'static-fonts', 'static-img', 'static-js', 'static-css', 'templates', 'static-libs', 'static-video' ]);