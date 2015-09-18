var helper = require('./helper'),
    R = require('ramda'),
    Bluebird = require('bluebird');

function attachDetailsToModule(moduleData, module) {
    var foundModule = helper.findModule(module.text, moduleData);
    foundModule.details = module.details;
}

module.exports = function() {
    var parsedModuleData = helper.readJSONFile('output/4.json'),
        moduleData = helper.readJSONFile('output/2.json');

    return Bluebird
        .resolve(R.map(R.curry(attachDetailsToModule)(moduleData), parsedModuleData))
        .return(moduleData)
        .tap(helper.writeJSONFile('output/5.json'));
};
