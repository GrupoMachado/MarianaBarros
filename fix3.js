const fs = require('fs');

const file = 'c:/Users/rafae/Desktop/APP/index.html';
const content = fs.readFileSync(file, 'utf8');

const lines = content.split('\\n');
let newLines = [];
let replacing = false;

for (let i = 0; i < lines.length; i++) {
    const lineStr = lines[i];
    
    // Check if we hit line 5282-ish (the start of the old div)
    if (lineStr.includes("<div style={{ display: 'flex', gap: '8px' }}>")) {
        replacing = true;
        
        newLines.push(\`                        <div className="mt-6 w-full">
                            <input
                                type="text"
                                id="activation-code-input"
                                className="w-full block rounded-lg bg-gray-800 border border-gray-600 px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 text-center text-lg uppercase tracking-widest mb-4"
                                placeholder="ESCREVA O CÓDIGO AQUI"
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                                value={val}
                                onChange={e => { setVal(e.target.value); setError(''); }}
                                onKeyDown={e => e.key === 'Enter' && handleAtivar()}
                            />
                            <button
                                id="confirm-activation-btn"
                                className="w-full block rounded-lg bg-orange-500 py-4 font-bold text-white shadow-lg hover:bg-orange-600 transition-colors text-lg"
                                onClick={handleAtivar}
                            >
                                Confirmar Ativação
                            </button>
                        </div>\`);
    } else if (replacing && lineStr.includes('<button className="btn-verify"')) {
        // Next line usually is the closing div of the flex row, we'll skip the next line too
        continue;
    } else if (replacing && lineStr.trim() === '</div>') {
        replacing = false; // We found the closing div of the flex row, stop skipping
    } else if (!replacing) {
        newLines.push(lineStr);
    }
}

fs.writeFileSync(file, newLines.join('\\n'), 'utf8');
console.log('Mobile modal layout surgically replaced with block vertical stacking!');
