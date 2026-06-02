const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8').replace(/\r\n/g, '\n');

const target = `                            </div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                                            {temperature > 30 ? '🔥 Meta ajustada: +1000ml' : (temperature >= 25 ? '☀️ Meta ajustada: +500ml' : 'Meta base (Peso x 35ml)')}
                                        </div>
                                    </>
                                )}
                            </div>`;

if(c.includes(target)) {
    c = c.replace(target, '                            </div>');
    fs.writeFileSync('index.html', c);
    console.log('Fixed orphaned JSX fragments');
} else {
    console.log('Target not found!');
}
