const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8').replace(/\r\n/g, '\n');

// 1. Localizar o bloco de hidratação atual
const hydrationStartStr = `<h4 style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>Água Diária (Meta)</h4>`;
const hydrationEndStr = `                                            </div>
                                        </div>
                                    </div>`;

const startIdx = c.indexOf(hydrationStartStr);
const endIdx = c.indexOf(hydrationEndStr, startIdx) + hydrationEndStr.length;

if (startIdx === -1) {
    console.log("Could not find hydration block");
    process.exit(1);
}

const hydrationBlock = c.substring(startIdx, endIdx);

// Remover o bloco da posição atual e o seu container
const containerStart = c.lastIndexOf('<div style={{ borderTop: \'1px solid rgba(255,255,255,0.05)\', paddingTop: \'16px\' }}>', startIdx);
const containerEnd = c.indexOf('</div>', endIdx) + 6;

const blockToRemove = c.substring(containerStart, containerEnd);
c = c.replace(blockToRemove, '');

// 2. Criar a nova versão "Grande" e "No Início"
const bigHydration = `
                    <div className="progress-section-card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.9) 100%)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', padding: '20px 0' }}>
                            <div style={{ textAlign: 'center' }}>
                                <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: '900', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>🌊 Hidratação Inteligente</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Monitoramento em tempo real baseado no clima de {userProfile?.estado || 'Sua Localidade'}</p>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '40px', width: '100%' }}>
                                <div className="water-circle-container" style={{ width: '180px', height: '180px' }}>
                                    <div className="water-wave" style={{ top: \`\${Math.max(0, 100 - (hydrationToday / dynamicGoal * 100))}% \` }}></div>
                                    <div className="water-text">
                                        <span className="water-percentage" style={{ fontSize: '32px' }}>{Math.round(hydrationToday / dynamicGoal * 100)}%</span>
                                        <span className="water-amount" style={{ fontSize: '14px' }}>{hydrationToday} / {dynamicGoal}ml</span>
                                    </div>
                                </div>

                                <div style={{ flex: '1', minWidth: '280px', maxWidth: '400px' }}>
                                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '16px' }}>
                                        {weatherLoading ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div className="loading-spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(56, 189, 248, 0.2)', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Sincronizando clima local...</span>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <div style={{ color: '#38bdf8', fontSize: '16px', fontWeight: '900' }}>Meta: {dynamicGoal}ml</div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                                                    Ajustada para {userProfile?.estado || 'sua região'}: {temperature !== null ? temperature + '°C' : '--°C'}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <button onClick={() => addHydration(250)} className="ob-submit-btn" style={{ flex: 1, padding: '14px', fontSize: '14px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>+250ml</button>
                                        <button onClick={() => addHydration(500)} className="ob-submit-btn" style={{ flex: 1, padding: '14px', fontSize: '14px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>+500ml</button>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input 
                                            type="number" 
                                            placeholder="Valor personalizado" 
                                            value={customWaterAmount}
                                            onChange={(e) => setCustomWaterAmount(e.target.value)}
                                            style={{ flex: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', color: '#fff', fontSize: '14px' }}
                                        />
                                        <select 
                                            value={customWaterUnit}
                                            onChange={(e) => setCustomWaterUnit(e.target.value)}
                                            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', color: '#fff', fontSize: '14px' }}
                                        >
                                            <option value="ml">ml</option>
                                            <option value="L">L</option>
                                        </select>
                                        <button onClick={handleCustomHydration} style={{ width: '50px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '20px' }}>+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
`;

// Injetar no início do return de EvolucaoCorporal
const insertionPoint = `<div className="progress-dashboard" style={{ animation: 'fade-in 0.4s ease-out', paddingBottom: '100px', overflowX: 'hidden', maxWidth: '100%', boxSizing: 'border-box' }}>`;
c = c.replace(insertionPoint, insertionPoint + bigHydration);

fs.writeFileSync('index.html', c);
console.log('Hydration moved to top and resized!');
