const fs = require('fs');
const file = 'c:/Users/rafae/Desktop/APP/index.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the entire PasswordUnlock function
const pwUnlockRegex = /function PasswordUnlock\(\{ moduleId, code, isVip, onUnlock \}\) \{[\s\S]*?return \(\s*<div className="modal-overlay"[\s\S]*?<\/div>\s*\);\s*\}/;
content = content.replace(pwUnlockRegex, '// Componente Modal Removido (Nova Arquitetura Global)');

// 2. Replace the ExtrasHub function
const extrasHubRegex = /function ExtrasHub\(\{ userProfile, onUnlock, onUnlockAll, onAccessModule \}\) \{[\s\S]*?return \([\s\S]*?<div className="extras-page"[\s\S]*?<\/div>\s*\);\s*\}/;

const novaTree = `function ExtrasHub({ userProfile, onUnlock, onUnlockAll, onAccessModule }) {
            const hasC = (mod) => userProfile?.permissions?.[mod];

            const offers = [
                {
                    id: 'vip_gold',
                    title: 'Combo de Ouro',
                    icon: '🏆',
                    price: '24,90',
                    desc: 'Acesso Vitalício: Inclui os 4 conteúdos completos (3 guias + Desafio VIP) reunidos num único pacote com 69% de desconto. (Poupe R$ 54,70 hoje!)',
                    code: 'VIPGOLD2024',
                    isVip: true,
                    highlight: '69% OFF',
                    link: 'https://pay.hotmart.com/Y105938748R?checkoutMode=10'
                },
                {
                    id: 'desafio30',
                    title: 'Desafio 30 Dias',
                    icon: '🔥',
                    price: '19,90',
                    desc: 'O cronograma definitivo. Saiba exatamente quais exercícios fazer a cada dia para acelerar os seus resultados sem perder tempo.',
                    code: 'DESAFIO30VIP',
                    link: 'https://pay.hotmart.com/S105938555K?checkoutMode=10'
                },
                { 
                    id: 'scanner_ia', 
                    title: 'Scanner de Refeições IA', 
                    icon: '📸', 
                    price: '16,90', 
                    desc: 'O fim de contar calorias à mão. Tire uma foto ao seu prato e a nossa Inteligência Artificial calcula as suas macros na hora.', 
                    code: 'IA2026', 
                    link: 'https://pay.hotmart.com/Q105939894U?checkoutMode=10',
                    highlight: 'NOVO'
                },
                { id: 'senior', title: 'Atividades para Idosos', icon: '🧘', price: '19,90', desc: '+200 exercícios focados em mobilidade e autonomia.', code: 'SENIOR890', link: 'https://pay.hotmart.com/D105938993C?checkoutMode=10' },
                { id: 'pilates', title: 'Dinâmicas de Pilates', icon: '⭕', price: '19,90', desc: '+200 exercícios para core e postura.', code: 'PILATES950', link: 'https://pay.hotmart.com/E105938855Y?checkoutMode=10' },
                { id: 'gymnastics', title: 'Atividades de Ginástica', icon: '🤸', price: '19,90', desc: '+250 exercícios de força funcional e agilidade.', code: 'GYM850', link: 'https://pay.hotmart.com/M105939209K?checkoutMode=10' },
                { id: 'musculacao', title: 'Guia de Musculação em Casa', icon: '💪', price: '19,90', desc: 'Transforme qualquer espaço num ginásio funcional.', code: 'MUSC500', link: 'https://pay.hotmart.com/N105939399C?checkoutMode=10' }
            ];

            const handleGlobalActivation = (e) => {
                e.preventDefault();
                
                const inputField = document.getElementById('global-code-input');
                const inputCode = inputField ? inputField.value.trim().toUpperCase() : '';

                if (!inputCode) return;

                const modulesData = [
                    { id: "scanner_ia", code: "IA2026" },
                    { id: "vip_gold", code: "VIPGOLD2024" },
                    { id: "desafio30", code: "DESAFIO30VIP" },
                    { id: "musculacao", code: "MUSC500" },
                    { id: "senior", code: "SENIOR890" },
                    { id: "pilates", code: "PILATES950" },
                    { id: "gymnastics", code: "GYM850" }
                ];

                const matchedModule = modulesData.find(m => m.code === inputCode || (inputCode === 'VIPGOLD2024' && m.id === 'vip_gold'));

                if (!matchedModule) {
                    alert("Código inválido. Verifique o seu e-mail de compra.");
                    return;
                }

                inputField.value = ""; // Limpa pós-sucesso

                // Atualiza o state global do projeto para refletir permanentemente a compra
                if (inputCode === 'VIPGOLD2024') {
                    onUnlockAll && onUnlockAll();
                } else {
                    onUnlock && onUnlock(matchedModule.id);
                }

                // 3. FLUXO ESPECIAL Scanner
                if (matchedModule.id === 'scanner_ia') {
                    const extrasWrapper = document.getElementById('extras-page') || document.querySelector('.extras-page');
                    if (extrasWrapper) {
                        extrasWrapper.classList.add('hidden');
                        extrasWrapper.style.display = 'none';
                    }
                    const scannerWrapper = document.getElementById('portal-root');
                    if (scannerWrapper) {
                        scannerWrapper.classList.remove('hidden');
                        scannerWrapper.style.display = 'flex'; 
                        scannerWrapper.style.zIndex = '100000';
                    }
                } 
                // 4. FLUXO NORMAL Extras
                else {
                    const targetCard = document.getElementById('card-' + matchedModule.id);
                    if (targetCard) {
                        const btn = targetCard.querySelector('.btn-access-override');
                        if (btn) {
                            btn.innerHTML = "✅ ACESSAR CONTEÚDO";
                            btn.classList.remove('bg-orange-500', 'hover:bg-orange-600', 'text-white');
                            btn.className = "w-full rounded-lg bg-green-500 py-3 font-bold text-white shadow-lg transition-colors mt-4 btn-access-override";
                            targetCard.style.border = '1px solid #22c55e';
                            targetCard.style.background = 'rgba(34, 197, 94, 0.05)';
                            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }
                }
            };

            return (
                <div id="extras-page" className="extras-page" style={{ paddingBottom: '120px' }}>
                    <div className="page-header">
                        <h1>🛒 Módulos Extra</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Expanda a sua biblioteca com conteúdos especializados.</p>
                    </div>

                    {/* NOVA ÁREA GLOBAL DE ATIVAÇÃO REQUISITADA */}
                    <div className="mb-8 w-full rounded-2xl bg-gray-900 p-6 border border-gray-700 shadow-lg">
                        <h3 className="text-xl font-bold text-white mb-2">Já tem um código de acesso?</h3>
                        <p className="text-sm text-gray-400 mb-4">Insira o seu código para desbloquear imediatamente o conteúdo.</p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input 
                                type="text" 
                                id="global-code-input" 
                                className="flex-1 rounded-lg bg-gray-800 border border-gray-600 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 text-lg uppercase tracking-widest text-center sm:text-left" 
                                placeholder="COLE O SEU CÓDIGO AQUI" 
                                autoComplete="off" 
                                spellCheck="false" 
                            />
                            <button 
                                type="button" 
                                id="global-activate-btn" 
                                className="rounded-lg bg-orange-500 px-8 py-3 font-bold text-white shadow-lg hover:bg-orange-600 transition-colors whitespace-nowrap"
                                onClick={handleGlobalActivation}
                            >
                                ATIVAR CÓDIGO
                            </button>
                        </div>
                    </div>

                    <div className="extras-grid">
                        {offers.map(off => {
                            const isVipUser = hasC('gold') || hasC('vip') || hasC('vip_gold') || (hasC('senior') && hasC('pilates') && hasC('gymnastics') && hasC('desafio30'));
                            const unlocked = off.isVip ? isVipUser : (isVipUser || hasC(off.id));
                            return (
                                <div id={'card-' + off.id} key={off.id} className={\`extras-card \${off.isVip ? 'vip-featured' : ''}\`} style={
                                    unlocked && !off.isVip ? { border: '1px solid #22c55e', background: 'rgba(34, 197, 94, 0.05)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }
                                        : (off.isVip && unlocked ? { backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }
                                            : (!unlocked ? { background: 'rgba(15, 23, 42, 0.8)' } : { backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }))
                                }>
                                    {off.highlight && <div className="badge-40-off">{off.highlight}</div>}
                                    <div className="sales-icon" style={{ fontSize: '48px', marginBottom: '16px' }}>{off.icon}</div>
                                    <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px', color: '#fff' }}>{off.title}</h3>
                                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', flex: 1 }}>{off.desc}</p>

                                    {!unlocked && (
                                        <div className="sales-price" style={{ fontSize: '24px', marginBottom: '20px' }}>
                                            R$ {off.price} <small style={{ fontSize: '12px' }}>pagamento único</small>
                                        </div>
                                    )}

                                    {unlocked ? (
                                        <div className="extras-actions" style={{ marginTop: 'auto' }}>
                                            {off.isVip ? (
                                                <div style={{ background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', padding: '16px', borderRadius: 'var(--radius-md)', fontWeight: '800', textAlign: 'center', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                                                    🏆 Acesso Total Vitalício Ativo
                                                </div>
                                            ) : (
                                                <button className="btn-access-override" style={{ backgroundColor: '#16a34a', color: '#ffffff', padding: '14px 20px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', width: '100%', marginTop: '20px', fontSize: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }} onClick={() => onAccessModule(off.id)}>
                                                    ✅ Assistir Agora
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="extras-actions" style={{ marginTop: 'auto', position: 'relative', zIndex: 1 }}>
                                            {off.isVip ? (
                                                <button className="btn-vip-gold btn-access-override" style={{ position: 'relative', zIndex: 1, padding: '18px', fontSize: '16px', fontWeight: '900', color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.3)', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => window.open(off.link, '_blank')}>
                                                    Garantir Combo de Ouro
                                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                                </button>
                                            ) : (
                                                <button className="btn-access-override" style={{ backgroundColor: '#ea580c', color: '#ffffff', padding: '14px 20px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', width: '100%', marginTop: '20px', position: 'relative', zIndex: 1, fontSize: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }} onClick={() => window.open(off.link, '_blank')}>
                                                    GARANTIR ACESSO AGORA ➔
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }`;

if (extrasHubRegex.test(content)) {
    content = content.replace(extrasHubRegex, novaTree);
    fs.writeFileSync(file, content, 'utf8');
    console.log("SUCCESS!");
} else {
    console.log("EXTRASHUB PATTERN NOT FOUND!");
}
