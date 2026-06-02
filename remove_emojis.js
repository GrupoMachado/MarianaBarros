const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

content = content.replace(/label: 'Treinos ⚡'/g, "label: 'Treinos'");
content = content.replace(/label: 'Treinos \\u26A1'/g, "label: 'Treinos'");

content = content.replace(/label: 'Meu Desafio 🔥'/g, "label: 'Meu Desafio'");
content = content.replace(/label: 'Ranking 🏆'/g, "label: 'Ranking'");
content = content.replace(/label: 'Evolução 📈'/g, "label: 'Evolução'");
content = content.replace(/label: 'Extras 🛒'/g, "label: 'Extras'");
content = content.replace(/label: 'Ajuda 💬'/g, "label: 'Ajuda'");

fs.writeFileSync('index.html', content, 'utf8');
console.log("Emojis removed from NAV array.");
