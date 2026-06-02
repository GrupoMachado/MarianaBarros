const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

content = content.replace(
    "{ id: 'nutricao', label: 'Nutrição 📸', d: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 13a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' },",
    "{ id: 'nutricao', label: 'Nutrição 📸', d: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 13a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' },\n            { id: 'agua', label: 'Hidratação 💧', d: 'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z' },"
);

fs.writeFileSync('index.html', content);
console.log('Aba Hidratacao adicionada ao NAV.');
