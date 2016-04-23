/* jshint node: true */
var tucanLogin = require('./tucan-login.js');

var data = {
    startUrl: undefined,
    cookie: undefined
};

module.exports = function getCookieAndStartUrl(username, password, baseUrl, selectors) {
    return tucanLogin
        .login(username, password, baseUrl, selectors)
        .tap(log('Retreiving cookie and startUrl'))
        .click(selectors.Veranstaltungen)
        .waitForSelector(selectors.Anmeldung)
        .click(selectors.Anmeldung)
        .waitForSelector(selectors.HeadlineAnmeldung)
        .tap(log('Getting startUrl'))
        .url()
        .then(function(url) {
            data.startUrl = url;
        })
        .tap(log('Getting cookie'))
        .cookies()
        .spread(function(cookie) {
            data.cookie = cookie.name + '=' + cookie.value;
        })
        .close()
        .then(function() {
            return [data.startUrl, data.cookie];
        })
        .catch(function(err) {
            console.error('There was an error retrieving cookie/starturl, please check your credentials (see README)', err);
            throw err;
        });
};

function log() {
    var args = arguments;
    return function() {
        console.log.apply(console, args);
    };
}