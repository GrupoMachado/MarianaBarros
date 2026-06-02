const fs = require('fs');

const file = 'c:/Users/rafae/Desktop/APP/index.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Update PasswordUnlock (using user's exact HTML inside React Portal)
let newPasswordUnlock = `
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
                    <div className="w-full max-w-sm rounded-2xl bg-gray-900 p-6 border border-gray-700 shadow-2xl relative">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">Ativar Módulo</h3>
                            <button onClick={() => setShow(false)} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">Insira o seu código de acesso recebido por email.</p>
                        
                        <input 
                            type="text" 
                            className={\`w-full rounded-lg bg-gray-800 border \${error ? 'border-red-500 text-red-500' : 'border-gray-600'} px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 mb-2 text-center text-lg uppercase tracking-widest transition-colors font-bold\`}
                            placeholder="CÓDIGO" 
                            value={val} 
                            onChange={e => { setVal(e.target.value); setError(false); }} 
                            autoComplete="off" 
                            autoCorrect="off" 
                            spellCheck="false" 
                            autoFocus
                        />
                        
                        {error && <p className="text-center text-red-500 text-xs mt-1 mb-3 font-bold uppercase tracking-wider">Código Inválido</p>}
                        {!error && <div className="mb-4"></div>}
                        
                        <button onClick={handleAtivar} className="w-full rounded-lg bg-orange-500 py-3 font-bold text-white shadow-lg hover:bg-orange-600 active:scale-95 transition-all tracking-wider">CONFIRMAR</button>
                    </div>
                </div>,
                document.body
            );
        }
`;

content = content.replace(/function PasswordUnlock\(\{[\s\S]*?\}\n        \}/, newPasswordUnlock.trim());


// 2. Update handleAccessModule
let oldAccessModuleMatcher = /const handleAccessModule = useCallback\(\(moduleId\) => \{[\s\S]*?\}\, \[\]\);/;
let newAccessModule = `const handleAccessModule = useCallback((moduleId) => {
                if (moduleId === 'scanner_ia') {
                    setPage('inicio');
                    setTimeout(() => {
                        const fileInput = document.getElementById('meal-image-input');
                        if (fileInput) fileInput.click();
                    }, 500); // 500ms for route switch
                    return;
                }
                if (moduleId === 'desafio30') {
                    setPage('cronograma');
                    return;
                }
                setModFilter(moduleId);
                // Auto-select category specific to the module
                if (moduleId === 'senior') setCat('Idosos');
                else if (moduleId === 'pilates') setCat('Pilates');
                else if (moduleId === 'gymnastics') setCat('Ginástica');
                else setCat('Todos');

                setDiff('Todos');
                setSearch('');
                setPage('treinos');
            }, []);`;
content = content.replace(oldAccessModuleMatcher, newAccessModule);

// 3. Update scanner IA link and code inside offers array
content = content.replace("code: 'SCANNER1690'", "code: 'IA2026'");
content = content.replace("link: 'https://pay.hotmart.com/SCANNER_EXAMPLE?checkoutMode=10'", "link: '#'");

fs.writeFileSync(file, content, 'utf8');
console.log('Mobile modal and dynamic routing integrated securely inside React!');
