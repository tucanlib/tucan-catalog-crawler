var cheerio = require('cheerio'),
    R = require('ramda'),
    config = require('../config.js'),
    Bluebird = require('bluebird'),
    helper = require('./helper');

var URL_BASE = config.baseUrl,
    BLACKLIST = config.blacklist;

function extractLinks(html) {
    if (typeof html !== 'string') {
        return html;
    }

    var isBlackListed = function(a) {
        return BLACKLIST.toLowerCase().indexOf(a.toLowerCase()) >= 0;
    };

    var $ = cheerio.load(html);
    return $(config.selectors.Course)
        .map(function(index, link) {
            var url = $(link).attr('href');

            return {
                name: R.trim($(link).text()),
                url: URL_BASE + url,
                isParent: (url.indexOf('PRGNAME=REGISTRATION')) >= 0,
                isModuleDetail: (url.indexOf('PRGNAME=MODULEDETAILS')) >= 0
            };
        })
        .filter(function(i, item) {
            return !isBlackListed(item.name);
        })
        .get();
}

function getAll(links) {
    if (!links || !links.length) {
        return Promise.resolve(links);
    }

    return Bluebird
        .all(R.map(function(link) {
            if (link.isModuleDetail) {
                return Promise.resolve(link);
            } else {
                return helper.getPage(link.url);
            }
        }, links))
        .then(R.map(extractLinks))
        .then(R.map(getAll))
        .all()
        .then(function(res) {
            if (res === []) {
                return [];
            } else {
                return R.zipWith(function(a, b) {
                    return {
                        key: a,
                        children: b
                    };
                }, links, res);
            }
        });
}

module.exports = function() {
    return getAll([{
            name: 'START',
            url: helper.getStartUrl()
        }])
        .then(helper.writeJSONFile('output/1.json'));
};
