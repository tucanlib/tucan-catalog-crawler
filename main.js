var helper = require('./steps/helper'),
    step1 = require('./steps/1-get-courses.js'),
    step2 = require('./steps/2-cleanup-tree.js'),
    step3 = require('./steps/3-get-module-details.js'),
    step4 = require('./steps/4-parse-module-details.js'),
    step5 = require('./steps/5-merge-module-details.js'),
    step6 = require('./steps/6-sanitize');

// See README
var START_URL = helper.getStartUrl('./START_URL.txt'),
    COOKIE = helper.getFile('./COOKIE.txt');

helper.setCookie(COOKIE);

if(!START_URL) {
    console.error('No START_URL given (see README)');
    process.exit(0);
}

step1(START_URL, COOKIE)
    .then(step2)
    .then(step3)
    .then(step4)
    .then(step5)
    .then(step6)
    .then(function() {
        console.log('FINISHED :)');
    });
