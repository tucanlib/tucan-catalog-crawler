var fs = require('fs');

createFileIfNotExistent('COOKIE.txt');
createFileIfNotExistent('START_URL.txt');
createDir('output');

function createDir(dir) {
    try {
        fs.mkdirSync(dir);
    } catch (e) {
        // Existing, ignore :)
    }
}

function createFileIfNotExistent(filename) {
    if (!fs.existsSync(filename)) {
        fs.writeFileSync(filename, '');
    }
}
