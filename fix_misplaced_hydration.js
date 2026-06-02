const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8').replace(/\r\n/g, '\n');

// 1. Localizar e REMOVER o bloco do sítio errado (perto de 8829)
const hydrationStartStr = `{/* Secção de Hidratação (Reduzida e no Fundo) */}`;
const hydrationEndStr = `                </div>\n`; // Vamos procurar os 3 fechos

const startIdx = c.indexOf(hydrationStartStr);
// O bloco termina após 3 divs fechados
let count = 0;
let currentIdx = startIdx;
while (count < 3 && currentIdx !== -1) {
    currentIdx = c.indexOf('</div>', currentIdx + 1);
    count++;
}
const endIdx = currentIdx + 6;

if (startIdx === -1) {
    console.log("Could not find misplaced hydration block");
    process.exit(1);
}

const misplacedBlock = c.substring(startIdx, endIdx);
c = c.replace(misplacedBlock, '');

// 2. Injetar no sítio CORRETO (Fim de EvolucaoCorporal)
const evEndStr = `                </div>\n            );\n        }\n        function RankingView`;
const insertionPoint = c.indexOf(evEndStr);

if (insertionPoint === -1) {
    console.log("Could not find end of EvolucaoCorporal");
    process.exit(1);
}

// O bloco que queremos injetar (limpo de espaços extras do script anterior)
const smallHydration = `
                    {/* Secção de Hidratação (Reduzida e no Fundo) */}
                    <div className="progress-section-card" style={{ marginTop: '24px', border: '1px solid rgba(56, 189, 248, 0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div className="water-circle-container" style={{ width: '100px', height: '100px' }}>
                                    <div className="water-wave" style={{ top: \`\${Math.max(0, 100 - (hydrationToday / dynamicGoal * 100))}% \` }}></div>
                                    <div className="water-text">
                                        <span className="water-percentage" style={{ fontSize: '18px' }}>{Math.round(hydrationToday / dynamicGoal * 100)}%</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold', margin: 0 }}>🌊 Hidratação Diária</h3>
                                    <p style={{ color: '#38bdf8', fontSize: '12px', margin: '4px 0 0 0', fontWeight: 'bold' }}>
                                        {hydrationToday} / {dynamicGoal}ml {temperature !== null ? \`(\${temperature}°C)\` : ''}
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <button onClick={() => addHydration(250)} className="ob-submit-btn" style={{ padding: '8px 12px', fontSize: '12px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>+250ml</button>
                                <button onClick={() => addHydration(500)} className="ob-submit-btn" style={{ padding: '8px 12px', fontSize: '12px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>+500ml</button>
                                
                                <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <input 
                                        type="number" 
                                        placeholder="Valor" 
                                        value={customWaterAmount}
                                        onChange={(e) => setCustomWaterAmount(e.target.value)}
                                        style={{ width: '60px', background: 'transparent', border: 'none', color: '#fff', fontSize: '12px', textAlign: 'center' }}
                                    />
                                    <button onClick={handleCustomHydration} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '4px', padding: '0 8px', fontWeight: 'bold' }}>+</button>
                                </div>
                            </div>
                        </div>
                    </div>
`;

c = c.substring(0, insertionPoint + 18) + smallHydration + c.substring(insertionPoint + 18);

fs.writeFileSync('index.html', c);
console.log('Hydration moved to correct component!');
