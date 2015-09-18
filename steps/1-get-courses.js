var cheerio = require('cheerio'),
    R = require('ramda'),
    Bluebird = require('bluebird'),
    helper = require('./helper');

var URL_BASE = 'https://www.tucan.tu-darmstadt.de';

function extractLinks(html) {
    if (typeof html !== 'string') {
        return html;
    }

    var isBlackListed = function(a) {
        return 'Anmelden Gesamtkatalog Zusätzliche Leistungen Leistungen für den Masterstudiengang Gesamtkatalog aller Module des Sprachenzentrums Informatik fachübergreifend Fachübergreifende Veranstaltungen'.toLowerCase().indexOf(a.toLowerCase()) >= 0;
    };

    var $ = cheerio.load(html);
    return $('#pageContent ul > li > a, #pageContent .tbcoursestatus td:not(.tbdata.dl-inner) a')
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

module.exports = function(startUrl) {
    return getAll([{
            name: 'START',
            url: startUrl
        }])
        .then(helper.writeJSONFile('output/1.json'));
};
