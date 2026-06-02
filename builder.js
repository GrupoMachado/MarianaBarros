const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. OneSignal in Head
if (!html.includes('OneSignalSDK.page.js')) {
    html = html.replace('</head>', `    <script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>\n</head>`);
}

// 2. Global OneSignal Init
const initScript = `
        window.OneSignalDeferred = window.OneSignalDeferred || [];
        OneSignalDeferred.push(function(OneSignal) {
            OneSignal.init({
                appId: "YOUR-ONESIGNAL-APP-ID", 
                safari_web_id: "web.onesignal.auto.12345",
                notifyButton: { enable: false }
            });
        });
`;
if (!html.includes('OneSignalDeferred.push')) {
    html = html.replace('<script type="text/babel">', `<script type="text/babel">\n${initScript}\n`);
}

// 3. Components injection before function App
const componentsCode = `

function SmartRestTimer({ timeSeconds, onComplete, onSkip }) {
    const [timeLeft, setTimeLeft] = useState(timeSeconds);
    
    useEffect(() => {
        if (timeLeft <= 0) {
            // Final longo
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                osc.type = 'square';
                osc.frequency.setValueAtTime(800, ctx.currentTime);
                osc.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 1);
                if (navigator.vibrate) navigator.vibrate([1000]);
            } catch(e) {}
            onComplete();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                const p = prev - 1;
                if (p > 0 && p <= 3) {
                    // Beep curto
                    try {
                        const ctx = new (window.AudioContext || window.webkitAudioContext)();
                        const osc = ctx.createOscillator();
                        osc.frequency.setValueAtTime(440, ctx.currentTime);
                        osc.connect(ctx.destination);
                        osc.start();
                        osc.stop(ctx.currentTime + 0.2);
                    } catch(e) {}
                }
                return p;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, onComplete]);

    const pct = (timeLeft / timeSeconds) * 100;
    const radius = 60;
    const circ = 2 * Math.PI * radius;
    const strokeDashoffset = circ - (pct / 100) * circ;

    return (
        <div className="modal-overlay" style={{ background: 'rgba(15,23,42,0.95)', zIndex: 11000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '40px', fontWeight: '800' }}>Tempo de Descanso</h2>
            <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="160" height="160" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
                    <circle cx="80" cy="80" r={radius} fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                    <circle cx="80" cy="80" r={radius} fill="transparent" stroke="var(--accent)" strokeWidth="12" strokeDasharray={circ} strokeDashoffset={strokeDashoffset} style={{ transition: 'stroke-dashoffset 1s linear' }} strokeLinecap="round" />
                </svg>
                <div style={{ fontSize: '48px', fontWeight: '900', color: '#fff' }}>{timeLeft}s</div>
            </div>
            <button className="btn-massive-success" style={{ marginTop: '50px', background: 'rgba(255,255,255,0.1)', color: '#fff' }} onClick={onSkip}>
                Saltar Descanso
            </button>
        </div>
    );
}

function TrackSetsModal({ ex, onClose, onShowTimer }) {
    const totalSets = parseInt((ex?.sets_reps || '1').split('x')[0]) || 1;
    const targetReps = parseInt((ex?.sets_reps || '0').split('x')[1]) || 0;
    
    const [setsData, setSetsData] = useState(Array(totalSets).fill({ weight: '', reps: '' }));
    const [lastSessionData, setLastSessionData] = useState([]);
    
    useEffect(() => {
        async function fetchLastLocal() {
            if (!window.supabase) return;
            const { data: { session } } = await window.supabase.auth.getSession();
            if (!session) return;
            const res = await window.supabase.from('workout_logs').select('*').eq('user_id', session.user.id).eq('exercise_id', ex.id).order('date', { ascending: false }).limit(totalSets);
            if (res.data) setLastSessionData(res.data);
        }
        fetchLastLocal();
    }, [ex, totalSets]);

    const handleSaveSet = async (idx) => {
        const row = setsData[idx];
        const w = parseFloat(row.weight) || 0;
        const r = parseInt(row.reps) || 0;
        
        if (window.supabase) {
            const { data: { session } } = await window.supabase.auth.getSession();
            if (session) {
                await window.supabase.from('workout_logs').insert({
                    user_id: session.user.id,
                    exercise_id: ex.id,
                    weight: w,
                    reps: r,
                    set_number: idx + 1
                });
            }
        }
        
        // Timer trigger (Compound = 120s, Isolation = 60s)
        const isCompound = ex?.category?.includes('Composto') || ex?.category?.includes('Membros Inferiores') || ex?.category?.includes('Core');
        const rest = isCompound ? (ex.rest_time_compound || 120) : (ex.rest_time_isolation || 60);
        onShowTimer(rest);
    };

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()} style={{ zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="password-modal-content" style={{ maxWidth: '400px', width: '90%', padding: '24px' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)', fontSize: '24px', background: 'none', border: 'none' }}>&times;</button>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>{ex.nome || ex.title || 'Tracking'}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>Registo Dinâmico de Progressive Overload</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {Array.from({ length: totalSets }).map((_, idx) => {
                        const last = lastSessionData[idx];
                        const phWeight = last ? \`Última: \${last.weight}kg\` : "Kg";
                        const phReps = last ? \`\${last.reps} reps\` : (targetReps ? \`Alvo: \${targetReps}\` : "Reps");
                        return (
                            <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-muted)', width: '30px' }}>{idx+1}</div>
                                <input type="number" placeholder={phWeight} style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', color: '#fff', padding: '10px', borderRadius: '8px', fontSize: '14px' }}
                                    value={setsData[idx].weight} onChange={e => { const n = [...setsData]; n[idx] = { ...n[idx], weight: e.target.value }; setSetsData(n); }} />
                                <input type="number" placeholder={phReps} style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', color: '#fff', padding: '10px', borderRadius: '8px', fontSize: '14px' }}
                                    value={setsData[idx].reps} onChange={e => { const n = [...setsData]; n[idx] = { ...n[idx], reps: e.target.value }; setSetsData(n); }} />
                                <button style={{ background: 'var(--accent)', color: '#fff', padding: '10px 14px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }} onClick={() => handleSaveSet(idx)}>✓</button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

`;
if (!html.includes('TrackSetsModal')) {
    html = html.replace('function App() {', componentsCode + 'function App() {');
}

// 4. Inject States into App()
if (!html.includes('const [trackEx')) {
    html = html.replace('const [sel, setSel] = useState(null);', 'const [sel, setSel] = useState(null);\n            const [trackEx, setTrackEx] = useState(null);\n            const [restTimer, setRestTimer] = useState(0);');
}

// 5. Replace onClickBody in ExerciciosCardCustom
if (html.includes("alert('Ecrã de Detalhes do Exercício em Breve!');")) {
    html = html.replace(
        "alert('Ecrã de Detalhes do Exercício em Breve!');", 
        "if(typeof setTrackEx === 'function') setTrackEx(ex); else alert('Det');"
    );
}

// Ensure the closure has setTrackEx
// In index.html, ExerciciosCardCustom is passed onClickBody={...}
html = html.replace(
    /onClickBody=\{\(\) => \{\s*alert\('Ecrã de Detalhes do Exercício em Breve!'\);\s*\}\}/g,
    "onClickBody={() => { if(typeof setTrackEx==='function') setTrackEx(ex); }}"
);

// 6. Render Modals at the end of App
// Search for "{sel && <VideoModal"
const renderModals = `
                {sel && <VideoModal exercise={sel} isCompleted={ud.isCompleted(sel.id)} onClose={() => setSel(null)} onToggle={ud.toggleComplete} />}
                {trackEx && <TrackSetsModal ex={trackEx} onClose={() => setTrackEx(null)} onShowTimer={setRestTimer} />}
                {restTimer > 0 && <SmartRestTimer timeSeconds={restTimer} onComplete={() => setRestTimer(0)} onSkip={() => setRestTimer(0)} />}
`;

if (!html.includes('trackEx && <TrackSetsModal')) {
    html = html.replace('{sel && <VideoModal exercise={sel} isCompleted={ud.isCompleted(sel.id)} onClose={() => setSel(null)} onToggle={ud.toggleComplete} />}', renderModals);
}

// Also replace in case it couldn't find the exact onClickBody string due to spaces
const re1 = /onClickBody=\{\(\)\s*=>\s*\{[\s\S]*?alert\('Ecrã de Detalhes do Exercício em Breve!'\);[\s\S]*?\}\}/g;
html = html.replace(re1, "onClickBody={() => { if(typeof setTrackEx==='function') setTrackEx(ex); }}");

fs.writeFileSync('index.html', html, 'utf8');
console.log('Injecoes frontend completadas com sucesso!');
