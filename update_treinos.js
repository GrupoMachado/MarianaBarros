const fs = require('fs');

const filePath = 'c:/Users/rafae/Desktop/APP/index.html';
let content = fs.readFileSync(filePath, 'utf-8');

// Replacements
const navRegex = /(const NAV = \[\s*\{ id: 'inicio'[^}]+\},\s*)\{ id: 'sugestao'[^}]+\},\s*\{ id: 'cronograma'[^}]+\},\s*\{ id: 'explorar'[^}]+\},/;
const replacementNav = "$1{ id: 'treinos', label: 'Treinos \\u26A1', d: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },\n            { id: 'cronograma', label: 'Meu Desafio \\uD83D\\uDD25', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', requiresAccess: 'desafio30' },";
content = content.replace(navRegex, replacementNav);

const mockData = `        const TREINO_MOCK = {
            grupos: [
                { id: 'g1', nome: 'Membros Superiores', icone_name: '💪' },
                { id: 'g2', nome: 'Membros Inferiores', icone_name: '🦵' },
                { id: 'g3', nome: 'Core', icone_name: '🎯' },
                { id: 'g4', nome: 'Cardio & Mobilidade', icone_name: '🏃‍♂️' }
            ],
            musculos: [
                { id: 'm1', group_id: 'g1', nome: 'Peitoral' },
                { id: 'm2', group_id: 'g1', nome: 'Costas' },
                { id: 'm3', group_id: 'g1', nome: 'Ombros' },
                { id: 'm4', group_id: 'g1', nome: 'Bíceps & Tríceps' },
                { id: 'm5', group_id: 'g2', nome: 'Quadríceps' },
                { id: 'm6', group_id: 'g2', nome: 'Posteriores' },
                { id: 'm7', group_id: 'g2', nome: 'Glúteos' },
                { id: 'm8', group_id: 'g2', nome: 'Panturrilhas' },
                { id: 'm9', group_id: 'g3', nome: 'Abdominais' },
                { id: 'm10', group_id: 'g3', nome: 'Lombar' },
                { id: 'm11', group_id: 'g4', nome: 'Cardio' },
                { id: 'm12', group_id: 'g4', nome: 'Mobilidade' }
            ],
            exercicios: [
                { id: 'e1', muscle_id: 'm1', nome: 'Flexões Normais', nivel: 'Intermediário', sets_reps: '4x 12', duracao_minutos: 5, is_enabled: true },
                { id: 'e2', muscle_id: 'm1', nome: 'Flexões Inclinadas', nivel: 'Iniciante', sets_reps: '3x 10', duracao_minutos: 4, is_enabled: true },
                { id: 'e3', muscle_id: 'm2', nome: 'Remada com Elástico', nivel: 'Iniciante', sets_reps: '3x 15', duracao_minutos: 5, is_enabled: true },
                { id: 'e4', muscle_id: 'm3', nome: 'Elevação Lateral', nivel: 'Iniciante', sets_reps: '3x 12', duracao_minutos: 4, is_enabled: true },
                { id: 'e5', muscle_id: 'm5', nome: 'Agachamento Livre', nivel: 'Iniciante', sets_reps: '4x 15', duracao_minutos: 6, is_enabled: true },
                { id: 'e6', muscle_id: 'm7', nome: 'Ponte de Glúteos', nivel: 'Iniciante', sets_reps: '3x 20', duracao_minutos: 5, is_enabled: true },
                { id: 'e7', muscle_id: 'm9', nome: 'Prancha', nivel: 'Intermediário', sets_reps: '3x 45s', duracao_minutos: 4, is_enabled: true }
            ]
        };

        const ExerciciosCardCustom = ({ ex }) => {
            return (
                <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', lineHeight: 1.2 }}>{ex.nome}</h3>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ 
                            background: ex.nivel === 'Iniciante' ? 'rgba(34,197,94,0.1)' : 'rgba(234,88,12,0.1)', 
                            color: ex.nivel === 'Iniciante' ? '#22c55e' : '#ea580c', 
                            padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' 
                        }}>
                            {ex.nivel}
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🔄 {ex.sets_reps}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>⏱️ {ex.duracao_minutos} min</span>
                    </div>
                    <button disabled style={{ 
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', 
                        color: 'var(--text-muted)', padding: '14px', borderRadius: '12px', fontWeight: 'bold', 
                        marginTop: 'auto', cursor: 'not-allowed', width: '100%', fontSize: '15px' 
                    }}>
                        🎥 Vídeo em breve
                    </button>
                </div>
            );
        };

        function App() {`;

content = content.replace("        function App() {", mockData);

const stateInjection = `            const [page, setPage] = useState('inicio');
            const [selectedGroup, setSelectedGroup] = useState(null);
            const [selectedMuscle, setSelectedMuscle] = useState(null);`;

content = content.replace("            const [page, setPage] = useState('inicio');", stateInjection);

const treinoLogic = `                    case 'treinos':
                        if (!selectedGroup) {
                            return (
                                <div style={{ animation: 'fade-in 0.4s ease-out' }}>
                                    <div className="page-header" style={{ marginBottom: '24px' }}>
                                        <h1>⚡ Treinos</h1>
                                        <p style={{ color: 'var(--text-secondary)' }}>Escolha um grupo muscular para começar.</p>
                                    </div>
                                    <div className="grid">
                                        {TREINO_MOCK.grupos.map(g => (
                                            <div key={g.id} className="card" onClick={() => {
                                                setSelectedGroup(g);
                                                const firstMuscle = TREINO_MOCK.musculos.find(m => m.group_id === g.id);
                                                setSelectedMuscle(firstMuscle);
                                            }} style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer' }}>
                                                <div style={{ fontSize: '40px', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', flexShrink: 0, width: '72px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{g.icone_name}</div>
                                                <h3 style={{ fontSize: '20px', fontWeight: '800', lineHeight: '1.2' }}>{g.nome}</h3>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        }

                        const groupMuscles = TREINO_MOCK.musculos.filter(m => m.group_id === selectedGroup.id);
                        const displayedMuscle = selectedMuscle || groupMuscles[0];
                        const exercisesToDisplay = displayedMuscle ? TREINO_MOCK.exercicios.filter(e => e.muscle_id === displayedMuscle.id && e.is_enabled) : [];

                        return (
                            <div style={{ animation: 'fade-in 0.4s ease-out' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                    <button onClick={() => { setSelectedGroup(null); setSelectedMuscle(null); }} style={{ background: 'rgba(255,255,255,0.1)', width: '44px', height: '44px', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', flexShrink: 0 }}>
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </button>
                                    <div>
                                        <h1 style={{ fontSize: '24px', margin: 0, fontWeight: '900' }}>{selectedGroup.nome}</h1>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>Selecione o músculo alvo</p>
                                    </div>
                                </div>

                                <div className="filter-section" style={{ overflowX: 'auto', paddingBottom: '12px', display: 'flex', gap: '12px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', marginBottom: '24px' }}>
                                    {groupMuscles.map(m => (
                                        <button key={m.id} className={\`pill \${displayedMuscle?.id === m.id ? 'active' : ''}\`} style={{ flexShrink: 0, padding: '10px 20px', fontSize: '15px' }} onClick={() => setSelectedMuscle(m)}>
                                            {m.nome}
                                        </button>
                                    ))}
                                </div>

                                {exercisesToDisplay.length > 0 ? (
                                    <div className="grid">
                                        {exercisesToDisplay.map(ex => <ExerciciosCardCustom key={ex.id} ex={ex} />)}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                                        <div style={{ fontSize: '40px', marginBottom: '16px' }}>🏗️</div>
                                        <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Em construção</h3>
                                        <p>Em breve dezenas de exercícios para {displayedMuscle?.nome}.</p>
                                    </div>
                                )}
                            </div>
                        );`;

const caseExplorarRegex = /case 'explorar':[\s\S]*?(?=case 'guardados':)/;
content = content.replace(caseExplorarRegex, treinoLogic + "\n\n                    ");

const caseSugestaoRegex = /case 'sugestao':[\s\S]*?(?=case 'progresso':)/;
content = content.replace(caseSugestaoRegex, "");

content = content.replaceAll("setPage('explorar');", "setPage('treinos');");
content = content.replace("if (n.id === 'explorar')", "if (n.id === 'treinos')");
content = content.replaceAll("page === 'explorar_senior'", "page === 'treinos_senior'");

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Update success');
