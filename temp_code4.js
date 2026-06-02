const fs = require('fs'); const code = fs.readFileSync('index.html', 'utf8'); const idx = code.indexOf('function TreinoModuleLive'); console.log(code.substring(idx + 4500, idx + 7500));
