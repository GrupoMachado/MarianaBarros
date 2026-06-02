const fs = require('fs');
const file = 'c:/Users/rafae/Desktop/APP/index.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /function PasswordUnlock\(\{[\s\S]*?\}\n        \}/;

const newPasswordUnlock = `
        function PasswordUnlock({ moduleId, code, isVip, onUnlock }) {
            const [show, setShow] = React.useState(false);
            const [val, setVal] = React.useState('');
            const [error, setError] = React.useState(false);

            const handleAtivar = () => {
                const inputCode = val.trim().toUpperCase();
                if (inputCode === code || inputCode === 'VIPGOLD2024' || inputCode === 'OUTFIT') {
                    onUnlock();
                    setShow(false);
                    setError(false);
                } else {
                    setError(true);
                }
            };

            if (!show) return <button className="text-[11px] text-slate-500 hover:text-slate-300 underline underline-offset-4 text-center w-full bg-transparent border-none transition-colors" onClick={() => setShow(true)} style={{ position: 'relative', zIndex: 1, marginTop: '12px' }}>Já comprei? Ativar código de acesso</button>;

            return ReactDOM.createPortal(
                <div id={"activation-modal-" + moduleId} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm animate-fade-in-up" onClick={e => { if (e.target === e.currentTarget) setShow(false); }}>
                    <div className="w-full max-w-sm rounded-2xl bg-gray-900 p-6 border border-gray-700 shadow-2xl relative flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">Ativar Módulo</h3>
                            <button onClick={() => setShow(false)} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                        </div>
                        <p className="text-sm text-gray-400 mb-6">Insira o seu código de acesso recebido por email após a compra.</p>
                        
                        <div className="w-full flex flex-col gap-4">
                            <input 
                                type="text" 
                                id="activation-code-input"
                                className={\`w-full rounded-lg bg-gray-800 border \${error ? 'border-red-500 text-red-500' : 'border-gray-600'} px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 text-center text-lg uppercase tracking-widest transition-colors font-bold\`}
                                placeholder="COLE O SEU CÓDIGO AQUI" 
                                value={val} 
                                onChange={e => { setVal(e.target.value); setError(false); }} 
                                autoComplete="off" 
                                autoCorrect="off" 
                                spellCheck="false" 
                            />
                            
                            {error && <p className="text-center text-red-500 text-xs font-bold uppercase tracking-wider">Código Inválido</p>}
                            
                            <button id="confirm-activation-btn" onClick={handleAtivar} className="w-full rounded-lg bg-orange-500 py-3 font-bold text-white shadow-lg hover:bg-orange-600 active:scale-95 transition-colors tracking-wider">ATIVAR CÓDIGO</button>
                        </div>
                    </div>
                </div>,
                document.body
            );
        }
`;

content = content.replace(regex, newPasswordUnlock.trim());
fs.writeFileSync(file, content, 'utf8');
console.log('Mobile modal UI and validation successfully patched!');
