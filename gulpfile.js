var gulp        = require('gulp'),
    requireWC   = require('require-without-cache'),
    browserSync = require('browser-sync'),
    swig        = require('gulp-swig'),
    chokidar    = require('chokidar'),
    less        = require('gulp-less'),
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
//sourcemaps  = require('gulp-sourcemaps'),
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
        swig:     markup + '/**/*.twig',
        pages:    markup + '/pages/*.twig',
        css:      htdocs + '/css',
        cssmain:  'template.css',
        cssmaino: 'template.min.css',
        js:       htdocs + '/js',
        images:   htdocs + '/images',
        data:     markup + '/data.js',
        html:     htdocs,
        tpl:      htdocs + '/components/markup-templates/templates',
        modules:  htdocs +'/less/modules/'
    },
    config = [
        {path: src.less,  name: 'less'},
        {path: src.swig,  name: 'templates'},
        {path: src.pages, name: 'templates'},
        {path: src.data,  name: 'templates'}
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

// Compile LESS
gulp.task('less', function () {
    return gulp.src(src.less)
        .pipe(concat('template.less'))
        //.pipe(sourcemaps.init())
        .pipe(less())
        .on('error', notify.onError(function (error) {
            return '\nError! Look in the console for details.\n' + error;
        }))
        .pipe(rename(src.cssmain))
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest(src.css))
        .pipe(browserSync.reload({stream:true}));
});

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

// Default
gulp.task('default', ['build-less', 'server']);

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
gulp.task('clone', function () {

    var components = src.tpl,
        from       = args.from,
        ver        = args.ver,
        to         = args.to || from,
        page       = args.page || 'index',
        basePath   = components + '/' + from + '/' + ver,
        config     = yaml.safeLoad(fs.readFileSync(basePath + '/config.yml', 'utf8')),
        tpl        = config.tpl || from;

    try {
        // Move and rename less files
        gulp.src(basePath + '/less/*.less')
            .pipe(rename(function (path) {
                path.basename = path.basename.replace(tpl, to);
                path.extname  = ".less"
            }))
            .pipe(glreplace(tpl, to))
            .pipe(gulp.dest(src.modules + to))
        ;
        // Rename and insert html from twig files
        gulp.src(basePath + '/twig/*.twig')
            .pipe(vinylPaths(function (path) {
                var data = fs.readFileSync(path, 'utf8').replace(new RegExp(tpl, 'g'), to);
                data = replaceTwigTags(data,to);
                fs.appendFile( markup + '/pages/' + page + '.twig', '\n' + data);
                return Promise.resolve();
            }))
        ;
        // Insert data
        gulp.src(basePath + '/data/*.js')
            .pipe(vinylPaths(function (path) {
                var content = fs.readFileSync(path, 'utf8').replace(new RegExp(toCamelCase(tpl), 'g'), toCamelCase(to));
                content = content.replace( /\'[\s\S]*?\'/g ,function (str) {
                    return str.replace(new RegExp(toCamelCase(to), 'g'), to);
                });
                fs.appendFile( markup + '/data.js', '\n' +  content );
                return Promise.resolve();
            }))
        ;
        // Move images
        gulp.src(basePath + '/images/*')
            .pipe(gulp.dest(src.images + '/' + to))
        ;
        // Rename and insert js
        gulp.src(basePath + '/js/*.js')
            .pipe(glreplace(tpl, to))
            .pipe(vinylPaths(function (path) {
                var data = fs.readFileSync(path, 'utf8')
                    .replace(new RegExp(tpl, 'g'), to)
                    .replace(new RegExp(toCamelCase(tpl), 'g'), toCamelCase(to));
                fs.appendFile( markup + '/pages/' + page + '.twig', '\n<script>\n' + data +'\n</script>' );
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
        elements  = args.e,
        modifiers = args.m,
        page      = args.page || 'index',
        path      = args.path || block,
        filename  = block + '.less',
        less      = '.' + block + ' {\n',
        html      = '\n<div class="' + block + '">\n',
        i;

    if(elements) {
        elements  = elements.split(',');
    } else {
        elements = [];
    }

    if(modifiers) {
        modifiers  = modifiers.split(',');
    } else {
        modifiers = [];
    }

    try {
        for(i = 0; i < elements.length; i++) {
            less = less  + '    &__' + elements[i] + ' {}\n';
            html = html + '    <div class="' + block + '__' + elements[i] + '"></div>\n';
        }
        for(i = 0; i < modifiers.length; i++) {
            less = less + '    &_' + modifiers[i] + ' {}\n';
        }
        less = less + '}';
        html = html + '</div>';

        file(filename, less, { src: true })
            .pipe(gulp.dest(src.modules + '/' + path));

        fs.appendFile( markup + '/pages/' + page + '.twig', html);
    } catch (e) {
        console.log(e);
    }
});