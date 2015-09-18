var helper = require('./helper'),
    R = require('ramda'),
    Bluebird = require('bluebird'),
    cheerio = require('cheerio');

function extractInformation(html) {
    var $ = cheerio.load(html);
    return $('tr.tbdata td')
        .first()
        .map(function(index, item) {
            var $item = $(item);

            return R.filter(function(item) {
                return !!item;
            }, R.map(R.pipe(R.trim, function(item) {
                if (item === '') return;
                var split = item.split('</b>');

                return {
                    title: R.trim(split[0]),
                    details: R.trim(split[1])
                };
            }), $item.html().split('<b>')));
        })
        .get();
}
module.exports = function() {
    return Bluebird
        .resolve(helper.readJSONFile('output/3.json'))
        .then(R.map(function(moduleData) {
            moduleData.details = extractInformation(moduleData.data);
            delete moduleData.data;
            return moduleData;
        }))
        .tap(helper.writeJSONFile('output/4.json'));
};
