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
    gulpif      = require('gulp-if'),
    glreplace   = require('gulp-replace'),
    fs          = require('fs'),
    insertLines = require('gulp-insert-lines');

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

    var tpl = args.tpl || src.tpl,
        from = args.from,
        ver = args.ver,
        to = args.to || from,
        page = args.page || 'index',
        isRenameFiles = false;

    if ( from != to ) {
        isRenameFiles = true;
    }

    gulp.src(tpl + '/' + from + '/' + ver + '/less/*.less')
        .pipe(gulpif(isRenameFiles, rename(function (path) {
                path.basename = path.basename.replace(from, to);
                path.extname  = ".less"
            }))
        )
        .pipe(gulpif(isRenameFiles, glreplace(from, to)))
        .pipe(gulp.dest(src.modules + to));

    var html = '\n' + fs.readFileSync(tpl + '/' + from + '/' + ver + '/' + from + '.twig', 'utf8');

    if (isRenameFiles) {
        html = html.replace(new RegExp(from, 'g'), to);
    }


    fs.appendFile( markup + '/pages/' + page + '.twig', html, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });

});
