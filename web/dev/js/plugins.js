// Avoid `console` errors in browsers that lack a console.
// -------------------------------------------------------------
(function () {
    var method;
    var noop = function () {
    };
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());





// jQuery Plugins
// -------------------------------------------------------------
(function ($) {
    $(document).ready(function (e) {

        function setEqualHeight(columns){
            columns.height('');
            if($( window ).width() > 400) {
                var tallestcolumn = 0;
                columns.each(function(){
                    currentHeight = $(this).height();
                    if(currentHeight > tallestcolumn){
                        tallestcolumn = currentHeight;
                    }
                });
                columns.height(tallestcolumn);
            }
        }

        function mobileLayout() {
            $('.js-feedbackPersonWr').prepend($('.js-feedbackFromMainFields'));
        }

        function tabletLayout() {
            $('.js-feedbackFromMainFieldsWr').prepend($('.js-feedbackFromMainFields'));
            $('.js-feedback').prepend($('.js-feedbackForm-title'));
        }

        function desktopLayout() {
            $('.js-feedbackForm-wr').prepend($('.js-feedbackForm-title'));
        }

        function updateLayout() {

            var width = $( window ).width();
            if(width >= 720 ) {
                var projectBlocks = $('.js-project-blocks');
                projectBlocks.each(function (key, item) {
                    setEqualHeight($(item).find('.js-project-block div'));
                });
            }
            if(width >= 1183 ) {
                tabletLayout();
                desktopLayout();
            } else if (width >= 720) {
                tabletLayout();
            } else  {
                tabletLayout();
                mobileLayout();
            }
        }

        $(window).resize(function () {
            updateLayout();
        });

        $(window).load(function () {
            updateLayout();
        });
    });
})(jQuery);

//  ====================================================================
//  Видео
//  ====================================================================
(function ($) {
    $(document).ready(function (e) {

    });
})(jQuery);

