const fs = require('fs');
const file = 'c:/Users/rafae/Desktop/APP/index.html';
let content = fs.readFileSync(file, 'utf8');

// The regex will match perfectly from the function PasswordUnlock signature down to its ending }
const regex = /function PasswordUnlock\(\{ moduleId, code, isVip, onUnlock \}\) \{[\s\S]*?return \(\s*<div className="modal-overlay"[\s\S]*?<\/div>\s*\);\s*\}/;

const novaTree = `function PasswordUnlock({ moduleId, code, isVip, onUnlock }) {
            const [show, setShow] = useState(false);
            const [val, setVal] = useState('');
            const [error, setError] = useState('');

            const handleAtivar = (e) => {
                if (e) e.preventDefault();
                const inputCode = val.trim().toUpperCase();

                // Object Validation as specified
                const modulesData = [
                    { id: "scanner_ia", code: "IA2026" },
                    { id: "vip_gold", code: "VIPGOLD2024" },
                    { id: "vip", code: "VIPGOLD2024" },
                    { id: "desafio30", code: "DESAFIO30VIP" },
                    { id: "musculacao", code: "MUSC500" },
                    { id: "senior", code: "SENIOR890" },
                    { id: "pilates", code: "PILATES950" },
                    { id: "gymnastics", code: "GYM850" }
                ];
                
                const isGlobalVip = inputCode === 'VIPGOLD2024' || inputCode === 'VIP2026';
                const isValid = modulesData.some(m => m.code === inputCode && (m.id === moduleId || isGlobalVip));

                if (isValid) {
                    onUnlock();
                    setShow(false);
                    setError('');
                    
                    if (moduleId === 'scanner_ia' || inputCode === 'IA2026') {
                        const extrasPage = document.querySelector('.extras-page');
                        if (extrasPage) {
                            extrasPage.style.display = 'none';
                        }
                        const portalRoot = document.getElementById('portal-root');
                        if (portalRoot) {
                            portalRoot.style.display = 'flex';
                            portalRoot.style.zIndex = '100000';
                            portalRoot.classList.remove('hidden');
                        }
                    } else {
                        const targetCard = e && e.target ? e.target.closest('.extras-card') : null;
                        if(targetCard) {
                            targetCard.style.border = '1px solid #22c55e';
                            targetCard.style.background = 'rgba(34, 197, 94, 0.05)';
                        }
                        alert(isVip || isGlobalVip ? '👑 Acesso Total Ativado! Todos os módulos desbloqueados.' : '✅ Módulo Ativado!');
                    }
                } else {
                    setError('Código inválido. Verifique o seu e-mail de compra.');
                }
            };

            const openActivationModal = (e) => {
                if (e) e.preventDefault();
                setShow(true);
                setTimeout(() => {
                    const input = document.getElementById('activation-code-input');
                    if (input) {
                        input.value = "";
                        input.focus();
                    }
                }, 100);
            };

            if (!show) return (
                <button type="button" className="btn-activate-link" onClick={openActivationModal} style={{ position: 'relative', zIndex: 1, opacity: 1, padding: '10px 0', border: 'none', background: 'transparent', width: '100%' }}>
                    Já comprei? Ativar código de acesso
                </button>
            );

            return (
                <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShow(false); }} style={{ zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="password-modal-content">
                        <button type="button" onClick={(e) => { e.preventDefault(); setShow(false); }} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)', fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer' }}>&times;</button>
                        <h2 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: '800', color: '#fff' }}>Ativar Código</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>Insira o código enviado para o seu e-mail após a compra.</p>

                        <div className="mt-6 w-full">
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
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAtivar(e);
                                    }
                                }}
                            />
                            <button
                                type="button"
                                id="confirm-activation-btn"
                                className="w-full block rounded-lg bg-orange-500 py-4 font-bold text-white shadow-lg hover:bg-orange-600 transition-colors text-lg active:scale-95"
                                onClick={handleAtivar}
                            >
                                Confirmar Ativação
                            </button>
                        </div>
                        {error && <div className="password-error-msg">{error}</div>}
                    </div>
                </div>
            );
        }`;

if (regex.test(content)) {
    content = content.replace(regex, novaTree);
    fs.writeFileSync(file, content, 'utf8');
    console.log("SUCCESS!");
} else {
    console.log("ERROR PATTERN NOT FOUND!");
}
