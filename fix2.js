const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8').replace(/\r\n/g, '\n');

const targetStr = `                            </div>
                            <div className="input-group" style={{ marginTop: '16px' }}>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>ESCOLHA SUA SKIN (AVATAR)</label>`;

const replaceStr = `                            </div>
                            <div className="input-group" style={{ marginTop: '16px' }}>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>SEU ESTADO (LOCALIZAÇÃO)</label>
                                <select className="ob-input" value={estado} onChange={e => setEstado(e.target.value)} required style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', color: '#fff', fontSize: '15px' }}>
                                    <option value="" disabled>Selecione o seu estado...</option>
                                    {ESTADOS_BR.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                                </select>
                            </div>
                            <div className="input-group" style={{ marginTop: '16px' }}>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>ESCOLHA SUA SKIN (AVATAR)</label>`;

if (c.includes(targetStr)) {
    c = c.replace(targetStr, replaceStr);
    fs.writeFileSync('index.html', c);
    console.log('Done replacement');
} else {
    console.log('Target string still not found!');
}
