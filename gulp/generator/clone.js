//function toCamelCase(str) {
//    return str.toLowerCase()
//        // Replaces any - or _ characters with a space
//        .replace( /[-_]+/g, ' ')
//        // Removes any non alphanumeric characters
//        .replace( /[^\w\s]/g, '')
//        // Uppercases the first character in each group immediately following a space
//        // (delimited by spaces)
//        .replace( / (.)/g, function($1) { return $1.toUpperCase(); })
//        // Removes spaces
//        .replace( / /g, '' );
//}
//
//function replaceTwigTags(str, to) {
//    return str.replace(/\{\{[\s\S]*?\}\}/g, function (str) {
//        return str.replace(new RegExp(to, 'g'), toCamelCase(to));
//    }).replace(/\{\%[\s\S]*?\%\}/g, function (str) {
//        return str.replace(new RegExp(to, 'g'), toCamelCase(to));
//    }).replace(/\{\#[\s\S]*?\#\}/g, function (str) {
//        return str.replace(new RegExp(to, 'g'), toCamelCase(to));
//    });
//}
//// Clone
//gulp.task('clone', function () {
//
//    var from       = args.from,
//        ver        = args.ver,
//        to         = args.to || from,
//        page       = args.page || 'index',
//        components = null,
//        basePath   = null,
//        config     = null,
//        tpl        = null;
//
//    for( i = 0; i < src.tpl.length; i++) {
//        if (fs.existsSync(src.tpl[i] + '/' + from + '/' + ver + '/config.yml')) {
//            components = src.tpl[i];
//            basePath = components + '/' + from + '/' + ver;
//            var s = fs.readFileSync(basePath + '/config.yml', 'utf8');
//            config = yaml.safeLoad(s);
//            tpl = config.tpl || from;
//            break;
//        }
//    }
//
//    if(config) {
//        try {
//            // Move and rename less files
//            gulp.src(basePath + '/less/*.less')
//                .pipe(rename(function (path) {
//                    path.basename = path.basename.replace(tpl, to);
//                    path.extname  = ".less"
//                }))
//                .pipe(glreplace(tpl, to))
//                .pipe(gulp.dest(src.modules + to))
//            ;
//
//            // Rename and insert html from twig files
//            gulp.src(basePath + '/twig/*.twig')
//                .pipe(vinylPaths(function (path) {
//                    var data = fs.readFileSync(path, 'utf8').replace(new RegExp(tpl, 'g'), to);
//                    data = replaceTwigTags(data,to);
//                    fs.appendFile( markup + '/pages/' + page + '.twig', '\n' + data);
//                    return Promise.resolve();
//                }))
//            ;
//
//            // Insert data
//            gulp.src(basePath + '/data/*.js')
//                .pipe(vinylPaths(function (path) {
//                    var content = fs.readFileSync(path, 'utf8').replace(new RegExp(toCamelCase(tpl), 'g'), toCamelCase(to));
//                    content = content.replace( /\'[\s\S]*?\'/g ,function (str) {
//                        return str.replace(new RegExp(toCamelCase(to), 'g'), to);
//                    });
//                    fs.appendFile( markup + '/data.js', '\n' +  content );
//                    return Promise.resolve();
//                }))
//            ;
//            // Move images
//            gulp.src(basePath + '/images/*')
//                .pipe(gulp.dest(src.images + '/' + to))
//            ;
//            // Rename and insert js
//            gulp.src(basePath + '/js/*.js')
//                .pipe(glreplace(tpl, to))
//                .pipe(vinylPaths(function (path) {
//                    var data = fs.readFileSync(path, 'utf8')
//                        .replace(new RegExp(tpl, 'g'), to)
//                        .replace(new RegExp(toCamelCase(tpl), 'g'), toCamelCase(to));
//                    fs.appendFile( markup + '/pages/' + page + '.twig', '\n<script>\n' + data +'\n</script>' );
//                    return Promise.resolve();
//                }))
//            ;
//        } catch (e) {
//            console.log(e);
//        }
//    } else {
//        console.log('Not found template: ' + from + '/' + ver + "\n");
//    }
//});