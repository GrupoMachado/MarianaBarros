const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const fixed = content.replace(/GinÃ¡stica/g, 'Ginástica');
fs.writeFileSync('index.html', fixed, 'utf8');
console.log('Encoding fixed.');
