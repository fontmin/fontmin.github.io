/**
 * @file build配置
 * @author edpx-mobile
 */

var cwd = process.cwd();
var path = require('path');
var fs = require('fs');

// 引入 rider 支持
var epr = require('./edp-rider-config');

/**
 * 指定匹配版本的 stylus
 */
exports.stylus = epr.stylus;

/**
 * 输入目录
 *
 * @type {string}
 */
exports.input = cwd;

/**
 * 输出目录
 *
 * @type {string}
 */
exports.output = path.resolve(cwd, 'public');

/**
 * 排除文件pattern列表
 *
 * @type {Array}
 */
exports.exclude = [
    'tool',
    'doc',
    'test',
    'module.conf',
    'package.json',
    '.editorconfig',
    '.bowerrc',
    'bower.json',
    'README.md',
    'dep',
    'dep/packages.manifest',
    'dep/*/*/test',
    'dep/*/*/doc',
    'dep/*/*/demo',
    'dep/*/*/tool',
    'dep/*/*/*.md',
    'dep/*/*/package.json',
    'edp-*',
    'node_modules',
    '.edpproj',
    '.svn',
    '.git',
    '.gitignore',
    '.idea',
    '.project',
    'Desktop.ini',
    'Thumbs.db',
    '.DS_Store',
    '*.tmp',
    '*.bak',
    '*.swp',
    '*.tpl'
];

var FontProcessor = require('edp-build-fontmin');
var ParallelProcessor = require('edp-build-parallel');

/**
 * 获取构建processors的方法
 *
 * @return {Array}
 */
exports.getProcessors = function () {
    var cssProcessor = new CssCompressor({
        files: ['*.styl']
    });
    var moduleProcessor = new ModuleCompiler();
    var jsProcessor = new JsCompressor();

    var replacements = new PathMapper().replacements;

    var pathMapperProcessor = new PathMapper({
        replacements: replacements.concat({
            type: 'html',
            tag: 'img',
            attribute: 'srcset',
            files: ['*.html']
        })
    });

    var stylusProcessor = new StylusCompiler({
        files: ['src/css/app.styl'],
        stylus: epr.stylus,
        compileOptions: {
            use: epr.stylusPlugin
        }
    });

    var addCopyright = new AddCopyright();
    var outputCleaner = new OutputCleaner();

    var baseFontProcessor = new FontProcessor({
        name: 'BaseFontProcessor',
        entryFiles: [ 'index.html' ],
        files: [ 'SourceHanSansSC-Light.ttf' ]
    });

    var twFontProcessor = new FontProcessor({
        name: 'TwFontProcessor',
        entryFiles: [ 'tw.html' ],
        files: [ 'SourceHanSansTC-Light.ttf' ]
    });

    var krFontProcessor = new FontProcessor({
        name: 'KrFontProcessor',
        entryFiles: [ 'kr.html' ],
        files: [ 'SourceHanSansK-Light.ttf' ]
    });

    var jpFontProcessor = new FontProcessor({
        name: 'JpFontProcessor',
        entryFiles: [ 'jp.html' ],
        files: [ 'SourceHanSans-Light.ttf' ]
    });

    var logoFontProcessor = new FontProcessor({
        name: 'LogoFontProcessor',
        entryFiles: [],
        files: [ 'SentyBrush.ttf' ],
        text: 'Fontmin'
    });

    var daoFontProcessor = new FontProcessor({
        name: 'DaoFontProcessor',
        entryFiles: [],
        files: [ 'SentyWEN1215.ttf' ],
        text: '道可道，非常道。名可名，非常名。'
    });

    var tongjiReplacer = {
        files: ['*.html'],
        from: '<!--@tongji-->',
        to: fs.readFileSync(path.resolve(cwd, 'tongji.tpl')),
        name: 'TongjiReplacer',
        process: function(file, processContext, callback) {
            if (this.from && this.to) {
                file.setData(
                    file.data.replace(this.from, this.to)
                );
            }

            callback();
        }
    };

    return [
        stylusProcessor,
        cssProcessor,
        tongjiReplacer,
        moduleProcessor,
        jsProcessor,
        pathMapperProcessor,
        new ParallelProcessor([
            addCopyright,
            outputCleaner
        ]),
        new ParallelProcessor([
            baseFontProcessor,
            twFontProcessor,
            krFontProcessor,
            // jpFontProcessor,
            logoFontProcessor,
            daoFontProcessor
        ])
    ];

};

exports.moduleEntries = 'html,htm,phtml,tpl,vm,js';
exports.pageEntries = 'html,htm,phtml,tpl,vm';

/**
 * builder主模块注入processor构造器的方法
 *
 * @param {Object} processors
 */
exports.injectProcessor = function (processors) {
    for (var key in processors) {
        global[ key ] = processors[ key ];
    }
};
