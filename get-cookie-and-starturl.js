var horseman = new require('node-horseman')();

var config = require('./config.js');

var data = {
    startUrl: undefined,
    cookie: undefined
};

module.exports = function getCookieAndStartUrl() {
    console.log('Getting startUrl and cookie for user:', config.user);
    return horseman
        .open(config.baseUrl)
        .waitForSelector(config.selectors.LoginSubmit)
        .type(config.selectors.LoginUser, config.user.tuid)
        .type(config.selectors.LoginPass, config.user.password)
        .click(config.selectors.LoginSubmit)
        .tap(log('Logged in'))
        .waitForSelector(config.selectors.Veranstaltungen)
        .click(config.selectors.Veranstaltungen)
        .waitForSelector(config.selectors.Anmeldung)
        .click(config.selectors.Anmeldung)
        .waitForSelector(config.selectors.HeadlineAnmeldung)
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