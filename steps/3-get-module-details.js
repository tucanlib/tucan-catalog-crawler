var cheerio = require('cheerio'),
    R = require('ramda'),
    Bluebird = require('bluebird'),
    helper = require('./helper');

var ProgressBar = require('progress');


function getCourses(modules) {
    function flatten(list, acc) {
        return R.reduce(function(acc, curr) {
            acc.push(curr);
            if (curr.children && curr.children.length) {
                return flatten(curr.children, acc);
            } else {
                return acc;
            }
        }, acc, list);
    }

    return R.pipe(R.filter(function(item) {
        return /^[0-9]{2}-/g.exec(item.text);
    }))(flatten(modules, []));
}

function getCourseDetails(course) {
    return helper
        .getPage(course.url)
        .then(function(res) {
            var $ = cheerio.load(res);
            course.data = $('#pageContent').html();
            return course;
        });
}

module.exports = function() {
    return Bluebird
        .resolve(helper.readJSONFile('output/2.json'))
        .then(getCourses)
        .then(function(modules) {
            console.log('Crawling module details for ' + modules.length + ' courses:');
            var bar = new ProgressBar(':current from :total - Time remaining :eta s || :bar', {
                total: modules.length
            });

            return Bluebird.reduce(modules, function(acc, module) {
                bar.tick();
                return getCourseDetails(module).then(function(res) {
                    acc.push(res);
                    return acc;
                });
            }, []);
        })
        .tap(helper.writeJSONFile('output/3.json'));
};
