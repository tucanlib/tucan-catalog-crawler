var helper = require('./steps/helper'),
    getCookieAndStartupUrlScript = require('./get-cookie-and-starturl.js'),
    step1 = require('./steps/1-get-courses.js'),
    step2 = require('./steps/2-cleanup-tree.js'),
    step3 = require('./steps/3-get-module-details.js'),
    step4 = require('./steps/4-parse-module-details.js'),
    step5 = require('./steps/5-merge-module-details.js'),
    step6 = require('./steps/6-sanitize');

getCookieAndStartupUrlScript()
    .spread(function(startUrl, cookie) {
        helper.setCookie(cookie);
        helper.setStartUrl(startUrl);
    })
    .then(logAndExecute('>> Step1: Getting courses', step1))
    .then(logAndExecute('>> Step2: Cleaning up tree', step2))
    .then(logAndExecute('>> Step3: Getting module details', step3))
    .then(logAndExecute('>> Step4: Parsing module details', step4))
    .then(logAndExecute('>> Step5: Merge module details', step5))
    .then(logAndExecute('>> Step6: Sanitizing', step6))
    .then(logAndExecute('>> Finished!', process.exit.bind(process, 0)))
    .catch(console.error);

function logAndExecute(msg, fn) {
    return function() {
        console.log(msg);
        return fn.apply(null, arguments);
    };
}