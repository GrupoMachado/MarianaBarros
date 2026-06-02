const fs = require('fs');
const file = 'c:/Users/rafae/Desktop/APP/index.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /<div style=\{\{\s*display:\s*'flex',\s*gap:\s*'8px'\s*\}\}>[\s\S]*?<\/button>\s*<\/div>/;

const newBody = `                        <div className="mt-6 w-full">
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
                                className="w-full block rounded-lg bg-orange-500 py-4 font-bold text-white shadow-lg hover:bg-orange-600 transition-colors text-lg active:scale-95"
                                onClick={handleAtivar}
                            >
                                Confirmar Ativação
                            </button>
                        </div>`;

if (regex.test(content)) {
    content = content.replace(regex, newBody);
    fs.writeFileSync(file, content, 'utf8');
    console.log("Success! Modal layout replaced perfectly.");
} else {
    console.log("Error: regex did not match the file content.");
}
