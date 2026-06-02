const fs = require('fs');
const filePath = 'c:/Users/rafae/Desktop/APP/index.html';
let content = fs.readFileSync(filePath, 'utf-8');

const regexRacio = /<div style=\{\{ background: 'rgba\(0,0,0,0\.2\)', padding: '16px', borderRadius: '12px', border: '1px solid rgba\(255,255,255,0\.05\)', display: 'flex', flexDirection: 'column', gap: '16px' \}\}>[\s\S]*?<small style=\{\{ color: 'var\(--text-muted\)' \}\}>Cálculo de 35ml por kg de peso corporal\.<\/small>\s*<\/div>\s*<\/div>/m;

const replacement = `<div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <h4 style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Rácio Cintura/Altura</h4>
                                        {isAthletic ? (
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                                <div style={{ fontSize: '22px', lineHeight: 1 }}>🌟</div>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ color: '#eab308', fontWeight: '900', fontSize: '16px', lineHeight: 1.2 }}>Estrutura<br/>Atlética</span>
                                                    <span style={{ color: '#eab308', fontWeight: 'bold', fontSize: '14px', opacity: 0.9 }}>({(waistToHeight).toFixed(2)})</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ color: '#fff', fontWeight: 'bold' }}>
                                               Índice: {(waistToHeight || 0).toFixed(2)} {waistToHeight > 0.5 ? '(Risco Aumentado)' : ''}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                                        <h4 style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Água Diária (Meta)</h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '20px' }}>💧</span>
                                            <span style={{ color: '#60a5fa', fontWeight: '900', fontSize: '18px' }}>~{aguaNecessariaL} Litros</span>
                                        </div>
                                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>Cálculo de 35ml por kg de peso corporal.</p>
                                    </div>
                                </div>`;

content = content.replace(regexRacio, replacement);
fs.writeFileSync(filePath, content, 'utf-8');
console.log('Rácio widget adjusted layout');
