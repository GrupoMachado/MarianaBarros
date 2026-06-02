const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8').replace(/\r\n/g, '\n');

const fetchTarget = `            // Fetch Weather and Calculate Goal
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
            }, [history, temperature]);`;

const fetchReplace = `            // Fetch Weather and Calculate Goal
            useEffect(() => {
                const fetchWeather = async () => {
                    setWeatherLoading(true);
                    if (userProfile && userProfile.estado) {
                        const cacheKey = \`weather_\${userProfile.estado}\`;
                        const cached = localStorage.getItem(cacheKey);
                        if (cached) {
                            try {
                                const { temp, timestamp } = JSON.parse(cached);
                                const isExpired = (Date.now() - timestamp) > (12 * 60 * 60 * 1000);
                                if (!isExpired) {
                                    setTemperature(temp);
                                    setWeatherLoading(false);
                                    return; // Usa a cache
                                }
                            } catch (e) { }
                        }

                        try {
                            const controller = new AbortController();
                            const timeoutId = setTimeout(() => controller.abort(), 5000);
                            const estadoFormatado = userProfile.estado.replace(/ /g, '+');
                            const res = await fetch(\`https://wttr.in/\${estadoFormatado},Brazil?format=j1\`, { signal: controller.signal });
                            clearTimeout(timeoutId);
                            if (res.ok) {
                                const data = await res.json();
                                if (data && data.current_condition && data.current_condition.length > 0) {
                                    const temp = parseInt(data.current_condition[0].temp_C);
                                    setTemperature(temp);
                                    localStorage.setItem(cacheKey, JSON.stringify({ temp, timestamp: Date.now() }));
                                }
                            }
                        } catch (e) {
                            // Fails silently, uses base goal
                        }
                    }
                    setWeatherLoading(false);
                };
                fetchWeather();
            }, [userProfile]);

            useEffect(() => {
                let baseGoal = 2000;
                
                let extra = 0;
                if (temperature !== null) {
                    if (temperature > 33) extra = 1000;
                    else if (temperature > 28) extra = 500;
                }
                
                setDynamicGoal(baseGoal + extra);
            }, [temperature]);`;


const uiTargetRegex = /<div style=\{\{ marginTop: '20px', textAlign: 'center', background: 'rgba\(0,0,0,0\.3\)', padding: '10px 16px', borderRadius: '12px', border: '1px solid rgba\(255,255,255,0\.05\)' \}\}>[\s\S]*?<\/div>/s;

const uiReplace = `<div style={{ marginTop: '20px', textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '10px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                {weatherLoading ? (
                                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>A verificar clima local...</span>
                                ) : (
                                    <>
                                        <div style={{ color: '#38bdf8', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
                                            Meta de hoje: {dynamicGoal}ml (Ajustada para o clima de {userProfile?.estado || 'Local'})
                                        </div>
                                    </>
                                )}
                            </div>`;

if(c.includes(fetchTarget)) {
    c = c.replace(fetchTarget, fetchReplace);
}

c = c.replace(uiTargetRegex, uiReplace);

fs.writeFileSync('index.html', c);
console.log('Hydration logic optimized!');
