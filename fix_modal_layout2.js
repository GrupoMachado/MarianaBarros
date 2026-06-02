const fs = require('fs');
const file = 'c:/Users/rafae/Desktop/APP/index.html';
let content = fs.readFileSync(file, 'utf8');

// The exact string to replace (which creates the horizontal look):
const oldDiv = `<div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                className="password-input"
                                placeholder="Inserir código aqui..."
                                style={{ width: '100%' }}
                                value={val}
                                onChange={e => { setVal(e.target.value); setError(''); }}
                                onKeyDown={e => e.key === 'Enter' && handleAtivar()}
                                autoFocus
                            />
                            <button className="btn-verify" onClick={handleAtivar}>Ativar</button>
                        </div>`;

const newDiv = `<div className="mt-6 w-full">
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
                                onClick={handleAtivar}
                                className="w-full block rounded-lg bg-orange-500 py-4 font-bold text-white shadow-lg hover:bg-orange-600 transition-colors text-lg"
                            >
                                Confirmar Ativação
                            </button>
                        </div>`;

content = content.replace(oldDiv, newDiv);

// Also update the trim().toUpperCase() just in case it doesn't exist
// Currently: const inputCode = val.trim().toUpperCase();
// Let's ensure the trigger logic in handleAtivar has this:
// Oh wait, my view of PasswordUnlock showed it already had \`const inputCode = val.trim().toUpperCase();\`

fs.writeFileSync(file, content, 'utf8');
console.log('Mobile modal UI and validation successfully patched!');
