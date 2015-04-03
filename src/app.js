/**
 * @file main
 * @author junmer(junmer@foxmail.com)
 */

define(function (require) {

    var $ = require('jquery');
    require('fullpage');

    var isMac = /Mac OS X/.test(navigator.userAgent);

    function setDownLoad() {
        if (isMac) {
            $btn = $('.down-btn');
            $link = $('.down-link');

            var btnUrl = $btn.attr('href');

            $btn
                .attr('href', $link.attr('href'))
                .text($btn.text().replace('Windows', 'OSX'));

            $link
                .attr('href', btnUrl)
                .text($link.text().replace('OSX', 'Windows'));
        }
    }

    function lazySrc() {
        $('[data-src]').each(function(){
            $elem = $(this)
            $elem.attr('src', $elem.attr('data-src'));
        });
    }

    function init () {
        $(document).ready(function() {

            setDownLoad();
            lazySrc();

            $('#fullpage').fullpage({
                sectionsColor: ['#3C5098'],
                anchors: ['banner', 'feature', 'usage', 'terminal', 'app', 'source'],
                afterRender: function() {
                    $('#loading').addClass('load-end');
                    $('.banner').addClass('load-end');
                },
                onLeave: function(index) {
                    if(index === 1) {
                        $('.banner').removeClass('load-end');
                    }
                }
            });

        });
    }

    return {
        init: init
    };

});
