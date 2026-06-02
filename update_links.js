const fs = require('fs');

// 1. Update index.html
let indexContent = fs.readFileSync('index.html', 'utf8');

// Replacements by exact string to be safe
indexContent = indexContent.replace('href="https://pay.hotmart.com/U105474953H?checkoutMode=10"', 'href="https://pay.hotmart.com/Q105939894U?checkoutMode=10"');
indexContent = indexContent.replace('href="https://pay.hotmart.com/O104937576P?checkoutMode=10"', 'href="https://pay.hotmart.com/I105940414O?checkoutMode=10"');
indexContent = indexContent.replace('href="https://pay.hotmart.com/L105474880L?checkoutMode=10"', 'href="https://pay.hotmart.com/S105938555K?checkoutMode=10"');
indexContent = indexContent.replace('href="https://pay.hotmart.com/O104937576P?checkoutMode=10"', 'href="https://pay.hotmart.com/Y105940091W?checkoutMode=10"'); // second occurrence of O...

// Re-doing it by lines to be absolutely certain of exact matches since some are identical
let lines = indexContent.split('\n');

// 1. Teaser Pages
lines[4586] = lines[4586].replace('U105474953H', 'Q105939894U'); // Scanner
lines[4658] = lines[4658].replace('O104937576P', 'I105940414O'); // Arsenal -> Pacote de elite
lines[4726] = lines[4726].replace('L105474880L', 'S105938555K'); // Desafio
lines[4787] = lines[4787].replace('O104937576P', 'Y105940091W'); // Sono

// 2. Dashboard Cards / CTAs
lines[5027] = lines[5027].replace('L105474880L', 'Y105938748R'); // Gold
lines[5046] = lines[5046].replace('L105474880L', 'I105940414O'); // Pacote de elite
lines[5071] = lines[5071].replace('L105474880L', 'E105939718I'); // Acesso Total VIP
lines[5084] = lines[5084].replace('U105474953H', 'Q105939894U'); // Scanner
lines[5092] = lines[5092].replace('V105658633P', 'S105938555K?checkoutMode=10'); // Desafio
lines[5101] = lines[5101].replace('H105186921S?bid=1776704277894', 'B105940293A?checkoutMode=10'); // Comunidade
lines[5109] = lines[5109].replace('L105474880L', 'Y105940091W'); // Sono

// 3. Modulos Extras / Sliders
lines[5132] = lines[5132].replace('V105658633P', 'N105939399C?checkoutMode=10'); // Musculacao
lines[5141] = lines[5141].replace('L105474880L', 'D105938993C?checkoutMode=10'); // Recuperacao Ativa
lines[5150] = lines[5150].replace('L105474880L', 'M105939209K?checkoutMode=10'); // Protocolo Mini Bands
lines[5159] = lines[5159].replace('L105474880L', 'E105938855Y?checkoutMode=10'); // Pilates

fs.writeFileSync('index.html', lines.join('\n'));
console.log('index.html updated successfully.');

// 2. Update fix_global_input.js
if (fs.existsSync('fix_global_input.js')) {
    let fixLines = fs.readFileSync('fix_global_input.js', 'utf8').split('\n');
    fixLines[24] = fixLines[24].replace('O104937576P', 'Y105938748R'); // vip_gold
    fixLines[33] = fixLines[33].replace('O104969469R', 'S105938555K'); // desafio30
    fixLines[45] = fixLines[45].replace('R104937272J', 'D105938993C'); // senior
    fixLines[46] = fixLines[46].replace('Q104937401F', 'E105938855Y'); // pilates
    fixLines[47] = fixLines[47].replace('O104937476X', 'M105939209K'); // gymnastics
    fixLines[48] = fixLines[48].replace('L104937229Y', 'N105939399C'); // musculacao
    fixLines[42] = fixLines[42].replace("link: '#'", "link: 'https://pay.hotmart.com/Q105939894U?checkoutMode=10'"); // scanner_ia
    fs.writeFileSync('fix_global_input.js', fixLines.join('\n'));
    console.log('fix_global_input.js updated successfully.');
}
