const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// 1. Restore states
code = code.replace(/const \[sel, setSel\] = useState\(null\);/, const [sel, setSel] = useState(null);
            const [trackEx, setTrackEx] = useState(null);
            const [restTimer, setRestTimer] = useState(0);
            const [notifOpen, setNotifOpen] = useState(false);
            const [safeVideoModalOpen, setSafeVideoModalOpen] = useState(false);
            const [showBackToTop, setShowBackToTop] = useState(false);
            const [isLoadingExercises, setIsLoadingExercises] = useState(true);
            const [isQuestActive, setIsQuestActive] = React.useState(true);
            const [questSuccess, setQuestSuccess] = React.useState(false);
            const [showXpModal, setShowXpModal] = useState(false);

            const handleScannerUnlock = React.useCallback(() => {
                localStorage.setItem('acessoScannerIA', 'true');
                setTemAcessoNutriScan(true);
            }, []);

            const completeQuest = React.useCallback(() => {
                setQuestSuccess(true);
                setTimeout(() => setIsQuestActive(false), 2000);
            }, []););

// 2. Restore useEffects
code = code.replace(/if \(ud\.session\) fetchAllExercises\(\);\s*\}, \[ud\.session, fetchAllExercises\]\);/, if (ud.session) fetchAllExercises();
            }, [ud.session, fetchAllExercises]);

            React.useEffect(() => {
                if (allExercises.length > 0 && dailyWorkout.length === 0) {
                    generateDailyWorkout();
                }
            }, [allExercises, dailyWorkout.length, generateDailyWorkout]);

            React.useEffect(() => {
                const handleScroll = () => {
                    setShowBackToTop(window.scrollY > 400);
                };
                window.addEventListener('scroll', handleScroll);
                return () => window.removeEventListener('scroll', handleScroll);
            }, []););

// 3. Restore stats and category logic
code = code.replace(/return completedExLogs\.map\(lg => \(allExercises \|\| \[\]\)\.find\(e => e\.id === lg\.id\)\)\.filter\(Boolean\);\s*\}, \[completedExLogs, allExercises\]\);/, eturn completedExLogs.map(lg => (allExercises || []).find(e => e.id === lg.id)).filter(Boolean);
            }, [completedExLogs, allExercises]);

            const totalSetsValue = React.useMemo(() => {
                let total = 0;
                completedExList.forEach(e => {
                    const val = parseInt(e?.sets || '0');
                    if (!isNaN(val)) total += val;
                });
                return total;
            }, [completedExList]);

            const estMinutesValue = totalSetsValue * 1.5;

            const catStats = React.useMemo(() => {
                if (!allExercises || allExercises.length === 0) return [];
                const rawCats = Array.from(new Set(allExercises.map(e => e?.category || 'Outros'))).filter(c => c && c !== 'Ignorado' && c !== 'Outros');
                const ORDEM = ['Pernas', 'Costas', 'Peito', 'Ombros', 'Braços', 'Abdominais', 'Cardio', 'Mobilidade', 'Membros Inferiores', 'Membros Superiores'];
                const activeCategories = rawCats.sort((a, b) => {
                    const ia = ORDEM.indexOf(a);
                    const ib = ORDEM.indexOf(b);
                    if (ia === -1 && ib === -1) return a.localeCompare(b);
                    if (ia === -1) return 1;
                    if (ib === -1) return -1;
                    return ia - ib;
                });
                const counts = {};
                activeCategories.forEach(c => counts[c] = 0);
                completedExList.forEach(e => {
                    if (e?.category && counts[e.category] !== undefined) {
                        counts[e.category]++;
                    }
                });
                const maxCount = Math.max(...Object.values(counts), 1);
                return activeCategories.map(c => ({
                    name: c,
                    done: counts[c] || 0,
                    pct: Math.round(((counts[c] || 0) / maxCount) * 100) || 0
                }));
            }, [completedExList, allExercises]);

            const getCategoryLabel = React.useCallback((title = ) => {
 const t = title.toLowerCase();
 if (t.includes( perna)) return PERNAS;
 if (t.includes(abdom)) return ABDOMINAIS;
 if (t.includes(peito) || t.includes(supino)) return PEITO;
 if (t.includes(costas) || t.includes(remada)) return COSTAS;
 if (t.includes(ombro)) return OMBROS;
 if (t.includes(braço) || t.includes(braco) || t.includes(biceps) || t.includes(triceps)) return BRAÇOS;
 if (t.includes(cardio) || t.includes(corrida) || t.includes(polichinelo)) return CARDIO;
 return EXERCÍCIO;
 }, []););

// 4. Restore daily workout logic
code = code.replace(/return generated;\s*\}, \[allExercises, getBunnyEmbedUrl\]\);/, eturn generated;
 }, [allExercises, getBunnyEmbedUrl]);

 const startDailyWorkout = React.useCallback(() => {
 const queue = dailyWorkout.length ? dailyWorkout : generateDailyWorkout();
 if (!queue || queue.length === 0) return;
 setDailyWorkoutIndex(0);
 setDailyWorkoutOpen(true);
 }, [dailyWorkout, generateDailyWorkout]);

 const concludeDailyWorkout = React.useCallback(async () => {
 try {
 if (window.supabase) {
 const { data: { session } } = await window.supabase.auth.getSession();
 if (session) {
 await window.supabase.from('workout_logs').insert({
 user_id: session.user.id,
 exercise_id: 'full-body-daily',
 weight: 0,
 reps: dailyWorkout.length || 7,
 set_number: 1
 });
 }
 }
 } catch (e) {
 console.error('Erro ao concluir treino full body:', e);
 } finally {
 setDailyWorkoutOpen(false);
 fetchUserStreaks();
 }
 }, [dailyWorkout.length, fetchUserStreaks]););

// 5. Restore handleAccessModule, calculateRecovery, and filtered
code = code.replace(/const isVipUser = temAcessoTotalVIP;\s*const nowForXP = new Date\(\);/, const isVipUser = temAcessoTotalVIP; 

 const handleAccessModule = React.useCallback((moduleId) => {
 if (moduleId === 'scanner_ia') {
 setPage('nutricao');
 return;
 }
 if (moduleId === 'desafio30') {
 setPage('cronograma');
 return;
 }
 setModFilter(moduleId);
 if (moduleId === 'senior') setCat('Idosos');
 else if (moduleId === 'pilates') setCat('Pilates');
 else if (moduleId === 'gymnastics') setCat('Ginástica');
 else setCat('Todos');
 setDiff('Todos');
 setSearch('');
 setPage('treinos');
 }, []);

 const calculateRecovery = React.useCallback(() => {
 const logs = ud.completedLog || [];
 const exercises = allExercises || [];
 const RECOVERY_WINDOW = 48 * 60 * 60 * 1000;
 const groups = {
 superior: [Membros Superiores, Braços],
 inferior: [Membros Inferiores],
 core: [Core]
 };
 const getStatus = (groupNames) => {
 const groupExIds = exercises.filter(ex => groupNames.includes(ex.category)).map(ex => ex.id);
 const groupLogs = logs.filter(l => groupExIds.includes(l.id));
 if (groupLogs.length === 0) return 100;
 const lastTs = Math.max(...groupLogs.map(l => l.ts || 0));
 if (!lastTs) return 100;
 const elapsed = Date.now() - lastTs;
 if (elapsed >= RECOVERY_WINDOW) return 100;
 return Math.max(5, Math.floor((elapsed / RECOVERY_WINDOW) * 100));
 };
 return { superior: getStatus(groups.superior), inferior: getStatus(groups.inferior), core: getStatus(groups.core) };
 }, [ud.completedLog, allExercises]);

 const recovery = calculateRecovery();

 if (ud.authLoading) {
 return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: '#f97316', fontWeight: 'bold', fontSize: '1.2rem' }}>A preparar a Arena...</div>;
 }

 if (!ud.session) {
 return <AuthModal />;
 }

 if (!ud.userProfile) {
 return <Onboarding onComplete={ud.saveProfile} />;
 }

 const getMotivationalPhrase = (goal) => {
 switch (goal) {
 case 'Perder Peso': return 'A consistência derrete qualquer obstáculo. Vamos suar?';
 case 'Ganhar Massa': return 'Construir o corpo peça a peça. Hora de desafiar os músculos.';
 case 'Tonificar e Definir': return 'A escultura revela-se na repetição. Foco nos detalhes.';
 case 'Saúde e Mobilidade': return 'O corpo livre é um corpo forte. Vamos destrancar o seu potencial.';
 default: return 'O treino de hoje constrói o corpo de amanhã.';
 }
 };

 const today = new Date();
 const filtered = allExercises.filter(ex => {
 const exMod = ex.moduleId || 'base';
 const hasModuleAccess = isVipUser || ud.userProfile?.permissions?.[exMod];
 if (ex.premium && !hasModuleAccess) return false;
 if (page === 'explorar' && modFilter !== 'all' && exMod !== modFilter) return false;
 if (cat !== 'Todos' && ex.category !== cat) return false;
 if (diff !== 'Todos' && ex.difficulty !== diff) return false;
 if (search.trim()) {
 const q = search.toLowerCase();
 if (!ex.title.toLowerCase().includes(q) && !ex.category.toLowerCase().includes(q)) return false;
 }
 return true;
 });

 const nowForXP = new Date(););

fs.writeFileSync('index.html', code);
console.log('Restoration applied successfully.');
