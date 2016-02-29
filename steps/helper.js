var R = require('ramda'),
    rp = require('request-promise'),
    fs = require('fs'),
    prettyJSON = R.curry(JSON.stringify)(R.__, null, '\t'),
    encoding = {
        encoding: 'utf-8'
    },
    readFileSync = R.curry(fs.readFileSync)(R.__, encoding),
    writeFileSync = R.curry(fs.writeFileSync)(R.__, R.__, encoding),
    readJSONFile = R.pipe(readFileSync, JSON.parse);


function findModule(moduleName, modules) {
    var found = R.find(function(item) {
        return item && item.text === moduleName;
    }, modules);
    return found ? found : findModule(moduleName, R.filter(R.prop('children'), R.flatten(R.pluck('children', modules))));
}

var COOKIE;

module.exports = {
    readJSONFile: readJSONFile,
    writeJSONFile: R.curry(function(filename, data) {
        return writeFileSync(filename, prettyJSON(data));
    }),
    getStartUrl: R.pipe(readFileSync, R.trim),
    setCookie: function(cookie) {
        COOKIE = cookie;
    },
    getFile: R.pipe(readFileSync, R.trim),
    getPage: function(url) {
        return rp({
            url: url,
            headers: {
                'Cookie': COOKIE
            }
        });
    },
    findModule: findModule
};