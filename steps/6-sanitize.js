var helper = require('./helper'),
    R = require('ramda'),
    Bluebird = require('bluebird');

function sanitizeText(text) {
    var replacements = [{
        toReplace: /&#xFC;/g,
        replacement: 'ü'
    }, {
        toReplace: /&#xA7;/g,
        replacement: '§'
    }, {
        toReplace: /&#xE4;/g,
        replacement: 'ä'
    }, {
        toReplace: /&#xDC;/g,
        replacement: 'Ü'
    }, {
        toReplace: /&#xF6;/g,
        replacement: 'ö'
    }, {
        // remove <br>'s from the end
        toReplace: /<br><br>$/g
    }, {
        // a second time - just to be sure
        toReplace: /<br>$/g
    }, {
        toReplace: /\t/g
    }, {
        toReplace: /\n/g
    }, {
        toReplace: /\r/g
    }, {
        // remove <br> from the beginning
        toReplace: /^:<br>/g
    }];

    return R.trim(R.reduce(function(acc, replacement) {
        return acc.replace(replacement.toReplace, replacement.replacement || '');
    }, text, replacements));
}

function sanitize(moduleData) {
    delete moduleData.url;

    if(moduleData.details && moduleData.details.length) {
        R.forEach(function(detail) {
            detail.title = sanitizeText(detail.title);
            detail.details = sanitizeText(detail.details);
        }, moduleData.details);
    }

    if(moduleData.children && moduleData.children.length) {
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
