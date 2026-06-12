const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '..', 'static.json');
const destination = path.join(__dirname, '..', 'build', 'static.json');

fs.copyFileSync(source, destination);
console.log('Copied static.json to build/static.json');
