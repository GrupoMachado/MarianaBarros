const fs = require('fs');

const file = 'c:/Users/rafae/Desktop/APP/index.html';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("id: 'scanner_ia'")) {
    const scannerOffer = `
                { 
                    id: 'scanner_ia', 
                    title: 'Scanner de Refeições IA', 
                    icon: '📸', 
                    price: '16,90', 
                    desc: 'O fim de contar calorias à mão. Tire uma foto ao seu prato e a nossa Inteligência Artificial calcula as suas macros na hora.', 
                    code: 'SCANNER1690', 
                    link: 'https://pay.hotmart.com/SCANNER_EXAMPLE?checkoutMode=10',
                    highlight: 'NOVO'
                },`;
    
    // We want to insert this before "id: 'senior'"
    content = content.replace('{ id: \'senior\',', scannerOffer + '\n                { id: \'senior\',');
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('Scanner IA offer added to ExtrasHub.');
} else {
    console.log('Scanner IA offer already exists.');
}
