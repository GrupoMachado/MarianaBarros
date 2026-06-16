const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const babelMatch = content.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
if (!babelMatch) {
    console.log("Babel script not found");
    process.exit(1);
}

let babelCode = babelMatch[1];

babelCode = "import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';\nimport ReactDOM from 'react-dom/client';\n" + babelCode;
babelCode = babelCode.replace(/const\s*{\s*useState[^}]*}\s*=\s*React;/, '');

fs.writeFileSync('src/main.jsx', babelCode, 'utf8');

let newContent = content.replace(/<script crossorigin src="https:\/\/unpkg\.com\/react@18.*?<\/script>\s*/, '');
newContent = newContent.replace(/<script crossorigin src="https:\/\/unpkg\.com\/react-dom@18.*?<\/script>\s*/, '');
newContent = newContent.replace(/<script crossorigin src="https:\/\/unpkg\.com\/@babel\/standalone.*?<\/script>\s*/, '');
newContent = newContent.replace(/<script type="text\/babel">[\s\S]*?<\/script>/, '<script type="module" src="/src/main.jsx"></script>');

fs.writeFileSync('index.html', newContent, 'utf8');

console.log("Extraction successful!");
