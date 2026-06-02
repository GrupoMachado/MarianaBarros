const fs = require('fs');
const filePath = 'c:/Users/rafae/Desktop/APP/index.html';
let content = fs.readFileSync(filePath, 'utf-8');

const regexTreinoMock = /const TREINO_MOCK = {[\s\S]*?};/m;
const mockData4Level = `const TREINO_MOCK = {
    grupos: [
        { id: 'g1', nome: 'Membros Superiores', icone_name: '\\uD83D\\uDCAA' },
        { id: 'g2', nome: 'Membros Inferiores', icone_name: '\\uD83E\\uDDB5' },
        { id: 'g3', nome: 'Core', icone_name: '\\uD83C\\uDFAF' },
        { id: 'g4', nome: 'Cardio & Mobilidade', icone_name: '\\uD83C\\uDF3F' }
    ],
    musculos: [
        { id: 'm1', group_id: 'g1', nome: 'Peitoral' },
        { id: 'm2', group_id: 'g1', nome: 'Costas' },
        { id: 'm3', group_id: 'g1', nome: 'Ombros' },
        { id: 'm4', group_id: 'g1', nome: 'Braços' },
        { id: 'm5', group_id: 'g2', nome: 'Quadríceps' },
        { id: 'm6', group_id: 'g2', nome: 'Posteriores' },
        { id: 'm7', group_id: 'g3', nome: 'Abdominais' }
    ],
    areas: [
        // Peitoral
        { id: 'a1', muscle_id: 'm1', nome: 'Peito Superior' },
        { id: 'a2', muscle_id: 'm1', nome: 'Peito Médio' },
        { id: 'a3', muscle_id: 'm1', nome: 'Peito Inferior' },
        // Costas
        { id: 'a4', muscle_id: 'm2', nome: 'Grande Dorsal' },
        { id: 'a5', muscle_id: 'm2', nome: 'Lombar' },
        // Braços
        { id: 'a6', muscle_id: 'm4', nome: 'Bíceps' },
        { id: 'a7', muscle_id: 'm4', nome: 'Tríceps' },
        // Pernas
        { id: 'a8', muscle_id: 'm5', nome: 'Foco Anterior' },
        { id: 'a9', muscle_id: 'm6', nome: 'Foco Posterior e Glúteos' }
    ],
    exercicios: [
        { id: 'e1', area_id: 'a1', nome: 'Flexões Inclinadas (Pés Elevados)', nivel: 'Intermediário', sets_reps: '4x 12', duracao_minutos: 5, thumbnail_url: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=600&auto=format&fit=crop', is_enabled: true },
        { id: 'e2', area_id: 'a1', nome: 'Press Inclinado com Halteres', nivel: 'Avançado', sets_reps: '3x 10', duracao_minutos: 4, thumbnail_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop', is_enabled: true },
        { id: 'e3', area_id: 'a2', nome: 'Flexões Normais', nivel: 'Iniciante', sets_reps: '3x 15', duracao_minutos: 5, thumbnail_url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop', is_enabled: true },
        { id: 'e4', area_id: 'a3', nome: 'Dips / Paralelas', nivel: 'Intermediário', sets_reps: '3x 12', duracao_minutos: 4, thumbnail_url: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=600&auto=format&fit=crop', is_enabled: true },
        { id: 'e5', area_id: 'a4', nome: 'Elevações (Pull-ups)', nivel: 'Intermediário', sets_reps: '4x 8', duracao_minutos: 6, thumbnail_url: 'https://images.unsplash.com/photo-1596356453261-0d268521dd00?q=80&w=600&auto=format&fit=crop', is_enabled: true },
        { id: 'e6', area_id: 'a6', nome: 'Curl com Halteres', nivel: 'Iniciante', sets_reps: '3x 12', duracao_minutos: 4, thumbnail_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop', is_enabled: true }
    ]
};`;
content = content.replace(regexTreinoMock, mockData4Level);

const regexCardCustom = /const ExerciciosCardCustom = \(\{ ex \}\) => \{[\s\S]*?return \([\s\S]*?\);\n        \};/m;
const cardCustom4Level = `const ExerciciosCardCustom = ({ ex, index, onClickImage, onClickBody }) => {
    return (
        <div className="playlist-item" style={{ display: 'flex', gap: '16px', marginBottom: '8px', alignItems: 'stretch' }}>
            <div className="step-badge" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--accent)', color: '#fff', padding: '0 8px', borderRadius: '12px', writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontWeight: '900', fontSize: '14px', letterSpacing: '2px', flexShrink: 0, opacity: 0.9, minHeight: '120px' }}>
                PASSO {index + 1}
            </div>
            <div className="card" style={{ flexGrow: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'var(--bg-secondary)', overflow: 'hidden', cursor: 'pointer' }} onClick={onClickBody}>
                <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); onClickImage(ex); }}>
                    <img src={ex.thumbnail_url || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600'} alt={ex.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.8) 100%)' }}></div>
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                         <span style={{ background: ex.nivel === 'Iniciante' ? '#22c55e' : (ex.nivel === 'Intermediário' ? '#ea580c' : '#ef4444'), color: '#fff', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                            {ex.nivel}
                        </span>
                    </div>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff" stroke="none"><path d="M8 5v14l11-7z"></path></svg>
                    </div>
                </div>
                
                <div>
                    <h3 style={{ fontSize: '17px', fontWeight: '800', lineHeight: 1.3, marginBottom: '8px' }}>{ex.nome}</h3>
                    <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--accent)" strokeWidth="2.5"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            <span style={{fontWeight: '700', color: '#fff'}}>{ex.sets_reps}</span> 
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--accent)" strokeWidth="2.5"><circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round"></circle><path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                            <span style={{fontWeight: '700', color: '#fff'}}>{ex.duracao_minutos} min</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};`;
content = content.replace(regexCardCustom, cardCustom4Level);

const regexState = /const \[selectedMuscle, setSelectedMuscle\] = useState\(null\);/m;
content = content.replace(regexState, "const [selectedMuscle, setSelectedMuscle] = useState(null);\n            const [selectedArea, setSelectedArea] = useState(null);");

const regexTreinoCase = /case 'treinos':[\s\S]*?(?=case 'guardados':)/m;
const treinoCase = `case 'treinos':
    if (!selectedGroup) {
        return (
            <div style={{ animation: 'fade-in 0.4s ease-out' }}>
                <div className="page-header" style={{ marginBottom: '24px' }}>
                    <h1>\\u26A1 Treinos</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Escolha um grupo muscular para começar.</p>
                </div>
                <div className="grid">
                    {TREINO_MOCK.grupos.map(g => (
                        <div key={g.id} className="card" onClick={() => {
                            setSelectedGroup(g);
                            const firstMuscle = TREINO_MOCK.musculos.find(m => m.group_id === g.id);
                            setSelectedMuscle(firstMuscle);
                            if(firstMuscle) {
                                const firstArea = TREINO_MOCK.areas.find(a => a.muscle_id === firstMuscle.id);
                                setSelectedArea(firstArea);
                            } else {
                                setSelectedArea(null);
                            }
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
    const muscleAreas = displayedMuscle ? TREINO_MOCK.areas.filter(a => a.muscle_id === displayedMuscle.id) : [];
    const displayedArea = selectedArea || muscleAreas[0];
    
    // Nível 4: Filtra os exercícios que pertencem à Área atualmente focada.
    const exercisesToDisplay = displayedArea ? TREINO_MOCK.exercicios.filter(e => e.area_id === displayedArea.id && e.is_enabled) : [];

    return (
        <div style={{ animation: 'fade-in 0.4s ease-out' }}>
            {/* Header Nível 1 Voltar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <button onClick={() => { setSelectedGroup(null); setSelectedMuscle(null); setSelectedArea(null); }} style={{ background: 'rgba(255,255,255,0.1)', width: '44px', height: '44px', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', flexShrink: 0 }}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <div>
                    <h1 style={{ fontSize: '24px', margin: 0, fontWeight: '900' }}>{selectedGroup.nome}</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>{displayedMuscle?.nome}</p>
                </div>
            </div>

            {/* Nível 2 - Músculos */}
            <div className="filter-section" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                {groupMuscles.map(m => (
                    <button key={m.id} className={\`pill \${displayedMuscle?.id === m.id ? 'active' : ''}\`} style={{ padding: '8px 18px', fontSize: '14px' }} onClick={() => {
                        setSelectedMuscle(m);
                        const fArea = TREINO_MOCK.areas.find(a => a.muscle_id === m.id);
                        setSelectedArea(fArea);
                    }}>
                        {m.nome}
                    </button>
                ))}
            </div>

            {/* Nível 3 - Áreas Específicas */}
            {muscleAreas.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '16px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {muscleAreas.map(a => (
                        <button key={a.id} onClick={() => setSelectedArea(a)} style={{ 
                            background: displayedArea?.id === a.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                            color: displayedArea?.id === a.id ? '#fff' : 'var(--text-secondary)',
                            border: '1px solid ' + (displayedArea?.id === a.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)'),
                            padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap', transition: 'all 0.2s', cursor: 'pointer'
                        }}>
                            {a.nome}
                        </button>
                    ))}
                </div>
            )}

            {/* Nível 4 - Exercicios da Área */}
            {exercisesToDisplay.length > 0 ? (
                <div className="playlist-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                    {exercisesToDisplay.map((ex, index) => (
                        <ExerciciosCardCustom 
                            key={ex.id} 
                            ex={ex} 
                            index={index} 
                            onClickImage={(exercise) => {
                                // Abre o video (Simulação do Modal setSel se suportado, senão envia info mockada)
                                if(typeof setSel === 'function') setSel(exercise);
                                else alert('Abrindo Video Player: ' + exercise.nome);
                            }}
                            onClickBody={() => {
                                alert('Ecrã de Detalhes do Exercício em Breve!');
                            }}
                        />
                    ))}
                    
                    {/* Botão de Finalizar no final da vertente Playlist */}
                    <button className="ob-submit-btn btn-massive-success" style={{ marginTop: '24px', position: 'relative', overflow: 'hidden' }} onClick={() => alert('Parabéns! +500 XP Ganhos.')}>
                        Concluir Treino (+500 XP)
                    </button>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '40px', marginBottom: '16px' }}>🏗️</div>
                    <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Em construção</h3>
                    <p>Em breve dezenas de exercícios para {displayedArea?.nome}.</p>
                </div>
            )}
        </div>
    );
`;
content = content.replace(regexTreinoCase, treinoCase + "\n\n                    ");

// Add style for btn-massive-success if missing
if(!content.includes('.btn-massive-success')) {
    content = content.replace("</style>", `
        .btn-massive-success {
            background: linear-gradient(135deg, #16a34a, #22c55e);
            color: #fff;
            padding: 18px 24px;
            font-size: 18px;
            font-weight: 800;
            border-radius: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
            border: none;
            cursor: pointer;
            width: 100%;
            transition: all 0.3s;
        }
        .btn-massive-success:active {
            transform: scale(0.98);
        }
    </style>`);
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Update Script 4Level Sucesso');
