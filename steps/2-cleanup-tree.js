var R = require('ramda'),
    Bluebird = require('bluebird'),
    helper = require('./helper');

function cleanUp(tree) {
    return R.map(function(node) {
        if(node.children) {
            if(node.children[0] == null) node.children = [];
            node.children = cleanUp(node.children);
        }
        return {
            text: node.key.name,
            url: node.key.url,
            children: node.children
        };
    }, tree);
}

module.exports = function() {
    var tree = helper.readJSONFile('output/1.json');

    return Bluebird
        .resolve(helper.writeJSONFile('output/2.json', cleanUp(tree)[0].children));
};