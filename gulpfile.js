var gulp        = require('gulp'),
    requireWC   = require('require-without-cache'),
    browserSync = require('browser-sync'),
    swig        = require('gulp-swig'),
    chokidar    = require('chokidar'),
    less        = require('gulp-less'),
    //sass        = require('gulp-sass'),
    rename      = require('gulp-rename'),
    minifyCSS   = require('gulp-minify-css'),
    prefix      = require('gulp-autoprefixer'),
    concat      = require('gulp-concat'),
    path        = require('path'),
    notify      = require('gulp-notify'),
    rimraf      = require('gulp-rimraf'),
    data        = require('gulp-data'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    sourcemaps  = require('gulp-sourcemaps'),
    jshint      = require('gulp-jshint'),
    replace     = require('gulp-replace-task'),
    args        = require('yargs').argv,
    glreplace   = require('gulp-replace'),
    fs          = require('fs'),
    yaml        = require('js-yaml'),
    vinylPaths  = require('vinyl-paths'),
    file        = require('gulp-file');

var htdocs = 'web',
    markup = 'markup',
    src = {
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
        sass: [
            htdocs + '/less/vars/variables.scss',
            htdocs + '/less/vars/mixin.scss',
            htdocs + '/less/common/*.scss',
            htdocs + '/less/libs/**/*.scss',
            htdocs + '/less/libs/**/*.scss',
            htdocs + '/less/snippets/**/*.scss',
            htdocs + '/less/modules/**/*.scss',
            htdocs + '/less/modules/**/**/*.scss'
        ],
        swig:     markup + '/**/*.twig',
        pages:    markup + '/pages/*.twig',
        css:      htdocs + '/css',
        cssmain:  'template.css',
        cssmaino: 'template.min.css',
        js:       htdocs + '/js',
        images:   htdocs + '/images',
        data:     markup + '/data.js',
        json:     markup + '/data.json',
        html:     htdocs,
        tpl:      htdocs + '/components/markup-templates/templates',
        modules:  htdocs +'/less/modules/'
    },
    config = [
        {path: src.less,  name: 'less'},
        {path: src.swig,  name: 'templates'},
        {path: src.pages, name: 'templates'},
        {path: src.json, name: 'templates'}
    ];

var opts = {
    defaults: {
        cache: false,
        locals: requireWC('./' + src.data, require)
    }
};

// Compile Swig
gulp.task('templates', function() {
    return gulp.src(src.pages)
        //.pipe(data( require('./' + src.json) ))
        .pipe(swig(opts))
        .on('error', notify.onError(function (error) {
            return '\nError! Look in the console for details.\n' + error;
        }))
        .pipe(gulp.dest(src.html))
        .pipe(browserSync.reload({stream:true}));
});

// Compile LESS|SASS
gulp.task('less', function () {
    return gulp.src(src.less)
        .pipe(concat('template.less'))
        .pipe(sourcemaps.init())
        .pipe(less())
        .on('error', notify.onError(function (error) {
            return '\nError! Look in the console for details.\n' + error;
        }))
        .pipe(rename(src.cssmain))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(src.css))
        .pipe(browserSync.reload({stream:true}));
});
//gulp.task('sass', function () {
//    return gulp.src(src.scss)
//        .pipe(concat('template.scss'))
//        .pipe(sourcemaps.init())
//        .pipe(sass())
//        .on('error', notify.onError(function (error) {
//            return '\nError! Look in the console for details.\n' + error;
//        }))
//        .pipe(rename(src.cssmain))
//        .pipe(sourcemaps.write())
//        .pipe(gulp.dest(src.css))
//        .pipe(browserSync.reload({stream:true}));
//});

// Compress CSS
gulp.task('compress-css', function () {
    return gulp.src(src.css + '/' + src.cssmain)
        .pipe(prefix('Last 15 version'))
        .pipe(minifyCSS())
        .pipe(rename(src.cssmaino))
        .pipe(gulp.dest(src.css));
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

// Compress images
gulp.task('compress-images', function () {
    gulp.src(src.images)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(src.images));
});

// Clean
gulp.task('clean', function() {
    return gulp.src(src.html, { read: false })
        .pipe(rimraf({ force: true }));
});

// JShint
gulp.task('jshint', function() {
    return gulp.src(src.js)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .on('error', notify.onError(function (error) {
            return '\nError! Look in the console for details.\n' + error;
        }));
});

// Build
gulp.task('build-less', ['less', 'jshint', 'templates']);
//gulp.task('build-sass', ['sass', 'jshint', 'templates']);

// Servers
gulp.task('server', ['less'], function() {
    browserSync({
        server: htdocs
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
gulp.task('server-less',  function() {
    chokidar.watch(src.less, {ignored: /[\/\\]\./})
        .on('all', function(event, path) {gulp.start('less');})
        .on('error', notify.onError(function (error) {
            return '\nError! Look in the console for details.\n' + error;
        }));
});
//gulp.task('server-sass',  function() {
//    chokidar.watch(src.sass, {ignored: /[\/\\]\./})
//        .on('all', function(event, path) {gulp.start('sass');})
//        .on('error', notify.onError(function (error) {
//            return '\nError! Look in the console for details.\n' + error;
//        }));
//});

// Default
gulp.task('default', ['build-less', 'server']);



// Clone
gulp.task('clone', function () {

    var components = args.components || src.tpl,
        from       = args.from,
        ver        = args.ver,
        to         = args.to || from,
        page       = args.page || 'index',
        basePath   = components + '/' + from + '/' + ver,
        config     = yaml.safeLoad(fs.readFileSync(basePath + '/config.yml', 'utf8')),
        tpl        = config.tpl || from;

    try {
        gulp.src(basePath + '/less/*.less')
            .pipe(rename(function (path) {
                path.basename = path.basename.replace(tpl, to);
                path.extname  = ".less"
            }))
            .pipe(glreplace(tpl, to))
            .pipe(gulp.dest(src.modules + to))
        ;
        gulp.src(basePath + '/twig/*.twig')
            .pipe(glreplace(tpl, to))
            .pipe(vinylPaths(function (path) {
                fs.appendFile( markup + '/pages/' + page + '.twig', fs.readFileSync(path, 'utf8') );
                return Promise.resolve();
            }))
        ;
    } catch (e) {
        console.log(e);
    }
});

// BEM
gulp.task('bem', function () {
    var block     = args.b,
        elements  = args.e.split(','),
        modifiers = args.m.split(','),
        page      = args.page || 'index',
        path      = args.path || block,
        filename  = block + '.less',
        output    = src.modules + '/' + path,
        css       = '.' + block + ' {\n',
        html      = '\n<div class="' + block + '">\n',
        i = 0;

    try {
        for(i = 0; i < elements.length; i++) {
            css  = css  + '    &__' + elements[i] + ' {}\n';
            html = html + '    <div class="' + block + '__' + elements[i] + '"></div>\n';
        }
        for(i = 0; i < modifiers.length; i++) {
            css = css + '    &_' + modifiers[i] + ' {}\n';
        }
        css = css + '}';
        html = html + '</div>';

        file(filename, css, { src: true })
            .pipe(gulp.dest(output));

        fs.appendFile( markup + '/pages/' + page + '.twig', html);
    } catch (e) {
        console.log(e);
    }
});