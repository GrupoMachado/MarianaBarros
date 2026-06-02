const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

const ESTADOS_BR_FULL = 'const ESTADOS_BR = ["Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"];';

// --- 1. Modify AuthModal Component ---

// Remove estado from AuthModal
c = c.replace(/const \[estado, setEstado\] = useState\(''\);\s*const \[error, setError\] = useState\(''\);\s*const ESTADOS_BR = \[.*?\];/s, `const [error, setError] = useState('');`);
c = c.replace(/if \(!isLogin && !estado\) return setError\('Por favor, selecione o seu Estado \(UF\)\.'\);/, ``);

// Replace insert of user_profiles to NOT include estado
c = c.replace(/estado:\s*estado/g, `/* removed estado */`);

// Remove select input from AuthModal JSX
c = c.replace(/<div className="input-group">\s*<label>Estado \(UF\)<\/label>\s*<select className="ob-input" value=\{estado\}.*?<\/select>\s*<\/div>/s, '');


// --- 2. Modify Onboarding Component ---

// Add estado state and ESTADOS_BR array
c = c.replace(/const \[selectedGender, setSelectedGender\] = useState\(''\);/, 
    `const [selectedGender, setSelectedGender] = useState('');
            const [estado, setEstado] = useState('');
            ${ESTADOS_BR_FULL}`
);

// Add estado to onSubmit condition
c = c.replace(/if \(name\.trim\(\) && goal && selectedGender\) onComplete\(name\.trim\(\), goal, selectedGender, age\);/,
    `if (name.trim() && goal && selectedGender && estado) onComplete(name.trim(), goal, selectedGender, age, estado);`
);

// Inject the select inside Onboarding (after Age and before Skin)
const ageInputStr = `</label>
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="99" 
                                    value={age} 
                                    onChange={(e) => setAge(e.target.value)} 
                                    className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                            </div>`;

const estadoUIStr = `${ageInputStr}
                            <div className="input-group" style={{ marginTop: '16px' }}>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>SEU ESTADO (LOCALIZAÇÃO)</label>
                                <select className="ob-input" value={estado} onChange={e => setEstado(e.target.value)} required style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', color: '#fff', fontSize: '15px' }}>
                                    <option value="" disabled>Selecione o seu estado...</option>
                                    {ESTADOS_BR.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                                </select>
                            </div>`;

c = c.replace(ageInputStr, estadoUIStr);

// Update button disabled state
c = c.replace(/disabled=\{\!name\.trim\(\) \|\| \!goal \|\| \!selectedGender\}/g, `disabled={!name.trim() || !goal || !selectedGender || !estado}`);
c = c.replace(/opacity: \(\!name\.trim\(\) \|\| \!goal \|\| \!selectedGender\)/g, `opacity: (!name.trim() || !goal || !selectedGender || !estado)`);

// --- 3. Modify useUserData to handle estado ---

// Add estado to saveProfile useCallback
c = c.replace(/saveProfile = useCallback\(\(name, goal, gender, age\) => {/g, `saveProfile = useCallback((name, goal, gender, age, estado) => {`);
c = c.replace(/age,\s*permissions:/s, `age,\n                    estado,\n                    permissions:`);

// Add estado to userProfile sync mapping (around line 3090)
c = c.replace(/gender: userProfile\.gender,\n\s*idade: userProfile\.age/, `gender: userProfile.gender,\n                            idade: userProfile.age,\n                            estado: userProfile.estado`);

// Pull estado from DB initial sync (around line 3020-3027)
c = c.replace(/if \(data\.xp_bonus\) setXp\(data\.xp_bonus\);/, `if (data.xp_bonus) setXp(data.xp_bonus);\n                            if (data.estado) setP(prev => prev ? { ...prev, estado: data.estado } : { name: data.name, estado: data.estado });`);

fs.writeFileSync('index.html', c);
