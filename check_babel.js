const fs = require('fs');
const parser = require('@babel/parser');

try {
  let content = fs.readFileSync('index.html', 'utf8');
  let openTag = '<script type="text/babel">';
  let closeTag = '</script>';
  
  let startIdx = content.indexOf(openTag);
  if (startIdx === -1) {
    console.log("No babel script tag found.");
    process.exit(1);
  }
  startIdx += openTag.length;
  
  let endIdx = content.indexOf(closeTag, startIdx);
  
  let code = content.substring(startIdx, endIdx);
  
  const padLines = content.substring(0, startIdx).split('\n').length - 1;
  const padding = '\n'.repeat(padLines);
  code = padding + code;
  
  parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx"]
  });
  
  console.log("No syntax errors found by Babel.");
} catch (e) {
  console.error("Syntax Error found!");
  console.error(e.message);
  if (e.loc) {
    console.error(`Line: ${e.loc.line}, Col: ${e.loc.column}`);
    const lines = fs.readFileSync('index.html', 'utf8').split('\n');
    console.error("Context:");
    for(let i = Math.max(0, e.loc.line - 3); i < Math.min(lines.length, e.loc.line + 3); i++) {
        console.error(`${i+1}: ${lines[i]}`);
    }
  }
}
