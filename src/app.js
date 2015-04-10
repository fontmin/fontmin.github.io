/**
 * @file main
 * @author junmer(junmer@foxmail.com)
 */

define(function (require) {

    var $ = require('jquery');
    require('lettering');
    require('fullpage');

    var isMac = /Mac OS X/.test(navigator.userAgent);

    var ua = navigator.userAgent;

    var isWin64 = (ua.indexOf('WOW64') !== -1 || ua.indexOf('Win64') !== -1);

    /**
     * 下载链接
     */
    function setDownLoad() {

        var $btn = $('.down-btn');
        var $link = $('.down-link');
        var btnUrl = $btn.attr('href');

        if (isWin64) {

            $btn.attr('href', btnUrl.replace('win32', 'win64'));

        }

        if (isMac) {

            $btn
                .attr('href', $link.attr('href'))
                .text($btn.text().replace('Windows', 'OS X'));

            $link
                .attr('href', btnUrl)
                .text($link.text().replace('OS X', 'Windows'));
        }
    }

    /**
     * 懒加载
     */
    function lazySrc() {
        $('[data-src]').each(function () {
            var $elem = $(this);
            $elem.attr('src', $elem.attr('data-src'));
        });
    }

    function setFeatureAnim() {
        $('.font-chars p').lettering();
    }

    /**
     * 入口
     */
    function init() {
        $(document).ready(function () {

            setFeatureAnim();
            setDownLoad();
            lazySrc();

            $('#fullpage').fullpage({
                sectionsColor: ['#3C5098'],
                anchors: ['banner', 'feature', 'usage', 'terminal', 'app', 'source'],
                afterRender: function () {
                    $('#loading').addClass('load-end');
                    $('.banner').addClass('load-end');
                },
                onLeave: function (index) {
                    if (index === 1) {
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
