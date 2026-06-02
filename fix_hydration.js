const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8').replace(/\r\n/g, '\n');

const stateTarget = `            const [activeTooltip, setActiveTooltip] = useState(null);
            const [hydrationToday, setHydrationToday] = useState(0);`;

const stateReplace = `            const [activeTooltip, setActiveTooltip] = useState(null);
            const [hydrationToday, setHydrationToday] = useState(0);
            const [temperature, setTemperature] = useState(null);
            const [dynamicGoal, setDynamicGoal] = useState(2000);
            const [weatherLoading, setWeatherLoading] = useState(true);

            // Fetch Weather and Calculate Goal
            useEffect(() => {
                const fetchWeather = async () => {
                    setWeatherLoading(true);
                    if (userProfile && userProfile.estado) {
                        try {
                            const controller = new AbortController();
                            const timeoutId = setTimeout(() => controller.abort(), 5000);
                            const res = await fetch(\`https://wttr.in/\${encodeURIComponent(userProfile.estado)},Brazil?format=j1\`, { signal: controller.signal });
                            clearTimeout(timeoutId);
                            if (res.ok) {
                                const data = await res.json();
                                if (data && data.current_condition && data.current_condition.length > 0) {
                                    setTemperature(parseInt(data.current_condition[0].temp_C));
                                }
                            }
                        } catch (e) {
                            console.warn("Falha ao obter clima, usando meta base.", e);
                        }
                    }
                    setWeatherLoading(false);
                };
                fetchWeather();
            }, [userProfile]);

            useEffect(() => {
                let baseGoal = 2000;
                if (history.length > 0) {
                    const last = history[history.length - 1];
                    if (last.peso) baseGoal = Math.round(last.peso * 35);
                }
                
                let extra = 0;
                if (temperature !== null) {
                    if (temperature > 30) extra = 1000;
                    else if (temperature >= 25) extra = 500;
                }
                
                setDynamicGoal(baseGoal + extra);
            }, [history, temperature]);

            useEffect(() => {
                if (session) {
                    const startOfDay = new Date();
                    startOfDay.setHours(0,0,0,0);
                    window.supabase.from('registos_hidratacao')
                        .select('quantidade_ml')
                        .eq('user_id', session.user.id)
                        .gte('data', startOfDay.toISOString())
                        .then(({ data, error }) => {
                            if (data && !error) {
                                const total = data.reduce((acc, curr) => acc + curr.quantidade_ml, 0);
                                setHydrationToday(total);
                            }
                        });
                }
            }, [session]);

            const addHydration = async (ml) => {
                const { data, error } = await window.supabase.from('registos_hidratacao').insert({
                    user_id: session.user.id,
                    quantidade_ml: ml
                }).select().single();

                if (data) {
                    setHydrationToday(prev => prev + ml);
                } else if (error) {
                    alert('Erro ao registar hidratação.');
                }
            };`;

const oldAddHydrationTarget = `            const addHydration = async (ml) => {
                const { data, error } = await window.supabase.from('registos_hidratacao').insert({
                    user_id: session.user.id,
                    quantidade_ml: ml
                }).select().single();

                if (data) {
                    setHydrationToday(prev => prev + ml);
                }
            };`;

if(c.includes(oldAddHydrationTarget)) {
    c = c.replace(oldAddHydrationTarget, ''); // Clean old function if it exists
}

c = c.replace(stateTarget, stateReplace);

// Now for the UI replacement
const uiTargetRegex = /\{\/\* Hidratação Diária \*\/\}.*?(?=\{\/\* Hightlights \*\/\})/s;

const waveCSS = `
        <style>
            @keyframes spinWave { 100% { transform: rotate(360deg); } }
            .water-circle-container {
                position: relative;
                width: 140px;
                height: 140px;
                border-radius: 50%;
                background: rgba(14, 165, 233, 0.1);
                border: 4px solid rgba(14, 165, 233, 0.3);
                overflow: hidden;
                margin: 0 auto;
                box-shadow: 0 0 20px rgba(14, 165, 233, 0.2), inset 0 0 20px rgba(14, 165, 233, 0.2);
            }
            .water-wave {
                position: absolute;
                width: 200%;
                height: 200%;
                background: linear-gradient(180deg, rgba(56, 189, 248, 0.8) 0%, rgba(2, 132, 199, 0.9) 100%);
                left: -50%;
                border-radius: 40%;
                animation: spinWave 6s linear infinite;
                transition: top 1s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .water-wave-2 {
                position: absolute;
                width: 200%;
                height: 200%;
                background: linear-gradient(180deg, rgba(14, 165, 233, 0.6) 0%, rgba(3, 105, 161, 0.8) 100%);
                left: -50%;
                border-radius: 35%;
                animation: spinWave 4s linear infinite;
                transition: top 1s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .water-percentage {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #fff;
                font-size: 24px;
                font-weight: 900;
                z-index: 10;
                text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                display: flex;
                flex-direction: column;
                align-items: center;
                line-height: 1;
            }
            .water-amount {
                font-size: 11px;
                font-weight: 600;
                color: rgba(255,255,255,0.9);
                margin-top: 4px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
        </style>
`;

const uiReplace = `{/* Hidratação Diária */}
                    <div className="progress-section-card" style={{ marginBottom: '24px', background: 'linear-gradient(145deg, rgba(14, 165, 233, 0.05) 0%, rgba(15, 23, 42, 0.6) 100%)', border: '1px solid rgba(14, 165, 233, 0.2)', position: 'relative', overflow: 'hidden' }}>
                        ${waveCSS}
                        <h3 className="ps-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: '24px' }}>
                            <span style={{ fontSize: '24px', filter: 'drop-shadow(0 0 8px rgba(56,189,248,0.5))' }}>💧</span> Hidratação Dinâmica
                        </h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
                            <div className="water-circle-container">
                                {(() => {
                                    const pct = Math.min(100, Math.max(0, (hydrationToday / dynamicGoal) * 100));
                                    const topOffset = 100 - pct; // 100% top is empty, 0% top is full
                                    return (
                                        <>
                                            <div className="water-wave-2" style={{ top: \`\${topOffset}%\` }}></div>
                                            <div className="water-wave" style={{ top: \`\${topOffset + 2}%\` }}></div>
                                        </>
                                    );
                                })()}
                                <div className="water-percentage">
                                    {Math.round((hydrationToday / dynamicGoal) * 100)}%
                                    <span className="water-amount">{hydrationToday} / {dynamicGoal}ml</span>
                                </div>
                            </div>

                            <div style={{ marginTop: '20px', textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '10px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                {weatherLoading ? (
                                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>A verificar clima local...</span>
                                ) : (
                                    <>
                                        <div style={{ color: '#38bdf8', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
                                            {temperature !== null ? \`Calor em \${userProfile?.estado || 'Local'}: \${temperature}°C\` : 'Clima não detetado'}
                                        </div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                                            {temperature > 30 ? '🔥 Meta ajustada: +1000ml' : (temperature >= 25 ? '☀️ Meta ajustada: +500ml' : 'Meta base (Peso x 35ml)')}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button 
                                onClick={() => addHydration(250)}
                                style={{ flex: 1, padding: '16px 12px', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.3)', background: 'linear-gradient(145deg, rgba(56, 189, 248, 0.15) 0%, rgba(2, 132, 199, 0.2) 100%)', color: '#38bdf8', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                                <span style={{ fontSize: '20px' }}>🥛</span>
                                <span>+250ml</span>
                            </button>
                            <button 
                                onClick={() => addHydration(500)}
                                style={{ flex: 1, padding: '16px 12px', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.3)', background: 'linear-gradient(145deg, rgba(56, 189, 248, 0.15) 0%, rgba(2, 132, 199, 0.2) 100%)', color: '#38bdf8', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                                <span style={{ fontSize: '20px' }}>🍾</span>
                                <span>+500ml</span>
                            </button>
                        </div>
                    </div>
                    
                    `;

c = c.replace(uiTargetRegex, uiReplace);
fs.writeFileSync('index.html', c);
console.log('Hydration UI replaced!');
