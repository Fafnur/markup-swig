//// Compile JS
//gulp.task('compile:js', function () {
//    return gulp.src(src.javascript)
//        .pipe(concat('scripts.js'))
//        .on('error', notify.onError(function (error) {
//            return '\nError! Look in the console for details.\n' + error;
//        }))
//        .pipe(gulp.dest(src.js))
//        .pipe(browserSync.reload({stream:true}));
//});
//
//
//
//// JShint
//gulp.task('jshint', function() {
//    return gulp.src(src.js)
//        .pipe(jshint())
//        .pipe(jshint.reporter('jshint-stylish'))
//        .on('error', notify.onError(function (error) {
//            return '\nError! Look in the console for details.\n' + error;
//        }));
//});