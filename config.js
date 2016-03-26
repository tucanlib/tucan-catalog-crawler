var fs = require('fs'),
    R = require('ramda');

var readFileSync = R.pipe(R.curry(fs.readFileSync)(R.__, {
    encoding: 'utf-8'
}), R.trim);

module.exports = {
    user: JSON.parse(readFileSync('./user.json')),
    baseUrl: 'https://www.tucan.tu-darmstadt.de',
    blacklist: 'Abmelden Anmelden Gesamtkatalog Zusätzliche Leistungen Leistungen für den Masterstudiengang Gesamtkatalog aller Module des Sprachenzentrums Informatik fachübergreifend Fachübergreifende Veranstaltungen',
    selectors: {
        LoginUser: '#field_user',
        LoginPass: '#field_pass',
        LoginSubmit: '#logIn_btn',
        Veranstaltungen: 'li[title="Veranstaltungen"] a',
        Anmeldung: 'li[title="Anmeldung"] a',
        HeadlineAnmeldung: 'h1:contains("Anmeldung")',
        //
        Course: '#pageContent ul > li > a, #pageContent .tbcoursestatus td:not(.tbdata.dl-inner) a'
    },
    replacements: [{
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
    }]
};
