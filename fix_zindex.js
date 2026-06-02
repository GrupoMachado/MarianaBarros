const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// The offending zIndex: 999 are all in lines 4095, 4097, 4102, 4364, 4397.
// I can just replace `zIndex: 999` with `zIndex: 1` or remove it.
content = content.replace(/marginTop: 'auto', position: 'relative', zIndex: 999/g, "marginTop: 'auto', position: 'relative', zIndex: 1");
content = content.replace(/position: 'relative', zIndex: 999, padding: '18px'/g, "position: 'relative', zIndex: 1, padding: '18px'");
content = content.replace(/position: 'relative', zIndex: 999, fontSize: '16px'/g, "position: 'relative', zIndex: 1, fontSize: '16px'");
content = content.replace(/position: 'relative', zIndex: 999, opacity: 1/g, "position: 'relative', zIndex: 1, opacity: 1");

fs.writeFileSync('index.html', content, 'utf8');
console.log("Fix z-index done.");
