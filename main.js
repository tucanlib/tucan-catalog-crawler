var helper = require('./steps/helper');
var config = require('./config');

require('./get-cookie-and-starturl.js')(config.user.username, config.user.password, config.baseUrl, config.selectors)
    .spread(function(startUrl, cookie) {
        helper.setCookie(cookie);
        helper.setStartUrl(startUrl);
    })
    .then(logAndExec(
        '>> Step1: Getting courses',
        require('./steps/1-get-courses.js')
    ))
    .then(logAndExec(
        '>> Step2: Cleaning up tree',
        require('./steps/2-cleanup-tree.js')
    ))
    .then(logAndExec(
        '>> Step3: Getting module details',
        require('./steps/3-get-module-details.js')
    ))
    .then(logAndExec(
        '>> Step4: Parsing module details',
        require('./steps/4-parse-module-details.js')
    ))
    .then(logAndExec(
        '>> Step5: Merge module details',
        require('./steps/5-merge-module-details.js')
    ))
    .then(logAndExec(
        '>> Step6: Sanitizing',
        require('./steps/6-sanitize')
    ))
    .then(logAndExec(
        '>> Finished!',
        process.exit.bind(process, 0)
    ))
    .catch(function(err) {
        console.error('Error retrieving modules:', err);
        process.exit(1);
    });

function logAndExec(msg, fn) {
    return function() {
        console.log(msg);
        return fn.apply(null, arguments);
    };
}
