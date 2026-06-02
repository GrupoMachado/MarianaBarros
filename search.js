const fs = require('fs');
const code = fs.readFileSync('index.html', 'utf8');
const inicioIdx = code.indexOf("case 'inicio':");
console.log("inicio:", inicioIdx);
const treinosIdx = code.indexOf("case 'treinos':");
console.log("treinos:", treinosIdx);
