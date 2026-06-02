const fs = require('fs');
const babel = require('@babel/core');

const html = fs.readFileSync('index.html', 'utf-8');
const scriptMatch = html.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);

if (scriptMatch) {
  const code = scriptMatch[1];
  try {
    babel.transformSync(code, {
      presets: ['@babel/preset-react'],
      filename: 'index.jsx'
    });
    console.log("SUCCESS: No Babel syntax errors found in the script block.");
  } catch (e) {
    console.error("BABEL ERROR:", e.message);
  }
} else {
  console.log("No Babel script block found.");
}
