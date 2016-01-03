//// BEM less
//gulp.task('bem', function () {
//    var block     = args.b,
//        elements  = args.e,
//        modifiers = args.m,
//        page      = args.page,
//        path      = args.path || block,
//        filename  = block + '.less',
//        less      = '.' + block + ' {\n',
//        html      = '\n<div class="' + block + '">\n',
//        i;
//
//    if(!page) {
//        page = 'index';
//        if(src.tplSuffix) {
//            page = page + '.html';
//        }
//    }
//
//    if(elements) {
//        elements  = elements.split(',');
//    } else {
//        elements = [];
//    }
//
//    if(modifiers) {
//        modifiers  = modifiers.split(',');
//    } else {
//        modifiers = [];
//    }
//
//    try {
//        for(i = 0; i < elements.length; i++) {
//            less = less  + '    &__' + elements[i] + ' {}\n';
//            html = html + '    <div class="' + block + '__' + elements[i] + '"></div>\n';
//        }
//        for(i = 0; i < modifiers.length; i++) {
//            less = less + '    &_' + modifiers[i] + ' {}\n';
//        }
//        less = less + '}';
//        html = html + '</div>';
//
//        file(filename, less, { src: true })
//            .pipe(gulp.dest(src.modules + '/' + path));
//
//        fs.appendFile( markup + '/pages/' + page + '.twig', html);
//    } catch (e) {
//        console.log(e);
//    }
//});