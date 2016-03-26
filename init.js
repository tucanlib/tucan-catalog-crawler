var fs = require('fs');

createFileIfNotExistent('user.json', JSON.stringify({
    tuid: 'TUID',
    password: 'Yeah, just enter your password here - because why shouldn\'t you trust a stranger on the internet ;) Well, if you are paranoid (and you should be!) you can always read the code and see that I don\'t send your password to my server or anything (or do I?)'
}, null, '\t'));

createDir('output');

function createDir(dir) {
    try {
        fs.mkdirSync(dir);
    } catch (e) {
        // Existing, ignore :)
    }
}

function createFileIfNotExistent(filename, data) {
    if (!fs.existsSync(filename)) {
        fs.writeFileSync(filename, data || '');
    }
}
