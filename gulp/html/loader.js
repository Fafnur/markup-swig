'use strict';
/**
 * Compile LESS files
 */
var path = require('path'),
    fs = require('fs'),
    conf = require('../config');

module.exports = function loader(basepath, encoding) {
    var ret = {};

    encoding = encoding || 'utf8';
    basepath = (basepath) ? path.normalize(basepath) : null;
    var basedir = process.env.INIT_CWD;
    var isWindows = /^win/.test(process.platform);

    var root = process.env.INIT_CWD;

    ret.resolve = function (to, from) {
        var ret;
        if (basepath) {
            from = basepath;
        } else {
            from = (from) ? path.dirname(from) : process.cwd();
        }

        // TODO:написать нормальное сравнение: match to process
        if(to.split(path.sep).length <= 3) {
            ret = root + path.sep + conf.markup.views + path.sep + to;
        } else {
            ret = path.resolve(from, to);
        }
        return ret;
    };

    ret.load = function (identifier, cb) {
        if (!fs || (cb && !fs.readFile) || !fs.readFileSync) {
            throw new Error('Unable to find file ' + identifier + ' because there is no filesystem to read from.');
        }
        identifier = ret.resolve(identifier);
        if (cb) {
            fs.readFile(identifier, encoding, cb);
            return;
        }
        return fs.readFileSync(identifier, encoding);
    };
    return ret;
};