var cheerio = require('cheerio'),
    R = require('ramda'),
    Bluebird = require('bluebird'),
    rp = require('request-promise'),
    helper = require('./helper');

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
    return rp({
            uri: course.url,
            headers: {
                'Cookie': 'cnsc=0'
            }
        })
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
        .tap(R.pipe(R.prop('length'), console.log))
        .then(function(modules) {
            return Bluebird.reduce(modules, function(acc, module) {
                return getCourseDetails(module).then(function(res) {
                    acc.push(res);
                    return acc;
                });
            }, []);
        })
        .tap(helper.writeJSONFile('output/3.json'));
};
