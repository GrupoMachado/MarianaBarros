const fs = require('fs'); const code = fs.readFileSync('index.html', 'utf8'); const idx = code.indexOf('const getCategoryIcon = (cat) => {'); console.log(code.substring(idx - 100, idx + 2000));
