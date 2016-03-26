var helper = require('./helper'),
    R = require('ramda'),
    Bluebird = require('bluebird'),
    config = require('../config.js');

function sanitizeText(text) {
    return R.trim(R.reduce(function(acc, replacement) {
        return acc.replace(replacement.toReplace, replacement.replacement ||  '');
    }, text, config.replacements));
}

function extractCP(details) {
    if(!details) return;

    function getCP(data) {
        return parseInt(R.trim(R.head(data.split(' '))), 10);
    }

    var CP = R.find(function(item) {
        return item.title.indexOf('Credits') >= 0;
    }, details);

    return CP ? getCP(CP.details) : null;
}

function sanitize(moduleData) {
    delete moduleData.url;

    moduleData.credits = extractCP(moduleData.details);

    if (moduleData.details && moduleData.details.length) {
        R.forEach(function(detail) {
            detail.title = sanitizeText(detail.title);
            detail.details = sanitizeText(detail.details);
        }, moduleData.details);
    }

    if (moduleData.children && moduleData.children.length) {
        R.forEach(sanitize, moduleData.children);
    }
}

module.exports = function() {
    var moduleData = helper.readJSONFile('output/5.json');

    return Bluebird
        .resolve(moduleData)
        .tap(R.map(sanitize))
        .tap(helper.writeJSONFile('output/6.json'))
        .return(moduleData);
};
