const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const startMatch = content.match(/<script[^>]*type=["']text\/babel["'][^>]*>/);
if (startMatch) {
    const start = startMatch.index + startMatch[0].length;
    const end = content.indexOf('</script>', start);
    const jsx = content.substring(start, end);
    fs.writeFileSync('temp.jsx', jsx);
    console.log('Wrote temp.jsx');
} else {
    console.log('Script tag not found');
}
