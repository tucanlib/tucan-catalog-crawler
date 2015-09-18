var step1 = require('./steps/1-get-courses.js'),
    step2 = require('./steps/2-cleanup-tree.js'),
    step3 = require('./steps/3-get-module-details.js'),
    step4 = require('./steps/4-parse-module-details.js'),
    step5 = require('./steps/5-merge-module-details.js');

// Log into TuCan and go to "Anmeldung" - copy the URL and put it here!
var startUrl = 'https://www.tucan.tu-darmstadt.de/scripts/mgrqcgi?APPNAME=CampusNet&PRGNAME=REGISTRATION&ARGUMENTS=-N410560491260766,-N000311,-A';

step1(startUrl)
    .then(step2)
    .then(step3)
    .then(step4)
    .then(step5)
    .then(function() {
        console.log('FINISHED :)');
    });
