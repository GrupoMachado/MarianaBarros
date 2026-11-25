import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { createClient } from '@supabase/supabase-js';



        

        const Clock = ({ size = 16, className = "" }) => (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
        );
        const Flame = ({ size = 16, className = "" }) => (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
        );
        const Dumbbell = ({ size = 16, className = "" }) => (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="m6.5 6.5-2.5 2.5" /><path d="m15 15 2.5 2.5" /><path d="m21 16-5-5" /><path d="m3 8 5 5" /><path d="m18 8 2 2a2 2 0 0 1 0 2.82l-2 2" /><path d="m6 16-2-2a2 2 0 0 1 0-2.82l2-2" /><path d="m8 13 3-3" /><path d="m14 10 3 3" />
            </svg>
        );
        const Zap = ({ size = 16, className = "" }) => (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        );

        const safeFormatDate = (date) => {
            try {
                if (!date) return "";
                const d = new Date(date);
                if (isNaN(d.getTime())) return "";
                return new Intl.DateTimeFormat('sv-SE').format(d);
            } catch (e) {
                return "";
            }
        };

        const safeOpenExternal = (url) => {
            if (!url || typeof url !== 'string') return;
            window.open(url, '_blank', 'noopener,noreferrer');
        };

        const trackConversionEvent = (eventName, { placement = null, product = null, metadata = {} } = {}) => {
            try {
                const sb = window.supabase;
                if (!sb || !eventName) return;
                sb.auth.getSession().then(({ data }) => {
                    const uid = data?.session?.user?.id;
                    if (!uid) return;
                    sb.from('app_conversion_events').insert({
                        user_id: uid,
                        app: 'br',
                        event_name: eventName,
                        placement,
                        product,
                        metadata
                    }).then(() => {}, () => {});
                }).catch(() => {});
            } catch {}
        };

        const openHotmartCheckout = (baseUrl, { placement = 'app_br', product = 'unknown', ud = null } = {}) => {
            if (!baseUrl || typeof baseUrl !== 'string') return;
            trackConversionEvent('checkout_click', { placement, product });
            let finalUrl = baseUrl;
            try {
                const parsed = new URL(baseUrl);
                const email = ud?.session?.user?.email || ud?.userProfile?.email || '';
                const name = ud?.userProfile?.name || '';
                const phone = (ud?.userProfile?.whatsapp || '').replace(/\D/g, '');
                if (email && !parsed.searchParams.has('email')) parsed.searchParams.set('email', email.trim().toLowerCase());
                if (name && !parsed.searchParams.has('name')) parsed.searchParams.set('name', name.trim());
                if (phone && phone.length >= 10 && !parsed.searchParams.has('phonenumber')) parsed.searchParams.set('phonenumber', phone);
                parsed.searchParams.set('src', `app_br_${placement}`);
                finalUrl = parsed.toString();
            } catch {}
            safeOpenExternal(finalUrl);
        };

        const isSafeImageUrl = (url) => {
            if (!url || typeof url !== 'string') return false;
            return /^https:\/\//i.test(url.trim()) || /^\.?\//.test(url.trim());
        };

        // Fonte única de verdade para entitlements (normaliza slugs do webhook Hotmart + promo_codes + perfil)
        const resolveEntitlements = (profile) => {
            const set = new Set();
            if (Array.isArray(profile?.premium_features)) {
                profile.premium_features.forEach(m => { if (m) set.add(String(m).toLowerCase()); });
            }
            if (profile?.permissions && typeof profile.permissions === 'object') {
                Object.entries(profile.permissions).forEach(([k, v]) => {
                    if (v) set.add(String(k).toLowerCase());
                });
            }
            const hasTotalVip = Boolean(profile?.is_vip) || set.has('total_vip');
            const hasGold = Boolean(profile?.acesso_combo_ouro) || set.has('vip_gold') || set.has('gold') || hasTotalVip;
            const hasScannerIA = Boolean(profile?.assinatura_scanner_ia_ativa) || set.has('scanner_ia') || set.has('pacote_elite') || set.has('arsenal_premium') || set.has('assinatura_scanner_ia_ativa') || hasGold || hasTotalVip;
            const hasDesafio = set.has('desafio30') || set.has('desafio_30') || hasGold || hasTotalVip;
            const hasSono = set.has('sono') || hasGold || hasTotalVip;
            const hasComunidade = set.has('comunidade_vip') || set.has('comunidade') || set.has('pacote_elite') || set.has('vip') || hasTotalVip;
            const hasMusculacao = set.has('musculacao') || hasGold || hasTotalVip;
            const hasSenior = set.has('senior') || set.has('recuperacao_ativa') || hasGold || hasTotalVip;
            const hasPilates = set.has('pilates') || hasGold || hasTotalVip;
            const hasGymnastics = set.has('gymnastics') || set.has('mini_bands') || hasGold || hasTotalVip;

            return {
                hasTotalVip,
                hasGold,
                hasScannerIA,
                hasDesafio,
                hasSono,
                hasComunidade,
                hasMusculacao,
                hasSenior,
                hasPilates,
                hasGymnastics
            };
        };


        const CATEGORIES = ['Todos', 'Membros Inferiores', 'Membros Superiores', 'Braços', 'Cardio', 'Mobilidade'];
        const DIFFICULTIES = ['Todos', 'Iniciante', 'Intermediário', 'Avançado'];
        const NUTRISCAN_FREE_LIMIT = 2;

        const NAV = [
            { id: 'inicio', label: 'Início', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
            { id: 'treinos', label: 'Treinos', d: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
            { id: 'arsenal-vip', label: 'Nutri IA', d: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
            { id: 'evolucao', label: 'Evolução', d: 'M23 6l-9.5 9.5-5-5L1 18' },
            { id: 'ranking', label: 'Ranking', d: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
            { id: 'extras', label: 'Planos', d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
            { id: 'ajuda', label: 'Ajuda', d: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
        ];

        // 5 abas espaçosas no mobile (Ranking e Ajuda acessíveis pelo topo do Início + menu)
        const MOBILE_NAV = NAV.filter(n => ['inicio', 'treinos', 'arsenal-vip', 'evolucao', 'extras'].includes(n.id));

        const EXERCISES = window.EXERCISES || [];

        const { SUPABASE_URL, SUPABASE_KEY } = window.APP_CONFIG || {};
        if (!SUPABASE_URL || !SUPABASE_KEY) {
            throw new Error('Config Supabase em falta: verifique o arquivo config.js');
        }
        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        window.supabase = supabase;

        function AuthModal() {
            const [authMode, setAuthMode] = useState(() => {
                try { return localStorage.getItem('has_logged_in_before') === '1' ? 'login' : 'register'; } catch { return 'register'; }
            }); // login | register | recovery
            const [email, setEmail] = useState('');
            const [password, setPassword] = useState('');
            const [showPassword, setShowPassword] = useState(false);
            const [error, setError] = useState('');
            const [successMsg, setSuccessMsg] = useState('');
            const [loading, setLoading] = useState(false);

            const switchMode = (nextMode) => {
                setAuthMode(nextMode);
                setError('');
                setSuccessMsg('');
            };

            const handleSubmit = async (e) => {
                e.preventDefault();
                setError('');
                setSuccessMsg('');

                const cleanEmail = email.trim().toLowerCase();
                if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
                    return setError('Digite um e-mail válido.');
                }
                if (authMode !== 'recovery' && !password) {
                    return setError('Por favor, digite sua senha.');
                }
                if (authMode !== 'recovery' && password.length < 6) {
                    return setError('A senha deve ter pelo menos 6 caracteres.');
                }

                setLoading(true);
                try {
                    let res;
                    if (authMode === "recovery") {
                        res = await supabase.auth.resetPasswordForEmail(cleanEmail, { redirectTo: window.location.origin });
                        if (!res.error) {
                            setSuccessMsg('✅ Link enviado! Verifique sua caixa de entrada (e o spam).');
                            setLoading(false);
                            return;
                        }
                    } else if (authMode === "login") {
                        res = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
                        if (!res.error) {
                            try { localStorage.setItem('has_logged_in_before', '1'); } catch {}
                        }
                    } else {
                        res = await supabase.auth.signUp({ email: cleanEmail, password });
                        if (!res.error && res.data?.user) {
                            try {
                                localStorage.setItem('has_logged_in_before', '1');
                                ['userProfile', 'completedLog', 'favoritedIds', 'challengeLog', 'xpBonus', 'metaProfile', 'lastEvolucao'].forEach(k => localStorage.removeItem(k));
                            } catch {}
                        }
                    }

                    if (res?.error) {
                        const raw = res.error.message || '';
                        let msg = raw;
                        if (raw.includes('Invalid login credentials')) msg = 'E-mail ou senha incorretos. Confira seus dados ou clique em "Esqueci minha senha".';
                        else if (raw.includes('User already registered')) msg = 'Este e-mail já está cadastrado. Toque em "Entrar" acima para acessar sua conta.';
                        else if (raw.includes('Email not confirmed')) msg = 'Confirme seu e-mail clicando no link que enviamos na sua caixa de entrada.';
                        else if (raw.includes('rate limit')) msg = 'Muitas tentativas seguidas. Aguarde um minuto e tente novamente.';
                        setError(msg);
                    } else if (authMode === "register" && !res?.data?.session) {
                        setSuccessMsg('✅ Conta criada! Verifique sua caixa de entrada para confirmar seu e-mail e liberar o acesso.');
                    }
                } catch (err) {
                    setError('Erro de conexão. Verifique sua internet e tente novamente.');
                } finally {
                    setLoading(false);
                }
            };

            return (
                <div className="auth-overlay" style={{ overflowY: 'auto', padding: '20px 16px' }}>
                    <div className="auth-card">
                        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,107,74,0.14)', border: '1px solid rgba(255,107,74,0.32)', color: '#ffa28a', fontSize: '10.5px', fontWeight: '900', padding: '4px 12px', borderRadius: '99px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                ✨ Academia Mariana Barros · ★ 4,9 · +6.000 alunas
                            </span>
                        </div>

                        {authMode !== 'recovery' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '14px', marginBottom: '18px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <button
                                    type="button"
                                    onClick={() => switchMode('register')}
                                    style={{
                                        padding: '10px',
                                        borderRadius: '10px',
                                        fontWeight: '800',
                                        fontSize: '13px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        background: authMode === 'register' ? 'var(--accent)' : 'transparent',
                                        color: authMode === 'register' ? '#fff' : 'rgba(255,255,255,0.65)',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Criar Conta
                                </button>
                                <button
                                    type="button"
                                    onClick={() => switchMode('login')}
                                    style={{
                                        padding: '10px',
                                        borderRadius: '10px',
                                        fontWeight: '800',
                                        fontSize: '13px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        background: authMode === 'login' ? 'var(--accent)' : 'transparent',
                                        color: authMode === 'login' ? '#fff' : 'rgba(255,255,255,0.65)',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Já tenho Conta
                                </button>
                            </div>
                        )}

                        <h2>{authMode === 'login' ? 'Bem-vinda de volta!' : authMode === 'register' ? 'Comece seu plano em casa' : 'Recuperar Senha'}</h2>
                        <div className="auth-header-desc">
                            {authMode === "recovery"
                                ? "Digite o mesmo e-mail usado na compra para receber o link de nova senha."
                                : authMode === "register"
                                ? "Crie seu acesso em 10 segundos (use o mesmo e-mail da Hotmart para liberar seus bônus)."
                                : "Entre com seu e-mail e senha para acessar seus treinos, evolução e Nutri-Scan IA."}
                        </div>

                        {authMode === 'register' && (
                            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.28)', borderRadius: '14px', padding: '10px 12px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px', color: '#e2dae9', fontWeight: '600' }}>
                                <div><span style={{ color: '#34d399', fontWeight: '900' }}>✓</span> +500 exercícios em vídeo com elástico em casa</div>
                                <div><span style={{ color: '#34d399', fontWeight: '900' }}>✓</span> 1º treino rápido de 12 min montado pro seu objetivo</div>
                                <div><span style={{ color: '#34d399', fontWeight: '900' }}>✓</span> <strong>2 fotos grátis</strong> no Nutri-Scan IA (calorias em 3s)</div>
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>E-mail</label>
                                <input
                                    type="email"
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    autoComplete="email"
                                    className="ob-input"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    disabled={loading}
                                    placeholder="seuemail@gmail.com"
                                />
                            </div>
                            {authMode !== 'recovery' && (
                                <div className="input-group">
                                    <label>Senha</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                                            className="ob-input"
                                            style={{ paddingRight: '46px' }}
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            disabled={loading}
                                            placeholder="Mínimo 6 caracteres"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(v => !v)}
                                            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.65)', cursor: 'pointer', fontSize: '16px', padding: '4px 6px' }}
                                        >
                                            {showPassword ? '🙈' : '👁️'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {error && <div className="auth-error" style={{ color: '#f87171', marginBottom: '10px' }}>{error}</div>}
                            {successMsg && (
                                <div style={{ background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(16,185,129,0.35)', color: '#6ee7b7', padding: '10px 12px', borderRadius: '10px', fontSize: '12.5px', fontWeight: '700', marginBottom: '12px', textAlign: 'center' }}>
                                    {successMsg}
                                </div>
                            )}

                            <button type="submit" className="ob-submit-btn" disabled={loading}>
                                {loading ? "Carregando..." : (authMode === "login" ? "Entrar no Aplicativo" : authMode === "register" ? "Criar Minha Conta" : "Enviar Link de Recuperação")}
                            </button>
                        </form>

                        {authMode !== 'recovery' ? (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', gap: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => switchMode('recovery')}
                                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '12px', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                                >
                                    Esqueci minha senha
                                </button>
                                <button
                                    type="button"
                                    onClick={() => switchMode(authMode === 'login' ? 'register' : 'login')}
                                    style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '12px', fontWeight: '800', cursor: 'pointer', padding: 0 }}
                                >
                                    {authMode === 'login' ? 'Primeiro acesso? Criar conta' : 'Já tenho conta → Entrar'}
                                </button>
                            </div>
                        ) : (
                            <div className="auth-toggle" onClick={() => switchMode('login')}>
                                ← Voltar para <span>Entrar</span>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        function useUserData() {
            const [session, setSession] = useState(null);
            const [authLoading, setAuthLoading] = useState(true);
            const [localSynced, setLocalSynced] = useState(false);
            const [recoveryMode, setRecoveryMode] = useState(false);

            const [completedLog, setC] = useState(() => {
                try {
                    const legacy = JSON.parse(localStorage.getItem('completedIds') || 'null');
                    const stored = JSON.parse(localStorage.getItem('completedLog') || 'null');
                    if (Array.isArray(stored)) return stored;
                    if (legacy && Array.isArray(legacy)) {
                        const now = Date.now();
                        return legacy.map(id => ({ id: typeof id === 'string' ? id : id.id, ts: now }));
                    }
                    return [];
                } catch { return []; }
            });
            const [favoritedIds, setF] = useState(() => { try { const parsed = JSON.parse(localStorage.getItem('favoritedIds') || '[]'); return Array.isArray(parsed) ? parsed : []; } catch { return []; } });
            const [userProfile, setP] = useState(() => {
                try {
                    const stored = JSON.parse(localStorage.getItem('userProfile') || 'null');
                    return stored && typeof stored === 'object' ? stored : null;
                } catch { return null; }
            });
            const [challengeLog, setChallengeLog] = useState(() => { try { const parsed = JSON.parse(localStorage.getItem('challengeLog') || '[]'); return Array.isArray(parsed) ? parsed : []; } catch { return []; } });
            const [xpBonus, setXp] = useState(() => { try { return parseInt(localStorage.getItem('xpBonus'), 10) || 0; } catch { return 0; } });
            const [metaProfile, setMeta] = useState(() => { try { return JSON.parse(localStorage.getItem('metaProfile') || 'null'); } catch { return null; } });

            // Server-synced Nutri-Scan trial quota (source of truth: ai_usage_logs via analyze-meal)
            const [nutriQuota, setNutriQuota] = useState({
                hasNutriScan: false,
                freeScansUsed: 0,
                freeScansRemaining: NUTRISCAN_FREE_LIMIT,
                loaded: false
            });

            const refreshNutriQuota = useCallback(async (activeSession = session) => {
                if (!activeSession) return;
                try {
                    const { data, error } = await supabase.functions.invoke('analyze-meal', {
                        body: { action: 'status' }
                    });
                    if (!error && data) {
                        setNutriQuota({
                            hasNutriScan: Boolean(data.hasNutriScan),
                            freeScansUsed: Number(data.freeScansUsed) || 0,
                            freeScansRemaining: typeof data.freeScansRemaining === 'number' ? data.freeScansRemaining : NUTRISCAN_FREE_LIMIT,
                            loaded: true
                        });
                    }
                } catch (err) {
                    console.warn('Falha ao consultar cota Nutri-Scan:', err);
                }
            }, [session]);

            const syncToSupa = useCallback(async (updates) => {
                if (!session) return { error: null };
                const { error } = await supabase.from('user_profiles').update(updates).eq('id', session.user.id);
                if (error) console.error('Erro ao sincronizar user_profiles:', error);
                return { error };
            }, [session]);

            const hydrateFromSupabase = useCallback(async (activeSession) => {
                if (!activeSession) return;
                try {
                    const [{ data, error }, favsRes, comprasRes] = await Promise.all([
                        supabase.from('user_profiles').select('*').eq('id', activeSession.user.id).maybeSingle(),
                        supabase.from('treinos_guardados').select('id_do_treino').eq('user_id', activeSession.user.id),
                        supabase.from('compras_utilizadores').select('modulo_comprado, status').eq('user_id', activeSession.user.id)
                    ]);

                    if (favsRes.data) {
                        setF(favsRes.data.map(row => row.id_do_treino));
                    }

                    const activeModules = Array.isArray(comprasRes.data)
                        ? comprasRes.data.filter(c => !c.status || c.status === 'active').map(c => c.modulo_comprado)
                        : [];

                    if (data) {
                        if (Array.isArray(data.completed_log)) setC(data.completed_log);
                        if (Array.isArray(data.challenge_log)) setChallengeLog(data.challenge_log);
                        if (typeof data.xp_bonus === 'number') setXp(data.xp_bonus);

                        const mergedPermissions = {};
                        (Array.isArray(data.premium_features) ? data.premium_features : []).forEach(m => { if (m) mergedPermissions[m] = true; });
                        activeModules.forEach(m => { if (m) mergedPermissions[m] = true; });

                        setP({
                            ...data,
                            age: data.idade ?? data.age ?? null,
                            goal: data.goal || data.objetivo_principal || '',
                            permissions: mergedPermissions
                        });

                        if (data.idade || data.objetivo_principal || data.peso_objetivo || data.daily_calorie_goal) {
                            const mp = {
                                idade: data.idade,
                                objetivo_principal: data.objetivo_principal,
                                peso_objetivo: data.peso_objetivo,
                                daily_calorie_goal: data.daily_calorie_goal
                            };
                            setMeta(mp);
                            try { localStorage.setItem('metaProfile', JSON.stringify(mp)); } catch {}
                        }
                    } else if (!error || error.code === 'PGRST116') {
                        // Aguarda trigger criar user_profiles ou cria perfil mínimo sem entitlements
                        setP(prev => prev && prev.id === activeSession.user.id ? prev : {
                            id: activeSession.user.id,
                            email: activeSession.user.email,
                            permissions: {}
                        });
                    }
                    setLocalSynced(true);
                    refreshNutriQuota(activeSession);
                } catch (err) {
                    console.error('Erro ao carregar dados do Supabase:', err);
                    setLocalSynced(true);
                }
            }, [refreshNutriQuota]);

            // Supabase Session Mgt
            useEffect(() => {
                supabase.auth.getSession().then(({ data: { session: s } }) => {
                    setSession(s);
                    setAuthLoading(false);
                });

                const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
                    if (event === 'INITIAL_SESSION') return;
                    if (event === 'PASSWORD_RECOVERY') setRecoveryMode(true);
                    setSession(s);
                    setAuthLoading(false);

                    if (event === 'SIGNED_OUT' || (event === 'SIGNED_IN' && !s)) {
                        setP(null);
                        setC([]);
                        setF([]);
                        setChallengeLog([]);
                        setXp(0);
                        setMeta(null);
                        setNutriQuota({ hasNutriScan: false, freeScansUsed: 0, freeScansRemaining: NUTRISCAN_FREE_LIMIT, loaded: false });
                        try { localStorage.clear(); } catch {}
                        setLocalSynced(false);
                    } else if (event === 'SIGNED_IN' && s) {
                        setLocalSynced(false);
                    }
                });
                return () => subscription.unsubscribe();
            }, []);

            // Sync from DB once per session
            useEffect(() => {
                if (session && !localSynced) {
                    hydrateFromSupabase(session);
                } else if (!session) {
                    setLocalSynced(false);
                }
            }, [session, localSynced, hydrateFromSupabase]);

            // Mirror state to localStorage safely (zero automatic Supabase cascades on load)
            useEffect(() => { try { localStorage.setItem('completedLog', JSON.stringify(completedLog)); } catch {} }, [completedLog]);
            useEffect(() => { try { localStorage.setItem('favoritedIds', JSON.stringify(favoritedIds)); } catch {} }, [favoritedIds]);
            useEffect(() => { if (userProfile) { try { localStorage.setItem('userProfile', JSON.stringify(userProfile)); } catch {} } }, [userProfile]);
            useEffect(() => { try { localStorage.setItem('challengeLog', JSON.stringify(challengeLog)); } catch {} }, [challengeLog]);
            useEffect(() => { try { localStorage.setItem('xpBonus', String(xpBonus)); } catch {} }, [xpBonus]);

            const logout = useCallback(async () => {
                await supabase.auth.signOut();
            }, []);

            const isCompleted = useCallback(id => completedLog.some(x => x.id === id), [completedLog]);

            const toggleComplete = useCallback(id => {
                let added = false;
                setC(prev => {
                    const exists = prev.some(x => x.id === id);
                    const next = exists ? prev.filter(x => x.id !== id) : [...prev, { id, ts: Date.now() }];
                    added = !exists;
                    if (prev.length === 0 && !exists) {
                        trackConversionEvent('first_workout_completed', { placement: 'single_exercise', metadata: { exerciseId: id } });
                    }
                    syncToSupa({ completed_log: next });
                    return next;
                });
                return added;
            }, [syncToSupa]);

            const completeWorkout = useCallback((exerciseIds) => {
                setC(prev => {
                    const next = [...prev];
                    let changed = false;
                    (exerciseIds || []).forEach(id => {
                        if (!next.some(x => x.id === id)) {
                            next.push({ id, ts: Date.now() });
                            changed = true;
                        }
                    });
                    if (prev.length === 0 && changed) {
                        trackConversionEvent('first_workout_completed', { placement: 'daily_workout', metadata: { count: (exerciseIds || []).length } });
                    }
                    if (changed) syncToSupa({ completed_log: next });
                    return changed ? next : prev;
                });
                setXp(prevXp => {
                    const nextXp = prevXp + 500;
                    syncToSupa({ xp_bonus: nextXp });
                    return nextXp;
                });
                window.dispatchEvent(new CustomEvent('triggerNutriScanUpsell'));
            }, [syncToSupa]);

            const completeChallengeDay = useCallback((day) => {
                setChallengeLog(prev => {
                    if (prev.includes(day)) return prev;
                    const next = [...prev, day];
                    syncToSupa({ challenge_log: next });
                    return next;
                });
                setXp(prevXp => {
                    const nextXp = prevXp + 1000;
                    syncToSupa({ xp_bonus: nextXp });
                    return nextXp;
                });
                window.dispatchEvent(new CustomEvent('triggerNutriScanUpsell'));
            }, [syncToSupa]);

            const toggleFavorite = useCallback(async (id) => {
                const isFav = favoritedIds.includes(id);
                setF(p => isFav ? p.filter(x => x !== id) : [...p, id]);

                if (session) {
                    const { error } = isFav
                        ? await supabase.from('treinos_guardados').delete().match({ user_id: session.user.id, id_do_treino: id })
                        : await supabase.from('treinos_guardados').insert({ user_id: session.user.id, id_do_treino: id });
                    if (error) console.error('Erro ao atualizar favorito:', error);
                }

                return !isFav;
            }, [favoritedIds, session]);

            const saveProfile = useCallback(async (name, goal, gender, age, estado, whatsapp) => {
                const parsedAge = age ? parseInt(age, 10) : null;
                setP(prev => ({
                    ...(prev || {}),
                    id: session?.user?.id || prev?.id,
                    name,
                    goal,
                    objetivo_principal: goal,
                    gender,
                    age: parsedAge,
                    idade: parsedAge,
                    estado,
                    whatsapp
                }));
                if (session) {
                    const { error } = await supabase.from('user_profiles').upsert({
                        id: session.user.id,
                        name,
                        goal,
                        objetivo_principal: goal,
                        gender,
                        idade: parsedAge,
                        estado,
                        whatsapp
                    }, { onConflict: 'id' });
                    if (error) {
                        console.error('Erro ao salvar perfil:', error);
                        return { error };
                    }
                }
                return { error: null };
            }, [session]);

            const redeemPromoCode = useCallback(async (rawCode) => {
                if (!session) return { ok: false, error: 'Faça login para ativar seu código.' };
                const { data, error } = await supabase.functions.invoke('redeem-code', {
                    body: { code: rawCode }
                });
                if (error) {
                    let msg = 'Código inválido ou expirado. Verifique o e-mail da Hotmart.';
                    try {
                        if (error.context) {
                            const body = await error.context.json();
                            if (body?.error) msg = body.error;
                        }
                    } catch {}
                    return { ok: false, error: msg };
                }
                if (!data?.success) {
                    return { ok: false, error: data?.error || 'Código inválido ou expirado.' };
                }
                await hydrateFromSupabase(session);
                return { ok: true, data };
            }, [session, hydrateFromSupabase]);

            const saveMetaProfile = useCallback(async ({ idade, objetivo_principal, peso_objetivo }) => {
                const mp = { idade, objetivo_principal, peso_objetivo };
                setMeta(mp);
                try { localStorage.setItem('metaProfile', JSON.stringify(mp)); } catch {}
                if (session) {
                    const { error } = await supabase.from('user_profiles').update({ idade, objetivo_principal, peso_objetivo }).eq('id', session.user.id);
                    if (error) console.error('Erro ao salvar perfil metabólico:', error);
                }
            }, [session]);

            // --- Audio Logic for Sleep Module (with proper cleanup) ---
            const [currentAudioId, setCurrentAudioId] = React.useState(null);
            const audioTimerRef = React.useRef(null);
            const audioRef = React.useRef(null);

            const stopAudio = React.useCallback(() => {
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current = null;
                }
                if (audioTimerRef.current) {
                    clearTimeout(audioTimerRef.current);
                    audioTimerRef.current = null;
                }
                setCurrentAudioId(null);
            }, []);

            const playAudio = React.useCallback((id, file, durationMs = null) => {
                stopAudio();
                const audio = new Audio(file);
                audio.loop = true;
                audio.play().catch(e => console.error("Audio play error:", e));
                audioRef.current = audio;
                setCurrentAudioId(id);

                if (durationMs) {
                    audioTimerRef.current = setTimeout(() => {
                        stopAudio();
                    }, durationMs);
                }
            }, [stopAudio]);

            useEffect(() => {
                return () => stopAudio();
            }, [stopAudio]);

            return React.useMemo(() => ({
                recoveryMode, setRecoveryMode,
                session, authLoading, localSynced, logout,
                completedLog, favoritedIds, userProfile, challengeLog, xpBonus,
                metaProfile, saveMetaProfile,
                nutriQuota, setNutriQuota, refreshNutriQuota,
                isCompleted, toggleComplete, completeWorkout, completeChallengeDay,
                toggleFavorite, saveProfile, redeemPromoCode,
                currentAudioId, playAudio, stopAudio
            }), [session, authLoading, localSynced, recoveryMode, logout, completedLog, favoritedIds, userProfile, challengeLog, xpBonus, metaProfile, saveMetaProfile, nutriQuota, refreshNutriQuota, isCompleted, toggleComplete, completeWorkout, completeChallengeDay, toggleFavorite, saveProfile, redeemPromoCode, currentAudioId, playAudio, stopAudio]);
        }



        // ================================================================
        // RADAR CHART (SVG nativo polar / spider chart hexagonal)
        // ================================================================
        function RadarChart({ catStats = [] }) {
            const size = 260; // Increased to provide room for labels
            const cx = size / 2;
            const cy = size / 2;
            const r = 85; 
            const n = catStats?.length || 0;
            
            if (n === 0) {
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', color: 'var(--text-muted)', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '20px' }}>
                        <span style={{ fontSize: '24px', marginBottom: '8px' }}>🕸️</span>
                        <p style={{ fontSize: '11px', textAlign: 'center' }}>Faça o seu primeiro treino para ver o seu Radar de Simetria em ação!</p>
                    </div>
                );
            }

            const angleSlice = (Math.PI * 2) / n;
            const axes = catStats.map((cs, i) => {
                const angle = angleSlice * i - Math.PI / 2;
                return { ...cs, angle };
            });

            const getPolygon = (scale) => axes.map(a => {
                const x = cx + r * scale * Math.cos(a.angle);
                const y = cy + r * scale * Math.sin(a.angle);
                return `${x},${y}`;
            }).join(' ');

            const dataPolygon = axes.map(a => {
                const scale = (a.pct / 100) || 0;
                return `${cx + r * scale * Math.cos(a.angle)},${cy + r * scale * Math.sin(a.angle)}`;
            }).join(' ');

            const LABELS = {
                'Membros Inferiores': 'Pernas', 
                'Membros Superiores': 'Costas',
                'Braços': 'Braços', 
                'Core': 'Core', 
                'Cardio': 'Cardio', 
                'Mobilidade': 'Mobilidade',
                'Peito': 'Peito', 
                'Ombros': 'Ombros', 
                'Abdominais': 'Abdominais',
                'Pernas': 'Pernas',
                'Costas': 'Costas'
            };

            return (
                <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto" style={{ maxWidth: '280px', display: 'block', margin: '0 auto' }}>
                    {[0.2, 0.4, 0.6, 0.8, 1.0].map((lv, i) => (
                        <polygon key={i} points={getPolygon(lv)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={i === 4 ? 1.5 : 1} />
                    ))}
                    {axes.map((a, i) => (
                        <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(a.angle)} y2={cy + r * Math.sin(a.angle)} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    ))}
                    <polygon points={dataPolygon} fill="rgba(255, 107, 74,0.25)" stroke="#ff6b4a" strokeWidth="2" strokeLinejoin="round" />
                    {axes.map((a, i) => {
                        const scale = (a.pct / 100) || 0;
                        return <circle key={i} cx={cx + r * scale * Math.cos(a.angle)} cy={cy + r * scale * Math.sin(a.angle)} r="3.5" fill="#ff6b4a" />;
                    })}
                    {axes.map((a, i) => {
                        const labelR = r + 28; // Slightly more distance for safety
                        return (
                            <text key={i} x={cx + labelR * Math.cos(a.angle)} y={cy + labelR * Math.sin(a.angle)}
                                textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="rgba(255,255,255,0.8)" fontWeight="800">
                                {(LABELS[a.name] || a.name || '').toUpperCase()}
                            </text>
                        );
                    })}
                    <circle cx={cx} cy={cy} r="2" fill="rgba(255,255,255,0.3)" />
                </svg>
            );
        }

        // ================================================================
        // METABOLISM CARD — Combustível de Crescimento (Mifflin-St Jeor)
        // ================================================================
        function MetabolismCard({ metaProfile, saveMetaProfile, completedExList }) {
            const [showForm, setShowForm] = React.useState(!metaProfile?.objetivo_principal);
            const [saving, setSaving] = React.useState(false);
            const [form, setForm] = React.useState({
                objetivo_principal: metaProfile?.objetivo_principal || '',
                peso_objetivo: metaProfile?.peso_objetivo || '',
                idade: metaProfile?.idade || ''
            });

            const evolData = (() => { try { return JSON.parse(localStorage.getItem('lastEvolucao') || 'null'); } catch { return null; } })();
            const mp = metaProfile;
            const hasProfile = mp?.objetivo_principal && mp?.idade;

            let totalSets = 0;
            completedExList.forEach(e => { const v = parseInt(e.sets); if (!isNaN(v)) totalSets += v; });
            const kcalBurned = Math.round(totalSets * 1.5 * 8);

            let targetKcal = null;
            if (hasProfile && evolData?.peso && evolData?.altura_cm) {
                const generoRaw = String(evolData.genero || 'masculino').toLowerCase();
                const isMale = generoRaw === 'm' || generoRaw === 'masculino' || generoRaw === 'male';
                const peso = parseFloat(evolData.peso);
                const altura = parseFloat(evolData.altura_cm);
                const idade = parseInt(mp.idade, 10);
                const bmr = isMale
                    ? (10 * peso) + (6.25 * altura) - (5 * idade) + 5
                    : (10 * peso) + (6.25 * altura) - (5 * idade) - 161;
                const tdee = bmr * 1.55;
                targetKcal = Math.round(tdee + (mp.objetivo_principal === 'Ganhar Massa' ? 500 : mp.objetivo_principal === 'Perder Peso' ? -500 : 0));
            }

            const goalIcon = { 'Ganhar Massa': '🚀', 'Perder Peso': '🔥', 'Manter': '⚖️' }[mp?.objetivo_principal] || '🎯';
            const kcalPct = targetKcal ? Math.min(100, Math.round((kcalBurned / targetKcal) * 100)) : 0;

            const handleSave = React.useCallback(async () => {
                if (!form.objetivo_principal || !form.idade) return;
                setSaving(true);
                await saveMetaProfile({ objetivo_principal: form.objetivo_principal, peso_objetivo: parseFloat(form.peso_objetivo) || null, idade: parseInt(form.idade) });
                setSaving(false);
                setShowForm(false);
            }, [form, saveMetaProfile]);

            return (
                <div className="progress-section-card" style={{ marginBottom: '24px', animation: 'fade-in 0.5s ease-out', border: '1px solid rgba(255, 107, 74,0.2)', background: 'linear-gradient(135deg, rgba(255, 107, 74,0.05), rgba(27, 22, 34,0.8))' }}>
                    <h3 className="ps-title">{goalIcon} Combustível de Crescimento</h3>
                    {!hasProfile || showForm ? (
                        <div>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Configure o seu perfil metabólico para cálculo personalizado (Mifflin-St Jeor).</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <select value={form.objetivo_principal} onChange={e => setForm(f => ({ ...f, objetivo_principal: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px' }}>
                                    <option value="" className="bg-slate-900 text-white">🎯 Qual é o seu objetivo?</option>
                                    <option value="Ganhar Massa" className="bg-slate-900 text-white">🚀 Ganhar Massa</option>
                                    <option value="Manter" className="bg-slate-900 text-white">⚖️ Manter</option>
                                    <option value="Perder Peso" className="bg-slate-900 text-white">🔥 Perder Peso</option>
                                </select>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <input type="number" placeholder="Idade (anos)" value={form.idade}
                                        onChange={e => setForm(f => ({ ...f, idade: e.target.value }))}
                                        style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
                                    <input type="number" placeholder="Peso Alvo (kg)" value={form.peso_objetivo}
                                        onChange={e => setForm(f => ({ ...f, peso_objetivo: e.target.value }))}
                                        style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
                                </div>
                                <button onClick={handleSave} disabled={saving || !form.objetivo_principal || !form.idade}
                                    style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', opacity: (!form.objetivo_principal || !form.idade) ? 0.5 : 1 }}>
                                    {saving ? 'A guardar...' : 'Calcular o Meu Alvo Calórico →'}
                                </button>
                                {showForm && hasProfile && <button onClick={() => setShowForm(false)} style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer', fontSize: '13px' }}>Cancelar</button>}
                            </div>
                        </div>
                    ) : (
                        <div>
                            {targetKcal ? (
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '36px', fontWeight: '900', color: 'var(--accent)' }}>{targetKcal.toLocaleString('pt-PT')}</span>
                                        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>kcal/dia</span>
                                    </div>
                                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                                        Meta para <strong style={{ color: '#fff' }}>{mp.objetivo_principal}</strong>
                                        {mp.peso_objetivo ? <span> · Alvo: <strong style={{ color: 'var(--accent)' }}>{mp.peso_objetivo} kg</strong></span> : ''}
                                    </p>
                                    <div style={{ marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                                            <span>Queimaste nos treinos: ~{kcalBurned} kcal</span>
                                            <span>{kcalPct}%</span>
                                        </div>
                                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${kcalPct}%`, background: 'linear-gradient(90deg, #ff6b4a, #fbbf24)', borderRadius: '99px', transition: 'width 0.8s ease' }}></div>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                        Fórmula Mifflin-St Jeor · Factor de actividade ×1.55{mp.objetivo_principal === 'Ganhar Massa' ? ' · +500 kcal superávite limpo' : mp.objetivo_principal === 'Perder Peso' ? ' · -500 kcal défice saudável' : ''}.
                                    </p>
                                </div>
                            ) : (
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                    Adicione um registro em 📈 Evolução (peso + altura) para calcular as suas kcal personalizadas.
                                </p>
                            )}
                            <button onClick={() => setShowForm(true)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', cursor: 'pointer', marginTop: '12px' }}>
                                ✏️ Editar Objetivo
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        function DynamicMissions({ catStats, completedLog }) {
            const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
            const weekLogs = completedLog.filter(l => l.ts >= weekAgo);
            const sorted = [...catStats].sort((a, b) => a.pct - b.pct);
            const catIcons = { 'Membros Inferiores': '🦵', 'Membros Superiores': '🏋️', 'Braços': '💪', 'Core': '🎯', 'Cardio': '🏃', 'Mobilidade': '🧘' };
            const catNames = { 'Membros Inferiores': 'Destruidor de Pernas', 'Membros Superiores': 'Costas de Aço', 'Braços': 'Braços de Ferro', 'Core': 'Core Blindado', 'Cardio': 'Motor Cardíaco', 'Mobilidade': 'Corpo Elástico' };

            const missions = sorted.slice(0, 3).map((cat, i) => {
                const target = 3;
                const done = Math.min(target, weekLogs.filter(l => { const ex = EXERCISES.find(e => e.id === l.id); return ex && ex.category === cat.name; }).length);
                return { cat: cat.name, icon: catIcons[cat.name] || '🏋️', name: catNames[cat.name] || cat.name, done, target, xp: [300, 200, 150][i], completed: done >= target };
            });

            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {missions.map((m, i) => (
                        <div key={i} style={{ padding: '14px', background: m.completed ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${m.completed ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '12px', animation: `fade-in ${0.3 + i * 0.15}s ease-out` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '20px' }}>{m.completed ? '✅' : m.icon}</span>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: '700', color: m.completed ? '#22c55e' : '#fff' }}>{m.name}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.cat} · Esta semana</div>
                                    </div>
                                </div>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: '#ff6b4a', flexShrink: 0 }}>+{m.xp} XP</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${(m.done / m.target) * 100}%`, background: m.completed ? '#22c55e' : 'linear-gradient(90deg, #ff6b4a, #fbbf24)', borderRadius: '99px', transition: 'width 0.8s ease' }}></div>
                                </div>
                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', flexShrink: 0 }}>{m.done}/{m.target}</span>
                            </div>
                        </div>
                    ))}
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '4px' }}>Missões baseadas no Radar de Simetria · Reiniciam toda a Segunda-feira</p>
                </div>
            );
        }

        function Sidebar({ page, onNav, userProfile, onLogout }) {
            const ent = resolveEntitlements(userProfile);
            const hasAnyPremium = ent.hasSenior || ent.hasPilates || ent.hasGymnastics;

            return (<aside className="sidebar">
                <div className="sidebar-logo"><span>🏋️</span><span className="accent">+500 Exercícios</span></div>
                {userProfile && <div className="sidebar-user" style={{ padding: '0 20px 20px', color: 'var(--text-secondary)', fontSize: '14px', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
                    Olá, <strong style={{ color: 'var(--text-primary)' }}>{userProfile.name}</strong>
                </div>}
                <nav className="sidebar-nav">
                    {NAV.map(n => (
                        <button key={n.id} className={`sidebar-link ${page === n.id ? 'active' : ''}`} onClick={() => onNav(n.id)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={n.d} strokeLinecap="round" strokeLinejoin="round" /></svg>
                            {n.label}
                        </button>
                    ))}

                    <button className={`sidebar-link ${page === 'guardados' ? 'active' : ''}`} onClick={() => onNav('guardados')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Salvos
                    </button>

                    {hasAnyPremium && (
                        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                            <div style={{ padding: '0 20px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                                Meus Módulos
                            </div>
                            {ent.hasSenior && (
                                <button className={`sidebar-link ${page === 'explorar_senior' ? 'active' : ''}`} onClick={() => onNav('explorar_senior')} style={{ color: 'var(--accent)' }}>
                                    <span style={{ fontSize: '18px', marginRight: '8px' }}>👵</span> Recuperação Ativa
                                </button>
                            )}
                            {ent.hasPilates && (
                                <button className={`sidebar-link ${page === 'explorar_pilates' ? 'active' : ''}`} onClick={() => onNav('explorar_pilates')} style={{ color: 'var(--accent)' }}>
                                    <span style={{ fontSize: '18px', marginRight: '8px' }}>🧘‍♀️</span> Pilates
                                </button>
                            )}
                            {ent.hasGymnastics && (
                                <button className={`sidebar-link ${page === 'explorar_gymnastics' ? 'active' : ''}`} onClick={() => onNav('explorar_gymnastics')} style={{ color: 'var(--accent)' }}>
                                    <span style={{ fontSize: '18px', marginRight: '8px' }}>🤸‍♂️</span> Mini-Bands
                                </button>
                            )}
                        </div>
                    )}

                    <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
                        <button className="sidebar-link" onClick={() => onLogout ? onLogout() : supabase.auth.signOut()} style={{ color: 'var(--text-muted)' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            Sair da Conta
                        </button>
                    </div>
                </nav>
            </aside>);
        }

        function Onboarding({ onComplete, initialProfile = null, onCancel = null }) {
            const isEditMode = Boolean(initialProfile);
            const [step, setStep] = useState(isEditMode ? 2 : 1);
            const [name, setName] = useState(initialProfile?.name || '');
            const [goal, setGoal] = useState(initialProfile?.goal || initialProfile?.objetivo_principal || '');
            const [age, setAge] = useState(initialProfile?.idade || initialProfile?.age || 38);
            const [selectedGender, setSelectedGender] = useState(initialProfile?.gender || '');
            const [estado, setEstado] = useState(initialProfile?.estado || '');
            const [whatsapp, setWhatsapp] = useState(initialProfile?.whatsapp || '');
            const [validationErr, setValidationErr] = useState('');
            const [saving, setSaving] = useState(false);

            const ESTADOS_BR = ["Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"];
            const GOAL_OPTIONS = [
                { value: 'Perder Peso', emoji: '🔥', title: 'Emagrecer & Secar', sub: 'Queimar gordura e desinchar em casa' },
                { value: 'Tonificar e Definir', emoji: '✨', title: 'Firmar & Tonificar', sub: 'Glúteos, pernas, barriga e braços firmes' },
                { value: 'Ganhar Massa', emoji: '💪', title: 'Ganhar Força & Massa', sub: 'Músculos mais fortes com elásticos' },
                { value: 'Saúde e Mobilidade', emoji: '🌿', title: 'Aliviar Dores & Saúde', sub: 'Postura, disposição e baixo impacto' }
            ];
            const GENDERS = [
                { id: 'female', label: 'Feminino', emoji: '✨' },
                { id: 'male', label: 'Masculino', emoji: '💪' },
                { id: 'other', label: 'Outro', emoji: '⚡' }
            ];

            const handlePhoneChange = (e) => {
                let value = e.target.value.replace(/\D/g, "");
                if (value.length > 11) value = value.slice(0, 11);
                if (value.length > 10) {
                    value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
                } else if (value.length > 6) {
                    value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
                } else if (value.length > 2) {
                    value = value.replace(/^(\d{2})(\d{0,5}).*/, "($1) $2");
                } else if (value.length > 0) {
                    value = value.replace(/^(\d{0,2}).*/, "($1");
                }
                setWhatsapp(value);
            };

            const finishOnboarding = async (skipOptional = false) => {
                setValidationErr('');
                if (!name.trim()) return setValidationErr('Digite como você gostaria de ser chamada(o).');
                if (!goal) return setValidationErr('Toque no seu principal objetivo acima.');
                setSaving(true);
                try {
                    const finalGender = skipOptional ? (selectedGender || 'female') : (selectedGender || 'female');
                    const finalEstado = skipOptional ? (estado || '') : estado;
                    const finalAge = skipOptional ? (Number(age) || 38) : (Number(age) || 38);
                    await onComplete(name.trim(), goal, finalGender, finalAge, finalEstado, whatsapp);
                    if (!isEditMode) {
                        trackConversionEvent('onboarding_completed', {
                            placement: skipOptional ? 'step2_skipped' : 'step2_full',
                            metadata: { goal, has_estado: Boolean(finalEstado) }
                        });
                    }
                } finally {
                    setSaving(false);
                }
            };

            const handleStep1Next = (e) => {
                e.preventDefault();
                setValidationErr('');
                if (!goal) return setValidationErr('Escolha seu principal objetivo para montarmos seu treino.');
                if (!name.trim()) return setValidationErr('Digite seu primeiro nome para personalizar o app.');
                setStep(2);
            };

            const handleSubmit = async (e) => {
                e.preventDefault();
                await finishOnboarding(false);
            };

            const isStep1Ready = Boolean(name.trim() && goal);

            return (
                <div className="onboarding-overlay" style={{ animation: 'fade-in 0.4s ease-out', overflowY: 'auto', alignItems: 'flex-start', padding: '24px 16px 40px' }}>
                    <div className="onboarding-card" style={{ margin: 'auto', position: 'relative' }}>
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                aria-label="Fechar"
                                style={{ position: 'absolute', top: '14px', right: '14px', width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >&times;</button>
                        )}

                        {!isEditMode && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '14px' }}>
                                <span style={{ height: '5px', width: '44px', borderRadius: '99px', background: '#ff6b4a' }}></span>
                                <span style={{ height: '5px', width: '44px', borderRadius: '99px', background: step === 2 ? '#ff6b4a' : 'rgba(255,255,255,0.14)' }}></span>
                                <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Passo {step} de 2</span>
                            </div>
                        )}

                        <div className="onboarding-header flex flex-col items-center">
                            <h1 style={{ fontSize: '23px', fontWeight: '900', marginBottom: '6px', textAlign: 'center', lineHeight: 1.2 }}>
                                {isEditMode
                                    ? '✏️ Editar Meu Perfil'
                                    : step === 1
                                    ? <>Monte seu plano em <span style={{ color: 'var(--accent)' }}>5 segundos</span></>
                                    : <>Quase lá, <span style={{ color: 'var(--accent)' }}>{name.trim().split(' ')[0]}</span>!</>}
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '10px', textAlign: 'center' }}>
                                {isEditMode
                                    ? 'Atualize seus dados para manter seus treinos e metas personalizados.'
                                    : step === 1
                                    ? 'Escolha seu foco para separarmos seu 1º treino rápido de 12 min em casa.'
                                    : 'Opcional: informe idade e estado para calibrar seu gasto calórico e clima (você pode pular).'}
                            </p>
                        </div>

                        {!isEditMode && step === 1 ? (
                            <form onSubmit={handleStep1Next} className="onboarding-form" noValidate>
                                <div className="input-group">
                                    <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>1. QUAL É O SEU PRINCIPAL OBJETIVO?</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                        {GOAL_OPTIONS.map(g => (
                                            <button
                                                type="button"
                                                key={g.value}
                                                onClick={() => setGoal(g.value)}
                                                style={{
                                                    padding: '12px 10px',
                                                    borderRadius: '14px',
                                                    border: goal === g.value ? '2px solid #ff6b4a' : '1px solid rgba(255,255,255,0.1)',
                                                    background: goal === g.value ? 'rgba(255, 107, 74, 0.18)' : 'rgba(255,255,255,0.03)',
                                                    color: '#fff',
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <div style={{ fontSize: '20px', marginBottom: '4px' }}>{g.emoji}</div>
                                                <div style={{ fontSize: '12.5px', fontWeight: '800', lineHeight: 1.2 }}>{g.title}</div>
                                                <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.6)', marginTop: '3px', lineHeight: 1.25 }}>{g.sub}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="input-group" style={{ marginTop: '16px' }}>
                                    <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>2. COMO VOCÊ GOSTARIA DE SER CHAMADA(O)?</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="Ex: Ana Paula"
                                        required
                                        className="ob-input"
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '13px', color: '#fff', fontSize: '15px' }}
                                    />
                                </div>

                                {validationErr && (
                                    <div style={{ marginTop: '12px', padding: '10px 12px', borderRadius: '10px', background: 'rgba(239,68,68,0.14)', border: '1px solid rgba(239,68,68,0.35)', color: '#fca5a5', fontSize: '12px', fontWeight: '700', textAlign: 'center' }}>
                                        {validationErr}
                                    </div>
                                )}

                                <button type="submit" className="ob-submit-btn" style={{ width: '100%', marginTop: '16px', padding: '15px', background: 'linear-gradient(135deg, #ff6b4a, #e85334)', color: '#fff', borderRadius: '14px', fontWeight: '900', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isStep1Ready ? 1 : 0.65 }}>
                                    CONTINUAR <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleSubmit} className="onboarding-form" noValidate>
                                {isEditMode && (
                                    <>
                                        <div className="input-group">
                                            <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>COMO VOCÊ GOSTARIA DE SER CHAMADA(O)?</label>
                                            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Ana Paula" required className="ob-input" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', color: '#fff', fontSize: '15px' }} />
                                        </div>
                                        <div className="input-group" style={{ marginTop: '14px' }}>
                                            <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>SEU PRINCIPAL OBJETIVO</label>
                                            <div className="goal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
                                                {GOAL_OPTIONS.map(g => (
                                                    <button type="button" key={g.value} onClick={() => setGoal(g.value)} style={{ padding: '10px', borderRadius: '12px', border: goal === g.value ? '2px solid #ff6b4a' : '1px solid rgba(255,255,255,0.1)', background: goal === g.value ? 'rgba(255, 107, 74, 0.18)' : 'rgba(255,255,255,0.03)', color: goal === g.value ? '#fff' : 'var(--text-secondary)', fontSize: '12.5px', fontWeight: '700' }}>
                                                        {g.emoji} {g.title}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="mb-4 mt-3">
                                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                                        Sua Idade: <span className="text-orange-500 text-base">{age}</span> ANOS
                                    </label>
                                    <input
                                        type="range"
                                        min="14"
                                        max="90"
                                        value={age}
                                        onChange={(e) => setAge(Number(e.target.value))}
                                        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                    />
                                </div>

                                <div className="input-group" style={{ marginTop: '14px' }}>
                                    <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>SEU PERFIL</label>
                                    <div className="gender-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '6px' }}>
                                        {GENDERS.map(g => (
                                            <button
                                                type="button"
                                                key={g.id}
                                                onClick={() => setSelectedGender(g.id)}
                                                style={{
                                                    padding: '10px 4px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '4px',
                                                    alignItems: 'center',
                                                    borderRadius: '12px',
                                                    borderWidth: selectedGender === g.id ? '2px' : '1.5px',
                                                    borderStyle: 'solid',
                                                    borderColor: selectedGender === g.id ? '#ff6b4a' : 'rgba(255,255,255,0.1)',
                                                    background: selectedGender === g.id ? 'rgba(255, 107, 74,0.18)' : 'rgba(255,255,255,0.03)',
                                                    color: selectedGender === g.id ? '#fff' : 'var(--text-secondary)',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <span style={{ fontSize: '22px' }}>{g.emoji}</span>
                                                <span style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: selectedGender === g.id ? '#ff6b4a' : 'inherit' }}>{g.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="input-group" style={{ marginTop: '14px' }}>
                                    <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>SEU ESTADO <span style={{ opacity: 0.65 }}>(OPCIONAL)</span></label>
                                    <select className="ob-input" value={estado} onChange={e => setEstado(e.target.value)} style={{ width: '100%', background: '#1b1622', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '12px', color: '#fff', fontSize: '15px', colorScheme: 'dark' }}>
                                        <option value="" style={{ background: '#1b1622', color: '#94a3b8' }}>Selecione o seu estado (opcional)...</option>
                                        {ESTADOS_BR.map(uf => <option key={uf} value={uf} style={{ background: '#1b1622', color: '#fff' }}>{uf}</option>)}
                                    </select>
                                </div>

                                {isEditMode && (
                                    <div className="input-group" style={{ marginTop: '14px' }}>
                                        <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>TELEFONE <span style={{ opacity: 0.65 }}>(OPCIONAL)</span></label>
                                        <input type="tel" value={whatsapp} onChange={handlePhoneChange} placeholder="Ex: (11) 99999-9999" className="ob-input" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', color: '#fff', fontSize: '15px' }} />
                                    </div>
                                )}

                                {validationErr && (
                                    <div style={{ marginTop: '12px', padding: '10px 12px', borderRadius: '10px', background: 'rgba(239,68,68,0.14)', border: '1px solid rgba(239,68,68,0.35)', color: '#fca5a5', fontSize: '12px', fontWeight: '700', textAlign: 'center' }}>
                                        {validationErr}
                                    </div>
                                )}

                                <button type="submit" className="ob-submit-btn" disabled={saving} style={{ width: '100%', marginTop: '16px', padding: '15px', background: 'linear-gradient(135deg, #ff6b4a, #e85334)', color: '#fff', borderRadius: '14px', fontWeight: '900', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: saving ? 0.65 : 1 }}>
                                    {saving ? 'SALVANDO...' : (isEditMode ? 'SALVAR ALTERAÇÕES' : 'ENTRAR NO MEU PLANO')} <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                                </button>

                                {!isEditMode && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                                        <button type="button" onClick={() => setStep(1)} disabled={saving} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)', fontSize: '12px', cursor: 'pointer' }}>
                                            ← Voltar
                                        </button>
                                        <button type="button" onClick={() => finishOnboarding(true)} disabled={saving} style={{ background: 'none', border: 'none', color: '#fb923c', fontSize: '12.5px', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline' }}>
                                            Pular e entrar agora →
                                        </button>
                                    </div>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            );
        }

        // MOTOR DE IMAGENS PREMIUM
        function ExerciseCard({ exercise: ex, isCompleted, isFavorited, onClick, onFav }) {
            const CATEGORY_IMAGES = {
                "Membros Inferiores": "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?auto=format&fit=crop&w=600&q=80",
                "Membros Superiores": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80",
                "Braços": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",
                "Core": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
                "Cardio": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80",
                "Mobilidade": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80"
            };
            const smartImage = CATEGORY_IMAGES[ex.category] || CATEGORY_IMAGES["Cardio"];
            const fallbackUrl = 'https://placehold.co/600x400/1e293b/f97316?text=' + ex.category.split(' ').join('+');
            return (<div className="card" onClick={() => onClick(ex)}>
                <div className="card-thumb">
                    <img src={smartImage} alt={ex.title} loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = fallbackUrl; }} />
                    <span className={`card-diff-badge ${ex.difficulty}`}>{ex.difficulty}</span>
                    <button className={`card-fav-btn ${isFavorited ? 'fav' : ''}`} onClick={e => { e.stopPropagation(); onFav(ex.id); }}>
                        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    </button>
                    {isCompleted && <div className="card-complete-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg></div>}
                </div>
                <div className="card-body">
                    <h3 className="card-title">{ex.title}</h3>
                    <div className="card-meta"><span className="card-category-tag">{ex.category}</span><span>{ex.sets}x {ex.reps}</span></div>
                </div>
            </div>);
        }

        function VideoModal({ exercise: ex, isCompleted, onClose, onToggle, hasNutriScanAccess = true, freeScansRemaining = 0, onOpenNutriScan }) {
            const videoRef = React.useRef(null);
            const onCloseRef = React.useRef(onClose);
            const [isPlaying, setIsPlaying] = React.useState(false);
            const [videoQuality, setVideoQuality] = React.useState('720p');
            const [videoError, setVideoError] = React.useState(false);

            useEffect(() => {
                onCloseRef.current = onClose;
            }, [onClose]);

            useEffect(() => {
                setVideoQuality('720p');
                setIsPlaying(false);
                setVideoError(false);
            }, [ex?.id]);

            useEffect(() => {
                if (!ex) return;
                document.body.style.overflow = 'hidden';
                const handleKeyDown = (e) => {
                    if (e.key === 'Escape') onCloseRef.current?.();
                };
                window.addEventListener('keydown', handleKeyDown);
                return () => {
                    document.body.style.overflow = 'unset';
                    window.removeEventListener('keydown', handleKeyDown);
                    if (videoRef.current) {
                        videoRef.current.pause();
                        videoRef.current.removeAttribute('src');
                        videoRef.current.load();
                    }
                };
            }, [ex?.id]);

            if (!ex) return null;

            const handleClose = () => {
                if (videoRef.current) {
                    videoRef.current.pause();
                    videoRef.current.removeAttribute('src');
                    videoRef.current.load();
                }
                onClose?.();
            };

            const startPlayback = () => {
                if (!videoRef.current) return;
                const playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => setIsPlaying(true))
                        .catch(error => {
                            console.error("Erro ao reproduzir vídeo:", error);
                            setIsPlaying(false);
                        });
                }
            };

            const title = ex.title || ex.nome || 'Exercício';
            const category = ex.category || ex.target_muscle || '';
            const difficulty = ex.difficulty || '';
            const defDesc = "1. Posicione o elástico com firmeza mantendo a postura alinhada. 2. Execute o movimento de forma controlada sem pressa. 3. Respire durante o esforço e contraia o abdômen.";
            const actualDesc = ex.description || defDesc;
            const isGuide = /^\d+\./.test(actualDesc);
            const steps = isGuide ? actualDesc.match(/\d+\.\s*(.*?)(?=\d+\.|$)/g)?.map(s => s.replace(/^\d+\.\s*/, '').trim()) : [actualDesc];

            const videoSrc = ex.video_url || ex.media || ex.videoUrl || '';
            const guidMatch = videoSrc?.match(/net\/([^\/]+)\/play/) || videoSrc?.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);

            const handleVideoError = () => {
                if (guidMatch) {
                    if (videoQuality === '720p') { setVideoQuality('480p'); return; }
                    if (videoQuality === '480p') { setVideoQuality('360p'); return; }
                    if (videoQuality === '360p') { setVideoQuality('240p'); return; }
                }
                setVideoError(true);
                setIsPlaying(false);
            };

            const modalTarget = document.getElementById('modal-root') || document.body;

            return createPortal(
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 pointer-events-auto overscroll-none modal-overlay"
                    style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.8)', pointerEvents: 'auto', overscrollBehavior: 'none' }}
                    onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
                >
                    <div
                        className="relative w-full max-w-md max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl pointer-events-auto isolation-auto modal"
                        style={{ position: 'relative', width: '100%', maxWidth: '28rem', maxHeight: '90vh', background: '#1b1622', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', pointerEvents: 'auto', isolation: 'auto' }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Botão Fechar */}
                        <button
                            type="button"
                            aria-label="Fechar vídeo"
                            className="absolute top-3 right-3 z-[600] p-2 bg-black/65 hover:bg-black/90 rounded-full text-white cursor-pointer pointer-events-auto modal-close"
                            style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 600, padding: '8px', background: 'rgba(0,0,0,0.65)', borderRadius: '9999px', color: '#fff', cursor: 'pointer', pointerEvents: 'auto', border: '1px solid rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                            onClick={handleClose}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: '22px', height: '22px' }}>
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>

                        {/* Wrapper de Scroll Único */}
                        <div className="w-full h-full max-h-[90vh] overflow-y-auto overscroll-contain pb-10" style={{ width: '100%', height: '100%', maxHeight: '90vh', overflowY: 'auto', overscrollBehavior: 'contain', paddingBottom: '40px' }}>
                            {/* Wrapper do Vídeo */}
                            <div
                                className="relative w-full aspect-video flex-shrink-0 z-[500] pointer-events-auto bg-black"
                                style={{ position: 'relative', width: '100%', aspectRatio: '16/9', flexShrink: 0, zIndex: 500, pointerEvents: 'auto', background: '#000' }}
                            >
                                {videoError ? (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#0b1120', padding: '16px', textAlign: 'center' }}>
                                        <span style={{ fontSize: '28px' }}>📡</span>
                                        <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '700' }}>Não foi possível carregar o vídeo agora.</span>
                                        <button
                                            type="button"
                                            onClick={() => { setVideoError(false); setVideoQuality('720p'); }}
                                            style={{ background: '#ff6b4a', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
                                        >
                                            🔄 Tentar novamente
                                        </button>
                                    </div>
                                ) : videoSrc && guidMatch ? (
                                    <video
                                        ref={videoRef}
                                        key={`${guidMatch[1]}-${videoQuality}`}
                                        src={`https://vz-f56588b2-589.b-cdn.net/${guidMatch[1]}/play_${videoQuality}.mp4`}
                                        poster={`https://vz-f56588b2-589.b-cdn.net/${guidMatch[1]}/thumbnail.jpg`}
                                        className="w-full aspect-video bg-black object-contain pointer-events-auto relative z-[500]"
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'relative', zIndex: 500, pointerEvents: 'auto' }}
                                        onPlay={() => setIsPlaying(true)}
                                        onPause={() => setIsPlaying(false)}
                                        onError={handleVideoError}
                                        controls
                                        playsInline
                                        preload="metadata"
                                    />
                                ) : videoSrc ? (
                                    <video
                                        ref={videoRef}
                                        key={videoSrc}
                                        src={videoSrc}
                                        poster="https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&w=600&q=80"
                                        className="w-full aspect-video bg-black object-contain pointer-events-auto relative z-[500]"
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'relative', zIndex: 500, pointerEvents: 'auto' }}
                                        onPlay={() => setIsPlaying(true)}
                                        onPause={() => setIsPlaying(false)}
                                        onError={handleVideoError}
                                        controls
                                        playsInline
                                        preload="metadata"
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', position: 'absolute', top: 0, left: 0 }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Sem Vídeo Associado</span>
                                    </div>
                                )}

                                {/* Botão de Play Overlay apenas antes de iniciar */}
                                {videoSrc && !isPlaying && !videoError && (
                                    <div
                                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 510 }}
                                    >
                                        <button
                                            type="button"
                                            aria-label="Reproduzir exercício"
                                            onClick={(e) => { e.stopPropagation(); startPlayback(); }}
                                            className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg outline-none focus:outline-none select-none pointer-events-auto hover:bg-orange-600 transition-transform hover:scale-105"
                                            style={{ width: '64px', height: '64px', background: '#ff6b4a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)', pointerEvents: 'auto', border: 'none', cursor: 'pointer', transition: 'transform 0.2s, background-color 0.2s', WebkitTapHighlightColor: 'transparent' }}
                                        >
                                            <svg className="w-8 h-8 ml-1" style={{ width: '32px', height: '32px', marginLeft: '4px' }} fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M4 4l12 6-12 6z" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Área de Conteúdo ("Guia Técnico") */}
                            <div
                                className="p-5 relative z-10 pointer-events-auto bg-slate-900 modal-body"
                                style={{ padding: '20px', position: 'relative', zIndex: 10, pointerEvents: 'auto', background: '#1b1622', margin: 0, marginTop: 0 }}
                            >
                                <h2 className="modal-title" style={{ fontSize: '26px', lineHeight: '1.2' }}>{title}</h2>
                                {(category || difficulty) && (
                                    <div className="card-meta" style={{ marginBottom: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {category && <span className="card-category-tag" style={{ margin: 0, fontSize: '13px', padding: '5px 11px' }}>{category}</span>}
                                        {difficulty && <span className={`card-diff-badge ${difficulty}`} style={{ position: 'static', margin: 0, padding: '5px 11px', fontSize: '12px' }}>{difficulty}</span>}
                                    </div>
                                )}

                                <div style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '24px' }}>
                                    <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent)', marginBottom: '14px', fontWeight: '800' }}>Guia Técnico</h3>
                                    {isGuide && steps && steps.length > 0 ? (
                                        <div className="guide-steps" style={{ gap: '16px', display: 'flex', flexDirection: 'column' }}>
                                            {steps.map((step, idx) => {
                                                const labels = ["Preparação", "Execução", "Dica de Segurança"];
                                                const icons = ["🎯", "⚡", "🛡️"];
                                                return (
                                                    <div key={idx} className="guide-step" style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '8px', borderLeft: '3px solid var(--accent)' }}>
                                                        <div className="guide-step-number" style={{ width: '28px', height: '28px', fontSize: '14px' }}>{icons[idx] || (idx + 1)}</div>
                                                        <div className="guide-step-content" style={{ paddingLeft: '12px' }}>
                                                            <div className="guide-step-label" style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '6px' }}>Passo {idx + 1}: {labels[idx] || "Instrução"}</div>
                                                            <div className="guide-step-text" style={{ fontSize: '15px', lineHeight: '1.55', color: 'var(--text-primary)', fontWeight: '500' }}>{step}</div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="modal-desc" style={{ fontSize: '15px', lineHeight: '1.65', color: 'var(--text-primary)', fontWeight: '500', padding: '0', background: 'transparent', border: 'none', margin: '0' }}>{actualDesc}</div>
                                    )}
                                </div>

                                {!['cardio', 'outros'].includes(category.toLowerCase()) && (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', width: '100%', marginTop: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '94px', borderRadius: '16px', background: 'rgba(37, 30, 46, 0.5)', border: '1px solid rgba(74, 222, 128, 0.3)' }}>
                                            <span style={{ color: '#4ade80', fontSize: '13px', fontWeight: 'bold' }}>Séries</span>
                                            <span style={{ color: '#ffffff', fontSize: '22px', fontWeight: '800', margin: '4px 0' }}>{ex.sets || '3'}</span>
                                            <span style={{ color: '#94a3b8', fontSize: '11px' }}>Blocos</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '94px', borderRadius: '16px', background: 'rgba(37, 30, 46, 0.5)', border: '1px solid rgba(250, 204, 21, 0.3)' }}>
                                            <span style={{ color: '#facc15', fontSize: '13px', fontWeight: 'bold' }}>Repetições</span>
                                            <span style={{ color: '#ffffff', fontSize: '22px', fontWeight: '800', margin: '4px 0' }}>{ex.reps ? String(ex.reps).replace(/reps|movimentos/gi, '').trim() : '15'}</span>
                                            <span style={{ color: '#94a3b8', fontSize: '11px' }}>Movimentos</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '94px', borderRadius: '16px', background: 'rgba(37, 30, 46, 0.5)', border: '1px solid rgba(248, 113, 113, 0.3)' }}>
                                            <span style={{ color: '#f87171', fontSize: '13px', fontWeight: 'bold' }}>Descanso</span>
                                            <span style={{ color: '#ffffff', fontSize: '22px', fontWeight: '800', margin: '4px 0' }}>{ex.rest ? String(ex.rest).replace(/s|seg|segundos/gi, '').trim() : '60'}</span>
                                            <span style={{ color: '#94a3b8', fontSize: '11px' }}>Segundos</span>
                                        </div>
                                    </div>
                                )}
                                <button className={`btn-complete ${isCompleted ? 'done' : 'pending'}`} style={{ marginTop: '24px', fontSize: '16px', padding: '18px' }} onClick={() => onToggle(ex.id)}>
                                    {isCompleted ? '✓ Exercício Concluído' : '✔️ Marcar como Concluído'}
                                </button>
                                {isCompleted && !hasNutriScanAccess && freeScansRemaining > 0 && onOpenNutriScan && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            trackConversionEvent('video_post_complete_nutri_click', { placement: 'video_modal' });
                                            handleClose();
                                            onOpenNutriScan();
                                        }}
                                        style={{ marginTop: '12px', width: '100%', padding: '14px 16px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.12))', border: '1px solid rgba(16,185,129,0.45)', color: '#d1fae5', fontSize: '13px', fontWeight: '800', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}
                                    >
                                        <span>✨ Exercício pago! Use 1 foto grátis no Nutri-Scan IA para calcular seu pós-treino</span>
                                        <span style={{ color: '#34d399', fontWeight: '900', flexShrink: 0 }}>Testar →</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>,
                modalTarget
            );
        }

        function TeaserArsenalPage({ onGoToExtras, ud = null }) {
            return (
                <div className="teaser-container">
                    <div className="teaser-badge">🔒 CONTEÚDO EXCLUSIVO</div>
                    
                    <div className="teaser-ia-icon-wrapper">
                        <div className="teaser-ia-icon-bg" style={{ background: 'linear-gradient(135deg, #ff6b4a 0%, #e85334 100%)' }}></div>
                        <div className="teaser-ia-icon">✨💪</div>
                    </div>
                    
                    <h1 className="teaser-title">
                        Seus Treinos Favoritos e Extras <span className="highlight">em um só lugar.</span>
                    </h1>
                    
                    <p className="teaser-subtitle">
                        Organize seus exercícios favoritos e libere nossos programas completos para emagrecer, tonificar e ganhar força em casa com praticidade.
                    </p>
        
                    <div className="teaser-benefits">
                        {[
                            { 
                                icon: "🥇", 
                                title: "Combo de Ouro Vitalício:", 
                                text: "Desafio 30 Dias + Musculação em Casa + Pilates + 3 Guias Bônus pagando uma única vez." 
                            },
                            { 
                                icon: "🎥", 
                                title: "Execução Segura:", 
                                text: "Vídeos explicativos para evitar dores e garantir o máximo resultado em cada movimento." 
                            },
                            { 
                                icon: "❤️", 
                                title: "Seus Favoritos Salvos:", 
                                text: "Salve seus exercícios preferidos e monte sua rotina em segundos." 
                            }
                        ].map((b, i) => (
                            <div key={i} className="benefit-card" style={{ animationDelay: `${0.1 * i}s` }}>
                                <span className="benefit-icon">{b.icon}</span>
                                <div className="benefit-content">
                                    <div className="benefit-text"><b>{b.title}</b> {b.text}</div>
                                </div>
                            </div>
                        ))}
                    </div>
        
                    <div className="fixed-cta-container">
                        <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '8px', margin: '0 auto' }}>
                            <button
                                type="button"
                                onClick={() => openHotmartCheckout('https://pay.hotmart.com/O106106388F?checkoutMode=10', { placement: 'teaser_arsenal', product: 'combo_ouro', ud })}
                                className="w-full text-center font-bold uppercase px-8 py-4 rounded-full bg-orange-600 hover:bg-orange-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-transform duration-300 block cursor-pointer border-none"
                            >
                                👉 LIBERAR COMBO DE OURO (R$ 24,90 VITALÍCIO)
                            </button>
                            {onGoToExtras && (
                                <button
                                    type="button"
                                    onClick={onGoToExtras}
                                    className="w-full py-2 text-xs text-slate-300 hover:text-white underline font-semibold"
                                >
                                    Ver todos os planos ou ativar meu código
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        function TeaserDesafioPage({ onGoToExtras, ud = null, exercises = [], onSelectExercise = null }) {
            const [lockedDayClicked, setLockedDayClicked] = React.useState(null);

            const day1Exercises = React.useMemo(() => {
                const list = (exercises && exercises.length > 0) ? exercises : (window.EXERCISES || []);
                const filtered = list.filter(ex => {
                    const c = String(ex.category || '').toLowerCase();
                    return ['pernas', 'abdominais', 'braços', 'cardio', 'costas', 'peito'].includes(c);
                });
                return (filtered.length >= 4 ? filtered : list).slice(0, 4);
            }, [exercises]);

            return (
                <div className="teaser-container" style={{ paddingBottom: '210px' }}>
                    <div className="teaser-badge">🔥 DIA 1 LIBERADO GRÁTIS • TESTE AGORA</div>

                    <h1 className="teaser-title" style={{ marginTop: '4px' }}>
                        <span className="block text-orange-400 text-3xl sm:text-5xl italic font-black mb-2 tracking-tighter">DESAFIO 30 DIAS</span>
                        SEU PLANO PRONTO PARA <span className="highlight">SECAR E DEFINIR EM CASA.</span>
                    </h1>
                    
                    <p className="teaser-subtitle">
                        Experimente o <strong>Dia 1 de graça abaixo</strong> e veja como é simples seguir a sequência pronta na ordem certa, sem inventar treino.
                    </p>

                    {/* PRÉVIA INTERATIVA DO CALENDÁRIO 30 DIAS (DIA 1 DESTRAVADO) */}
                    <div className="w-full max-w-xl mx-auto mb-6 p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-white/10 text-left shadow-xl">
                        <div className="flex items-center justify-between gap-2 mb-3">
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">🎁 Amostra Grátis Liberada</div>
                                <h3 className="text-base font-black text-white m-0">Calendário dos 30 Dias</h3>
                            </div>
                            <span className="text-[10px] font-black text-orange-300 bg-orange-500/15 border border-orange-500/30 px-2.5 py-1 rounded-full">1 de 30 grátis</span>
                        </div>

                        <div className="grid grid-cols-6 gap-1.5 mb-4">
                            {Array.from({ length: 18 }, (_, i) => i + 1).map(day => {
                                const isFree = day === 1;
                                const isPicked = lockedDayClicked === day;
                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => {
                                            if (isFree) {
                                                setLockedDayClicked(null);
                                            } else {
                                                setLockedDayClicked(day);
                                                trackConversionEvent('desafio_locked_day_click', { placement: 'teaser_desafio_calendar', product: 'desafio_30', metadata: { day } });
                                            }
                                        }}
                                        className={`py-2 rounded-xl text-[10px] font-black flex flex-col items-center justify-center border transition-all ${
                                            isFree
                                                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                                                : isPicked
                                                ? 'bg-orange-500/25 text-orange-200 border-orange-400'
                                                : 'bg-white/5 text-slate-400 border-white/5 hover:border-orange-500/30'
                                        }`}
                                    >
                                        <span>Dia {day}</span>
                                        <span className="text-[8px] mt-0.5">{isFree ? 'GRÁTIS' : '🔒'}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {lockedDayClicked ? (
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-slate-950 border border-orange-500/40 animate-in zoom-in-95 duration-200">
                                <div className="text-xs font-black text-orange-300 uppercase mb-1">🔒 Dia {lockedDayClicked} bloqueado</div>
                                <p className="text-xs text-slate-200 leading-relaxed mb-3">
                                    Destrave todos os <strong>30 dias completos</strong> + Musculação em Casa + Pilates + Sono Profundo no <strong>Combo de Ouro</strong> por apenas <strong>R$ 24,90</strong> (menos de R$ 0,83/dia — pagamento único vitalício!).
                                </p>
                                <button
                                    type="button"
                                    onClick={() => openHotmartCheckout('https://pay.hotmart.com/O106106388F?checkoutMode=10', { placement: 'teaser_desafio_locked_day', product: 'combo_ouro', ud })}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs uppercase tracking-wider"
                                >
                                    🔓 Destravar os 30 Dias + 5 Guias (R$ 24,90)
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-black text-emerald-300 uppercase tracking-wider">✅ Dia 1 — Treino de Boas-Vindas (toque para assistir)</span>
                                </div>
                                <div className="space-y-2">
                                    {day1Exercises.map((ex, idx) => (
                                        <button
                                            key={ex.id || idx}
                                            type="button"
                                            onClick={() => {
                                                trackConversionEvent('desafio_day1_preview_play', { placement: 'teaser_desafio_day1' });
                                                onSelectExercise?.(ex);
                                            }}
                                            className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between gap-3 text-left transition-all"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 font-black text-xs flex items-center justify-center shrink-0">
                                                    {idx + 1}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-xs font-bold text-white truncate">{ex.title}</div>
                                                    <div className="text-[10px] text-slate-400">{ex.category} · 3 séries · 12–15 reps</div>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black text-emerald-400 shrink-0">▶ Ver vídeo</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="teaser-benefits">
                        {[
                            { 
                                icon: "📅", 
                                title: "30 Dias Passo a Passo:", 
                                text: "Abra o app, aperte o play e siga a sequência pronta do dia sem perder tempo pensando." 
                            },
                            { 
                                icon: "⚡", 
                                title: "Menos de R$ 0,83 por dia:", 
                                text: "No Combo de Ouro (R$ 24,90 único) você leva o Desafio 30D + 5 guias para sempre." 
                            },
                            { 
                                icon: "🛡️", 
                                title: "Garantia Hotmart 7 Dias:", 
                                text: "Pagamento seguro no PIX ou Cartão. Se não amar, devolução garantida." 
                            }
                        ].map((b, i) => (
                            <div key={i} className="benefit-card" style={{ animationDelay: `${0.1 * i}s` }}>
                                <span className="benefit-icon">{b.icon}</span>
                                <div className="benefit-content">
                                    <div className="benefit-text"><b>{b.title}</b> {b.text}</div>
                                </div>
                            </div>
                        ))}
                    </div>
        
                    <div className="fixed-cta-container">
                        <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '8px', margin: '0 auto' }}>
                            <button
                                type="button"
                                onClick={() => openHotmartCheckout('https://pay.hotmart.com/O106106388F?checkoutMode=10', { placement: 'teaser_desafio_combo', product: 'combo_ouro', ud })}
                                className="w-full text-center font-black uppercase px-6 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white shadow-xl transition-transform duration-200 block text-xs sm:text-sm cursor-pointer border-none"
                            >
                                🥇 LEVAR NO COMBO DE OURO (30 DIAS + 5 GUIAS) — R$ 24,90
                            </button>
                            <button
                                type="button"
                                onClick={() => openHotmartCheckout('https://pay.hotmart.com/R106106925S?checkoutMode=10', { placement: 'teaser_desafio_single', product: 'desafio_30', ud })}
                                className="w-full text-center font-bold uppercase px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white transition-all block text-xs cursor-pointer"
                            >
                                Ou desbloquear só o Desafio 30 Dias (R$ 19,90 vitalício)
                            </button>
                            <div className="text-center text-[10px] text-slate-400 font-semibold">
                                ⚡ PIX ou Cartão na hora · 🛡️ 7 dias de garantia Hotmart
                            </div>
                            {onGoToExtras && (
                                <button
                                    type="button"
                                    onClick={onGoToExtras}
                                    className="w-full py-1 text-[11px] text-slate-400 hover:text-white underline font-semibold"
                                >
                                    Já comprou? Clique aqui para ativar seu código
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        function TeaserSonoPage({ onGoToExtras, ud = null }) {
            const [previewSeconds, setPreviewSeconds] = React.useState(0);
            const [previewDone, setPreviewDone] = React.useState(false);
            const [wakeTime, setWakeTime] = React.useState('06:30');
            const intervalRef = React.useRef(null);

            React.useEffect(() => {
                return () => {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    ud?.stopAudio?.();
                };
            }, []);

            const startFreePreview = (trackId, file) => {
                if (ud?.currentAudioId === trackId) {
                    ud?.stopAudio?.();
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    setPreviewSeconds(0);
                    return;
                }
                setPreviewDone(false);
                setPreviewSeconds(20);
                trackConversionEvent('sono_audio_preview_play', { placement: 'teaser_sono', metadata: { trackId } });
                ud?.playAudio?.(trackId, file, 20000);
                if (intervalRef.current) clearInterval(intervalRef.current);
                intervalRef.current = setInterval(() => {
                    setPreviewSeconds(prev => {
                        if (prev <= 1) {
                            clearInterval(intervalRef.current);
                            setPreviewDone(true);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            };

            const idealBedtimes = React.useMemo(() => {
                const [h, m] = (wakeTime || '06:30').split(':').map(Number);
                if (isNaN(h) || isNaN(m)) return [];
                const wakeMins = h * 60 + m;
                return [
                    { label: 'Ideal (7h30 · 5 ciclos)', mins: wakeMins - 465 },
                    { label: 'Revigorante (9h · 6 ciclos)', mins: wakeMins - 555 }
                ].map(item => {
                    const norm = ((item.mins % 1440) + 1440) % 1440;
                    const hh = String(Math.floor(norm / 60)).padStart(2, '0');
                    const mm = String(norm % 60).padStart(2, '0');
                    return { label: item.label, time: `${hh}:${mm}` };
                });
            }, [wakeTime]);

            return (
                <div className="teaser-container" style={{ paddingBottom: '210px' }}>
                    <div className="teaser-badge">🌙 TESTE GRÁTIS • ÁUDIO + CALCULADORA DO SONO</div>
                    
                    <h1 className="teaser-title" style={{ marginTop: '4px' }}>
                        Durma melhor e acorde com <span className="highlight">mais energia para treinar.</span>
                    </h1>
                    
                    <p className="teaser-subtitle">
                        Dormir mal aumenta a vontade de comer doces e trava o emagrecimento. Teste abaixo uma <strong>amostra grátis de 20s</strong> dos nossos áudios relaxantes!
                    </p>

                    {/* AMOSTRA GRÁTIS REAL DE 20 SEGUNDOS */}
                    <div className="w-full max-w-xl mx-auto mb-5 p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-indigo-500/30 text-left shadow-xl">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">🎧 Ouvir prévia grátis (20s)</span>
                            {previewSeconds > 0 && (
                                <span className="text-[10px] font-black text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-full animate-pulse">
                                    Tocando: {previewSeconds}s
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {[
                                { id: 'preview-forest', label: 'Som Relaxante', sub: 'Desacelerar a mente', icon: '🌿', file: 'forest-noise.mp3' },
                                { id: 'preview-brown', label: 'Ruído Castanho', sub: 'Combater insônia', icon: '🌙', file: 'brown-noise.mp3' }
                            ].map(tr => {
                                const playing = ud?.currentAudioId === tr.id;
                                return (
                                    <button
                                        key={tr.id}
                                        type="button"
                                        onClick={() => startFreePreview(tr.id, tr.file)}
                                        className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-left transition-all ${playing ? 'bg-indigo-500/25 border-indigo-400' : 'bg-white/5 hover:bg-white/10 border-white/10'}`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-xl">{tr.icon}</span>
                                            <div>
                                                <div className="text-xs font-black text-white">{tr.label}</div>
                                                <div className="text-[10px] text-slate-400">{tr.sub}</div>
                                            </div>
                                        </div>
                                        <span className="text-xs font-black text-indigo-300 shrink-0">{playing ? '⏸ Parar' : '▶ Ouvir'}</span>
                                    </button>
                                );
                            })}
                        </div>
                        {previewDone && (
                            <div className="mt-3 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/35 text-xs text-emerald-200 font-bold">
                                ✨ Gostou da sensação? Libere os áudios completos sem limite + timer automático no Combo de Ouro (R$ 24,90 único)!
                            </div>
                        )}
                    </div>

                    {/* CALCULADORA GRÁTIS DE HORÁRIO IDEAL DE DORMIR */}
                    <div className="w-full max-w-xl mx-auto mb-6 p-4 sm:p-5 rounded-3xl bg-slate-900/75 border border-white/10 text-left">
                        <div className="flex items-center justify-between gap-3 mb-3">
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-orange-400">⏰ Ferramenta Grátis</div>
                                <div className="text-sm font-black text-white">Que horas você quer acordar?</div>
                            </div>
                            <input
                                type="time"
                                value={wakeTime}
                                onChange={(e) => setWakeTime(e.target.value)}
                                className="bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white font-black text-sm outline-none focus:border-indigo-400"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                            {idealBedtimes.map((b, i) => (
                                <div key={i} className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                                    <div className="text-lg font-black text-white">{b.time}</div>
                                    <div className="text-[10px] text-slate-400 font-semibold">{b.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
        
                    <div className="fixed-cta-container">
                        <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '8px', margin: '0 auto' }}>
                            <button
                                type="button"
                                onClick={() => openHotmartCheckout('https://pay.hotmart.com/O106106388F?checkoutMode=10', { placement: 'teaser_sono_combo', product: 'combo_ouro', ud })}
                                className="w-full text-center font-black uppercase px-6 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white shadow-xl transition-transform duration-200 block text-xs sm:text-sm cursor-pointer border-none"
                            >
                                🥇 LEVAR GRÁTIS NO COMBO DE OURO (+5 PROGRAMAS) — R$ 24,90
                            </button>
                            <button
                                type="button"
                                onClick={() => openHotmartCheckout('https://pay.hotmart.com/Y106107162P?checkoutMode=10', { placement: 'teaser_sono_single', product: 'sono', ud })}
                                className="w-full text-center font-bold uppercase px-6 py-3 rounded-2xl bg-indigo-600/80 hover:bg-indigo-500 text-white transition-all block text-xs cursor-pointer border-none"
                            >
                                Ou liberar apenas o Sono Profundo (R$ 19,90)
                            </button>
                            <div className="text-center text-[10px] text-slate-400 font-semibold">
                                ⚡ PIX ou Cartão na hora · 🛡️ 7 dias de garantia Hotmart
                            </div>
                            {onGoToExtras && (
                                <button
                                    type="button"
                                    onClick={onGoToExtras}
                                    className="w-full py-1 text-[11px] text-slate-400 hover:text-white underline font-semibold"
                                >
                                    Já comprou? Ative seu código aqui
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        const ExtraCard = ({ title, desc, price, oldPrice, badge, ribbon, icon, unlocked, isMonthly, onAction, ctaLabel, secondaryCta, onSecondaryAction, subPrice, pdfs, onOpenPdf, glow, glowColor = 'orange' }) => {
            const isGreen = glowColor === 'green';
            const glowClass = isGreen 
                ? 'shadow-[0_0_35px_-6px_rgba(16,185,129,0.45)] border-2 border-emerald-500/50' 
                : 'shadow-[0_0_35px_-6px_rgba(255,107,74,0.45)] border-2 border-orange-500/50';

            return (
                <div className={`p-6 rounded-[24px] bg-[#211b29] flex flex-col relative overflow-hidden transition-all duration-300 ${glow ? glowClass : 'border border-white/10 hover:bg-[#2b2335]'}`}>
                    {ribbon && (
                        <div className="absolute top-0 right-0 w-28 h-28 overflow-hidden pointer-events-none z-20">
                            <div className={`absolute top-4 -right-8 w-36 ${isGreen ? 'bg-gradient-to-r from-emerald-600 to-emerald-500' : 'bg-gradient-to-r from-orange-600 to-amber-500'} text-white text-center font-black text-[8px] py-1.5 rotate-45 shadow-2xl uppercase tracking-[0.15em] border-y border-white/10`}>
                                {ribbon}
                            </div>
                        </div>
                    )}
                    {badge && (
                        <div className={`inline-flex self-start mb-4 ${isGreen ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'} text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider z-10`}>
                            {badge}
                        </div>
                    )}
                    
                    <div className="flex gap-4 mb-5">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl shrink-0">
                            {icon}
                        </div>
                        <div className="flex-1 pt-1">
                            <h3 className="text-lg font-black text-white leading-tight mb-1 uppercase italic tracking-tighter">{title}</h3>
                            <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${unlocked ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-slate-600'}`}></span>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{unlocked ? 'Liberado na sua conta' : (isMonthly ? 'Assinatura flexível' : 'Pagamento único')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-[12px] text-slate-300 mb-6 leading-relaxed font-medium">{desc}</div>

                    <div className="mt-auto">
                        {!unlocked ? (
                            <div className="mb-5">
                                {oldPrice && <p className="text-[10px] text-slate-500 line-through font-bold mb-1">DE: R$ {oldPrice}</p>}
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xs font-black text-white/50">R$</span>
                                    <span className="text-3xl font-black text-white tracking-tighter italic">{price}</span>
                                    <span className="text-[10px] text-slate-400 font-black uppercase ml-1">{isMonthly ? '/ mês' : 'Vitalício'}</span>
                                </div>
                                {subPrice && <p className="text-[10px] text-emerald-400 font-bold mt-1.5">⚡ {subPrice}</p>}
                            </div>
                        ) : (
                            <div className="mb-5 py-2.5 bg-emerald-500/10 rounded-xl text-center border border-emerald-500/20">
                                <span className="text-[10px] font-black text-emerald-400 tracking-[0.15em] uppercase">Desbloqueado ✅</span>
                            </div>
                        )}

                        {unlocked && pdfs && pdfs.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 mb-5">
                                {pdfs.map((pdf, idx) => (
                                    <button
                                        type="button"
                                        key={idx} 
                                        onClick={() => onOpenPdf && onOpenPdf(pdf)}
                                        className="bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all group/pdf active:scale-95 cursor-pointer hover:border-orange-500/30"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 text-sm group-hover/pdf:bg-red-500/20">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                        </div>
                                        <span className="text-[8px] font-black uppercase text-slate-300 group-hover/pdf:text-white text-center leading-tight tracking-wider">{pdf.title}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <button 
                                type="button"
                                onClick={onAction}
                                className={`w-full py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 ${unlocked ? 'bg-white/10 hover:bg-white/15 text-white' : (isGreen ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20' : 'bg-orange-600 text-white hover:bg-orange-500 shadow-lg shadow-orange-600/20')}`}
                            >
                                {unlocked ? 'Acessar Agora' : (ctaLabel || 'Liberar Acesso Agora')}
                            </button>
                            {!unlocked && secondaryCta && onSecondaryAction && (
                                <button
                                    type="button"
                                    onClick={onSecondaryAction}
                                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-300 border border-emerald-500/20 text-[11px] font-bold transition-all"
                                >
                                    {secondaryCta}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            );
        };

        function ExtrasHub({ ud, onNav, onAccessModule, freeScansRemaining = 0, onOpenNutriScan, focusRedeem = false, onClearFocusRedeem }) {
            const [activeTab, setActiveTab] = React.useState('combos');
            const [redeemCode, setRedeemCode] = React.useState('');
            const [redeeming, setRedeeming] = React.useState(false);
            const [redeemFeedback, setRedeemFeedback] = React.useState(null); // { type: 'ok'|'err', msg }
            const [viewingPdf, setViewingPdf] = React.useState(null);
            const [pdfLoading, setPdfLoading] = React.useState(false);
            const redeemSectionRef = React.useRef(null);

            React.useEffect(() => {
                if (focusRedeem && redeemSectionRef.current) {
                    redeemSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    onClearFocusRedeem?.();
                }
            }, [focusRedeem, onClearFocusRedeem]);

            const ent = resolveEntitlements(ud.userProfile);
            const { hasTotalVip, hasGold, hasScannerIA, hasDesafio, hasSono, hasComunidade, hasMusculacao, hasSenior, hasPilates, hasGymnastics } = ent;

            const ALL_GUIDES = [
                { title: "Musculação em Casa", unlocked: hasMusculacao, url: "https://wutjxjubudszwgvxedgm.supabase.co/storage/v1/object/public/Protocolo%20Flexibilidade%20&%20Anti-Stress/Untitled%20folder/Guia%20de%20Musculacao%20em%20Casa.pdf" },
                { title: "Pilates Modelador", unlocked: hasPilates, url: "https://wutjxjubudszwgvxedgm.supabase.co/storage/v1/object/public/Protocolo%20Flexibilidade%20&%20Anti-Stress/Untitled%20folder/Pilates.pdf" },
                { title: "Recuperação Ativa", unlocked: hasSenior, url: "https://wutjxjubudszwgvxedgm.supabase.co/storage/v1/object/public/Protocolo%20Flexibilidade%20&%20Anti-Stress/Untitled%20folder/Protocolo%20de%20Recuperacao%20Ativa.pdf" },
                { title: "Guia Mini-Bands", unlocked: hasGymnastics, url: "https://wutjxjubudszwgvxedgm.supabase.co/storage/v1/object/public/Protocolo%20Flexibilidade%20&%20Anti-Stress/Untitled%20folder/Guia%20de%20Treinamento%20Mini-Faixas%20(Mini-Bands).pdf" }
            ];

            const openPdfViewer = (pdf) => {
                if (!pdf?.url) {
                    setRedeemFeedback({ type: 'err', msg: 'Este guia está sendo preparado e será liberado em breve.' });
                    return;
                }
                setPdfLoading(true);
                setViewingPdf(pdf);
            };

            const openCommunityVip = async () => {
                try {
                    const { data, error } = await window.supabase.functions.invoke('redeem-code', {
                        body: { action: 'get_community_link' }
                    });
                    if (!error && data?.url) {
                        safeOpenExternal(data.url);
                        return;
                    }
                } catch (e) {
                    console.error('Erro ao abrir Comunidade VIP:', e);
                }
                setRedeemFeedback({ type: 'err', msg: 'Não foi possível abrir o link da Comunidade VIP. Verifique sua conexão e tente novamente.' });
            };

            const handleRedeemCode = async (e) => {
                if (e && e.preventDefault) e.preventDefault();
                const cleaned = redeemCode.replace(/\s+/g, '').toUpperCase();
                if (!cleaned) return;
                setRedeeming(true);
                setRedeemFeedback(null);
                try {
                    const res = await ud.redeemPromoCode(cleaned);
                    if (res.ok) {
                        setRedeemCode('');
                        setRedeemFeedback({ type: 'ok', msg: '✅ Acesso liberado na sua conta com sucesso! Já pode abrir seus conteúdos.' });
                    } else {
                        setRedeemFeedback({ type: 'err', msg: res.error || 'Código inválido ou expirado. Confira o e-mail da Hotmart.' });
                    }
                } finally {
                    setRedeeming(false);
                }
            };

            const unlockedGuides = ALL_GUIDES.filter(g => g.unlocked);

            return (
                <div id="extras-page" className="extras-hub p-5 pb-32 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="page-header mb-6">
                        <h1 className="text-3xl sm:text-4xl font-black italic tracking-tighter mb-2">✨ Planos & Guias Extras</h1>
                        <p className="text-slate-400 font-medium text-xs sm:text-sm">Escolha o complemento ideal para acelerar seus resultados em casa</p>
                    </div>

                    {unlockedGuides.length > 0 && (
                        <div className="mb-6 p-5 bg-emerald-500/10 border border-emerald-500/25 rounded-3xl">
                            <h3 className="text-emerald-300 font-black uppercase tracking-widest text-[10px] mb-3">📚 Seus Guias Liberados</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                {unlockedGuides.map((pdf, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => openPdfViewer(pdf)}
                                        className="bg-slate-900/60 hover:bg-slate-800 border border-white/10 p-3 rounded-xl flex items-center gap-2 text-left transition-all"
                                    >
                                        <span className="text-red-400 text-base">📄</span>
                                        <span className="text-[10px] font-black text-white uppercase leading-tight">{pdf.title}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2 mb-7 bg-white/5 p-1 rounded-[20px] border border-white/5">
                        <button 
                            type="button"
                            onClick={() => setActiveTab('combos')}
                            className={`flex-1 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.16em] transition-all ${activeTab === 'combos' ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20' : 'text-slate-400 hover:text-white'}`}
                        >
                            🔥 Mais Vendidos (3)
                        </button>
                        <button 
                            type="button"
                            onClick={() => setActiveTab('separados')}
                            className={`flex-1 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.16em] transition-all ${activeTab === 'separados' ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20' : 'text-slate-400 hover:text-white'}`}
                        >
                            Programas Individuais
                        </button>
                    </div>

                    {activeTab === 'combos' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <ExtraCard 
                                title="Combo de Ouro"
                                badge="🔥 MAIS ESCOLHIDO"
                                glow={true}
                                glowColor="orange"
                                desc={
                                    <>
                                        <div className="mb-2.5 text-[10px] font-black text-amber-300 tracking-wide">★ 4,9 · +6.000 alunas treinando em casa</div>
                                        {hasDesafio && !hasGold ? (
                                            <div className="mb-3 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-[11px] font-bold">
                                                ✨ Você já tem o Desafio 30D! Complete sua coleção com Musculação em Casa + Pilates + 4 Guias Bônus:
                                            </div>
                                        ) : (
                                            <span>O pacote completo de treinos e guias em pagamento único (sem mensalidade):</span>
                                        )}
                                        <div className="mt-2.5 space-y-1">
                                            <div className="font-bold text-amber-300">✓ Desafio 30 Dias Passo a Passo</div>
                                            <div className="font-bold text-amber-300">✓ Guia Musculação em Casa</div>
                                            <div className="font-bold text-amber-300">✓ Pilates Modelador & Ginástica Pélvica</div>
                                            <div className="font-bold text-amber-300">✓ Treino Sênior / Mobilidade</div>
                                            <div className="font-bold text-emerald-300">🎁 Bônus Grátis: Sono Profundo + Mini-Bands + Recuperação Ativa</div>
                                        </div>
                                    </>
                                }
                                price="24,90"
                                oldPrice="119,40"
                                subPrice="Menos de R$ 0,83/dia no Desafio • PIX ou Cartão • 🛡️ Garantia 7 dias Hotmart"
                                icon="🥇"
                                ctaLabel="Quero o Combo de Ouro"
                                unlocked={hasGold}
                                pdfs={ALL_GUIDES}
                                onOpenPdf={openPdfViewer}
                                onAction={() => hasGold ? (onAccessModule ? onAccessModule('desafio30') : onNav('arsenal-vip')) : openHotmartCheckout('https://pay.hotmart.com/O106106388F?checkoutMode=10', { placement: 'extras_combo_ouro', product: 'combo_ouro', ud })}
                            />

                            <ExtraCard 
                                title="Nutri-Scan™ IA"
                                badge="📸 7 DIAS GRÁTIS"
                                glow={true}
                                glowColor="green"
                                desc={
                                    <>
                                        <div className="mb-2.5 text-[10px] font-black text-emerald-300 tracking-wide">★ 4,9 · Sem balança, direto pelo celular</div>
                                        Tire uma foto do seu prato ou digite o que comeu e descubra calorias e proteínas em 3 segundos:
                                        <div className="mt-2.5 space-y-1">
                                            <div className="font-bold text-emerald-300">✓ Análises Ilimitadas por Foto e Texto</div>
                                            <div className="font-bold text-emerald-300">✓ Meta Diária para Emagrecer ou Definir</div>
                                            <div className="font-bold text-emerald-300">✓ Calendário de Consistência Automático</div>
                                        </div>
                                    </>
                                }
                                price="9,90"
                                isMonthly={true}
                                subPrice="7 Dias Grátis • Depois só R$ 0,33/dia • 🛡️ Cancele quando quiser na Hotmart"
                                icon="📸"
                                ctaLabel="Liberar 7 Dias Grátis"
                                secondaryCta={!hasScannerIA && freeScansRemaining > 0 && onOpenNutriScan ? `🎁 Usar teste grátis no app (${freeScansRemaining} restante)` : null}
                                onSecondaryAction={onOpenNutriScan}
                                unlocked={hasScannerIA}
                                onAction={() => hasScannerIA ? (onOpenNutriScan ? onOpenNutriScan() : onNav('arsenal-vip')) : openHotmartCheckout('https://pay.hotmart.com/H106107115U?checkoutMode=10', { placement: 'extras_nutri_scan', product: 'nutri_scan', ud })}
                            />

                            <ExtraCard 
                                title="Acesso Total VIP"
                                badge="💎 SEM MENSALIDADE"
                                desc={
                                    <>
                                        <div className="mb-2.5 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-200 text-[11px] font-bold leading-snug">
                                            💡 Em 7 meses de Nutri-Scan mensal (R$ 9,90/mês) você pagaria R$ 69,30 — aqui leva o Nutri-Scan + Combo de Ouro PARA SEMPRE sem mensalidade!
                                        </div>
                                        <div className="mt-2 space-y-1">
                                            <div className="font-bold text-emerald-300">✓ Tudo do Combo de Ouro (6 Programas)</div>
                                            <div className="font-bold text-emerald-300">✓ Nutri-Scan™ IA Vitalício (sem mensalidade!)</div>
                                            <div className="font-bold text-emerald-300">✓ Comunidade VIP no Telegram</div>
                                            <div className="font-bold text-emerald-300">✓ Todas as Atualizações Futuras</div>
                                        </div>
                                    </>
                                }
                                price="69,90"
                                oldPrice="119,40 + 19,90/mês"
                                subPrice="PIX ou Cartão • 🛡️ Garantia 7 dias Hotmart • Zero mensalidade para sempre"
                                icon="💎"
                                ribbon="TUDO LIBERADO"
                                ctaLabel="Quero Acesso Total Vitalício"
                                unlocked={hasTotalVip}
                                pdfs={ALL_GUIDES}
                                onOpenPdf={openPdfViewer}
                                onAction={() => hasTotalVip ? onNav('inicio') : openHotmartCheckout('https://pay.hotmart.com/E105939718I?checkoutMode=10', { placement: 'extras_acesso_total', product: 'acesso_total', ud })}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {!hasGold && (
                                <div
                                    onClick={() => setActiveTab('combos')}
                                    className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between gap-3 cursor-pointer hover:bg-orange-500/15 transition-all"
                                >
                                    <p className="text-xs text-orange-200 font-bold leading-snug">
                                        💡 <strong>Dica de economia:</strong> No <strong>Combo de Ouro (R$ 24,90)</strong> você leva o Desafio 30D + Musculação em Casa + Pilates + 3 Guias Bônus por apenas R$ 5 a mais!
                                    </p>
                                    <span className="text-[10px] font-black text-orange-400 uppercase shrink-0">Ver Combo ➔</span>
                                </div>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ExtraCard 
                                    title="Musculação em Casa"
                                    desc="Guia prático em PDF para tonificar, ganhar força e definir o corpo em casa sem precisar de aparelhos de academia."
                                    price="19,90"
                                    icon="💪"
                                    badge="GUIA EM PDF"
                                    subPrice="Pagamento único vitalício"
                                    unlocked={hasMusculacao}
                                    pdfs={[ALL_GUIDES[0]]}
                                    onOpenPdf={openPdfViewer}
                                    onAction={() => hasMusculacao ? openPdfViewer(ALL_GUIDES[0]) : openHotmartCheckout('https://pay.hotmart.com/N105939399C?checkoutMode=10', { placement: 'extras_ind_musculacao', product: 'musculacao', ud })}
                                />
                                <ExtraCard 
                                    title="Desafio 30 Dias"
                                    desc="Seu cronograma diário pronto por 30 dias para eliminar a dúvida do que treinar e acelerar resultados reais."
                                    price="19,90"
                                    icon="🔥"
                                    subPrice="Pagamento único vitalício"
                                    unlocked={hasDesafio}
                                    onAction={() => hasDesafio ? (onAccessModule ? onAccessModule('desafio30') : onNav('arsenal-vip')) : openHotmartCheckout('https://pay.hotmart.com/R106106925S?checkoutMode=10', { placement: 'extras_ind_desafio30', product: 'desafio_30', ud })}
                                />
                                <ExtraCard 
                                    title="Nutri-Scan™ IA"
                                    desc="Fotografe seu prato ou escreva o que comeu e descubra calorias e macronutrientes em segundos."
                                    price="9,90"
                                    isMonthly={true}
                                    subPrice="7 Dias Grátis na Hotmart"
                                    icon="📸"
                                    unlocked={hasScannerIA}
                                    onAction={() => hasScannerIA ? (onOpenNutriScan ? onOpenNutriScan() : onNav('arsenal-vip')) : openHotmartCheckout('https://pay.hotmart.com/H106107115U?checkoutMode=10', { placement: 'extras_ind_nutri_scan', product: 'nutri_scan', ud })}
                                />
                                <ExtraCard 
                                    title="Pilates Modelador"
                                    desc="Fortaleça abdômen, melhore a postura e alivie dores nas costas com treinos suaves e eficientes em casa."
                                    price="19,90"
                                    icon="🧘‍♀️"
                                    subPrice="Pagamento único vitalício"
                                    unlocked={hasPilates}
                                    pdfs={[ALL_GUIDES[1]]}
                                    onOpenPdf={openPdfViewer}
                                    onAction={() => hasPilates ? openPdfViewer(ALL_GUIDES[1]) : openHotmartCheckout('https://pay.hotmart.com/E105938855Y?checkoutMode=10', { placement: 'extras_ind_pilates', product: 'pilates', ud })}
                                />
                                <ExtraCard 
                                    title="Pacote de Elite (IA + Comunidade)"
                                    desc="Nutri-Scan™ IA ilimitado + acesso à Comunidade VIP no Telegram com suporte e dicas."
                                    price="14,90"
                                    oldPrice="19,90"
                                    isMonthly={true}
                                    icon="💬"
                                    unlocked={hasScannerIA && hasComunidade}
                                    onAction={() => (hasScannerIA && hasComunidade) ? openCommunityVip() : openHotmartCheckout('https://pay.hotmart.com/I105940414O?checkoutMode=10', { placement: 'extras_ind_pacote_elite', product: 'pacote_elite', ud })}
                                />
                            </div>
                        </div>
                    )}

                    <div id="redeem-code-section" ref={redeemSectionRef} className="mt-12 p-7 bg-[#211b29] rounded-[28px] border border-dashed border-white/15 text-center">
                        <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-2">Já comprou na Hotmart? Ative seu código aqui</h3>
                        <p className="text-slate-400 text-xs mb-5">Digite o código que você recebeu por e-mail para liberar imediatamente na sua conta.</p>
                        <form onSubmit={handleRedeemCode} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                            <input 
                                type="text" 
                                value={redeemCode}
                                onChange={(e) => setRedeemCode(e.target.value)}
                                disabled={redeeming}
                                placeholder="DIGITE SEU CÓDIGO AQUI"
                                className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white font-black text-xs focus:border-orange-500 outline-none transition-all placeholder:text-slate-600 uppercase"
                            />
                            <button 
                                type="submit"
                                disabled={redeeming || !redeemCode.trim()}
                                className="bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all active:scale-95 shadow-xl disabled:opacity-50"
                            >
                                {redeeming ? 'Validando...' : 'Liberar'}
                            </button>
                        </form>
                        {redeemFeedback && (
                            <div className={`mt-4 max-w-lg mx-auto p-3 rounded-xl text-xs font-bold ${redeemFeedback.type === 'ok' ? 'bg-emerald-500/15 border border-emerald-500/35 text-emerald-300' : 'bg-red-500/15 border border-red-500/35 text-red-300'}`}>
                                {redeemFeedback.msg}
                            </div>
                        )}
                    </div>

                    {viewingPdf && (
                        <div className="fixed inset-0 z-[20000] bg-slate-950 flex flex-col animate-in fade-in zoom-in-95 duration-300">
                            <div className="flex items-center justify-between gap-2 p-4 bg-slate-900 border-b border-white/10">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                    </div>
                                    <h3 className="text-white font-black uppercase tracking-wider text-[11px] truncate">{viewingPdf.title}</h3>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <a
                                        href={viewingPdf.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-[10px] uppercase tracking-wider transition-all"
                                    >
                                        📥 Baixar / Abrir
                                    </a>
                                    <button 
                                        type="button"
                                        onClick={() => setViewingPdf(null)}
                                        aria-label="Fechar guia"
                                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-2xl hover:bg-white/20"
                                    >
                                        &times;
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 bg-slate-950 overflow-hidden relative">
                                {pdfLoading && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-10 pointer-events-none">
                                        <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-3"></div>
                                        <p className="text-xs font-bold text-slate-300">Carregando guia PDF...</p>
                                    </div>
                                )}
                                <iframe 
                                    src={`https://docs.google.com/gview?url=${encodeURIComponent(viewingPdf.url)}&embedded=true`}
                                    className="w-full h-full border-none"
                                    style={{ background: '#1b1622' }}
                                    title={viewingPdf.title}
                                    onLoad={() => setPdfLoading(false)}
                                />
                            </div>
                            <div className="p-3 bg-slate-900 border-t border-white/10 text-center">
                                <p className="text-[10px] text-slate-400 font-semibold">
                                    Não abriu no visualizador? Toque em <strong className="text-orange-400">"📥 Baixar / Abrir"</strong> no canto superior direito.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        /* ==========================================================================
           COMPONENTES DE NUTRIÇÃO (MODULARIZADOS)
           ========================================================================== */

        function MealDetailsForm({ isOpen, onClose, onConfirm, aiData, isSaving = false, saveError = '' }) {
            const [editableData, setEditableData] = React.useState({
                mealName: '',
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0,
                description: ''
            });

            const [selectedExtras, setSelectedExtras] = React.useState({
                oil: false,
                vegoil: false,
                alcohol: false,
                soda: false
            });

            // Sincronizar dados da IA e resetar extras a cada nova refeição
            React.useEffect(() => {
                if (aiData && isOpen) {
                    setEditableData({
                        mealName: aiData.mealName || '',
                        calories: Math.max(0, Number(aiData.calories) || 0),
                        protein: Math.max(0, Number(aiData.protein) || 0),
                        carbs: Math.max(0, Number(aiData.carbs) || 0),
                        fat: Math.max(0, Number(aiData.fat) || 0),
                        description: aiData.description || ''
                    });
                    setSelectedExtras({ oil: false, vegoil: false, alcohol: false, soda: false });
                }
            }, [aiData, isOpen]);

            if (!isOpen || !aiData) return null;

            const EXTRAS_CONFIG = {
                oil: { label: 'Azeite (+120 kcal)', kcal: 120 },
                vegoil: { label: 'Óleo Vegetal (+110 kcal)', kcal: 110 },
                alcohol: { label: 'Bebida Alcoólica (+150 kcal)', kcal: 150 },
                soda: { label: 'Bebida com Açúcar (+130 kcal)', kcal: 130 }
            };

            const toggleExtra = (id) => {
                setSelectedExtras(prev => ({ ...prev, [id]: !prev[id] }));
            };

            const handleInputChange = (field, value) => {
                if (field === 'mealName' || field === 'description') {
                    setEditableData(prev => ({ ...prev, [field]: value }));
                } else {
                    const num = Math.max(0, Math.min(5000, parseInt(value, 10) || 0));
                    setEditableData(prev => ({ ...prev, [field]: num }));
                }
            };

            const extraKcal = Object.entries(selectedExtras)
                .reduce((acc, [id, checked]) => acc + (checked ? EXTRAS_CONFIG[id].kcal : 0), 0);

            const totalKcal = Math.round((editableData.calories || 0) + extraKcal);
            const inputBaseClass = "bg-slate-800/50 hover:bg-slate-700/80 focus:ring-2 focus:ring-orange-500 rounded px-2 py-1 transition-all outline-none border-none text-white";

            return (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[200000] p-4 animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-orange-500/25 rounded-[28px] w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl relative">
                        <div className="p-6 sm:p-8">
                            <h2 className="text-xl sm:text-2xl font-black text-white mb-5 uppercase tracking-tight">🍽️ Detalhes da Refeição</h2>
                            
                            <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">O que a IA identificou</p>
                                        <p className="text-[10px] text-slate-400 italic">(Você pode editar os valores manualmente)</p>
                                    </div>
                                </div>
                                
                                <input 
                                    type="text"
                                    value={editableData.mealName}
                                    onChange={(e) => handleInputChange('mealName', e.target.value)}
                                    className={`${inputBaseClass} w-full text-lg font-black mb-4 italic placeholder:text-slate-600`}
                                    placeholder="Nome da refeição..."
                                />
                                
                                <div className="grid grid-cols-4 gap-2 text-center">
                                    <div className="bg-orange-500/10 p-2 rounded-xl">
                                        <p className="text-[8px] text-orange-400 font-bold uppercase mb-1">Kcal</p>
                                        <input 
                                            type="number"
                                            min="0"
                                            max="5000"
                                            value={editableData.calories}
                                            onChange={(e) => handleInputChange('calories', e.target.value)}
                                            className={`${inputBaseClass} w-full text-sm font-black text-center p-0`}
                                        />
                                    </div>
                                    <div className="bg-blue-500/10 p-2 rounded-xl">
                                        <p className="text-[8px] text-blue-400 font-bold uppercase mb-1">Prot(g)</p>
                                        <input 
                                            type="number"
                                            min="0"
                                            max="500"
                                            value={editableData.protein}
                                            onChange={(e) => handleInputChange('protein', e.target.value)}
                                            className={`${inputBaseClass} w-full text-sm font-black text-center p-0`}
                                        />
                                    </div>
                                    <div className="bg-green-500/10 p-2 rounded-xl">
                                        <p className="text-[8px] text-green-400 font-bold uppercase mb-1">Carb(g)</p>
                                        <input 
                                            type="number"
                                            min="0"
                                            max="700"
                                            value={editableData.carbs}
                                            onChange={(e) => handleInputChange('carbs', e.target.value)}
                                            className={`${inputBaseClass} w-full text-sm font-black text-center p-0`}
                                        />
                                    </div>
                                    <div className="bg-yellow-500/10 p-2 rounded-xl">
                                        <p className="text-[8px] text-yellow-400 font-bold uppercase mb-1">Gord(g)</p>
                                        <input 
                                            type="number"
                                            min="0"
                                            max="400"
                                            value={editableData.fat}
                                            onChange={(e) => handleInputChange('fat', e.target.value)}
                                            className={`${inputBaseClass} w-full text-sm font-black text-center p-0`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2.5 mb-6">
                                <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest mb-2">Adicionar Extras (O que a IA não vê)</p>
                                
                                {Object.entries(EXTRAS_CONFIG).map(([id, config]) => (
                                    <label key={id} className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${selectedExtras[id] ? 'bg-orange-500/10 border-orange-500/40 shadow-lg shadow-orange-500/5' : 'bg-white/5 border-white/5'}`}>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedExtras[id]}
                                            onChange={() => toggleExtra(id)}
                                            className="w-5 h-5 rounded-lg border-white/10 bg-slate-800 text-orange-500 focus:ring-orange-500" 
                                        />
                                        <span className={`text-sm font-bold ${selectedExtras[id] ? 'text-white' : 'text-slate-400'}`}>{config.label}</span>
                                    </label>
                                ))}
                            </div>

                            {saveError && (
                                <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/35 text-red-300 text-xs font-bold text-center">
                                    {saveError}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button 
                                    type="button"
                                    onClick={onClose}
                                    disabled={isSaving}
                                    className="flex-1 py-4 rounded-2xl bg-slate-800 text-white font-bold uppercase tracking-widest text-xs active:scale-95 transition-transform disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="button"
                                    disabled={isSaving || totalKcal <= 0}
                                    onClick={() => onConfirm(editableData.mealName || 'Refeição', editableData.description, totalKcal, editableData.protein, editableData.carbs, editableData.fat)}
                                    className="flex-1 py-4 rounded-2xl bg-orange-500 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-orange-500/20 active:scale-95 transition-transform disabled:opacity-40"
                                >
                                    {isSaving ? 'Salvando...' : `Salvar (${totalKcal} kcal)`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        function ConsistencyCalendar({ history, metaKcal, metaProtein }) {
            const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth();
            const totalDays = daysInMonth(month, year);
            const firstDay = new Date(year, month, 1).getDay();
            const firstDayAdjusted = firstDay === 0 ? 6 : firstDay - 1;

            const days = [];
            for (let i = 0; i < firstDayAdjusted; i++) days.push(null);
            for (let i = 1; i <= totalDays; i++) days.push(i);

            // Mapear logs por data local YYYY-MM-DD (evita bug na virada de mês dias 1-6)
            const logsByDate = history.reduce((acc, log) => {
                const key = safeFormatDate(log.created_at);
                if (!key) return acc;
                if (!acc[key]) acc[key] = { kcal: 0, protein: 0 };
                acc[key].kcal += log.calories || 0;
                acc[key].protein += log.protein || 0;
                return acc;
            }, {});

            const firstLog = history.length > 0 ? history.reduce((min, p) => p.created_at < min.created_at ? p : min, history[0]) : null;
            const firstLogStartKey = firstLog ? safeFormatDate(firstLog.created_at) : null;

            const last7Days = Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const key = safeFormatDate(d);
                if (firstLogStartKey && key < firstLogStartKey) return null;
                const dayLogs = logsByDate[key];
                if (!dayLogs) return false;
                return dayLogs.kcal > (metaKcal * 0.8) && dayLogs.kcal < (metaKcal * 1.2);
            });

            const trackedDays = last7Days.filter(d => d !== null);
            const consistencyPct = trackedDays.length === 0 ? 0 : Math.round((trackedDays.filter(Boolean).length / trackedDays.length) * 100);

            return (
                <div className="bg-slate-800/40 border border-white/5 rounded-[32px] p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-white font-black uppercase tracking-tight text-sm">Mapa da Disciplina</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(today)}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/20">
                            <span className="text-sm">🔥</span>
                            <span className="text-orange-400 font-black text-[10px] uppercase">{consistencyPct}% Consistência</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => (
                            <div key={i} className="text-center text-[9px] text-slate-600 font-black mb-1">{d}</div>
                        ))}
                        {days.map((day, i) => {
                            if (!day) return <div key={i} className="aspect-square"></div>;

                            const dDate = new Date(year, month, day);
                            const key = safeFormatDate(dDate);
                            const dayLogs = logsByDate[key];
                            const isToday = day === today.getDate();
                            const isBeforeStart = firstLogStartKey && key < firstLogStartKey;

                            let bgColor = "bg-white/5";
                            let border = "border-white/5";
                            let shadow = "";
                            let textColor = "text-slate-500";

                            if (isBeforeStart) {
                                bgColor = "bg-transparent";
                                border = "border-white/5 opacity-20";
                                textColor = "text-slate-700 opacity-20";
                            } else if (dayLogs) {
                                const isHealthy = dayLogs.kcal > (metaKcal * 0.8) && dayLogs.kcal < (metaKcal * 1.2);
                                if (isHealthy) {
                                    bgColor = "bg-green-500";
                                    border = "border-green-400";
                                    shadow = "shadow-[0_0_10px_rgba(34,197,94,0.3)]";
                                    textColor = "text-slate-900";
                                } else {
                                    bgColor = "bg-amber-500";
                                    border = "border-amber-400";
                                    textColor = "text-slate-900";
                                }
                            }

                            return (
                                <div 
                                    key={i} 
                                    className={`aspect-square rounded-lg border ${border} ${bgColor} ${shadow} flex items-center justify-center relative transition-all ${isToday ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''}`}
                                >
                                    <span className={`text-[10px] font-black ${textColor}`}>{day}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-500">
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-green-500"></div> Meta Batida</div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-amber-500"></div> Fora da Meta</div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-white/5"></div> Sem Registro</div>
                    </div>
                </div>
            );
        }

        const MacroCard = ({ label, current, target, unit, barColor, isSelected, onSelect }) => (
            <div 
                onClick={onSelect}
                className={`bg-slate-800/40 border ${isSelected ? 'border-orange-500/50 scale-105' : 'border-white/5'} rounded-2xl p-4 flex-1 cursor-pointer transition-all active:scale-95`}
            >
                <div className="flex justify-between items-start mb-1">
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{label}</p>
                    <span className="text-[10px] text-slate-600">▼</span>
                </div>
                <div className="flex justify-between items-end mb-2">
                    <span className="text-lg font-black text-white">{current}<span className="text-[10px] text-slate-500 ml-0.5">{unit}</span></span>
                    <span className="text-[10px] text-slate-500 font-bold">/ {target}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                        className={`h-full ${barColor} rounded-full shadow-sm transition-all duration-1000`} 
                        style={{ width: `${Math.min(100, target > 0 ? (current / target) * 100 : 0)}%` }}
                    ></div>
                </div>
            </div>
        );

        function NutritionDashboardView({ 
            nutritionProfile, 
            metaKcal, 
            metaProtein,
            metaCarbs,
            metaFat,
            consumedToday, 
            proteinToday,
            carbsToday,
            fatToday,
            todayLogs,
            progressPct, 
            localHistory, 
            onScanClick,
            aiTextInput,
            setAiTextInput,
            onTextOnlyScan,
            isAnalyzing,
            scanError,
            onDismissScanError,
            onDeleteMeal,
            isTrialMode,
            freeScansRemaining,
            onOpenNutriUpsell,
            onNav,
            hasCustomProfile,
            ud,
            lastSavedTrialBanner,
            onDismissTrialBanner,
            onQuickSampleScan
        }) {
            const [selectedMacro, setSelectedMacro] = React.useState(null);

            const macroSources = {
                'Proteína': 'Frango, Atum, Ovos, Whey Protein, Queijo Cottage/Minas, Patinho Moído.',
                'Carboidratos': 'Arroz Branco/Integral, Batata Doce/Inglesa, Aveia, Mandioca, Frutas.',
                'Gordura': 'Azeite Extra Virgem, Abacate, Castanhas, Amêndoas, Salmão.'
            };

            return (
                <div className="p-5 animate-in fade-in duration-500 pb-32">
                    <div className="page-header mb-4"><h1>📸 Nutri-Scan™ IA</h1></div>

                    {scanError && (
                        <div className="mb-5 p-4 rounded-2xl bg-red-500/15 border border-red-500/35 flex items-start justify-between gap-3">
                            <p className="text-xs text-red-200 font-bold leading-relaxed">{scanError}</p>
                            <button type="button" onClick={onDismissScanError} className="text-red-300 font-black text-base leading-none px-1">&times;</button>
                        </div>
                    )}

                    {lastSavedTrialBanner && isTrialMode && freeScansRemaining > 0 && (
                        <div className="mb-5 p-4 rounded-3xl bg-gradient-to-r from-emerald-500/25 via-emerald-600/15 to-teal-500/15 border border-emerald-400/50 shadow-xl animate-in zoom-in-95 duration-300">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-1">🎉 1ª Análise Salva com Sucesso!</div>
                                    <p className="text-sm text-white font-bold leading-snug">
                                        Incrível! Você descobriu <span className="text-emerald-300">{lastSavedTrialBanner.calories} kcal</span> ({lastSavedTrialBanner.mealName}) em segundos.
                                    </p>
                                    <p className="text-xs text-slate-200 mt-1">
                                        Faltam <strong className="text-white">{lastSavedTrialBanner.remainingKcal} kcal</strong> para sua meta de hoje — você ainda tem <strong className="text-emerald-300">{freeScansRemaining} teste grátis</strong>!
                                    </p>
                                </div>
                                <button type="button" onClick={onDismissTrialBanner} className="text-emerald-200 font-black text-lg leading-none px-1">&times;</button>
                            </div>
                        </div>
                    )}

                    {isTrialMode && freeScansRemaining > 0 && (
                        <div className="bg-gradient-to-r from-emerald-600/20 via-emerald-500/15 to-teal-500/10 border border-emerald-500/35 rounded-3xl p-5 mb-6 shadow-xl">
                            <div className="flex items-center justify-between gap-3 mb-2">
                                <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                    🎁 {freeScansRemaining === 1 ? '1 TESTE GRÁTIS RESTANTE' : `${freeScansRemaining} TESTES GRÁTIS LIBERADOS`}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => onNav && onNav('extras', { focusRedeem: true })}
                                    className="text-[10px] text-emerald-300 font-bold underline"
                                >
                                    Já tenho código
                                </button>
                            </div>
                            <p className="text-sm text-white font-bold leading-snug mb-1">
                                Teste agora na prática, sem pagar nada!
                            </p>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Tire uma foto do seu prato, escolha da galeria ou digite o que você comeu abaixo e veja a IA calcular calorias e macros em segundos.
                            </p>
                        </div>
                    )}

                    {isTrialMode && freeScansRemaining === 0 && (
                        <div className="bg-gradient-to-br from-orange-600/25 via-slate-900 to-slate-900 border border-orange-500/40 rounded-3xl p-6 mb-6 shadow-2xl">
                            <div className="inline-flex items-center gap-1.5 bg-orange-500/20 border border-orange-500/40 text-orange-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                                ✨ Você completou seus 2 testes grátis
                            </div>
                            <h3 className="text-xl font-black text-white leading-tight mb-2">
                                {consumedToday > 0
                                    ? `Você já mapeou ${consumedToday} kcal hoje sem balança!`
                                    : 'Gostou de saber as calorias do seu prato em segundos?'}
                            </h3>
                            <p className="text-xs text-slate-300 leading-relaxed mb-4">
                                Libere análises ilimitadas todos os dias com <strong className="text-white">7 Dias Grátis</strong> (depois apenas R$ 9,90/mês — cancele quando quiser na Hotmart).
                            </p>
                            <div className="flex flex-col gap-2">
                                <button
                                    type="button"
                                    onClick={() => openHotmartCheckout('https://pay.hotmart.com/H106107115U?checkoutMode=10', { placement: 'nutri_limit_card', product: 'nutri_scan', ud })}
                                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-600/25 active:scale-95 transition-all"
                                >
                                    👉 Liberar Nutri-Scan Ilimitado (7 Dias Grátis)
                                </button>
                                <div className="text-center text-[10px] text-slate-400 font-semibold">
                                    ⚡ Apenas R$ 0,33/dia · PIX ou Cartão · 🛡️ Cancele quando quiser na Hotmart
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onNav && onNav('extras', { focusRedeem: true })}
                                    className="w-full py-2 text-[11px] text-slate-400 hover:text-white font-bold underline"
                                >
                                    Já assinou ou tem código? Ativar aqui • Ou veja o Acesso Total sem mensalidade
                                </button>
                            </div>
                        </div>
                    )}

                    {/* FERRAMENTAS DE REGISTRO */}
                    <div className="space-y-4 mb-6">
                        <button 
                            type="button"
                            disabled={isAnalyzing}
                            onClick={onScanClick}
                            className={`w-full relative overflow-hidden group rounded-[28px] p-6 shadow-2xl active:scale-95 transition-transform disabled:opacity-60 ${isTrialMode && freeScansRemaining === 0 ? 'bg-slate-800 border border-orange-500/40' : 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-orange-500/30'}`}
                        >
                            <div className="flex items-center justify-center gap-4">
                                <span className="text-4xl text-white">{isTrialMode && freeScansRemaining === 0 ? '🔒' : '📸'}</span>
                                <div className="text-left">
                                    <div className="text-white font-black text-lg sm:text-xl uppercase tracking-tighter">
                                        {isTrialMode && freeScansRemaining === 0 ? 'Desbloquear Scanner por Foto' : 'Fotografar ou Escolher Foto do Prato'}
                                    </div>
                                    <div className="text-white/80 text-[11px] font-bold">
                                        {isTrialMode && freeScansRemaining > 0
                                            ? `Grátis! Restam ${freeScansRemaining} de ${NUTRISCAN_FREE_LIMIT} testes`
                                            : isTrialMode
                                            ? 'Toque para liberar análises ilimitadas'
                                            : 'Tire uma foto ou envie da galeria e descubra calorias na hora'}
                                    </div>
                                </div>
                            </div>
                        </button>

                        <div className="p-5 bg-white/5 border border-white/10 rounded-[28px] backdrop-blur-md">
                            <p className="text-[11px] text-emerald-300 font-black uppercase tracking-[0.14em] mb-1 ml-1">✍️ Não está com prato agora?</p>
                            <p className="text-xs text-slate-300 mb-3 ml-1">Digite o que comeu na sua última refeição — ou toque em 1 exemplo para testar em 3 segundos:</p>
                            {(!isTrialMode || freeScansRemaining > 0) && onQuickSampleScan && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <button
                                        type="button"
                                        disabled={isAnalyzing}
                                        onClick={() => onQuickSampleScan('2 ovos mexidos, 1 fatia de pão integral e 1 xícara de café com leite')}
                                        className="text-[11px] bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-200 px-3 py-2 rounded-full font-bold transition-all active:scale-95"
                                    >
                                        ☕ Café da manhã (1 toque)
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isAnalyzing}
                                        onClick={() => onQuickSampleScan('150g de frango grelhado, 4 colheres de arroz, feijão e salada verde')}
                                        className="text-[11px] bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-200 px-3 py-2 rounded-full font-bold transition-all active:scale-95"
                                    >
                                        🥗 Almoço (1 toque)
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isAnalyzing}
                                        onClick={() => onQuickSampleScan('Omelete de 2 ovos com queijo branco e salada de tomate')}
                                        className="text-[11px] bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 px-3 py-2 rounded-full font-bold transition-all active:scale-95"
                                    >
                                        🍲 Jantar leve (1 toque)
                                    </button>
                                </div>
                            )}
                            <textarea 
                                id="meal-description-input"
                                value={aiTextInput}
                                disabled={isAnalyzing}
                                onChange={(e) => setAiTextInput(e.target.value)}
                                placeholder="Ex: 2 ovos mexidos, 1 pão integral e 1 xícara de café com leite..."
                                className="w-full bg-slate-900/60 border border-white/10 rounded-2xl p-4 text-white text-sm focus:ring-2 focus:ring-orange-500/50 outline-none transition-all placeholder:text-slate-500 mb-3"
                                style={{ minHeight: '76px', resize: 'none' }}
                            />
                            {aiTextInput?.trim() && (
                                <button 
                                    type="button"
                                    disabled={isAnalyzing}
                                    onClick={() => onTextOnlyScan()}
                                    className="w-full py-3.5 bg-orange-500 hover:bg-orange-400 rounded-xl text-white text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-orange-500/20 disabled:opacity-50"
                                >
                                    {isAnalyzing ? 'Analisando...' : (isTrialMode && freeScansRemaining === 0 ? '🔒 Liberar para Analisar ➔' : 'Calcular Calorias com IA ➔')}
                                </button>
                            )}
                        </div>
                    </div>

                    {(!hasCustomProfile || nutritionProfile?.isProfileIncomplete) && (
                        <button
                            type="button"
                            onClick={() => onNav && onNav('evolucao')}
                            className="w-full text-left bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/25 rounded-2xl p-4 mb-6 flex items-center justify-between gap-3 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">⚖️</span>
                                <p className="text-amber-200 text-xs font-semibold leading-snug">
                                    Meta calórica estimada. Toque aqui para colocar seu peso e altura e personalizar sua meta exata.
                                </p>
                            </div>
                            <span className="text-amber-400 font-black text-xs shrink-0">Ajustar ➔</span>
                        </button>
                    )}

                    {/* Meta Principal */}
                    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-[32px] p-6 border border-white/10 shadow-2xl mb-6">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <p className="text-[10px] text-orange-400 font-black uppercase tracking-[0.2em] mb-1">Meta de Calorias</p>
                                <h3 className="text-4xl font-black text-white">{metaKcal}<span className="text-sm font-bold text-slate-500 ml-1">kcal</span></h3>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Registradas</p>
                                <h3 className="text-2xl font-black text-white">{consumedToday} kcal</h3>
                            </div>
                        </div>
                        <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 mb-3">
                            <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full shadow-[0_0_15px_rgba(255,107,74,0.4)]" style={{ width: `${progressPct}%` }}></div>
                        </div>
                        <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            <span>Zona Ideal: {Math.round(metaKcal * 0.9)} - {Math.round(metaKcal * 1.1)}</span>
                            <span>{progressPct}%</span>
                        </div>
                    </div>

                    {/* Cartões de Macros */}
                    <div className="flex gap-3 mb-4">
                        <MacroCard label="Proteína" current={proteinToday} target={metaProtein} unit="g" barColor="bg-blue-500" isSelected={selectedMacro === 'Proteína'} onSelect={() => setSelectedMacro(selectedMacro === 'Proteína' ? null : 'Proteína')} />
                        <MacroCard label="Carboidratos" current={carbsToday} target={metaCarbs} unit="g" barColor="bg-green-500" isSelected={selectedMacro === 'Carboidratos'} onSelect={() => setSelectedMacro(selectedMacro === 'Carboidratos' ? null : 'Carboidratos')} />
                        <MacroCard label="Gordura" current={fatToday} target={metaFat} unit="g" barColor="bg-yellow-500" isSelected={selectedMacro === 'Gordura'} onSelect={() => setSelectedMacro(selectedMacro === 'Gordura' ? null : 'Gordura')} />
                    </div>

                    {selectedMacro && (
                        <div className="mb-8 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl animate-in zoom-in duration-300">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm">💡</span>
                                <h4 className="text-[10px] text-orange-400 font-black uppercase tracking-widest">Melhores Fontes de {selectedMacro}</h4>
                            </div>
                            <p className="text-xs text-slate-200 font-bold leading-relaxed">{macroSources[selectedMacro]}</p>
                        </div>
                    )}

                    <ConsistencyCalendar history={localHistory} metaKcal={metaKcal} metaProtein={metaProtein} />

                    {/* HISTÓRICO DE HOJE */}
                    <div className="mb-10">
                        <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4 flex items-center gap-2">
                           🕒 Histórico de Hoje
                        </h2>
                        <div className="space-y-3">
                            {todayLogs.length === 0 ? (
                                <div className="bg-slate-800/20 border border-dashed border-white/10 rounded-2xl p-8 text-center text-slate-400 italic text-sm">
                                    Nenhuma refeição registrada hoje. Tire uma foto do seu prato acima para começar!
                                </div>
                            ) : (
                                todayLogs.map((item, idx) => (
                                    <div key={item.id || idx} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="text-xl shrink-0">🍽️</div>
                                            <div className="min-w-0">
                                                <div className="text-sm font-bold text-white truncate">{item.meal_name || item.description || 'Refeição'}</div>
                                                <div className="text-[10px] text-slate-500 uppercase font-black">{new Date(item.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <div className="text-right">
                                                <div className="text-orange-400 font-black">{item.calories} kcal</div>
                                                <div className="text-[8px] text-slate-500 font-black uppercase">P: {item.protein}g | C: {item.carbs}g | G: {item.fat}g</div>
                                            </div>
                                            {item.id && onDeleteMeal && (
                                                <button
                                                    type="button"
                                                    onClick={() => onDeleteMeal(item.id)}
                                                    title="Excluir refeição"
                                                    aria-label="Excluir refeição"
                                                    className="w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center text-xs transition-all"
                                                >
                                                    🗑️
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        function NutritionDashboard({ ud, onNav, hasNutriScanAccess = false, onOpenNutriUpsell }) {
            const [localHistory, setLocalHistory] = React.useState([]);
            const [nutritionProfile, setNutritionProfile] = React.useState(null);
            const [isLoading, setIsLoading] = React.useState(true);
            const [showMealDetails, setShowMealDetails] = React.useState(false);
            const [isAnalyzing, setIsAnalyzing] = React.useState(false);
            const [isSavingMeal, setIsSavingMeal] = React.useState(false);
            const [saveMealError, setSaveMealError] = React.useState('');
            const [scanError, setScanError] = React.useState('');
            const [aiData, setAiData] = React.useState(null);
            const [aiTextInput, setAiTextInput] = React.useState('');
            const [lastSavedTrialBanner, setLastSavedTrialBanner] = React.useState(null);
            const isScanningRef = React.useRef(false);
            const scanCancelIdRef = React.useRef(0);
            const nutritionSummaryRef = React.useRef({ metaKcal: 1632, consumedToday: 0 });

            const quota = ud?.nutriQuota || { hasNutriScan: false, freeScansUsed: 0, freeScansRemaining: NUTRISCAN_FREE_LIMIT };
            const isPaid = Boolean(hasNutriScanAccess || quota.hasNutriScan);
            const freeScansRemaining = isPaid ? Infinity : Math.max(0, quota.freeScansRemaining ?? NUTRISCAN_FREE_LIMIT);
            const isTrialMode = !isPaid;

            React.useEffect(() => {
                ud?.refreshNutriQuota?.();
            }, []);

            const parseFunctionError = async (error) => {
                let status = error?.context?.status || 0;
                let code = '';
                let message = '';
                try {
                    if (error?.context) {
                        const body = await error.context.json();
                        code = body?.code || '';
                        message = body?.error || '';
                    }
                } catch {}
                return { status, code, message };
            };

            const handleApiFailure = async (error) => {
                const { status, code, message } = await parseFunctionError(error);
                if (status === 401 || code === 'UNAUTHORIZED') {
                    setScanError('Sua sessão expirou. Saia e entre novamente na sua conta para usar o Nutri-Scan.');
                    return;
                }
                if (status === 403 || code === 'TRIAL_EXHAUSTED') {
                    ud?.setNutriQuota?.(prev => ({ ...prev, freeScansUsed: NUTRISCAN_FREE_LIMIT, freeScansRemaining: 0, loaded: true }));
                    if (onOpenNutriUpsell) onOpenNutriUpsell('limit_reached');
                    return;
                }
                setScanError(message || 'Não conseguimos analisar esta refeição agora. Tente outra foto com mais luz ou descreva o prato (nenhum teste foi descontado).');
            };

            const applySuccessResponse = (data) => {
                if (typeof data.freeScansRemaining === 'number') {
                    ud?.setNutriQuota?.(prev => ({
                        ...prev,
                        hasNutriScan: Boolean(data.hasNutriScan ?? prev.hasNutriScan),
                        freeScansUsed: typeof data.freeScansUsed === 'number' ? data.freeScansUsed : prev.freeScansUsed,
                        freeScansRemaining: data.freeScansRemaining,
                        loaded: true
                    }));
                }
                setAiData(data);
                setAiTextInput('');
                setSaveMealError('');
                setShowMealDetails(true);
            };

            const cancelCurrentScan = () => {
                scanCancelIdRef.current += 1;
                isScanningRef.current = false;
                setIsAnalyzing(false);
            };

            async function executeScan(file) {
                if (isScanningRef.current) return;
                if (isTrialMode && freeScansRemaining <= 0) {
                    if (onOpenNutriUpsell) onOpenNutriUpsell('limit_reached');
                    return;
                }
                setScanError('');
                isScanningRef.current = true;
                const myScanId = ++scanCancelIdRef.current;
                setIsAnalyzing(true);

                try {
                    const dataUrl = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = (e) => resolve(e.target?.result);
                        reader.onerror = () => reject(new Error('Não foi possível ler a imagem selecionada.'));
                        reader.readAsDataURL(file);
                    });

                    const base64String = await new Promise((resolve, reject) => {
                        const img = new Image();
                        img.onload = () => {
                            try {
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d');
                                const MAX_WIDTH = 800;
                                let width = img.width || 800;
                                let height = img.height || 600;
                                if (width > MAX_WIDTH) {
                                    height = Math.round((height * MAX_WIDTH) / width);
                                    width = MAX_WIDTH;
                                }
                                canvas.width = width;
                                canvas.height = height;
                                ctx.drawImage(img, 0, 0, width, height);
                                const b64 = canvas.toDataURL('image/jpeg', 0.65).split(',')[1];
                                resolve(b64);
                            } catch (canvasErr) {
                                reject(new Error('Formato de foto não suportado. Tente tirar uma foto JPG ou PNG.'));
                            }
                        };
                        img.onerror = () => reject(new Error('Não foi possível abrir esta foto (ex.: HEIC incompatível). Tire a foto direto pela câmera ou escolha JPG/PNG.'));
                        img.src = dataUrl;
                    });

                    if (scanCancelIdRef.current !== myScanId) return;

                    const { data, error } = await window.supabase.functions.invoke('analyze-meal', {
                        body: {
                            image: base64String,
                            mimeType: 'image/jpeg',
                            textInput: aiTextInput,
                            lang: 'pt'
                        }
                    });

                    if (scanCancelIdRef.current !== myScanId) return;
                    if (error || !data) {
                        await handleApiFailure(error);
                        return;
                    }
                    applySuccessResponse(data);
                } catch (err) {
                    if (scanCancelIdRef.current === myScanId) {
                        setScanError(err?.message || 'Erro ao processar a foto. Tente novamente.');
                    }
                } finally {
                    if (scanCancelIdRef.current === myScanId) {
                        isScanningRef.current = false;
                        setIsAnalyzing(false);
                    }
                }
            }

            async function executeTextOnlyScan(overrideText = null) {
                const targetText = (typeof overrideText === 'string' ? overrideText : aiTextInput).trim();
                if (!targetText || isScanningRef.current) return;
                if (isTrialMode && freeScansRemaining <= 0) {
                    if (onOpenNutriUpsell) onOpenNutriUpsell('limit_reached');
                    return;
                }
                setScanError('');
                isScanningRef.current = true;
                const myScanId = ++scanCancelIdRef.current;
                setIsAnalyzing(true);
                try {
                    const { data, error } = await window.supabase.functions.invoke('analyze-meal', {
                        body: {
                            image: null,
                            textInput: targetText,
                            lang: 'pt'
                        }
                    });
                    if (scanCancelIdRef.current !== myScanId) return;
                    if (error || !data) {
                        await handleApiFailure(error);
                        return;
                    }
                    applySuccessResponse(data);
                } catch (err) {
                    if (scanCancelIdRef.current === myScanId) {
                        setScanError('Erro de conexão ao analisar sua refeição. Tente novamente.');
                    }
                } finally {
                    if (scanCancelIdRef.current === myScanId) {
                        isScanningRef.current = false;
                        setIsAnalyzing(false);
                    }
                }
            }

            const analyzeMealImage = () => {
                if (isScanningRef.current) return;
                if (isTrialMode && freeScansRemaining <= 0) {
                    if (onOpenNutriUpsell) onOpenNutriUpsell('limit_reached');
                    return;
                }
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                    const file = e.target?.files?.[0];
                    if (file) executeScan(file);
                };
                input.click();
            };

            const handleConfirmMeal = async (mealName, description, totalCalories, protein, carbs, fat) => {
                if (!window.supabase || isSavingMeal) return;
                setIsSavingMeal(true);
                setSaveMealError('');

                try {
                    const { data: { user } } = await window.supabase.auth.getUser();
                    if (!user) throw new Error("Sessão expirada. Entre novamente.");

                    const savedCals = Math.max(0, Math.round(Number(totalCalories) || 0));
                    const { error } = await window.supabase
                        .from('nutrition_logs')
                        .insert([{
                            user_id: user.id,
                            meal_name: mealName,
                            description: description,
                            calories: savedCals,
                            protein: Math.max(0, Math.round(Number(protein) || 0)),
                            carbs: Math.max(0, Math.round(Number(carbs) || 0)),
                            fat: Math.max(0, Math.round(Number(fat) || 0)),
                            created_at: new Date().toISOString()
                        }]);

                    if (error) throw error;

                    setShowMealDetails(false);
                    window.dispatchEvent(new CustomEvent('nutrition-updated'));

                    const { metaKcal: curMetaKcal, consumedToday: curConsumed } = nutritionSummaryRef.current;
                    const nextConsumed = curConsumed + savedCals;
                    const remainingKcal = Math.max(0, curMetaKcal - nextConsumed);

                    trackConversionEvent('nutri_meal_saved', {
                        placement: isTrialMode ? 'trial' : 'paid',
                        product: 'nutri_scan',
                        metadata: { calories: savedCals, freeScansRemaining: isTrialMode ? freeScansRemaining : -1 }
                    });

                    if (isTrialMode && freeScansRemaining === 1) {
                        setLastSavedTrialBanner({
                            mealName: mealName || 'sua refeição',
                            calories: savedCals,
                            remainingKcal,
                            scansLeft: 1
                        });
                    } else if (isTrialMode && freeScansRemaining === 0) {
                        setLastSavedTrialBanner(null);
                        onOpenNutriUpsell?.('limit_reached', {
                            caloriesToday: nextConsumed,
                            lastMealName: mealName || 'sua refeição',
                            lastMealKcal: savedCals
                        });
                    }
                } catch (err) {
                    console.error("Erro ao gravar refeição:", err);
                    setSaveMealError(err?.message || 'Não foi possível salvar a refeição. Tente novamente.');
                } finally {
                    setIsSavingMeal(false);
                }
            };

            const handleDeleteMeal = async (mealId) => {
                if (!mealId || !window.supabase) return;
                if (!window.confirm('Excluir esta refeição do seu histórico de hoje?')) return;
                const { error } = await window.supabase.from('nutrition_logs').delete().eq('id', mealId);
                if (error) {
                    setScanError('Não foi possível excluir a refeição. Tente novamente.');
                    return;
                }
                setLocalHistory(prev => prev.filter(item => item.id !== mealId));
            };

            const loadNutritionDashboard = React.useCallback(async () => {
                if (!window.supabase) return;
                setIsLoading(true);
                
                try {
                    const { data: { user } } = await window.supabase.auth.getUser();
                    if (!user) {
                        setIsLoading(false);
                        return;
                    }

                    const { data: evoData } = await window.supabase
                        .from('evolucao_corporal')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('data', { ascending: false })
                        .limit(1)
                        .maybeSingle();

                    const { data: profileData } = await window.supabase
                        .from('user_profiles')
                        .select('*')
                        .eq('id', user.id)
                        .maybeSingle();

                    const userAge = (profileData && profileData.idade) ? profileData.idade : 38;
                    const userGender = (profileData && (profileData.gender || profileData.genero)) ? (profileData.gender || profileData.genero) : 'female';
                    const userObjective = (profileData && (profileData.objetivo_principal || profileData.goal)) ? (profileData.objetivo_principal || profileData.goal) : 'Perder Peso';
                    const isProfileIncomplete = (!profileData || !profileData.idade || !(profileData.objetivo_principal || profileData.goal));

                    if (!evoData || !evoData.peso || !evoData.altura_cm) {
                        setNutritionProfile({
                            peso: null,
                            altura: null,
                            idade: parseInt(userAge, 10),
                            genero: userGender,
                            objetivo: userObjective,
                            isProfileIncomplete: true
                        });
                    } else {
                        setNutritionProfile({
                            peso: parseFloat(evoData.peso),
                            altura: parseFloat(evoData.altura_cm),
                            idade: parseInt(userAge, 10),
                            genero: userGender,
                            objetivo: userObjective,
                            isProfileIncomplete: isProfileIncomplete
                        });
                    }

                    try {
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                        const { data: history } = await window.supabase
                            .from('nutrition_logs')
                            .select('*')
                            .eq('user_id', user.id)
                            .gte('created_at', thirtyDaysAgo.toISOString())
                            .order('created_at', { ascending: false });
                        
                        if (history) setLocalHistory(history);
                    } catch (e) {
                        console.error("Erro histórico:", e);
                    }
                } catch (err) {
                    console.error("Erro no carregamento nutrição:", err);
                } finally {
                    setIsLoading(false);
                }
            }, []);

            React.useEffect(() => {
                loadNutritionDashboard();
                const handleUpdate = () => loadNutritionDashboard();
                window.addEventListener('nutrition-updated', handleUpdate);
                return () => window.removeEventListener('nutrition-updated', handleUpdate);
            }, [loadNutritionDashboard]);

            if (isLoading) {
                return (
                    <div className="p-10 flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-400 font-bold animate-pulse text-sm uppercase tracking-widest">Carregando Nutri-Scan...</p>
                    </div>
                );
            }

            const p = nutritionProfile || {};
            const hasCustomProfile = parseFloat(p.peso) > 20 && parseFloat(p.altura) > 50;
            const weight = hasCustomProfile ? parseFloat(p.peso) : 68;
            const goal = p.objetivo || 'Perder Peso';

            let multiplier = 28;
            const lowerGoal = goal.toLowerCase();
            if (lowerGoal.includes('perder') || lowerGoal.includes('emagrecer') || lowerGoal.includes('seca')) {
                multiplier = 24;
            } else if (lowerGoal.includes('ganhar') || lowerGoal.includes('massa') || lowerGoal.includes('bulking')) {
                multiplier = 34;
            }

            const metaKcal = Math.round(weight * multiplier);
            const metaProtein = Math.round(weight * 1.8);
            const metaFat = Math.round(weight * 0.8);
            const kcalFromProt = metaProtein * 4;
            const kcalFromFat = metaFat * 9;
            const metaCarbs = Math.max(50, Math.round((metaKcal - kcalFromProt - kcalFromFat) / 4));

            const todayKey = safeFormatDate(new Date());
            const todayLogs = localHistory.filter(h => safeFormatDate(h.created_at) === todayKey);
            const consumedToday = todayLogs.reduce((acc, curr) => acc + (curr.calories || 0), 0);
            const proteinToday = todayLogs.reduce((acc, curr) => acc + (curr.protein || 0), 0);
            const carbsToday = todayLogs.reduce((acc, curr) => acc + (curr.carbs || 0), 0);
            const fatToday = todayLogs.reduce((acc, curr) => acc + (curr.fat || 0), 0);
            const progressPct = Math.min(100, metaKcal > 0 ? Math.round((consumedToday / metaKcal) * 100) : 0);
            nutritionSummaryRef.current = { metaKcal, consumedToday };

            return (
                <React.Fragment>
                    <NutritionDashboardView 
                        nutritionProfile={nutritionProfile}
                        metaKcal={metaKcal}
                        metaProtein={metaProtein}
                        metaCarbs={metaCarbs}
                        metaFat={metaFat}
                        consumedToday={consumedToday}
                        proteinToday={proteinToday}
                        carbsToday={carbsToday}
                        fatToday={fatToday}
                        todayLogs={todayLogs}
                        progressPct={progressPct}
                        localHistory={localHistory}
                        onScanClick={analyzeMealImage}
                        aiTextInput={aiTextInput}
                        setAiTextInput={setAiTextInput}
                        onTextOnlyScan={executeTextOnlyScan}
                        onQuickSampleScan={(txt) => executeTextOnlyScan(txt)}
                        isAnalyzing={isAnalyzing}
                        scanError={scanError}
                        onDismissScanError={() => setScanError('')}
                        onDeleteMeal={handleDeleteMeal}
                        isTrialMode={isTrialMode}
                        freeScansRemaining={freeScansRemaining}
                        onOpenNutriUpsell={(reason) => onOpenNutriUpsell?.(reason, { caloriesToday: consumedToday })}
                        onNav={onNav}
                        hasCustomProfile={hasCustomProfile}
                        ud={ud}
                        lastSavedTrialBanner={lastSavedTrialBanner}
                        onDismissTrialBanner={() => setLastSavedTrialBanner(null)}
                    />

                    {isAnalyzing && (
                        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center z-[250000] p-6 text-center animate-in fade-in duration-300">
                            <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-6 shadow-[0_0_30px_rgba(255,107,74,0.3)]"></div>
                            <p className="text-white font-black text-xl uppercase tracking-widest animate-pulse">IA Analisando...</p>
                            <p className="text-slate-400 text-xs mt-2 uppercase tracking-tight">Identificando os alimentos e calorias do seu prato</p>
                            <button
                                type="button"
                                onClick={cancelCurrentScan}
                                className="mt-6 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-300 text-xs font-bold"
                            >
                                Cancelar
                            </button>
                        </div>
                    )}

                    <MealDetailsForm 
                        isOpen={showMealDetails}
                        onClose={() => setShowMealDetails(false)}
                        onConfirm={handleConfirmMeal}
                        aiData={aiData}
                        isSaving={isSavingMeal}
                        saveError={saveMealError}
                    />

                </React.Fragment>
            );
        }
        const CHALLENGE_MAP = [
            ['Peito', 'Ombros', 'Bíceps', 'Tríceps', 'Braços'], // 1
            ['Quadríceps', 'Glúteos', 'Posteriores', 'Panturrilhas', 'Membros Inferiores', 'Pernas'], // 2
            ['Costas', 'Lombar', 'Dorsais', 'Trapézio'], // 3
            ['Abdominais', 'Core', 'Cardio'], // 4
            ['Peito', 'Ombros', 'Bíceps', 'Tríceps', 'Braços'], // 5
            ['Quadríceps', 'Glúteos', 'Posteriores', 'Panturrilhas', 'Membros Inferiores', 'Pernas'], // 6
            'Avaliação/Descanso', // 7
            ['Costas', 'Lombar', 'Dorsais', 'Trapézio'], // 8
            ['Abdominais', 'Core', 'Cardio'], // 9
            ['Peito', 'Ombros', 'Bíceps', 'Tríceps', 'Braços'], // 10
            ['Quadríceps', 'Glúteos', 'Posteriores', 'Panturrilhas', 'Membros Inferiores', 'Pernas'], // 11
            ['Costas', 'Lombar', 'Dorsais', 'Trapézio'], // 12
            ['Abdominais', 'Core', 'Cardio'], // 13
            'Avaliação/Descanso', // 14
            ['Peito', 'Ombros', 'Bíceps', 'Tríceps', 'Braços'], // 15
            ['Quadríceps', 'Glúteos', 'Posteriores', 'Panturrilhas', 'Membros Inferiores', 'Pernas'], // 16
            ['Costas', 'Lombar', 'Dorsais', 'Trapézio'], // 17
            ['Abdominais', 'Core', 'Cardio'], // 18
            ['Peito', 'Ombros', 'Bíceps', 'Tríceps', 'Braços'], // 19
            ['Quadríceps', 'Glúteos', 'Posteriores', 'Panturrilhas', 'Membros Inferiores', 'Pernas'], // 20
            'Avaliação/Descanso', // 21
            ['Costas', 'Lombar', 'Dorsais', 'Trapézio'], // 22
            ['Abdominais', 'Core', 'Cardio'], // 23
            ['Peito', 'Ombros', 'Bíceps', 'Tríceps', 'Braços'], // 24
            ['Quadríceps', 'Glúteos', 'Posteriores', 'Panturrilhas', 'Membros Inferiores', 'Pernas'], // 25
            ['Costas', 'Lombar', 'Dorsais', 'Trapézio'], // 26
            ['Abdominais', 'Core', 'Cardio'], // 27
            ['Peito', 'Ombros', 'Bíceps', 'Tríceps', 'Braços'], // 28
            ['Quadríceps', 'Glúteos', 'Posteriores', 'Panturrilhas', 'Membros Inferiores', 'Pernas'], // 29
            'Avaliação/Descanso' // 30
        ];

        const ChallengeExCard = ({ ex, onClick }) => {
            const catLower = (ex.category || '').toLowerCase();
            let img = "muscles.png";
            if (catLower.includes('perna') || catLower.includes('glúteo') || catLower.includes('quad') || catLower.includes('inferior')) img = './assets/categories/pernas.png';
            else if (catLower.includes('costa') || catLower.includes('dors')) img = './assets/categories/costas.png';
            else if (catLower.includes('peito')) img = './assets/categories/peito.png';
            else if (catLower.includes('ombro')) img = './assets/categories/ombros.png';
            else if (catLower.includes('braç') || catLower.includes('bicep') || catLower.includes('tricep') || catLower.includes('superior')) img = './assets/categories/bracos.png';
            else if (catLower.includes('abdom') || catLower.includes('core')) img = './assets/categories/abdominais.png';
            else if (catLower.includes('cardio')) img = './assets/categories/cardio.png';
            else img = './assets/categories/outros.png';

            return (
                <div className="bg-[#211b29] rounded-[20px] overflow-hidden border border-white/5 flex flex-row items-stretch transition-all active:scale-95 shadow-lg shadow-black/40" onClick={() => onClick({id: ex.id, nome: ex.title, media: ex.video_url})} style={{ cursor: 'pointer' }}>
                    <div className="w-24 bg-[#141118] relative flex-shrink-0">
                        <img src={img} onError={(e) => { e.target.src = "muscles.png" }} className="w-full h-full object-cover opacity-50 mix-blend-screen" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-orange-600 shadow-lg shadow-orange-600/30 flex items-center justify-center pl-1 backdrop-blur-sm">
                                <svg viewBox="0 0 24 24" width="12" height="12" fill="white"><path d="M8 5v14l11-7z" /></svg>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-center gap-1.5">
                        <h4 className="font-black italic uppercase text-sm leading-tight text-white line-clamp-2">{ex.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-orange-500 font-black uppercase tracking-widest bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-md">3 SÉRIES</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-1">10 - 15 REPS</span>
                        </div>
                    </div>
                </div>
            );
        };

        function Cronograma({ challengeLog, onCompleteDay, onNav, ud, onSelect }) {
            const [selectedDay, setSelectedDay] = React.useState(() => {
                const lastCompleted = Math.max(0, ...challengeLog);
                return Math.min(30, lastCompleted + 1);
            });
            const [evaluationData, setEvaluationData] = React.useState({ weight: '', feel: '' });
            const [evalError, setEvalError] = React.useState('');
            const [lockedHint, setLockedHint] = React.useState('');
            const [isSaving, setIsSaving] = React.useState(false);
            const [dbData, setDbData] = React.useState(null);
            const [initialWeight, setInitialWeight] = React.useState(null);
            const [lastBioMeta, setLastBioMeta] = React.useState({ altura_cm: null, genero: null });

            // Sincronizar exercícios
            React.useEffect(() => {
                let mounted = true;
                const fetchEx = async () => {
                    try {
                        const { data } = await window.supabase.from('exercises').select('*').eq('is_enabled', true);
                        if (mounted && data) setDbData(data);
                    } catch (e) {
                         if (mounted) setDbData(window.EXERCISES || []);
                    }
                };
                if (window.supabase) fetchEx();
                else setDbData(window.EXERCISES || []);
                return () => { mounted = false; };
            }, []);

            // Carregar peso inicial + última altura/gênero para não quebrar meta do Nutri-Scan
            React.useEffect(() => {
                const fetchBio = async () => {
                    if (!window.supabase || !ud?.session?.user?.id) return;
                    const [{ data: firstRow }, { data: latestRow }] = await Promise.all([
                        window.supabase
                            .from('evolucao_corporal')
                            .select('peso')
                            .eq('user_id', ud.session.user.id)
                            .order('data', { ascending: true })
                            .limit(1)
                            .maybeSingle(),
                        window.supabase
                            .from('evolucao_corporal')
                            .select('altura_cm, genero')
                            .eq('user_id', ud.session.user.id)
                            .order('data', { ascending: false })
                            .limit(1)
                            .maybeSingle()
                    ]);
                    if (firstRow?.peso) setInitialWeight(parseFloat(firstRow.peso));
                    if (latestRow) setLastBioMeta({ altura_cm: latestRow.altura_cm || null, genero: latestRow.genero || null });
                };
                fetchBio();
            }, [ud?.session?.user?.id]);

            const completedCount = challengeLog.length;
            const progressPercent = Math.round((completedCount / 30) * 100);
            
            // Lógica de Rank
            let rank = { name: 'INICIANTE', class: 'rank-recruta', icon: '🥉' };
            if (completedCount >= 24) rank = { name: 'DESTAQUE', class: 'rank-titã', icon: '🔥' };
            else if (completedCount >= 16) rank = { name: 'AVANÇADO', class: 'rank-guerreiro', icon: '🥇' };
            else if (completedCount >= 8) rank = { name: 'CONSTANTE', class: 'rank-elite', icon: '🥈' };

            const totalReps = completedCount * 6 * 3 * 12; 
            const disciplinePct = Math.min(100, Math.round((completedCount / Math.max(1, selectedDay)) * 100));

            const isEvalDay = (day) => [7, 14, 21, 30].includes(day);

            const getDayExercises = React.useMemo(() => {
                const day = selectedDay;
                const mapTargets = CHALLENGE_MAP[day - 1] || 'Avaliação/Descanso';
                
                if (mapTargets === 'Avaliação/Descanso') {
                    return [{ type: 'rest', title: 'DIA DE AVALIAÇÃO E DESCANSO ATIVO', message: 'Sugestão: Caminhada leve de 30 a 45 minutos para recuperação.' }];
                }

                if (!dbData) return [];

                const seededRand = (s) => {
                    const x = Math.sin(s) * 10000;
                    return x - Math.floor(x);
                };

                const pool = dbData.filter(ex => {
                    if (ex.category === 'Outros') return false;
                    const exStr = (ex.category + " " + ex.title + " " + (ex.target_muscle||'')).toLowerCase();
                    return Array.isArray(mapTargets) && mapTargets.some(t => exStr.includes(t.toLowerCase()));
                });

                const tempPool = [...pool];
                if (tempPool.length === 0) {
                    tempPool.push(...dbData.filter(e => e.category !== 'Outros').slice(0, 5));
                }

                const result = [];
                const seedBase = day + (ud?.userProfile?.id?.charCodeAt(0) || 0);
                const numExercises = 6;

                for (let i = 0; i < numExercises && tempPool.length > 0; i++) {
                    const rndIdx = Math.floor(seededRand(seedBase + i) * tempPool.length);
                    result.push({ type: 'exercise', ...tempPool.splice(rndIdx, 1)[0] });
                }
                return result;
            }, [selectedDay, ud?.userProfile?.id, dbData]);

            const isRestDay = CHALLENGE_MAP[selectedDay - 1] === 'Avaliação/Descanso';
            const isBoss = isEvalDay(selectedDay);
            const isCompleted = challengeLog.includes(selectedDay);

            const handleSaveEvaluation = async () => {
                setEvalError('');
                const p = parseFloat(evaluationData.weight);
                if (!p || p < 30 || p > 350) {
                    setEvalError('Informe um peso válido entre 30 e 350 kg.');
                    return;
                }
                setIsSaving(true);
                
                try {
                    if (ud?.session?.user?.id && window.supabase) {
                        const fallbackGender = lastBioMeta.genero || (ud?.userProfile?.gender?.toLowerCase()?.startsWith('m') ? 'm' : 'f');
                        const { data: savedEvo, error: evoErr } = await window.supabase
                            .from('evolucao_corporal')
                            .insert({
                                user_id: ud.session.user.id,
                                peso: p,
                                altura_cm: lastBioMeta.altura_cm,
                                genero: fallbackGender,
                                note: `Desafio 30 Dias - Dia ${selectedDay}${evaluationData.feel ? ` (${evaluationData.feel})` : ''}`
                            })
                            .select()
                            .single();

                        if (evoErr) throw evoErr;
                        if (savedEvo) {
                            try { localStorage.setItem('lastEvolucao', JSON.stringify(savedEvo)); } catch {}
                        }

                        const { error: wlErr } = await window.supabase.from('workout_logs').insert({
                            user_id: ud.session.user.id,
                            exercise_id: `challenge-checkin-day-${selectedDay}`,
                            weight: p,
                            reps: 1,
                            set_number: 1
                        });
                        if (wlErr) console.warn('Aviso check-in workout_logs:', wlErr);
                    }
                    onCompleteDay(selectedDay);
                    if (selectedDay < 30) setSelectedDay(selectedDay + 1);
                    setEvaluationData({ weight: '', feel: '' });
                } catch (err) {
                    console.error("Erro ao gravar check-in:", err);
                    setEvalError('Não foi possível salvar sua avaliação. Verifique sua conexão e tente novamente.');
                } finally {
                    setIsSaving(false);
                }
            };

            const lastCompletedDay = Math.max(0, ...challengeLog);

            return (
                <div className="cronograma-page p-4 sm:p-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-40">
                    
                    {/* Header Dinâmico Modo Titã */}
                    <div className="bg-[#211b29] rounded-[32px] p-8 mb-8 border border-white/5 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 scale-150 pointer-events-none text-orange-500">
                            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`rank-badge ${rank.class}`}>
                                        {rank.icon} {rank.name}
                                    </span>
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase leading-none">
                                    Desafio 30 Dias: <span className="text-orange-500">{rank.name}</span>
                                </h1>
                            </div>
                            <div className="text-right">
                                <span className="text-3xl font-black italic text-white">{progressPercent}%</span>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Conclusão Total</p>
                            </div>
                        </div>

                        <div className="h-3 bg-black/40 rounded-full overflow-hidden mb-6 border border-white/5">
                            <div 
                                className={`h-full transition-all duration-1000 ${rank.name === 'DESTAQUE' ? 'bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400' : 'bg-gradient-to-r from-orange-600 to-orange-400'}`}
                                style={{ width: `${progressPercent}%`, boxShadow: '0 0 20px rgba(255, 107, 74, 0.4)' }}
                            ></div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                                <div className="text-lg font-black text-white italic">{completedCount}/30</div>
                                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Dias</div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                                <div className="text-lg font-black text-white italic">{disciplinePct}%</div>
                                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Disciplina</div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                                <div className="text-lg font-black text-white italic">LVL {Math.floor(completedCount/3) + 1}</div>
                                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Poder</div>
                            </div>
                        </div>
                    </div>

                    {lockedHint && (
                        <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-bold text-center">
                            🔒 {lockedHint}
                        </div>
                    )}

                    {/* Grade de Progressão */}
                    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-3 mb-12">
                        {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                            const isDone = challengeLog.includes(day);
                            const isActive = selectedDay === day;
                            const isLocked = day > (lastCompletedDay + 1);
                            const isBossDay = isEvalDay(day);

                            return (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => {
                                        if (isLocked) {
                                            setLockedHint(`Conclua o Dia ${lastCompletedDay + 1} primeiro para desbloquear o Dia ${day}!`);
                                            return;
                                        }
                                        setLockedHint('');
                                        setSelectedDay(day);
                                    }}
                                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all border-2 active:scale-90 ${
                                        isActive ? 'day-current' : 
                                        isDone ? 'day-completed border-green-500/40' : 
                                        isLocked ? 'day-locked border-white/5' : 
                                        'border-white/10 bg-white/5'
                                    } ${isBossDay ? 'boss-day' : ''}`}
                                >
                                    <span className={`text-xl font-black italic ${isActive ? 'text-white' : isDone ? 'text-green-400' : 'text-slate-500'}`}>
                                        {day}
                                    </span>
                                    {isDone && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-[#1b1622] shadow-lg">
                                            <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12" /></svg>
                                        </div>
                                    )}
                                    {isLocked && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px] rounded-2xl">
                                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Área de Missão / Boss Level */}
                    <div className="bg-[#211b29] rounded-[40px] p-8 border border-white/5 shadow-2xl relative">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                                    <span className="text-orange-500 font-black text-[10px] uppercase tracking-[0.3em] italic">Dia {selectedDay} de 30</span>
                                </div>
                                <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-tight">
                                    {isBoss ? 'Dia de Avaliação Semanal' : isRestDay ? 'Descanso Ativo' : 'Treino do Dia'}
                                </h3>
                            </div>
                            {isCompleted && (
                                <div className="bg-green-500/20 text-green-400 text-[10px] font-black px-5 py-2.5 rounded-full uppercase italic border border-green-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                    Missão Concluída ✓
                                </div>
                            )}
                        </div>

                        {isBoss && isCompleted ? (
                            <div className="text-center py-10">
                                <div className="w-20 h-20 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl">🏆</div>
                                <h4 className="text-xl font-black uppercase italic text-white mb-2">Avaliação do Dia {selectedDay} Concluída!</h4>
                                <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
                                    Seu check-in já foi salvo na aba Evolução. Continue firme para os próximos dias do desafio!
                                </p>
                                {selectedDay < 30 && (
                                    <button
                                        type="button"
                                        onClick={() => setSelectedDay(selectedDay + 1)}
                                        className="px-6 py-3.5 bg-orange-600 hover:bg-orange-500 rounded-2xl text-white font-black text-xs uppercase tracking-widest transition-all"
                                    >
                                        Ir para o Dia {selectedDay + 1} ➔
                                    </button>
                                )}
                            </div>
                        ) : isBoss ? (
                            <div className="evolution-radar p-6 sm:p-8 border border-orange-500/10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-14 h-14 bg-orange-600/20 rounded-2xl flex items-center justify-center text-orange-500 shadow-lg shadow-orange-600/10">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black uppercase italic text-white">Radar de Evolução</h4>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Sincronize seu peso da semana</p>
                                    </div>
                                </div>
                                
                                {initialWeight && (
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Peso Inicial</div>
                                            <div className="text-2xl font-black text-white italic">{initialWeight}kg</div>
                                        </div>
                                        <div className="bg-orange-500/5 p-4 rounded-2xl border border-orange-500/20">
                                            <div className="text-[9px] text-orange-500 font-black uppercase tracking-widest mb-1">Evolução</div>
                                            <div className="text-2xl font-black text-orange-500 italic">
                                                {evaluationData.weight ? (parseFloat(evaluationData.weight) - initialWeight).toFixed(1) : '---'} kg
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            step="0.1"
                                            value={evaluationData.weight}
                                            onChange={e => setEvaluationData({...evaluationData, weight: e.target.value})}
                                            className="w-full bg-black/40 border-none rounded-2xl px-6 py-5 text-white font-black italic text-xl placeholder:text-slate-700 outline-none focus:ring-2 focus:ring-orange-600 transition-all shadow-inner"
                                            placeholder="PESO ATUAL (KG)"
                                        />
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 font-black italic">KG</span>
                                    </div>
                                    <textarea 
                                        value={evaluationData.feel}
                                        onChange={e => setEvaluationData({...evaluationData, feel: e.target.value})}
                                        className="w-full bg-black/40 border-none rounded-2xl px-6 py-5 text-white font-black italic text-lg placeholder:text-slate-700 outline-none focus:ring-2 focus:ring-orange-600 transition-all min-h-[140px] resize-none shadow-inner"
                                        placeholder="COMO VOCÊ ESTÁ SE SENTINDO ESTA SEMANA?"
                                    />
                                    {evalError && (
                                        <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/35 text-red-300 text-xs font-bold text-center">{evalError}</div>
                                    )}
                                    <button 
                                        type="button"
                                        onClick={handleSaveEvaluation}
                                        disabled={isSaving || !evaluationData.weight}
                                        className="w-full py-6 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-orange-600/30 active:scale-95 transition-all disabled:opacity-50 group"
                                    >
                                        {isSaving ? 'SALVANDO...' : (
                                            <span className="flex items-center justify-center gap-3">
                                                SALVAR AVALIAÇÃO SEMANAL 
                                                <svg className="group-hover:translate-x-2 transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : isRestDay ? (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(59,130,246,0.1)] border border-blue-500/20">
                                    <span className="text-5xl">🧘</span>
                                </div>
                                <h4 className="text-2xl font-black italic uppercase mb-4 text-white">Descanso Ativo</h4>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed mb-10 max-w-sm mx-auto italic">
                                    O descanso faz parte do resultado! Hoje foque em alongamentos leves, uma boa caminhada e bastante água.
                                </p>
                                {!isCompleted && (
                                    <button 
                                        type="button"
                                        onClick={() => { onCompleteDay(selectedDay); if(selectedDay < 30) setSelectedDay(selectedDay+1); }}
                                        className="w-full py-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all text-white shadow-xl active:scale-95"
                                    >
                                        ✓ MARCAR DESCANSO COMO FEITO
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {getDayExercises.map(ex => (
                                    <div 
                                        key={ex.id} 
                                        onClick={() => onSelect(ex)}
                                        className="bg-white/5 rounded-[24px] p-5 flex items-center gap-5 group cursor-pointer hover:bg-white/10 transition-all border border-white/5 active:scale-[0.98]"
                                    >
                                        <div className="w-20 h-20 rounded-2xl bg-[#141118] flex items-center justify-center font-black italic text-orange-500 text-xs border border-white/5 overflow-hidden relative">
                                            <div className="absolute inset-0 bg-orange-600/10 group-hover:bg-orange-600/0 transition-colors"></div>
                                            <svg className="opacity-20 group-hover:opacity-100 transition-opacity" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-base font-black italic uppercase text-white leading-tight mb-2 group-hover:text-orange-400 transition-colors">{ex.title}</h4>
                                            <div className="flex gap-4">
                                                <span className="text-[10px] font-black uppercase text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-md">3 SÉRIES</span>
                                                <span className="text-[10px] font-black uppercase text-slate-500 bg-white/5 px-2.5 py-1 rounded-md">12-15 REPS</span>
                                            </div>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-600 group-hover:shadow-[0_0_15px_rgba(255,107,74,0.4)] transition-all">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                        </div>
                                    </div>
                                ))}

                                {!isCompleted && (
                                    <button 
                                        type="button"
                                        onClick={() => { onCompleteDay(selectedDay); if(selectedDay < 30) setSelectedDay(selectedDay+1); }}
                                        className="w-full py-7 mt-8 bg-orange-600 hover:bg-orange-500 rounded-[28px] font-black text-sm uppercase tracking-[0.35em] italic shadow-2xl shadow-orange-600/40 active:scale-95 transition-all text-white flex items-center justify-center gap-4"
                                    >
                                        CONCLUIR PROTOCOLO <span className="text-white/70 text-xs">+1000 XP</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Dashboard de Performance (Visual Tático) */}
                    <div className="mt-12">
                        <div className="flex items-center gap-3 mb-6 px-2">
                            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Relatório Tático de Performance</h4>
                            <div className="h-[2px] flex-1 bg-gradient-l from-transparent to-white/10"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="tactical-stat">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">REPETIÇÕES TOTAIS</span>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>
                                </div>
                                <div className="text-3xl font-black text-white italic mb-1">
                                    {totalReps.toLocaleString()} <span className="text-xs text-slate-500 not-italic uppercase">REPS</span>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
                                    <div className="h-full bg-orange-500/50" style={{ width: `${Math.min(100, (totalReps/6480)*100)}%` }}></div>
                                </div>
                            </div>

                            <div className="tactical-stat">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">DISCIPLINA DE FERRO</span>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                                </div>
                                <div className="text-3xl font-black text-white italic mb-1">
                                    {disciplinePct}%
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
                                    <div className="h-full bg-green-500/50" style={{ width: `${disciplinePct}%` }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.25em]">
                                Plano de Progressão Ativo • Desafio 30 Dias
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        // ================================================================
        // TOOLTIP SYSTEM (Help Helpers)
        // ================================================================

        const TooltipHelp = ({ text, active, setActive }) => (
            <div style={{ position: 'relative', display: 'inline-block', marginLeft: '6px' }}
                onMouseEnter={() => setActive(text)} onMouseLeave={() => setActive(null)}>
                <span style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }}>i</span>
                {active === text && (
                    <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', background: '#251e2e', color: '#fff', padding: '12px', borderRadius: '8px', fontSize: '13px', width: '220px', zIndex: 999, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)', marginBottom: '8px', lineHeight: '1.5' }}>
                        {text}
                    </div>
                )}
            </div>
        );

        const InputField = ({ label, name, ph, tooltip, form, handleChange, activeTooltip, setActiveTooltip }) => {
            const [val, setVal] = useState(form[name] || '');
            useEffect(() => { setVal(form[name] || ''); }, [form[name]]);
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1 1 140px', minWidth: '0', maxWidth: '100%', boxSizing: 'border-box' }}>
                    <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                        {label} {tooltip && <TooltipHelp text={tooltip} active={activeTooltip} setActive={setActiveTooltip} />}
                    </label>
                    <input type="text" inputMode="decimal" name={name} placeholder={ph} value={val}
                        onChange={e => {
                            let v = e.target.value.replace(/,/g, '.');
                            if (/^[0-9]*\.?[0-9]*$/.test(v)) {
                                setVal(v);
                                handleChange({ target: { name, value: v } });
                            }
                        }}
                        style={{ padding: '14px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s', width: '100%', boxSizing: 'border-box' }}
                        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                </div>
            );
        };

        const HydrationSection = ({ session, userProfile }) => {
            const [hydrationToday, setHydrationToday] = useState(0);
            const [customWaterAmount, setCustomWaterAmount] = useState('');
            const [customWaterUnit, setCustomWaterUnit] = useState('ml');
            const [temperature, setTemperature] = useState(null);
            const [dynamicGoal, setDynamicGoal] = useState(2000);
            const [weatherLoading, setWeatherLoading] = useState(true);
            const [hydrationLogs, setHydrationLogs] = useState([]);
            const [showHydrationHistory, setShowHydrationHistory] = useState(false);

            const handleCustomHydration = () => {
                const val = parseFloat(customWaterAmount);
                if (!val || val <= 0) return;
                let mlToAdd = val;
                if (customWaterUnit === 'L') mlToAdd = val * 1000;
                if (mlToAdd > 5000) {
                    alert("Valor demasiado alto para um único registro! (Máx 5L)");
                    return;
                }
                addHydration(mlToAdd);
                setCustomWaterAmount('');
            };

            const addHydration = async (ml) => {
                const { data, error } = await window.supabase.from('registos_hidratacao').insert({
                    user_id: session.user.id,
                    quantidade_ml: ml
                }).select().single();
                if (data) {
                    setHydrationToday(prev => prev + ml);
                    setHydrationLogs(prev => [data, ...prev]);
                } else if (error) {
                    alert('Erro ao registar hidratação.');
                }
            };

            const removeHydration = async (id, ml) => {
                const { error } = await window.supabase.from('registos_hidratacao').delete().eq('id', id);
                if (!error) {
                    setHydrationToday(prev => Math.max(0, prev - ml));
                    setHydrationLogs(prev => prev.filter(log => log.id !== id));
                } else {
                    alert('Erro ao remover registro.');
                }
            };

            useEffect(() => {
                const fetchWeather = async () => {
                    setWeatherLoading(true);
                    if (userProfile && userProfile.estado) {
                        const cacheKey = `weather_${userProfile.estado}`;
                        const cached = localStorage.getItem(cacheKey);
                        if (cached) {
                            try {
                                const { temp, timestamp } = JSON.parse(cached);
                                if ((Date.now() - timestamp) <= (12 * 60 * 60 * 1000)) {
                                    setTemperature(temp);
                                    setWeatherLoading(false);
                                    return;
                                }
                            } catch (e) { }
                        }
                        try {
                            const res = await fetch(`https://wttr.in/${encodeURIComponent(userProfile.estado)}?format=j1`);
                            if (res.ok) {
                                const data = await res.json();
                                if (data?.current_condition?.[0]) {
                                    const temp = parseInt(data.current_condition[0].temp_C, 10);
                                    if (!isNaN(temp)) {
                                        setTemperature(temp);
                                        try { localStorage.setItem(cacheKey, JSON.stringify({ temp, timestamp: Date.now() })); } catch {}
                                    }
                                }
                            }
                        } catch (e) {}
                    }
                    setWeatherLoading(false);
                };
                fetchWeather();
            }, [userProfile?.estado]);

            useEffect(() => {
                let extra = 0;
                if (temperature !== null) {
                    if (temperature > 33) extra = 1000;
                    else if (temperature > 28) extra = 500;
                }
                setDynamicGoal(2000 + extra);
            }, [temperature]);

            useEffect(() => {
                if (session) {
                    const now = new Date();
                    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).toISOString();
                    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString();
                    window.supabase.from('registos_hidratacao')
                        .select('*')
                        .eq('user_id', session.user.id)
                        .gte('data', startOfDay)
                        .lte('data', endOfDay)
                        .order('data', { ascending: false })
                        .then(({ data }) => {
                            if (data) {
                                setHydrationToday(data.reduce((acc, curr) => acc + curr.quantidade_ml, 0));
                                setHydrationLogs(data);
                            }
                        });
                }
            }, [session]);

            return (
                <div className="progress-section-card" style={{ background: 'linear-gradient(135deg, rgba(37, 30, 46, 0.4) 0%, rgba(27, 22, 34, 0.6) 100%)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '28px', padding: '24px', marginBottom: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: 0 }}>
                            <span style={{ color: '#38bdf8', fontSize: '24px' }}>💧</span> Hidratação Dinâmica
                        </h3>
                    </div>

                    {/* Climate Intel Widget */}
                    {temperature > 28 && (
                        <div className="mb-6 bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2">
                            <span className="text-2xl">☀️</span>
                            <div>
                                <div className="text-[10px] text-orange-500 font-black uppercase tracking-widest">Alerta de Calor: {temperature}°C</div>
                                <div className="text-[11px] text-slate-200 font-medium leading-tight">Recomendamos reduzir o volume ou aumentar a hidratação em 500ml.</div>
                            </div>
                        </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                        <div className={`water-circle-container ${hydrationToday >= dynamicGoal ? 'goal-reached' : ''}`} style={{ width: '180px', height: '180px' }}>
                            <svg viewBox="0 0 100 100" className="water-svg">
                                <defs>
                                    <linearGradient id="waterGradientHome" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#0ea5e9" />
                                        <stop offset="100%" stopColor="#0369a1" />
                                    </linearGradient>
                                    <path id="waveHome" d="M 0,10 C 30,10 30,15 60,15 90,15 90,10 120,10 150,10 150,15 180,15 210,15 210,10 240,10 v 100 h -240 z" />
                                </defs>
                                <mask id="circleMaskHome">
                                    <circle cx="50" cy="50" r="50" fill="white" />
                                </mask>
                                <g mask="url(#circleMaskHome)">
                                    <rect width="100" height="100" fill="rgba(56, 189, 248, 0.1)" />
                                    <g className="wave-group" style={{ transform: `translateY(${100 - Math.min(100, (hydrationToday / dynamicGoal * 100))}px)`, transition: 'transform 1s ease' }}>
                                        <use xlinkHref="#waveHome" x="0" y="0" className="wave-anim-1" fill="rgba(14, 165, 233, 0.6)" />
                                        <use xlinkHref="#waveHome" x="0" y="0" className="wave-anim-2" fill="url(#waterGradientHome)" />
                                    </g>
                                </g>
                            </svg>
                            <div className="water-text">
                                <span style={{ fontSize: '32px', fontWeight: '900', lineHeight: 1 }}>{Math.round(hydrationToday / dynamicGoal * 100)}%</span>
                                <span style={{ fontSize: '11px', fontWeight: 'bold', opacity: 0.8, marginTop: '4px' }}>{hydrationToday}/{dynamicGoal}ML</span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ color: '#38bdf8', fontSize: '13px', fontWeight: '800', margin: 0 }}>
                                Clima de {userProfile?.estado || 'sua região'}: {temperature !== null ? temperature + '°C' : '--°C'}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                            <button onClick={() => addHydration(250)} className="hydration-btn-clean" style={{ padding: '12px', flex: 1 }}>
                                <span style={{ fontSize: '24px' }}>🥛</span>
                                <span style={{ fontSize: '12px', fontWeight: '900' }}>+250ml</span>
                            </button>
                            <button onClick={() => addHydration(500)} className="hydration-btn-clean" style={{ padding: '12px', flex: 1 }}>
                                <span style={{ fontSize: '24px' }}>🍾</span>
                                <span style={{ fontSize: '12px', fontWeight: '900' }}>+500ml</span>
                            </button>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '16px', width: '100%', boxSizing: 'border-box' }}>
                            <input type="number" className="custom-water-input" placeholder="ML" value={customWaterAmount} onChange={(e) => setCustomWaterAmount(e.target.value)} style={{ width: '80px', background: 'transparent', color: '#fff', border: 'none', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }} />
                            <button onClick={handleCustomHydration} style={{ flex: 1, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: '900', fontSize: '11px', cursor: 'pointer', textTransform: 'uppercase' }}>ADICIONAR</button>
                        </div>
                        <button onClick={() => setShowHydrationHistory(!showHydrationHistory)} style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {showHydrationHistory ? 'Ocultar Detalhes' : 'Ver Registros Hoje'}
                        </button>
                        {showHydrationHistory && (
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                                {hydrationLogs.map(log => (
                                    <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                        <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>{log.quantidade_ml}ml</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{new Date(log.data).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            <button onClick={() => removeHydration(log.id, log.quantidade_ml)} style={{ color: '#ef4444', fontSize: '12px' }}>✕</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            );
        };

        function SonoProfundo({ ud }) {
            const [showModal, setShowModal] = useState(false);
            const [sleepLogs, setSleepLogs] = useState([]);
            const [loading, setLoading] = useState(true);
            const [selectedTimer, setSelectedTimer] = useState(null);

            // Info do Mês Atual
            const currentMonthInfo = React.useMemo(() => {
                const now = new Date();
                const mName = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(now);
                return {
                    name: mName.charAt(0).toUpperCase() + mName.slice(1),
                    year: now.getFullYear(),
                    month: now.getMonth()
                };
            }, []);

            // Heatmap Real Data (Dias do Mês)
            const heatmapDays = React.useMemo(() => {
                const { year, month } = currentMonthInfo;
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                
                return Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                    const log = sleepLogs.find(l => l.data === dateStr);
                    
                    if (log) {
                        const q = log.qualidade;
                        let color = 'bg-red-900/50';
                        if (q >= 80) color = 'bg-green-500/50';
                        else if (q >= 50) color = 'bg-orange-500/50';
                        return { color, day };
                    }
                    return { color: 'bg-slate-800/40', day };
                });
            }, [sleepLogs, currentMonthInfo]);

            // Lógica de Cronotipo e Ciclo Circadiano
            const chronoData = React.useMemo(() => {
                if (sleepLogs.length === 0) return { type: 'Urso', advice: 'Sincronizado com o dia. Treine perto do meio-dia.', bedtime: '23:00', pct: 0 };
                
                // Média de hora de deitar (convertida para minutos desde meia-noite)
                const avgBedtimeMins = sleepLogs.reduce((acc, log) => {
                    const [h, m] = (log.hora_deitar || '23:00').split(':').map(Number);
                    let total = h * 60 + m;
                    if (h < 12) total += 1440; // Se deitar depois da meia-noite
                    return acc + total;
                }, 0) / sleepLogs.length;

                const avgH = Math.floor(avgBedtimeMins / 60) % 24;
                const avgM = Math.round(avgBedtimeMins % 60);
                const bedtimeStr = `${avgH.toString().padStart(2, '0')}:${avgM.toString().padStart(2, '0')}`;

                let type = 'Urso';
                let advice = 'Sincronizado com o dia. Treine entre 11h e 13h.';
                if (avgBedtimeMins < 1320) { // Antes das 22h
                    type = 'Leão';
                    advice = 'Acorda cedo com disposição. Seu pico de energia é pela manhã (08h - 10h).';
                } else if (avgBedtimeMins > 1440) { // Depois da meia-noite
                    type = 'Lobo';
                    advice = 'Pico de energia à tarde. Evite treinos intensos antes das 10h.';
                }

                // Cálculo de aproveitamento da janela hormonal (22:30 - 02:00)
                // Simplificação: se dormir dentro do intervalo, soma pontos
                const goldStart = 1350; // 22:30
                const goldEnd = 1560;   // 02:00
                const overlap = Math.max(0, Math.min(avgBedtimeMins + 480, goldEnd) - Math.max(avgBedtimeMins, goldStart));
                const pct = Math.round((overlap / (goldEnd - goldStart)) * 100);

                return { type, advice, bedtime: bedtimeStr, pct, avgMins: avgBedtimeMins };
            }, [sleepLogs]);

            // Lógica da Calculadora de Ciclos
            const wakeUpCycles = React.useMemo(() => {
                const now = new Date();
                return [3, 4, 5, 6].map(num => {
                    const time = new Date(now.getTime() + num * 90 * 60 * 1000);
                    return {
                        time: time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                        cycles: num,
                        hours: num * 1.5
                    };
                });
            }, []);

            const sleepDebt = React.useMemo(() => {
                if (sleepLogs.length === 0) return { h: 0, m: 0, total: 0 };
                const goalPerDay = 8;
                const recentLogs = sleepLogs.slice(0, 7);
                const actualTotalMins = recentLogs.reduce((acc, log) => acc + (parseFloat(log.horas_dormidas) || 0) * 60, 0);
                const goalTotalMins = recentLogs.length * goalPerDay * 60;
                const debtMins = goalTotalMins - actualTotalMins;

                if (debtMins <= 0) return { h: 0, m: 0, total: 0 };
                return {
                    h: Math.floor(debtMins / 60),
                    m: Math.round(debtMins % 60),
                    total: debtMins
                };
            }, [sleepLogs]);

            // Checklist state (localStorage)
            const [checklist, setChecklist] = useState(() => {
                try {
                    const saved = localStorage.getItem('sleep_checklist_today');
                    const lastDate = localStorage.getItem('sleep_checklist_date');
                    const today = new Date().toDateString();
                    if (lastDate === today && saved) return JSON.parse(saved);
                } catch(e) {}
                return { screens: false, dark: false, supplements: false };
            });

            useEffect(() => {
                localStorage.setItem('sleep_checklist_today', JSON.stringify(checklist));
                localStorage.setItem('sleep_checklist_date', new Date().toDateString());
            }, [checklist]);

            const fetchSleep = async () => {
                const { data: { session } } = await window.supabase.auth.getSession();
                if (!session) return;
                const { data } = await window.supabase
                    .from('registos_sono')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .order('data', { ascending: false })
                    .limit(31);
                if (data) setSleepLogs(data);
                setLoading(false);
            };

            useEffect(() => {
                fetchSleep();
            }, []);

            const today = safeFormatDate(new Date());
            const todayLog = sleepLogs.find(l => l.data === today);
            const lastLog = todayLog || null;

            const workoutsToday = ud.completedLog.filter(log => safeFormatDate(log.ts) === today).length;

            const statusBadgeStyles = {
                slate: { box: 'bg-slate-500/10 border-slate-500/30', iconBg: 'bg-slate-500/20', title: 'text-slate-200', text: 'text-slate-400' },
                orange: { box: 'bg-orange-500/10 border-orange-500/30', iconBg: 'bg-orange-500/20', title: 'text-orange-200', text: 'text-orange-400' }
            };

            let statusBadge = { icon: '🧘', styleKey: 'slate', title: 'Recuperação Otimizada', text: 'Sem carga intensa hoje. Foco em regeneração celular e descanso.' };
            if (workoutsToday >= 3) { statusBadge = { icon: '🔥', styleKey: 'orange', title: 'Super-Compensação Necessária', text: 'Treino intenso detectado. O corpo pede +1h de sono para reparação muscular.' }; } 
            else if (workoutsToday > 0) { statusBadge = { icon: '⚡', styleKey: 'orange', title: 'Manutenção de Ritmo', text: 'Carga moderada detectada. Mantenha a meta de 8h para consolidar seus ganhos.' }; }

            const badgeCls = statusBadgeStyles[statusBadge.styleKey];
            const recentSleepDays = sleepLogs.filter(l => {
                const diff = (Date.now() - new Date(l.data + 'T12:00:00').getTime()) / (1000 * 60 * 60 * 24);
                return diff >= 0 && diff <= 7;
            });
            const consistency = recentSleepDays.length > 0 ? `${Math.min(100, Math.round((recentSleepDays.length / 7) * 100))}%` : '--';

            return (
                <div className={`max-w-xl mx-auto py-2 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-700 px-4 transition-all`}>
                    
                    {/* Header: Cronotipo & Recovery Status */}
                    <div className="flex flex-col gap-4 mb-8">
                        <div className="flex items-center justify-between">
                            <div className="bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-2xl flex items-center gap-3">
                                <div className="text-xl">{chronoData.type === 'Leão' ? '🦁' : chronoData.type === 'Lobo' ? '🐺' : '🐻'}</div>
                                <div>
                                    <p className="text-[8px] font-black text-orange-500 uppercase tracking-widest">Cronotipo Detectado</p>
                                    <p className="text-xs font-black text-white italic">{chronoData.type}</p>
                                </div>
                            </div>
                            <div className="flex-1 ml-4 bg-slate-900/40 border border-white/5 px-4 py-2 rounded-2xl">
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Dica de Performance</p>
                                <p className="text-[10px] font-bold text-slate-300 leading-tight">{chronoData.advice}</p>
                            </div>
                        </div>

                        {/* Alerta de Status de Recuperação */}
                        <div className={`${badgeCls.box} border rounded-[32px] p-5 flex items-center gap-4 animate-in slide-in-from-top-4 duration-1000`}>
                            <div className={`w-12 h-12 ${badgeCls.iconBg} rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0`}>{statusBadge.icon}</div>
                            <div>
                                <p className={`${badgeCls.title} text-[12px] font-black uppercase tracking-tight leading-tight`}>{statusBadge.title}</p>
                                <p className={`${badgeCls.text} text-[10px] font-bold mt-1`}>{statusBadge.text}</p>
                            </div>
                        </div>
                    </div>

                    {/* A. Hero: Sleep Score & Circadian Arc */}
                    <div className="flex flex-col items-center mb-10 relative">
                        {/* Sleep Debt Indicator (Dinâmico) */}
                        {sleepDebt.total > 0 && (
                            <div className="absolute -top-4 -right-2 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-full animate-pulse z-20 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                <span className="text-[10px] font-black text-red-500 uppercase tracking-tighter italic">Dívida: -{sleepDebt.h}h {sleepDebt.m}m</span>
                            </div>
                        )}

                        <div className="relative w-64 h-64 flex flex-col items-center justify-center">
                            {/* Janela de Melatonina SVG Arc (Atrás do principal) */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90 scale-125 opacity-20">
                                {/* Golden Window: 22:30 - 02:00 (Aproximadamente 90 graus de arco) */}
                                <circle cx="128" cy="128" r="115" fill="none" stroke="rgba(251, 191, 36, 0.2)" strokeWidth="4" />
                                <path d="M 128,13 A 115,115 0 0 1 243,128" fill="none" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round" />
                            </svg>

                            <svg className="relative w-56 h-56 -rotate-90">
                                <circle cx="112" cy="112" r="100" fill="none" stroke="rgba(255, 107, 74, 0.05)" strokeWidth="12" />
                                <circle cx="112" cy="112" r="100" fill="none" stroke="url(#sleepOrangeGradient)" strokeWidth="12" 
                                    strokeDasharray="628" strokeDashoffset={lastLog ? 628 - (628 * lastLog.qualidade) / 100 : 628} 
                                    strokeLinecap="round" className="transition-all duration-1000" />
                                <defs>
                                    <linearGradient id="sleepOrangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#ff6b4a" />
                                        <stop offset="100%" stopColor="#fbbf24" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 pt-4">
                                {lastLog ? (
                                    <React.Fragment>
                                        <span className="block text-5xl font-black text-white italic">{lastLog.qualidade}%</span>
                                        <span className="block text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mt-1">Qualidade de Elite</span>
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <span className="block text-4xl font-black text-slate-700 italic">--%</span>
                                        <span className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Sem Dados Hoje</span>
                                    </React.Fragment>
                                )}
                            </div>
                        </div>
                        
                        {/* Circadian Insight */}
                        <div className="mt-6 flex flex-col items-center gap-2">
                            <div className="bg-amber-500/5 px-4 py-1.5 rounded-full border border-amber-500/20 text-center">
                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                                    Aproveitamento da Janela Hormonal: <span className="text-white italic">{chronoData.pct}%</span>
                                </span>
                            </div>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight max-w-[240px] text-center leading-tight">
                                Você está aproveitando {chronoData.pct}% da sua janela de recuperação hormonal profunda.
                            </p>
                        </div>
                    </div>



                    {/* Calculadora de Ciclos (NEW) */}
                    <div className="mb-10">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="text-orange-500">⏰</span> Se eu dormir agora...
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            {wakeUpCycles.map(c => (
                                <div key={c.cycles} className="bg-slate-900/40 border border-white/5 p-4 rounded-3xl text-center group hover:bg-slate-900/60 transition-all">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Acordar Descansada</p>
                                    <p className="text-xl font-black text-white italic group-hover:text-orange-400 transition-colors">{c.time}</p>
                                    <p className="text-[8px] font-black text-slate-600 uppercase mt-1 tracking-widest">{c.cycles} CICLOS ({c.hours}H)</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bolha de Insights (Coach IA Advanced Correlation) */}
                    <div className="bg-gradient-to-br from-slate-900/40 to-slate-800/40 border border-white/5 rounded-[32px] p-6 mb-10 flex items-start gap-4">
                        <div className="text-2xl animate-bounce" style={{ animationDuration: '3s' }}>💡</div>
                        <div>
                            <h4 className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Dica da Mariana</h4>
                            <p className="text-white text-xs font-medium leading-relaxed">
                                {sleepDebt.total > 120 ? 
                                    `Atenção: você acumulou ${sleepDebt.h}h de cansaço. Tente descansar 8h–9h hoje para recuperar sua energia.` :
                                    (lastLog?.qualidade > 85 ? 
                                        "Ótima noite de descanso! Seu corpo está pronto e cheio de energia para o treino de hoje." :
                                        (checklist.screens ? 
                                            "Parabéns! Ficar longe das telas antes de dormir está melhorando muito seu sono." :
                                            "Dica: desligar o celular 1h antes de deitar pode melhorar sua qualidade de sono em 15%."
                                        )
                                    )
                                }
                            </p>
                        </div>
                    </div>

                    {/* Padrão de Consistência Mensal (Heatmap) */}
                    <div className="mb-10">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center justify-between">
                            <span className="flex items-center gap-2"><span className="text-orange-500">🗓️</span> Padrão Mensal</span>
                            <span className="text-[9px] text-slate-500 uppercase tracking-widest italic font-bold">Mês de {currentMonthInfo.name}</span>
                        </h4>
                        <div className="bg-slate-900/40 border border-white/5 rounded-[32px] p-6 shadow-inner">
                            <div className="grid grid-cols-10 gap-2 mb-4">
                                {heatmapDays.map((d, i) => (
                                    <div key={i} className={`aspect-square rounded-md ${d.color} transition-all hover:scale-110 shadow-sm flex items-center justify-center border border-white/[0.03]`} title={`Dia ${d.day}`}>
                                        <span className="text-[6px] font-black text-white/10">{d.day}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center text-[8px] font-black text-slate-500 uppercase tracking-widest">
                                <span>Menos Descanso</span>
                                <div className="flex gap-1.5 items-center">
                                    <div className="w-2.5 h-2.5 rounded-sm bg-slate-800/40" title="Sem Registo"></div>
                                    <div className="w-2.5 h-2.5 rounded-sm bg-red-900/50"></div>
                                    <div className="w-2.5 h-2.5 rounded-sm bg-orange-500/50"></div>
                                    <div className="w-2.5 h-2.5 rounded-sm bg-green-500/50"></div>
                                </div>
                                <span>Recuperação Elite</span>
                            </div>
                        </div>
                    </div>

                    {/* B. Cards de Bio-Métricas */}
                    <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-5 hover:bg-slate-900/80 transition-all group">
                            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">⭐</div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Qualidade</div>
                            <div className="text-lg font-black text-white italic">{lastLog ? `${lastLog.qualidade/10}/10` : '--/10'}</div>
                        </div>
                        <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-5 hover:bg-slate-900/80 transition-all group">
                            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">⚡</div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Energia</div>
                            <div className="text-lg font-black text-white italic">{lastLog ? lastLog.feeling : '--'}</div>
                        </div>
                        <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-5 hover:bg-slate-900/80 transition-all group">
                            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🛏️</div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Tempo na Cama</div>
                            <div className="text-lg font-black text-white italic">{lastLog ? `${Math.floor(lastLog.horas_dormidas)}h ${Math.round((lastLog.horas_dormidas % 1) * 60)}m` : '--h --m'}</div>
                        </div>
                        <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-5 hover:bg-slate-900/80 transition-all group">
                            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📈</div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Consistência</div>
                            <div className="text-lg font-black text-white italic">{consistency}</div>
                        </div>
                    </div>

                    {/* C. Gráfico de Ciclo de Sono com Meta Visual */}
                    <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 mb-10 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <span className="text-orange-500">📊</span> Histórico de Horas
                            </h4>
                            <span className="text-[10px] text-slate-500 font-bold">Últimos 7 dias</span>
                        </div>
                        <div className="h-40 flex items-end gap-2 px-2 relative mt-4">
                            <div className="absolute left-0 right-0 border-t border-dashed border-orange-500/30 z-0 pointer-events-none" style={{ bottom: '66.6%' }}>
                                <span className="absolute right-0 -top-3 text-[8px] font-black text-orange-500/50 uppercase tracking-tighter">Meta: 8h</span>
                            </div>

                            {sleepLogs.length > 0 ? sleepLogs.slice(0, 7).reverse().map((l, i) => (
                                <div key={i} className="flex-1 bg-gradient-to-t from-orange-600/40 to-amber-500/60 rounded-t-lg z-10 transition-all hover:opacity-80" style={{ height: `${Math.min((l.horas_dormidas / 12) * 100, 100)}%` }}></div>
                            )) : (
                                <div className="w-full h-full flex items-center justify-center border-t border-white/5 border-dashed">
                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Sem Histórico</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* D. Checklist de Higiene do Sono */}
                    <div className="mb-10">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="text-orange-500">🌙</span> Rotina Noturna
                        </h4>
                        <div className="bg-slate-900/40 border border-white/5 rounded-[32px] p-6 space-y-4">
                            {[
                                { id: 'screens', label: 'Sem celular/telas (1h antes)', icon: '📵' },
                                { id: 'dark', label: 'Quarto escuro e fresco', icon: '❄️' },
                                { id: 'supplements', label: 'Chá relaxante ou rotina feita', icon: '🍵' }
                            ].map(item => (
                                <div 
                                    key={item.id} 
                                    onClick={() => setChecklist({...checklist, [item.id]: !checklist[item.id]})}
                                    className="flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-lg bg-white/5 w-10 h-10 rounded-xl flex items-center justify-center">{item.icon}</div>
                                        <span className={`text-xs font-bold transition-colors ${checklist[item.id] ? 'text-white' : 'text-slate-500'}`}>{item.label}</span>
                                    </div>
                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${checklist[item.id] ? 'bg-orange-500 border-orange-500' : 'border-white/10 bg-white/5'}`}>
                                        {checklist[item.id] && <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* E. Mixer de Áudio com Temporizador */}
                    <div className="mb-10">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="text-orange-500">🎧</span> Áudios Relaxantes
                        </h4>
                        <div className="flex flex-col gap-2 mb-6">
                            {[
                                { id: 'forest', label: 'Som Relaxante', icon: '😴', file: 'forest-noise.mp3' },
                                { id: 'brown', label: 'Ruído Castanho', icon: '🟤', file: 'brown-noise.mp3' }
                            ].map(sound => {
                                const isPlaying = ud.currentAudioId === sound.id;
                                return (
                                    <button 
                                        key={sound.id} 
                                        onClick={() => {
                                            if (isPlaying) {
                                                ud.stopAudio();
                                            } else {
                                                const durationMs = selectedTimer ? selectedTimer * 60 * 1000 : null;
                                                ud.playAudio(sound.id, sound.file, durationMs);
                                            }
                                        }}
                                        className={`w-full bg-slate-900/60 hover:bg-slate-900/80 border ${isPlaying ? 'border-orange-500' : 'border-white/5'} p-4 rounded-2xl flex items-center justify-between group transition-all`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl ${isPlaying ? 'bg-orange-500/20' : 'bg-white/5'} flex items-center justify-center text-xl`}>{sound.icon}</div>
                                            <span className={`text-sm font-bold ${isPlaying ? 'text-orange-500' : 'text-white'}`}>{sound.label}</span>
                                        </div>
                                        <div className={`w-8 h-8 rounded-full ${isPlaying ? 'bg-orange-600 animate-pulse' : 'bg-white/5'} flex items-center justify-center group-hover:bg-orange-600 transition-all`}>
                                            {isPlaying ? (
                                                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                                            ) : (
                                                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Temporizador Pills */}
                        <div className="flex items-center justify-between mb-3 px-1">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                Desligar Automaticamente
                            </span>
                            {selectedTimer && <span className="text-[9px] text-orange-500 font-bold uppercase animate-pulse">Ativo</span>}
                        </div>
                        <div className="flex gap-2 px-1">
                            {[30, 60, 90].map(m => (
                                <button 
                                    key={m} 
                                    onClick={() => setSelectedTimer(selectedTimer === m ? null : m)}
                                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${
                                        selectedTimer === m ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20'
                                    }`}
                                >
                                    {m} MIN
                                </button>
                            ))}
                        </div>
                        {selectedTimer && (
                            <p className="text-[9px] text-orange-500/60 font-bold uppercase tracking-widest text-center mt-3 animate-pulse">
                                Desligamento automático ativo em {selectedTimer} minutos
                            </p>
                        )}
                    </div>

                    {/* F. Protocolos de Relaxamento */}
                    <div className="mb-10">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="text-orange-500">🧠</span> Dicas para Dormir Profundo
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                            <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/20 p-5 rounded-3xl">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-lg">🧬</div>
                                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Passo 1: Desacelerar a Mente</span>
                                </div>
                                <p className="text-[11px] text-slate-300 font-medium">Use o Ruído Castanho ou Som Relaxante durante 20 min antes de dormir para acalmar os pensamentos.</p>
                            </div>
                            <div className="bg-gradient-to-r from-purple-900/20 to-fuchsia-900/20 border border-purple-500/20 p-5 rounded-3xl">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-lg">🔥</div>
                                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Passo 2: Pausa nas Telas</span>
                                </div>
                                <p className="text-[11px] text-slate-300 font-medium">Evite luz forte do celular 1h antes de deitar — seu corpo libera melatonina muito mais rápido no escuro.</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Fixo Premium */}
                    <div className="fixed left-0 right-0 z-[500] px-4 py-4 bg-slate-950/85 backdrop-blur-2xl border-t border-white/5 sm:bottom-4 sm:left-auto sm:right-4 sm:w-[400px] sm:rounded-3xl sm:border" style={{ bottom: 'calc(68px + env(safe-area-inset-bottom, 0px))' }}>
                        <div className="max-w-md mx-auto">
                            <button 
                                onClick={() => setShowModal(true)}
                                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white font-black py-4 rounded-2xl shadow-[0_12px_30px_rgba(255,107,74,0.3)] active:scale-[0.98] transition-all text-sm uppercase tracking-tighter"
                            >
                                🌙 REGISTRAR NOITE DE SONO
                            </button>
                        </div>
                    </div>

                    {showModal && <SleepLogModal onClose={() => setShowModal(false)} onSave={() => { fetchSleep(); setShowModal(false); }} />}
                </div>
            );
        }



        function SleepLogModal({ onClose, onSave }) {
            const [form, setForm] = useState({ 
                data: safeFormatDate(new Date()), 
                deitar: '23:00', 
                acordar: '07:30', 
                qualidade: 8, 
                feeling: 'Normal' 
            });
            const [loading, setLoading] = useState(false);
            const [saveErr, setSaveErr] = useState('');

            const calculateHours = () => {
                const [dHours, dMins] = form.deitar.split(':').map(Number);
                const [aHours, aMins] = form.acordar.split(':').map(Number);
                let start = new Date(0, 0, 0, dHours, dMins);
                let end = new Date(0, 0, 0, aHours, aMins);
                if (end < start) end.setDate(end.getDate() + 1);
                const diff = (end - start) / (1000 * 60 * 60);
                return diff.toFixed(2);
            };

            const handleSave = async () => {
                setLoading(true);
                setSaveErr('');
                try {
                    const { data: { session } } = await window.supabase.auth.getSession();
                    if (!session) {
                        setSaveErr('Sessão expirada. Entre novamente.');
                        setLoading(false);
                        return;
                    }
                    const horas = calculateHours();
                    const { error } = await window.supabase.from('registos_sono').insert({
                        user_id: session.user.id,
                        data: form.data,
                        hora_deitar: form.deitar,
                        hora_acordar: form.acordar,
                        horas_dormidas: parseFloat(horas),
                        qualidade: parseInt(form.qualidade, 10) * 10,
                        feeling: form.feeling
                    });
                    if (error) {
                        setSaveErr('Erro ao salvar seu registro de sono. Tente novamente.');
                        setLoading(false);
                        return;
                    }
                    onSave();
                } catch (err) {
                    setSaveErr('Erro de conexão ao salvar.');
                    setLoading(false);
                }
            };

            const hoursTotal = calculateHours();

            return (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose}></div>
                    <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-[32px] p-6 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Fechar"
                            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center"
                        >&times;</button>
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tight mb-6">Registrar <span className="text-orange-500">Sono</span></h3>
                        
                        <div className="space-y-4 mb-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Hora de Deitar</label>
                                    <div className="w-full bg-white/5 border border-white/10 rounded-xl focus-within:border-orange-500 transition-all time-input-wrapper">
                                        <input 
                                            type="time" 
                                            value={form.deitar} 
                                            onChange={e => setForm({...form, deitar: e.target.value})} 
                                            onClick={(e) => { try { e.target.showPicker(); } catch(err) {} }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Hora de Acordar</label>
                                    <div className="w-full bg-white/5 border border-white/10 rounded-xl focus-within:border-orange-500 transition-all time-input-wrapper">
                                        <input 
                                            type="time" 
                                            value={form.acordar} 
                                            onChange={e => setForm({...form, acordar: e.target.value})} 
                                            onClick={(e) => { try { e.target.showPicker(); } catch(err) {} }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl flex justify-between items-center">
                                <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Tempo Total</span>
                                <span className="text-lg font-black text-white italic">{Math.floor(hoursTotal)}h {Math.round((hoursTotal % 1) * 60)}m</span>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Qualidade do Sono (1-10)</label>
                                <input type="range" min="1" max="10" value={form.qualidade} onChange={e => setForm({...form, qualidade: e.target.value})} className="w-full accent-orange-500" />
                                <div className="flex justify-between mt-1">
                                    <span className="text-[9px] text-slate-600 font-bold uppercase">Ruim</span>
                                    <span className="text-orange-500 font-black italic">{form.qualidade}/10</span>
                                    <span className="text-[9px] text-slate-600 font-bold uppercase">Excelente</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Como você está se sentindo hoje?</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Cansado', 'Normal', 'Revigorado'].map(f => (
                                        <button 
                                            type="button"
                                            key={f}
                                            onClick={() => setForm({...form, feeling: f})}
                                            className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border ${
                                                form.feeling === f ? 'bg-orange-600 border-orange-600 text-white' : 'bg-white/5 border-white/10 text-slate-500'
                                            }`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {saveErr && (
                            <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/35 text-red-300 text-xs font-bold text-center">{saveErr}</div>
                        )}

                        <button type="button" onClick={handleSave} disabled={loading} className="w-full py-5 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl font-black text-white text-xs uppercase tracking-widest shadow-xl shadow-orange-600/20 active:scale-95 transition-all disabled:opacity-50">
                            {loading ? 'SALVANDO...' : 'SALVAR DESCANSO'}
                        </button>
                    </div>
                </div>
            );
        }

        function RankingTab({ session, userProfile, currentXP, onGoToTreinos, onOpenEditProfile }) {
            return (
                <div className="tab-content fade-in pb-24">
                    <div className="fade-in">
                        <RankingView session={session} userProfile={userProfile} currentXP={currentXP} onGoToTreinos={onGoToTreinos} onOpenEditProfile={onOpenEditProfile} hideHeader={true} />
                    </div>
                </div>
            );
        }

        const Counter = ({ value, decimals = 1, suffix = '' }) => {
            const [display, setDisplay] = useState(0);
            useEffect(() => {
                let rafId = null;
                const end = parseFloat(value) || 0;
                const duration = 800;
                const startTime = performance.now();

                const animate = (now) => {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    setDisplay(end * progress);
                    if (progress < 1) {
                        rafId = requestAnimationFrame(animate);
                    }
                };
                rafId = requestAnimationFrame(animate);
                return () => { if (rafId !== null) cancelAnimationFrame(rafId); };
            }, [value]);
            return <span className="font-technical">{display.toFixed(decimals)}{suffix}</span>;
        };

        const MetricCard = ({ title, value, delta, suffix, icon, decimals = 1 }) => (
            <div className="stat-premium-card group relative overflow-hidden" style={{ flex: 1, background: 'rgba(27, 22, 34, 0.6)', border: '1px solid rgba(255, 107, 74, 0.1)', padding: '20px', borderRadius: '24px', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
                <div className="flex justify-between items-start mb-4">
                    <div style={{ background: 'rgba(255, 107, 74, 0.1)', color: 'var(--accent)', padding: '10px', borderRadius: '14px', boxShadow: '0 0 15px rgba(255, 107, 74, 0.2)' }}>
                        {icon}
                    </div>
                    {delta !== 0 && (
                        <div style={{ fontSize: '11px', fontWeight: '900', color: delta > 0 ? '#ef4444' : '#22c55e', display: 'flex', alignItems: 'center', gap: '4px', background: delta > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', padding: '4px 8px', borderRadius: '8px' }}>
                            <span>{delta > 0 ? '▲' : '▼'}</span>
                            <span>{Math.abs(delta).toFixed(1)}</span>
                        </div>
                    )}
                </div>
                <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{title}</div>
                    <div style={{ fontSize: '28px', color: '#fff', fontWeight: '900' }}>
                        <Counter value={value} decimals={decimals} suffix={suffix} />
                    </div>
                </div>
            </div>
        );

        function EvolucaoCorporal({ session, userProfile, onOpenNutriScan }) {
            const [history, setHistory] = useState([]);
            const [abaGrafico, setAbaGrafico] = useState('peso');
            const [loading, setLoading] = useState(true);
            const [saving, setSaving] = useState(false);
            const [formError, setFormError] = useState('');
            const [saveSuccess, setSaveSuccess] = useState(false);
            const [showMoreMeasures, setShowMoreMeasures] = useState(false);

            const [form, setForm] = useState({
                peso: '', altura: '', cintura: '',
                quadril: '', braco_dir: '', perna_dir: ''
            });

            const inferredGender = React.useMemo(() => {
                const raw = String(userProfile?.gender || userProfile?.genero || '').toLowerCase();
                if (raw.startsWith('m')) return 'm';
                return 'f';
            }, [userProfile?.gender, userProfile?.genero]);

            useEffect(() => {
                if (!session) { setLoading(false); return; }
                window.supabase
                    .from('evolucao_corporal')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .order('data', { ascending: true })
                    .then(({ data }) => {
                        if (data && data.length > 0) {
                            setHistory(data);
                            try { localStorage.setItem('lastEvolucao', JSON.stringify(data[data.length - 1])); } catch {}
                            const lastH = data.slice().reverse().find(h => h.altura_cm)?.altura_cm;
                            if (lastH) setForm(prev => ({ ...prev, altura: prev.altura || String(lastH) }));
                        }
                        setLoading(false);
                    });
            }, [session]);

            const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

            const handleGravar = async (e) => {
                if (e && e.preventDefault) e.preventDefault();
                setFormError('');
                setSaveSuccess(false);
                const p = parseFloat(String(form.peso).replace(',', '.'));
                const h_cm = form.altura ? parseFloat(String(form.altura).replace(',', '.')) : null;
                const cint = form.cintura ? parseFloat(String(form.cintura).replace(',', '.')) : null;
                const quad = form.quadril ? parseFloat(String(form.quadril).replace(',', '.')) : null;
                const braco = form.braco_dir ? parseFloat(String(form.braco_dir).replace(',', '.')) : null;
                const perna = form.perna_dir ? parseFloat(String(form.perna_dir).replace(',', '.')) : null;

                if (!p || p < 30 || p > 350) {
                    setFormError('Informe um peso válido entre 30 e 350 kg (ex: 68.5).');
                    return;
                }
                if (h_cm !== null && (isNaN(h_cm) || h_cm < 100 || h_cm > 240)) {
                    setFormError('Informe uma altura válida em cm (ex: 162).');
                    return;
                }

                setSaving(true);
                const record = {
                    user_id: session.user.id,
                    genero: inferredGender,
                    peso: p,
                    altura_cm: h_cm,
                    cintura_cm: cint && !isNaN(cint) ? cint : null,
                    quadril_cm: quad && !isNaN(quad) ? quad : null,
                    braco_dir_cm: braco && !isNaN(braco) ? braco : null,
                    perna_dir_cm: perna && !isNaN(perna) ? perna : null
                };

                try {
                    const { data, error } = await window.supabase
                        .from('evolucao_corporal')
                        .insert(record)
                        .select()
                        .single();
                    if (data) {
                        setHistory(prev => [...prev, data]);
                        try { localStorage.setItem('lastEvolucao', JSON.stringify(data)); } catch {}
                        setForm(prev => ({ ...prev, peso: '', cintura: '', quadril: '', braco_dir: '', perna_dir: '' }));
                        setSaveSuccess(true);
                        window.dispatchEvent(new CustomEvent('nutrition-updated'));
                    } else {
                        console.error('Erro Supabase:', error);
                        setFormError('Não foi possível salvar agora. Verifique sua conexão e tente novamente.');
                    }
                } finally {
                    setSaving(false);
                }
            };

            const handleEliminar = async (id) => {
                if (!window.confirm('Excluir este registro do seu histórico?')) return;
                const { error } = await window.supabase.from('evolucao_corporal').delete().eq('id', id);
                if (!error) {
                    setHistory(prev => {
                        const next = prev.filter(h => h.id !== id);
                        try {
                            if (next.length > 0) localStorage.setItem('lastEvolucao', JSON.stringify(next[next.length - 1]));
                            else localStorage.removeItem('lastEvolucao');
                        } catch {}
                        return next;
                    });
                }
            };

            const lastLog = history.length > 0 ? history[history.length - 1] : null;
            const startLog = history.length > 0 ? history[0] : null;
            const deltaPeso = lastLog && startLog && history.length > 1 ? (Number(lastLog.peso) - Number(startLog.peso)) : 0;

            const cinturaLogs = history.filter(h => h.cintura_cm != null && Number(h.cintura_cm) > 0);
            const lastCintura = cinturaLogs.length > 0 ? Number(cinturaLogs[cinturaLogs.length - 1].cintura_cm) : null;
            const deltaCintura = cinturaLogs.length > 1 ? (lastCintura - Number(cinturaLogs[0].cintura_cm)) : 0;

            const goalStr = String(userProfile?.goal || userProfile?.objetivo_principal || 'Perder Peso').toLowerCase();
            const kcalMult = (goalStr.includes('perder') || goalStr.includes('emagrecer') || goalStr.includes('seca')) ? 24 : goalStr.includes('massa') ? 34 : 28;
            const estimatedMetaKcal = lastLog?.peso ? Math.round(Number(lastLog.peso) * kcalMult) : null;

            const chartData = (abaGrafico === 'cintura' ? cinturaLogs : history.filter(h => h.peso != null))
                .slice(-10)
                .map((h, i) => ({
                    x: i,
                    y: abaGrafico === 'cintura' ? Number(h.cintura_cm) : Number(h.peso),
                    date: new Date(h.data)
                }));

            const reversedHistory = [...history].reverse();

            return (
                <div className="p-4 sm:p-6 pb-32 max-w-2xl mx-auto animate-in fade-in duration-500">
                    <div className="mb-5">
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">⚖️ Minha Evolução</h1>
                        <p className="text-xs sm:text-sm text-slate-400 font-medium">
                            Anote seu peso de vez em quando para ver seu progresso e ajustar suas calorias no Nutri-Scan.
                        </p>
                    </div>

                    {/* 1. REGISTRO RÁPIDO NO TOPO (10 SEGUNDOS) */}
                    <form onSubmit={handleGravar} className="bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-white/10 rounded-[28px] p-5 sm:p-6 mb-6 shadow-xl">
                        <div className="flex items-center justify-between gap-2 mb-4">
                            <div>
                                <h2 className="text-base font-black text-white leading-tight">Anotar peso de hoje</h2>
                                <p className="text-[11px] text-slate-400">Simples e rápido — só o peso já basta</p>
                            </div>
                            <span className="text-2xl">📝</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] text-slate-300 font-bold">Peso (kg) *</label>
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    step="0.1"
                                    name="peso"
                                    value={form.peso}
                                    onChange={handleChange}
                                    placeholder={lastLog?.peso ? `Último: ${lastLog.peso}` : 'Ex: 68,5'}
                                    className="bg-black/40 border border-white/15 rounded-2xl px-4 py-3.5 text-white text-base font-black focus:border-orange-500 outline-none transition-all placeholder:text-slate-500"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] text-slate-300 font-bold">Altura (cm)</label>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    name="altura"
                                    value={form.altura}
                                    onChange={handleChange}
                                    placeholder="Ex: 162"
                                    className="bg-black/40 border border-white/15 rounded-2xl px-4 py-3.5 text-white text-base font-black focus:border-orange-500 outline-none transition-all placeholder:text-slate-500"
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="text-[11px] text-slate-400 font-bold block mb-1.5">Cintura em cm <span className="text-slate-500 font-normal">(opcional — mostra a roupa folgando)</span></label>
                            <input
                                type="number"
                                inputMode="decimal"
                                step="0.1"
                                name="cintura"
                                value={form.cintura}
                                onChange={handleChange}
                                placeholder={lastCintura ? `Última: ${lastCintura} cm` : 'Opcional (ex: 82)'}
                                className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm font-bold focus:border-orange-500 outline-none transition-all placeholder:text-slate-500"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowMoreMeasures(v => !v)}
                            className="text-[11px] text-slate-400 hover:text-orange-400 font-bold mb-4 inline-flex items-center gap-1 transition-colors"
                        >
                            {showMoreMeasures ? '− Ocultar outras medidas' : '＋ Quero anotar quadril, braço ou coxa (opcional)'}
                        </button>

                        {showMoreMeasures && (
                            <div className="grid grid-cols-3 gap-2.5 mb-4 p-3 rounded-2xl bg-black/25 border border-white/5">
                                <div>
                                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Quadril (cm)</label>
                                    <input type="number" inputMode="decimal" step="0.1" name="quadril" value={form.quadril} onChange={handleChange} placeholder="Opcional" className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs font-bold outline-none focus:border-orange-500" />
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Braço (cm)</label>
                                    <input type="number" inputMode="decimal" step="0.1" name="braco_dir" value={form.braco_dir} onChange={handleChange} placeholder="Opcional" className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs font-bold outline-none focus:border-orange-500" />
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Coxa (cm)</label>
                                    <input type="number" inputMode="decimal" step="0.1" name="perna_dir" value={form.perna_dir} onChange={handleChange} placeholder="Opcional" className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs font-bold outline-none focus:border-orange-500" />
                                </div>
                            </div>
                        )}

                        {formError && (
                            <div className="mb-3 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-bold text-center">
                                {formError}
                            </div>
                        )}

                        {saveSuccess && (
                            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/35 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <span className="text-emerald-200 text-xs font-bold">✅ Peso salvo! Sua meta diária já foi atualizada.</span>
                                {onOpenNutriScan && (
                                    <button
                                        type="button"
                                        onClick={onOpenNutriScan}
                                        className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-[11px] uppercase tracking-wider shrink-0"
                                    >
                                        📸 Abrir Nutri-Scan →
                                    </button>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || saving}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-600/25 active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {saving ? 'Salvando...' : '✓ Salvar Meu Peso'}
                        </button>
                    </form>

                    {/* 2. RESUMO SIMPLES EM 2–3 CARTÕES */}
                    {lastLog && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                            <div className="bg-slate-800/50 border border-white/10 rounded-3xl p-4">
                                <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">Peso Atual</div>
                                <div className="text-2xl font-black text-white">{Number(lastLog.peso).toFixed(1)} <span className="text-xs text-slate-400 font-bold">kg</span></div>
                                {history.length > 1 ? (
                                    <div className={`text-[11px] font-bold mt-1 ${deltaPeso <= 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
                                        {deltaPeso === 0 ? 'Estável' : `${deltaPeso > 0 ? '+' : ''}${deltaPeso.toFixed(1)} kg desde o início`}
                                    </div>
                                ) : (
                                    <div className="text-[11px] text-slate-400 font-semibold mt-1">1º registro salvo</div>
                                )}
                            </div>

                            {lastCintura ? (
                                <div className="bg-slate-800/50 border border-white/10 rounded-3xl p-4">
                                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">Cintura</div>
                                    <div className="text-2xl font-black text-white">{lastCintura.toFixed(1)} <span className="text-xs text-slate-400 font-bold">cm</span></div>
                                    <div className={`text-[11px] font-bold mt-1 ${deltaCintura <= 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
                                        {cinturaLogs.length > 1
                                            ? (deltaCintura === 0 ? 'Mesma medida' : `${deltaCintura > 0 ? '+' : ''}${deltaCintura.toFixed(1)} cm`)
                                            : 'Medida inicial'}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-slate-800/50 border border-white/10 rounded-3xl p-4">
                                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">Pesagens</div>
                                    <div className="text-2xl font-black text-white">{history.length}</div>
                                    <div className="text-[11px] text-slate-400 font-semibold mt-1">{history.length === 1 ? 'registro feito' : 'registros feitos'}</div>
                                </div>
                            )}

                            {estimatedMetaKcal && (
                                <button
                                    type="button"
                                    onClick={() => onOpenNutriScan && onOpenNutriScan()}
                                    className="col-span-2 sm:col-span-1 text-left bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/25 rounded-3xl p-4 transition-all"
                                >
                                    <div className="text-[10px] text-emerald-300 font-black uppercase tracking-wider mb-1">Meta Diária</div>
                                    <div className="text-2xl font-black text-white">{estimatedMetaKcal} <span className="text-xs text-emerald-300 font-bold">kcal</span></div>
                                    <div className="text-[11px] text-emerald-300 font-bold mt-1">Usar no Nutri-Scan →</div>
                                </button>
                            )}
                        </div>
                    )}

                    {/* 3. GRÁFICO LIMPO (SÓ QUANDO TIVER REGISTROS) */}
                    {chartData.length >= 2 && (
                        <div className="bg-slate-900/70 border border-white/10 rounded-[28px] p-5 mb-6 shadow-xl">
                            <div className="flex items-center justify-between gap-3 mb-4">
                                <h3 className="text-sm font-black text-white uppercase tracking-wider">Sua Evolução</h3>
                                {cinturaLogs.length >= 2 && (
                                    <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
                                        <button type="button" onClick={() => setAbaGrafico('peso')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase ${abaGrafico === 'peso' ? 'bg-orange-500 text-white' : 'text-slate-400'}`}>Peso</button>
                                        <button type="button" onClick={() => setAbaGrafico('cintura')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase ${abaGrafico === 'cintura' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}>Cintura</button>
                                    </div>
                                )}
                            </div>
                            <div className="h-[180px] w-full">
                                {(() => {
                                    const color = abaGrafico === 'cintura' ? '#10b981' : '#ff6b4a';
                                    const vals = chartData.map(d => d.y);
                                    const minVal = Math.min(...vals);
                                    const maxVal = Math.max(...vals);
                                    const pad = Math.max(0.5, (maxVal - minVal) * 0.25);
                                    const min = Math.max(0, minVal - pad);
                                    const max = maxVal + pad;
                                    const range = (max - min) || 1;
                                    const pts = chartData.map((d, i) => ({
                                        x: (i / (chartData.length - 1)) * 100,
                                        y: 40 - ((d.y - min) / range) * 36,
                                        val: d.y,
                                        label: `${d.date.getDate()}/${d.date.getMonth() + 1}`
                                    }));
                                    const lineD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
                                    const areaD = `${lineD} L 100,42 L 0,42 Z`;
                                    return (
                                        <svg viewBox="-12 -4 120 54" className="w-full h-full overflow-visible">
                                            <defs>
                                                <linearGradient id="simpleEvoGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                                                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                                                </linearGradient>
                                            </defs>
                                            <path d={areaD} fill="url(#simpleEvoGrad)" />
                                            <path d={lineD} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                            {pts.map((p, i) => (
                                                <g key={i}>
                                                    <circle cx={p.x} cy={p.y} r="1.6" fill="#1b1622" stroke={color} strokeWidth="0.9" />
                                                    <text x={p.x} y={p.y - 3.2} textAnchor="middle" fill="#fff" fontSize="2.9" fontWeight="800">{p.val.toFixed(1)}</text>
                                                    <text x={p.x} y="47" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="2.5">{p.label}</text>
                                                </g>
                                            ))}
                                        </svg>
                                    );
                                })()}
                            </div>
                        </div>
                    )}

                    {/* 4. HISTÓRICO SIMPLES EM CARTÕES */}
                    <div className="bg-slate-900/50 border border-white/5 rounded-[28px] p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-black text-white uppercase tracking-wider">Histórico</h3>
                            <span className="text-[11px] text-slate-400 font-bold">{history.length} {history.length === 1 ? 'registro' : 'registros'}</span>
                        </div>
                        {loading ? (
                            <div className="py-6 text-center text-xs text-slate-400 font-semibold">Carregando seus registros...</div>
                        ) : reversedHistory.length === 0 ? (
                            <div className="py-6 text-center text-xs text-slate-400 leading-relaxed">
                                Ainda não há registros salvos. Anote seu peso acima para começar a acompanhar sua evolução semana a semana!
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {reversedHistory.map(row => (
                                    <div key={row.id} className="bg-white/5 border border-white/5 rounded-2xl px-4 py-3.5 flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-base font-black text-orange-400">{Number(row.peso).toFixed(1)} kg</span>
                                                <span className="text-[11px] text-slate-400 font-semibold">{new Date(row.data).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                            {(row.cintura_cm || row.quadril_cm) && (
                                                <div className="text-[11px] text-slate-400 mt-0.5">
                                                    {row.cintura_cm ? `Cintura: ${row.cintura_cm} cm` : ''}
                                                    {row.cintura_cm && row.quadril_cm ? ' · ' : ''}
                                                    {row.quadril_cm ? `Quadril: ${row.quadril_cm} cm` : ''}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleEliminar(row.id)}
                                            aria-label="Excluir registro"
                                            className="w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center text-xs shrink-0 transition-all"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        const MOCK_INTL = [
            "Emily Davis", "Marie Laurent", "Sofia Hernandez", "Elena Romano", "Sarah Parker", "Emma Wilson", "Lucia Rodriguez", "Francesca Marino", "Mia Dubois", "Hannah Miller", "Claire Bennett", "Laura Rossi", "Camila Navarro", "Anna Schmidt", "Julia Fischer", "Chloe Bernard", "Isabella Conti", "Valeria Morales", "Olivia Brown", "Sophia Taylor", "Marta Lopez", "Beatrice Ricci", "Grace Evans", "Natalie Weber", "Paula Diaz", "Rachel Meyer", "Lisa Wagner", "Audrey Petit", "Daniela Castro", "Chiara Ferrari", "Victoria Clark", "Alicia Gomez", "Charlotte Dubois", "Lina Hoffmann", "Eva Becker", "Sonia Alvarez", "Celine Morel", "Diana Schulz", "Helena Koch", "Nora Bauer", "Michael Johnson", "Carlos Sanchez", "Marco Rossi", "Jean Dupont", "David Miller", "Lucas Fischer", "Diego Lopez", "Thomas Bernard", "Alex Rivera", "Daniel Moore"
        ];
        const MOCK_BR = [
            "Carla Mendes", "Patrícia Silva", "Juliana Rocha", "Fernanda Costa", "Renata Almeida", "Ana Beatriz", "Mariana Oliveira", "Cláudia Ferreira", "Vanessa Santos", "Aline Pereira", "Camila Souza", "Priscila Moura", "Fabiana Monteiro", "Letícia Assis", "Amanda Leite", "Simone Ribeiro", "Luciana Carvalho", "Daniela Martins", "Cristiane Gomes", "Tatiane Lima", "Adriana Araujo", "Márcia Nascimento", "Elaine Barbosa", "Sandra Freitas", "Mônica Vieira", "Rosana Alves", "Débora Castro", "Gisele Fernandes", "Raquel Sales", "Talita Guimarães", "Laís Porto", "Beatriz Soares", "Helena Lopes", "Kátia Cardoso", "Silvia Neves", "Viviane Correia", "Michele Mello", "Cíntia Cavalcanti", "Sueli Peixoto", "Regina Silveira", "Denise Fogaça", "Vera Bernardes", "Lúcia Gouveia", "Sônia Macedo", "Rafael Rodrigues", "Bruno Souza", "Ricardo Alves", "Tiago Ferreira", "Leonardo Lima", "Gustavo Lima"
        ];
        
        const generateFakeRanking = (currentXP, filterMode = 'global', estado = 'WW') => {
            const shift = Math.max(0, currentXP - 850);
            const femAvatars = ['👩🏻', '👩🏽', '👩🏼', '👩🏾', '👩🏻‍🦱'];
            
            // Gerar Ranking Local (Estado)
            let localList = [];
            for (let i = 0; i < 50; i++) {
                let base = 0;
                if (i === 0) base = 990;
                else if (i === 1) base = 950;
                else if (i === 2) base = 920;
                else if (i === 3) base = 890;
                else if (i === 4) base = 860;
                else base = Math.max(0, 860 - ((i - 4) * 30));
                
                const variance = (i * 17) % 20;
                const xpFinal = base + shift + variance;

                localList.push({
                    id: `mock-local-${i}`,
                    name: MOCK_BR[i % MOCK_BR.length],
                    xp: xpFinal,
                    level: Math.floor(xpFinal / 1000) + 1,
                    estado: estado,
                    isFake: true,
                    avatar: i >= 44 ? '🧑' : femAvatars[i % femAvatars.length]
                });
            }

            // Gerar Ranking Internacional (Mundial)
            let intlList = [];
            for (let i = 0; i < 50; i++) {
                let base = 0;
                if (i === 0) base = 1100;
                else if (i === 1) base = 1050;
                else if (i === 2) base = 1010;
                else if (i === 3) base = 970;
                else if (i === 4) base = 940;
                else base = Math.max(0, 940 - ((i - 4) * 25));
                
                const variance = (i * 13) % 20;
                const xpFinal = base + shift + variance;

                intlList.push({
                    id: `mock-intl-${i}`,
                    name: MOCK_INTL[i % MOCK_INTL.length],
                    xp: xpFinal,
                    level: Math.floor(xpFinal / 1000) + 1,
                    estado: 'WW',
                    isFake: true,
                    avatar: i >= 40 ? '🧑' : femAvatars[i % femAvatars.length]
                });
            }

            if (filterMode === 'local') {
                return localList;
            } else {
                // Global mode: mix INTL and LOCAL so local champions appear in the world ranking
                let combined = [...intlList, ...localList];
                combined.sort((a, b) => b.xp - a.xp);
                combined.forEach((u, idx) => {
                    if (u.id.includes('intl')) {
                        const fakeEstados = ['WW', 'US', 'EU', 'AS', 'UK'];
                        u.estado = fakeEstados[(idx * 7) % fakeEstados.length];
                    }
                });
                return combined.slice(0, 50);
            }
        };

        function RankingView({ session, userProfile, currentXP, onGoToTreinos, onOpenEditProfile }) {
            const [topUsers, setTopUsers] = useState([]);
            const [loading, setLoading] = useState(true);
            const [myRank, setMyRank] = useState(null);
            const [filterMode, setFilterMode] = useState('global');
            const [timeLeft, setTimeLeft] = useState('');

            useEffect(() => {
                const updateCountdown = () => {
                    const now = new Date();
                    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                    const diffMs = nextMonth - now;
                    
                    const d = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                    const h = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                    
                    setTimeLeft(`${d}d ${h < 10 ? '0'+h : h}h ${m < 10 ? '0'+m : m}m`);
                };
                
                updateCountdown();
                const timer = setInterval(updateCountdown, 60000);
                return () => clearInterval(timer);
            }, []);

            useEffect(() => {
                const fetchRanking = async () => {
                    setLoading(true);
                    
                    let combined = generateFakeRanking(currentXP || 0, filterMode, filterMode === 'global' ? 'WW' : (userProfile?.estado || 'SP'));

                    if (session) {
                        combined.push({
                            id: session.user.id,
                            name: userProfile?.name || 'Você',
                            xp: currentXP || 0,
                            level: Math.floor((currentXP || 0) / 1000) + 1,
                            estado: userProfile?.estado || 'BR',
                            isReal: true,
                            avatar: '👤'
                        });
                    }

                    combined.sort((a, b) => b.xp - a.xp);
                    
                    const finalTop = combined.slice(0, 50);
                    setTopUsers(finalTop);

                    if (session) {
                        const index = combined.findIndex(u => u.id === session.user.id);
                        setMyRank(index !== -1 ? index + 1 : combined.length + 1);
                    }
                    setLoading(false);
                };

                fetchRanking();
            }, [session, currentXP, filterMode, userProfile?.estado]);

            const currentLeague = myRank <= 3 ? 'elite' : myRank <= 10 ? 'diamond' : myRank <= 25 ? 'platinum' : 'standard';

            return (
                <div className={`ranking-wrapper ${currentLeague} animate-in fade-in duration-500`}>
                    {currentLeague === 'elite' && (
                        <div className="floating-dust">
                            {[...Array(15)].map((_, i) => (
                                <div key={i} className="dust-particle" style={{
                                    left: `${(i * 7) % 100}%`,
                                    '--duration': `${15 + (i % 10)}s`,
                                    '--drift': `${(i % 2 === 0 ? 1 : -1) * 40}px`,
                                    animationDelay: `${i * 1.2}s`
                                }} />
                            ))}
                        </div>
                    )}
                    
                    <div className="progress-dashboard relative z-10 pb-40">
                        <div className="page-header mb-2 text-center">
                        <h1 style={{ fontSize: '28px', fontWeight: '900' }}>🏆 Ranking de Consistência</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Comunidade +500 Exercícios
                        </p>
                    </div>

                    {/* Banner FOMO */}
                    <div className="mb-8 mx-auto max-w-[400px] bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4 flex items-center justify-center gap-3 animate-pulse">
                        <span style={{ fontSize: '20px' }}>⏳</span>
                        <div className="text-center">
                            <div className="text-[10px] text-orange-500/80 font-black uppercase tracking-widest">Temporada termina em</div>
                            <div className="text-lg font-technical text-white tracking-widest">{timeLeft}</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', justifyContent: 'center' }}>
                        <button 
                            onClick={() => setFilterMode('global')}
                            style={{ padding: '8px 20px', borderRadius: '99px', border: '1px solid rgba(255,255,255,0.1)', background: filterMode === 'global' ? 'var(--accent)' : 'rgba(255,255,255,0.05)', color: filterMode === 'global' ? '#fff' : 'var(--text-secondary)', fontWeight: '900', transition: 'all 0.2s', cursor: 'pointer', fontSize: '11px', textTransform: 'uppercase' }}
                        >🌍 Global</button>
                        <button 
                            type="button"
                            onClick={() => {
                                if (!userProfile?.estado) {
                                    if (onOpenEditProfile) {
                                        onOpenEditProfile();
                                    } else {
                                        alert('Atualize seu Estado em Editar Perfil para ver o ranking local.');
                                    }
                                    return;
                                }
                                setFilterMode('local');
                            }}
                            style={{ padding: '8px 20px', borderRadius: '99px', border: '1px solid rgba(255,255,255,0.1)', background: filterMode === 'local' ? 'var(--accent)' : 'rgba(255,255,255,0.05)', color: filterMode === 'local' ? '#fff' : 'var(--text-secondary)', fontWeight: '900', transition: 'all 0.2s', cursor: 'pointer', fontSize: '11px', textTransform: 'uppercase' }}
                        >📍 Local (Estado)</button>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-[30vh]">
                            <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {topUsers.map((u, i) => {
                                const isMe = session && u.id === session.user.id;
                                const rank = i + 1;
                                
                                let tierStyle = {
                                    bg: 'rgba(255,255,255,0.03)',
                                    border: 'rgba(255,255,255,0.05)',
                                    icon: '',
                                    glow: 'none',
                                    accent: 'var(--text-primary)'
                                };

                                if (rank <= 3) {
                                    tierStyle = {
                                        bg: 'linear-gradient(90deg, rgba(234,179,8,0.15) 0%, rgba(255,255,255,0.02) 100%)',
                                        border: 'rgba(234,179,8,0.4)',
                                        icon: '👑',
                                        glow: '0 0 25px rgba(234,179,8,0.15)',
                                        accent: '#facc15'
                                    };
                                } else if (rank <= 10) {
                                    tierStyle = {
                                        bg: 'linear-gradient(90deg, rgba(34,211,238,0.1) 0%, rgba(255,255,255,0.02) 100%)',
                                        border: 'rgba(34,211,238,0.3)',
                                        icon: '💎',
                                        glow: 'none',
                                        accent: '#22d3ee'
                                    };
                                } else if (rank <= 25) {
                                    tierStyle = {
                                        bg: 'linear-gradient(90deg, rgba(226,232,240,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                                        border: 'rgba(226,232,240,0.2)',
                                        icon: '⚙️',
                                        glow: 'none',
                                        accent: '#e2e8f0'
                                    };
                                } else {
                                    tierStyle = {
                                        bg: 'rgba(255,255,255,0.03)',
                                        border: 'rgba(255,255,255,0.05)',
                                        icon: '🏅',
                                        glow: 'none',
                                        accent: '#94a3b8'
                                    };
                                }

                                if (isMe) {
                                    tierStyle.bg = 'rgba(255, 107, 74, 0.15)';
                                    tierStyle.border = 'rgba(255, 107, 74, 0.6)';
                                }

                                return (
                                    <div 
                                        key={u.id} 
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', borderRadius: '24px',
                                            border: `1px solid ${tierStyle.border}`, background: tierStyle.bg, boxShadow: tierStyle.glow,
                                            transition: 'transform 0.2s'
                                        }}
                                        className={rank <= 3 ? "animate-pulse" : ""}
                                    >
                                        <div style={{ width: '40px', fontSize: '22px', textAlign: 'center', fontWeight: '900' }}>
                                            {tierStyle.icon || <span style={{ color: '#475569', fontSize: '12px' }}>#{rank}</span>}
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '15px', fontWeight: '900', color: isMe ? 'var(--accent)' : '#fff' }}>
                                                {u.name} {isMe && <span className="ml-2 px-2 py-0.5 bg-orange-500 text-[9px] rounded-full text-white">VOCÊ</span>}
                                            </div>
                                            <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                Nível {u.level} • {filterMode === 'global' ? 'World Class' : (u.estado || 'Atleta')}
                                            </div>
                                        </div>

                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '18px', fontWeight: '900', color: tierStyle.accent }}>
                                                {u.xp?.toLocaleString()}
                                                <span style={{ fontSize: '9px', color: 'var(--text-muted)', marginLeft: '4px' }}>XP</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {session && (
                        <div style={{ position: 'fixed', bottom: '90px', left: '20px', right: '20px', zIndex: 100 }}>
                            <div style={{ 
                                background: 'rgba(27, 22, 34, 0.8)', 
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255, 107, 74, 0.5)', 
                                borderRadius: '28px', 
                                padding: '16px 24px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                maxWidth: '500px',
                                margin: '0 auto',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                            }}>
                                <div style={{ 
                                    width: '50px', height: '50px', background: 'var(--accent)', borderRadius: '18px', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                    fontSize: '20px', fontWeight: '900', color: '#fff',
                                    boxShadow: '0 0 20px rgba(255, 107, 74,0.3)'
                                }}>
                                    #{(!myRank || myRank > 50) ? '?' : myRank}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '13px', fontWeight: '900', color: '#fff' }}>Minha Posição</div>
                                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', fontWeight: '700' }}>
                                        {(!myRank || myRank > 50) ? (
                                            <>🎯 Meta: <span className="text-orange-500">Faltam {Math.max(1, (topUsers[49]?.xp || 0) - currentXP)} XP</span> para entrar no Top 50.</>
                                        ) : myRank === 1 ? (
                                            <>🏆 <span className="text-orange-500">Você está no Top 1!</span> Continue assim.</>
                                        ) : (
                                            <>🎯 Próxima posição: <span className="text-orange-500">Faltam {Math.max(1, (topUsers[myRank - 2]?.xp || 0) - currentXP)} XP</span> para subir.</>
                                        )}
                                    </div>
                                </div>
                                <button 
                                    onClick={() => onGoToTreinos && onGoToTreinos()}
                                    style={{ 
                                        background: 'rgba(255, 107, 74,0.2)', border: '1px solid rgba(255, 107, 74,0.4)', borderRadius: '14px', 
                                        padding: '10px 14px', color: '#fff', fontSize: '10px', fontWeight: '900', 
                                        textTransform: 'uppercase', cursor: 'pointer' 
                                    }}
                                >⚡ Treinar</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

        function HelpDashboard({ onLogout }) {
            const [faqOpen, setFaqOpen] = React.useState(null);
            const [legalModal, setLegalModal] = React.useState(null); // 'termos' | 'privacidade' | null

            const handleReset = async () => {
                if (window.confirm('Tem certeza que deseja limpar o cache do aplicativo? Esta ação vai desconectar sua conta neste aparelho para atualizar tudo do zero.')) {
                    try { await window.supabase?.auth?.signOut(); } catch {}
                    localStorage.clear();
                    window.location.reload();
                }
            };

            const toggleFaq = (idx) => {
                setFaqOpen(faqOpen === idx ? null : idx);
            };

            const faqs = [
                { q: "Como ativar o Desafio 30 Dias, Nutri-Scan ou Combo de Ouro?", a: "Se você comprou com o mesmo e-mail usado aqui no app, o acesso libera automaticamente. Se recebeu um código no e-mail da Hotmart, vá na aba 'Extras', desça até 'Ative seu código aqui', digite o código e toque em Liberar!" },
                { q: "Como funciona o Nutri-Scan™ IA?", a: "Você já tem 2 análises grátis liberadas na aba 'Nutri IA'. Basta tirar uma foto do seu prato, escolher da galeria ou digitar o que comeu e a IA calcula automaticamente calorias, proteínas, carboidratos e gorduras." },
                { q: "Onde configuro meu Peso e Altura?", a: "Vá na aba 'Evolução' e preencha apenas Peso e Altura (as demais medidas são opcionais). Seus dados ficam salvos na sua conta e calibram sua meta diária no Nutri-Scan." },
                { q: "Como instalar o aplicativo na tela inicial do celular?", a: "Veja o vídeo curto abaixo! Em iPhone (Safari) toque em Compartilhar > Adicionar à Tela de Início. Em Android (Chrome) toque nos 3 pontinhos > Instalar aplicativo." }
            ];

            return (
                <div className="progress-dashboard pb-28">
                    <div className="page-header" style={{ marginBottom: '16px' }}>
                        <h1>Central de Ajuda</h1>
                    </div>

                    <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e', animation: 'pulse 2s infinite' }}></div>
                        <span style={{ color: '#22c55e', fontWeight: '700', fontSize: '15px' }}>Aplicativo Funcionando 100% 🟢</span>
                    </div>

                    <div className="install-app-card" style={{ marginBottom: '32px' }}>
                        <h3 className="install-app-card-title">📱 Como instalar o App</h3>
                        <p className="install-app-card-text">
                            Adicione o aplicativo à sua Tela Inicial para usar com um toque. Para Android ou iPhone, clique em <strong style={{ color: 'var(--text-primary)' }}>Compartilhar</strong> (ou nos 3 pontinhos) e depois em <strong style={{ color: 'var(--accent)' }}>"Adicionar à Tela Inicial"</strong>.
                        </p>
                        <div style={{ width: '100%', maxWidth: '280px', borderRadius: '8px', overflow: 'hidden', margin: '0 auto', marginTop: '16px' }}>
                            <video src="./instalar_app.mp4" poster="./OIP.webp" controls playsInline preload="metadata" style={{ width: "100%", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}></video>
                        </div>
                    </div>

                    <h3 className="ps-title" style={{ marginTop: '32px' }}>Guia Rápido do Aplicativo</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '32px' }}>
                        <div style={{ background: 'linear-gradient(135deg, rgba(37, 30, 46,0.4), rgba(27, 22, 34,0.8))', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📸</div>
                            <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>Nutri IA</h4>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Tire foto do seu prato e descubra calorias e macros em segundos (2 testes grátis!).</p>
                        </div>
                        <div style={{ background: 'linear-gradient(135deg, rgba(37, 30, 46,0.4), rgba(27, 22, 34,0.8))', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📈</div>
                            <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>Evolução</h4>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Acompanhe seu peso, medidas e progresso semana a semana.</p>
                        </div>
                        <div style={{ background: 'linear-gradient(135deg, rgba(37, 30, 46,0.4), rgba(27, 22, 34,0.8))', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔓</div>
                            <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>Extras & Guias</h4>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Acesse o Desafio 30 Dias, Musculação em Casa, Pilates e ative seus códigos.</p>
                        </div>
                    </div>

                    <h3 className="ps-title" style={{ marginTop: '32px' }}>Perguntas Frequentes (FAQ)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                        {faqs.map((f, i) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                                <button type="button" onClick={() => toggleFaq(i)} style={{ width: '100%', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
                                    <span style={{ fontWeight: '600', fontSize: '15px' }}>{f.q}</span>
                                    <span style={{ color: 'var(--accent)', transform: faqOpen === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>▼</span>
                                </button>
                                {faqOpen === i && (
                                    <div style={{ padding: '0 16px 16px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                                        {f.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <h3 className="ps-title" style={{ marginTop: '32px' }}>Suporte & Atendimento</h3>
                    <div style={{ background: 'linear-gradient(135deg, rgba(37, 30, 46,0.5), rgba(27, 22, 34,0.8))', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '32px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '18px', lineHeight: '1.55' }}>
                            Precisa de ajuda com seu acesso, código ou assinatura? Fale com a nossa equipe pelo Instagram ou por e-mail:
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a
                                href="https://www.instagram.com/__mariana_barros_/"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(135deg, #ff6b4a, #ec4899)', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontWeight: '800', fontSize: '14px', textDecoration: 'none', boxShadow: '0 4px 14px rgba(236,72,153,0.3)', flex: '1 1 220px', maxWidth: '280px' }}
                            >
                                📸 Instagram @__mariana_barros_
                            </a>
                            <a
                                href="mailto:grupomachado171@gmail.com?subject=Suporte%20App%20%2B500%20Exerc%C3%ADcios"
                                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontWeight: '800', fontSize: '14px', textDecoration: 'none', flex: '1 1 220px', maxWidth: '280px' }}
                            >
                                ✉️ Enviar E-mail de Suporte
                            </a>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '14px', marginBottom: 0 }}>
                            E-mail direto: <strong style={{ color: 'var(--text-primary)', userSelect: 'all' }}>grupomachado171@gmail.com</strong>
                        </p>
                    </div>

                    <h3 className="ps-title" style={{ marginTop: '32px', color: 'var(--red)' }}>Conta & Cache</h3>
                    <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '24px', borderRadius: '16px', marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>O aplicativo não atualizou suas informações? Limpe o cache local ou desconecte sua conta.</p>
                        <button type="button" onClick={handleReset} style={{ width: '100%', background: 'transparent', border: '1px solid var(--red)', color: 'var(--red)', padding: '12px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            Limpar Cache do App
                        </button>
                        {onLogout && (
                            <button type="button" onClick={onLogout} style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                                Sair da Conta
                            </button>
                        )}
                    </div>

                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', paddingBottom: '30px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                        <div style={{ marginBottom: '6px', fontWeight: '700' }}>+500 Exercícios com Elástico</div>
                        <div style={{ letterSpacing: '1px', opacity: 0.7 }}>Versão 1.2.0</div>
                        <div style={{ marginTop: '12px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
                            <button type="button" onClick={() => setLegalModal('termos')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', textDecoration: 'underline', cursor: 'pointer', fontSize: '13px' }}>Termos & Condições</button>
                            <button type="button" onClick={() => setLegalModal('privacidade')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', textDecoration: 'underline', cursor: 'pointer', fontSize: '13px' }}>Privacidade</button>
                        </div>
                    </div>

                    {legalModal && (
                        <div className="fixed inset-0 z-[20000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setLegalModal(null)}>
                            <div className="bg-slate-900 border border-white/15 rounded-3xl max-w-md w-full max-h-[85vh] overflow-y-auto p-6 relative">
                                <button type="button" onClick={() => setLegalModal(null)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 text-white text-xl flex items-center justify-center">&times;</button>
                                <h3 className="text-lg font-black text-white mb-4">
                                    {legalModal === 'termos' ? 'Termos & Condições de Uso' : 'Política de Privacidade (LGPD)'}
                                </h3>
                                <div className="text-xs text-slate-300 leading-relaxed space-y-3">
                                    {legalModal === 'termos' ? (
                                        <>
                                            <p>O aplicativo +500 Exercícios com Elástico oferece vídeos demonstrativos, cronogramas de treino e estimativas nutricionais por IA para fins informativos e educativos.</p>
                                            <p>Antes de iniciar qualquer programa de exercícios ou mudança alimentar, consulte um médico ou profissional de educação física/nutrição. Respeite sempre os limites do seu corpo.</p>
                                            <p>As compras, garantias, cancelamentos e reembolsos são processados de forma segura pela plataforma Hotmart conforme as políticas vigentes na data da contratação.</p>
                                        </>
                                    ) : (
                                        <>
                                            <p>Seus dados cadastrais (e-mail, nome, objetivo, medidas corporais, registros de hidratação, sono e refeições) são armazenados de forma privada e utilizados exclusivamente para personalizar sua experiência no aplicativo.</p>
                                            <p>Não vendemos seus dados a terceiros. Fotos enviadas ao Nutri-Scan IA são processadas apenas para estimar calorias e macronutrientes no momento da análise.</p>
                                            <p>Você pode atualizar seus dados em Editar Perfil ou solicitar exclusão da sua conta a qualquer momento pelo e-mail <strong>grupomachado171@gmail.com</strong>.</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        function SmartRestTimer({ timeSeconds, onComplete, onSkip }) {
            const [timeLeft, setTimeLeft] = useState(timeSeconds);

            useEffect(() => {
                if (timeLeft <= 0) {
                    try {
                        const ctx = new (window.AudioContext || window.webkitAudioContext)();
                        const osc = ctx.createOscillator();
                        osc.type = 'square';
                        osc.frequency.setValueAtTime(800, ctx.currentTime);
                        osc.connect(ctx.destination);
                        osc.start();
                        osc.stop(ctx.currentTime + 1);
                        if (navigator.vibrate) navigator.vibrate([1000]);
                    } catch (e) { }
                    onComplete();
                    return;
                }

                const timer = setInterval(() => {
                    setTimeLeft(prev => {
                        const p = prev - 1;
                        if (p > 0 && p <= 3) {
                            try {
                                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                                const osc = ctx.createOscillator();
                                osc.frequency.setValueAtTime(440, ctx.currentTime);
                                osc.connect(ctx.destination);
                                osc.start();
                                osc.stop(ctx.currentTime + 0.2);
                            } catch (e) { }
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
                <div className="modal-overlay" style={{ background: 'rgba(27, 22, 34,0.95)', zIndex: 11000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
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

        function TrackSetsModal({ ex, onClose, onShowTimer, onUpdateStreak }) {
            const totalSets = parseInt((ex?.sets_reps || '1').split('x')[0]) || 1;
            const targetReps = parseInt((ex?.sets_reps || '0').split('x')[1]) || 0;

            const [setsData, setSetsData] = useState(Array(totalSets).fill({ weight: '', reps: '' }));
            const [lastSessionData, setLastSessionData] = useState([]);

            useEffect(() => {
                async function fetchLastLocal() {
                    if (!window.supabase) return;
                    const { data: { session } } = await window.supabase.auth.getSession();
                    if (!session) return;
                    const res = await window.supabase.from('workout_logs').select('*').eq('user_id', session.user.id).eq('exercise_id', ex.id).order('created_at', { ascending: false }).limit(totalSets);
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
                        if (onUpdateStreak) onUpdateStreak();
                    }
                }

                const isCompound = ex?.category?.includes('Composto') || ex?.category?.includes('Membros Inferiores') || ex?.category?.includes('Core');
                const rest = isCompound ? (ex.rest_time_compound || 120) : (ex.rest_time_isolation || 60);
                onShowTimer(rest);
            };

            return (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()} style={{ zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="password-modal-content" style={{ maxWidth: '400px', width: '90%', padding: '24px' }}>
                        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)', fontSize: '24px', background: 'none', border: 'none' }}>&times;</button>
                        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>{ex.nome || ex.title || 'Tracking'}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>Registro Dinâmico de Progressive Overload</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {Array.from({ length: totalSets }).map((_, idx) => {
                                const last = lastSessionData[idx];
                                const phWeight = last ? `Última: ${last.weight}kg` : "Kg";
                                const phReps = last ? `${last.reps} reps` : (targetReps ? `Alvo: ${targetReps}` : "Reps");
                                return (
                                    <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-muted)', width: '30px' }}>{idx + 1}</div>
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

        function useIntersectionObserver(options = {}) {
            const [isIntersecting, setIsIntersecting] = useState(false);
            const targetRef = useRef(null);

            useEffect(() => {
                const observer = new IntersectionObserver(([entry]) => {
                    if (entry.isIntersecting) {
                        setIsIntersecting(true);
                        observer.disconnect();
                    }
                }, { rootMargin: '200px', ...options });

                if (targetRef.current) observer.observe(targetRef.current);
                return () => observer.disconnect();
            }, [options]);

            return [targetRef, isIntersecting];
        }

        function PremiumExerciseCard({ exercise, onClick, categoryImage }) {
            const handleAdapterClick = () => {
                if (onClick) onClick({
                    ...exercise,
                    id: exercise.id,
                    title: exercise.title || exercise.nome,
                    nome: exercise.title || exercise.nome,
                    media: exercise.video_url || exercise.media,
                    video_url: exercise.video_url || exercise.media,
                    category: exercise.category || exercise.target_muscle || '',
                    difficulty: exercise.difficulty || '',
                    description: exercise.description || '',
                    sets: exercise.sets || '3',
                    reps: exercise.reps || '15',
                    rest: exercise.rest || '60'
                });
            };

            return (
                <div className="premium-card" onClick={handleAdapterClick} style={{ cursor: 'pointer' }}>
                    <div className="premium-card-media" style={{ backgroundColor: '#000', overflow: 'hidden' }}>
                        <img src={categoryImage || "muscles.png"} alt={exercise.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8, background: '#000' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #000 0%, transparent 50%)', backgroundColor: 'transparent' }}></div>
                    </div>
                    <div className="premium-card-content">
                        <h3 className="premium-card-title">{exercise.title}</h3>
                        <div className="premium-card-meta">{exercise.target_muscle}</div>
                    </div>
                </div>
            );
        }

        function TreinoModuleLive({ ud = null, setSel, hasAccess, hasDesafio = false, hasMusculacao = false, hasPilates = false, onOpenDesafio, onGoToExtras }) {
            const [viewMode, setViewMode] = useState('categories');
            const [data, setData] = useState([]);
            const [categories, setCategories] = useState([]);
            const [activeTab, setActiveTab] = useState(null);
            const [loading, setLoading] = useState(true);
            const [previewProgram, setPreviewProgram] = useState(null);

            useEffect(() => {
                async function fetchLiveData() {
                    const CACHE_KEY = 'treinos_categorias_cache';

                    const processAndSetData = (ex) => {
                        ex.sort((a, b) => {
                            const numA = parseInt((a.title.match(/\d+/) || [0])[0], 10);
                            const numB = parseInt((b.title.match(/\d+/) || [0])[0], 10);
                            return numA - numB;
                        });

                        setData(ex);
                        const uniqueCats = Array.from(new Set(ex.map(e => e.category))).filter(c => c && c !== 'Ignorado' && c.toLowerCase() !== 'core');
                        const ORDEM_CATEGORIAS = ['Pernas', 'Costas', 'Peito', 'Ombros', 'Braços', 'Abdominais', 'Cardio', 'Outros'];
                        uniqueCats.sort((a, b) => {
                            const indexA = ORDEM_CATEGORIAS.indexOf(a);
                            const indexB = ORDEM_CATEGORIAS.indexOf(b);
                            if (indexA === -1 && indexB === -1) return a.localeCompare(b);
                            if (indexA === -1) return 1;
                            if (indexB === -1) return -1;
                            return indexA - indexB;
                        });
                        setCategories(uniqueCats);
                        if (uniqueCats.length > 0) setActiveTab(uniqueCats[0]);
                    };

                    try {
                        const cached = localStorage.getItem(CACHE_KEY);
                        if (cached) {
                            const parsed = JSON.parse(cached);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                processAndSetData(parsed);
                                setLoading(false);
                            }
                        }
                    } catch (e) {
                        console.warn("Erro ao ler cache do localStorage", e);
                    }

                    try {
                        const { data: ex, error } = await window.supabase
                            .from('exercises')
                            .select('*')
                            .eq('is_enabled', true)
                            .order('title', { ascending: true });

                        if (ex) {
                            processAndSetData(ex);
                            try {
                                localStorage.setItem(CACHE_KEY, JSON.stringify(ex));
                            } catch (e) {
                                console.warn("Erro ao guardar no localStorage", e);
                            }
                        }
                    } catch (e) {
                        console.error("Erro fetch exercises", e);
                    } finally {
                        setLoading(false);
                    }
                }
                if (window.supabase) fetchLiveData();
                else setLoading(false);
            }, []);

            if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Carregando seus exercícios... ⏳</div>;

            const categoryConfigs = {
                'pernas': { color: '#3b82f6', img: './assets/categories/pernas.png' },
                'costas': { color: '#a855f7', img: './assets/categories/costas.png' },
                'peito': { color: '#ef4444', img: './assets/categories/peito.png' },
                'ombros': { color: '#f59e0b', img: './assets/categories/ombros.png' },
                'braços': { color: '#ec4899', img: './assets/categories/bracos.png' },
                'abdominais': { color: '#06b6d4', img: './assets/categories/abdominais.png' },
                'cardio': { color: '#22c55e', img: './assets/categories/cardio.png' },
                'outros': { color: '#eab308', img: './assets/categories/outros.png' },
                'outro': { color: '#eab308', img: './assets/categories/outros.png' }
            };

            const PREMIUM_PROGRAMS = [
                {
                    id: 'desafio30',
                    icon: '🔥',
                    title: 'Desafio 30 Dias',
                    subtitle: 'Seca Barriga & Definição',
                    badge: 'MAIS VENDIDO',
                    unlocked: hasDesafio || hasAccess,
                    singlePrice: '19,90',
                    singleLink: 'https://pay.hotmart.com/R106106925S?checkoutMode=10',
                    comboLink: 'https://pay.hotmart.com/O106106388F?checkoutMode=10',
                    bullets: [
                        'Cronograma pronto dia após dia por 30 dias (sem precisar inventar treino)',
                        'Foco em queima de gordura, definição e consistência em casa',
                        'Avaliações semanais de progresso dentro do app'
                    ],
                    onOpenUnlocked: () => onOpenDesafio && onOpenDesafio()
                },
                {
                    id: 'musculacao',
                    icon: '💪',
                    title: 'Musculação em Casa',
                    subtitle: 'Definição sem academia',
                    badge: 'GUIA EM PDF',
                    unlocked: hasMusculacao || hasAccess,
                    singlePrice: '19,90',
                    singleLink: 'https://pay.hotmart.com/N105939399C?checkoutMode=10',
                    comboLink: 'https://pay.hotmart.com/O106106388F?checkoutMode=10',
                    bullets: [
                        'Guia prático passo a passo para ganhar tônus e força usando o que você tem em casa',
                        'Ideal para firmar braços, pernas e glúteos sem pagar academia',
                        'Acesso vitalício para baixar e consultar sempre que quiser'
                    ],
                    onOpenUnlocked: () => safeOpenExternal('https://wutjxjubudszwgvxedgm.supabase.co/storage/v1/object/public/Protocolo%20Flexibilidade%20&%20Anti-Stress/Untitled%20folder/Guia%20de%20Musculacao%20em%20Casa.pdf')
                },
                {
                    id: 'pilates',
                    icon: '🧘‍♀️',
                    title: 'Pilates Modelador',
                    subtitle: 'Abdômen, postura & alívio de dores',
                    badge: 'INCLUSO NO COMBO',
                    unlocked: hasPilates || hasAccess,
                    singlePrice: '19,90',
                    singleLink: 'https://pay.hotmart.com/E105938855Y?checkoutMode=10',
                    comboLink: 'https://pay.hotmart.com/O106106388F?checkoutMode=10',
                    bullets: [
                        'Exercícios de baixo impacto para fortalecer o core e afinar a cintura',
                        'Excelente para aliviar dores nas costas e melhorar a flexibilidade',
                        'Perfeito para fazer em casa em qualquer idade'
                    ],
                    onOpenUnlocked: () => safeOpenExternal('https://wutjxjubudszwgvxedgm.supabase.co/storage/v1/object/public/Protocolo%20Flexibilidade%20&%20Anti-Stress/Untitled%20folder/Pilates.pdf')
                }
            ];

            const displayedExercises = data.filter(e => e.category === activeTab);

            return (
                <div className="w-full" id="treino-module-live-root">
                    <div style={{
                        animation: 'fade-in 0.4s ease-out',
                        paddingBottom: '110px',
                        width: '100%',
                        position: 'relative'
                    }}>

                        {viewMode === 'categories' ? (
                            <div style={{ animation: 'fade-in 0.3s ease' }}>
                                <div style={{ padding: '24px 24px 8px', fontSize: '26px', fontWeight: '900', color: 'white', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Zap size={28} className="text-orange-500" />
                                    <span className="text-white">O que vamos treinar hoje?</span>
                                </div>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: '20px',
                                    padding: '20px 24px',
                                    width: '100%'
                                }}>
                                    {categories.map(cat => {
                                        const config = categoryConfigs[cat.toLowerCase()] || categoryConfigs['outros'];
                                        const themeColor = config.color;

                                        return (
                                            <button
                                                key={cat}
                                                onClick={() => {
                                                    setActiveTab(cat);
                                                    setViewMode('exercises');
                                                }}
                                                style={{
                                                    outline: 'none',
                                                    position: 'relative',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: '24px 12px',
                                                    background: 'linear-gradient(180deg, rgba(37, 30, 46, 0.45) 0%, rgba(17, 14, 20, 0.98) 100%)',
                                                    backdropFilter: 'blur(20px)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '36px',
                                                    aspectRatio: '1 / 1.22',
                                                    boxShadow: '0 20px 40px -15px rgba(0,0,0,0.9)',
                                                    overflow: 'hidden',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <div style={{ width: '112px', height: '112px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: `1px solid ${themeColor}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                                                    <img src={config.img} alt={cat} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.25)' }} />
                                                </div>
                                                <span style={{ color: '#ffffff', fontSize: '17px', fontWeight: '900', letterSpacing: '1.5px', textTransform: 'uppercase', textAlign: 'center', marginTop: '14px' }}>
                                                    {cat}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* UPSELLS CONTEXTUAIS NA ABA MAIS VISITADA (PROGRAMAS EXCLUSIVOS) */}
                                <div className="px-6 pt-4 pb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em]">Acelere seus Resultados</span>
                                            <h3 className="text-xl font-black text-white tracking-tight">✨ Programas & Guias Exclusivos</h3>
                                        </div>
                                        {!hasAccess && (
                                            <button
                                                onClick={onGoToExtras}
                                                className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 border border-amber-500/25 px-3 py-1.5 rounded-full"
                                            >
                                                Combo R$ 24,90 ➔
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        {PREMIUM_PROGRAMS.map(prog => (
                                            <button
                                                key={prog.id}
                                                onClick={() => prog.unlocked ? prog.onOpenUnlocked() : setPreviewProgram(prog)}
                                                className={`w-full text-left p-4 rounded-3xl border flex items-center gap-4 transition-all active:scale-[0.98] ${
                                                    prog.unlocked
                                                        ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/15'
                                                        : 'bg-slate-800/60 border-white/10 hover:border-orange-500/40'
                                                }`}
                                            >
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 relative ${prog.unlocked ? 'bg-emerald-500/20' : 'bg-orange-500/15'}`}>
                                                    {prog.icon}
                                                    {!prog.unlocked && (
                                                        <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-slate-950 border border-orange-500/40 flex items-center justify-center text-[11px]">🔒</span>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${prog.unlocked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-orange-500/20 text-orange-300'}`}>
                                                            {prog.unlocked ? 'LIBERADO ✅' : prog.badge}
                                                        </span>
                                                    </div>
                                                    <div className="text-base font-black text-white truncate">{prog.title}</div>
                                                    <div className="text-xs text-slate-400 font-medium truncate">{prog.subtitle}</div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    {prog.unlocked ? (
                                                        <span className="text-xs font-black text-emerald-400">Abrir ➔</span>
                                                    ) : (
                                                        <div>
                                                            <div className="text-xs font-black text-white">R$ {prog.singlePrice}</div>
                                                            <div className="text-[9px] text-orange-400 font-bold">Ver prévia ➔</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ animation: 'fade-in 0.3s ease' }}>
                                <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <button 
                                        onClick={() => setViewMode('categories')}
                                        style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '12px 20px', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer' }}
                                    >
                                        ← Voltar
                                    </button>
                                    <h2 style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', color: 'white' }}>{activeTab}</h2>
                                </div>
                                <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
                                    {displayedExercises.map(ex => (
                                        <PremiumExerciseCard
                                            key={ex.id}
                                            exercise={ex}
                                            onClick={setSel}
                                            categoryImage={categoryConfigs[activeTab?.toLowerCase()]?.img || categoryConfigs['outros'].img}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* MODAL DE PRÉVIA + ANCORAGEM COMBO DE OURO */}
                    {previewProgram && (
                        <div className="fixed inset-0 z-[100000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setPreviewProgram(null)}>
                            <div className="bg-slate-900 border border-white/15 rounded-[28px] w-full max-w-md p-6 relative shadow-2xl animate-in zoom-in-95 duration-200">
                                <button
                                    onClick={() => setPreviewProgram(null)}
                                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 text-white text-xl flex items-center justify-center hover:bg-white/20"
                                >&times;</button>

                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-3xl">
                                        {previewProgram.icon}
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase text-orange-400 tracking-widest">Programa Exclusivo</span>
                                        <h3 className="text-xl font-black text-white leading-tight">{previewProgram.title}</h3>
                                        <p className="text-xs text-slate-400">{previewProgram.subtitle}</p>
                                    </div>
                                </div>

                                <ul className="space-y-2.5 mb-6 text-xs text-slate-200">
                                    {previewProgram.bullets.map((b, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="text-emerald-400 font-black">✅</span>
                                            <span>{b}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="space-y-3">
                                    <button
                                        type="button"
                                        onClick={() => openHotmartCheckout(previewProgram.comboLink, { placement: `treinos_preview_${previewProgram.id}_combo`, product: 'combo_ouro', ud })}
                                        className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-orange-600/25 active:scale-95 transition-all"
                                    >
                                        🥇 Levar NO COMBO DE OURO (Este + 5 Guias) — R$ 24,90
                                        <span className="block text-[10px] font-bold opacity-90 normal-case mt-0.5">Apenas R$ 5 a mais • Pagamento único vitalício!</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => openHotmartCheckout(previewProgram.singleLink, { placement: `treinos_preview_${previewProgram.id}_single`, product: previewProgram.id, ud })}
                                        className="w-full py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all"
                                    >
                                        Desbloquear só {previewProgram.title} — R$ {previewProgram.singlePrice}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => { setPreviewProgram(null); onGoToExtras && onGoToExtras(true); }}
                                        className="w-full py-2 text-[11px] text-slate-400 hover:text-white underline font-semibold"
                                    >
                                        Já comprou? Clique aqui para ativar seu código
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        function ArsenalVIP({ ud, onNav, temAcessoNutriScan, onOpenNutriUpsell }) {
            return (
                <div className="arsenal-vip-container animate-in fade-in duration-500">
                    <NutritionDashboard
                        ud={ud}
                        onNav={onNav}
                        hasNutriScanAccess={temAcessoNutriScan}
                        onOpenNutriUpsell={onOpenNutriUpsell}
                    />
                </div>
            );
        }

        function NutriScanUpsellModal({ isOpen, onClose, onTrackEvent, reason = 'post_workout', freeScansRemaining = 0, onTryFreeNow, onGoToExtras, ud = null, mealContext = null }) {
            if (!isOpen) return null;

            const isLimitReached = reason === 'limit_reached' || freeScansRemaining <= 0;
            const mappedCalories = Number(mealContext?.caloriesToday) || 0;

            return (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100000, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={(e) => { if (e.target === e.currentTarget) { if (onTrackEvent) onTrackEvent('no'); onClose(); } }}>
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '26px', width: '100%', maxWidth: '410px', maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 50px rgba(0,0,0,0.6)', animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        <div style={{ width: '100%', height: '130px', flexShrink: 0, background: 'linear-gradient(135deg, #1b1622, #251e2e)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', position: 'relative' }}>
                            <img src="./nutri_scan_illustration.png" alt="Nutri-Scan IA" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.92 }} />
                            <button
                                onClick={() => { if (onTrackEvent) onTrackEvent('no'); onClose(); }}
                                style={{ position: 'absolute', top: '12px', right: '12px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,0,0,0.65)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >&times;</button>
                            <div style={{ position: 'absolute', bottom: '10px', left: '14px', background: isLimitReached ? '#ff6b4a' : '#10b981', color: '#fff', fontSize: '10px', fontWeight: '900', padding: '4px 10px', borderRadius: '99px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                {isLimitReached ? '✨ Testes grátis concluídos' : `🎁 ${freeScansRemaining} testes grátis liberados`}
                            </div>
                        </div>

                        <div style={{ padding: '22px', overflowY: 'auto', flex: 1 }}>
                            <div style={{ fontSize: '11px', fontWeight: '800', color: '#34d399', marginBottom: '6px' }}>
                                ★ 4,9 · Mais de 6.000 alunas treinando em casa
                            </div>
                            <h2 style={{ fontSize: '21px', fontWeight: '900', marginBottom: '12px', color: 'var(--text-primary)', lineHeight: '1.22' }}>
                                {isLimitReached && mappedCalories > 0
                                    ? `Você acabou de mapear ${mappedCalories} kcal sem balança!`
                                    : isLimitReached
                                    ? 'Gostou de ver as calorias do seu prato em segundos?'
                                    : 'Treino pago! Agora cuide do que faz 70% do resultado: sua alimentação.'}
                            </h2>
                            
                            <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.58', marginBottom: '20px' }}>
                                <p style={{ marginBottom: '12px' }}>
                                    {isLimitReached
                                        ? 'Com o Nutri-Scan™ IA ilimitado você tira foto ou digita qualquer refeição do seu dia e acompanha sua meta de emagrecimento sem pesar comida.'
                                        : 'Não adianta treinar firme e ficar no escuro na cozinha. O Nutri-Scan™ IA analisa seu prato pela foto e calcula calorias e proteínas em 3 segundos.'}
                                </p>
                                
                                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 14px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <li><span style={{color: '#10b981'}}>✅</span> <strong>Foto ou texto em 3s:</strong> Calorias, proteínas, carboidratos e gorduras na hora.</li>
                                    <li><span style={{color: '#10b981'}}>✅</span> <strong>Sem balança e sem estresse:</strong> Perfeito para a rotina corrida de casa ou trabalho.</li>
                                    <li><span style={{color: '#10b981'}}>✅</span> <strong>Valor acessível:</strong> Comece com <strong>7 Dias Grátis</strong> e depois apenas <strong>R$ 9,90/mês</strong> (menos que um cafezinho!).</li>
                                </ul>

                                <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '14px', padding: '10px 12px', fontSize: '12px', color: '#d1fae5', fontWeight: '600' }}>
                                    🔒 Teste por 7 dias grátis na Hotmart. Se não amar, cancele quando quiser sem multa.
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {!isLimitReached && onTryFreeNow && (
                                    <button
                                        onClick={() => {
                                            onClose();
                                            onTryFreeNow();
                                        }}
                                        style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #ff6b4a, #e85334)', color: '#fff', borderRadius: '16px', fontWeight: '900', fontSize: '15px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 18px rgba(255, 107, 74, 0.35)' }}
                                    >
                                        📸 Testar Agora Grátis ({freeScansRemaining} {freeScansRemaining === 1 ? 'uso' : 'usos'} no app)
                                    </button>
                                )}

                                <button 
                                    type="button"
                                    onClick={() => {
                                        if(onTrackEvent) onTrackEvent('yes');
                                        openHotmartCheckout('https://pay.hotmart.com/H106107115U?checkoutMode=10&bid=1784830143838', {
                                            placement: isLimitReached ? 'modal_post_scan2' : 'modal_post_workout',
                                            product: 'nutri_scan',
                                            ud
                                        });
                                    }}
                                    style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', borderRadius: '16px', fontWeight: '900', fontSize: '15px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)' }}
                                >
                                    👉 Liberar 7 Dias Grátis (R$ 9,90/mês)
                                </button>

                                {onGoToExtras && (
                                    <button
                                        onClick={() => {
                                            onClose();
                                            onGoToExtras();
                                        }}
                                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontWeight: '700', fontSize: '11.5px', cursor: 'pointer' }}
                                    >
                                        💎 Prefere sem mensalidade? Ver Acesso Total Vitalício (R$ 69,90)
                                    </button>
                                )}

                                <button 
                                    onClick={() => {
                                        if(onTrackEvent) onTrackEvent('no');
                                        onClose();
                                    }}
                                    style={{ width: '100%', padding: '8px', background: 'transparent', color: 'var(--text-muted)', border: 'none', fontWeight: '500', fontSize: '12px', cursor: 'pointer' }}
                                >
                                    Agora não, continuar no app
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        function WarriorCountBadge() {
            const [count, setCount] = useState(() => 101 + (Math.floor(Date.now() / 300000) % 899));
            useEffect(() => {
                const interval = setInterval(() => {
                    setCount(101 + (Math.floor(Date.now() / 300000) % 899));
                }, 60000);
                return () => clearInterval(interval);
            }, []);
            return (
                <div className="flex items-center gap-2.5">
                    <div className="relative flex h-2 w-2">
                        <div className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></div>
                        <div className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></div>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em]">{count} alunas treinando agora</span>
                </div>
            );
        }

        function App() {

            const ud = useUserData();
            const [page, setPage] = useState('inicio');
            const [arsenalSubTab, setArsenalSubTab] = useState('nutricao');
            const [treinoSubTab, setTreinoSubTab] = useState('exercicios');
            const [evolucaoSubTab, setEvolucaoSubTab] = useState('peso');
            const [focusRedeemOnExtras, setFocusRedeemOnExtras] = useState(false);
            const [editProfileOpen, setEditProfileOpen] = useState(false);
            const [workoutSwappedMsg, setWorkoutSwappedMsg] = useState('');
            const [recoverySaving, setRecoverySaving] = useState(false);
            const [recoveryError, setRecoveryError] = useState('');
            const [notifUnread, setNotifUnread] = useState(() => {
                try { return localStorage.getItem('notifs_seen_v2') !== '1'; } catch { return true; }
            });

            const ent = useMemo(() => resolveEntitlements(ud.userProfile), [ud.userProfile]);
            const temAcessoTotalVIP = ent.hasTotalVip;
            const temAcessoPremium = ent.hasGold;
            const temAcessoNutriScan = Boolean(ent.hasScannerIA || ud.nutriQuota?.hasNutriScan);
            const hasDesafio = ent.hasDesafio;
            const hasSono = ent.hasSono;
            const hasMusculacao = ent.hasMusculacao;
            const hasPilates = ent.hasPilates;

            const freeScansRemainingGlobal = temAcessoNutriScan
                ? Infinity
                : Math.max(0, typeof ud.nutriQuota?.freeScansRemaining === 'number' ? ud.nutriQuota.freeScansRemaining : NUTRISCAN_FREE_LIMIT);

            const [showNutriScanUpsell, setShowNutriScanUpsell] = useState(false);
            const [nutriUpsellReason, setNutriUpsellReason] = useState('post_workout');
            const [nutriUpsellContext, setNutriUpsellContext] = useState(null);
            const [showWorkoutVictory, setShowWorkoutVictory] = useState(false);
            const [quickstartDismissed, setQuickstartDismissed] = useState(() => {
                try { return localStorage.getItem('quickstart_dismissed_v1') === '1'; } catch { return false; }
            });
            const oneSignalLoggedInRef = useRef(null);
            const suppressNextUpsellRef = useRef(false);

            const openNutriScanUpsell = useCallback((reason = 'post_workout', context = null) => {
                if (temAcessoNutriScan) return;
                setNutriUpsellReason(reason);
                setNutriUpsellContext(context);
                setShowNutriScanUpsell(true);
            }, [temAcessoNutriScan]);

            const promptOneSignalPushIfNeeded = useCallback(() => {
                if (typeof window === 'undefined' || !Array.isArray(window.OneSignalDeferred)) return;
                try {
                    const lastPromptTs = Number(localStorage.getItem('os_smart_prompt_ts') || '0');
                    if (Date.now() - lastPromptTs < 3 * 24 * 60 * 60 * 1000) return;
                    window.OneSignalDeferred.push(async (OneSignal) => {
                        try {
                            const optedIn = OneSignal.User?.PushSubscription?.optedIn;
                            if (!optedIn && OneSignal.Notifications?.permission !== true) {
                                localStorage.setItem('os_smart_prompt_ts', String(Date.now()));
                                await OneSignal.Slidedown?.promptPush?.();
                            }
                        } catch {}
                    });
                } catch {}
            }, []);

            useEffect(() => {
                if (!ud.session) return;
                try { localStorage.setItem('has_logged_in_before', '1'); } catch {}
                if (!ud.userProfile) return;
                if (typeof window !== 'undefined' && Array.isArray(window.OneSignalDeferred)) {
                    const uid = ud.session.user?.id;
                    const userEmail = (ud.session.user?.email || ud.userProfile?.email || '').trim().toLowerCase();
                    window.OneSignalDeferred.push(async (OneSignal) => {
                        try {
                            if (uid && oneSignalLoggedInRef.current !== uid) {
                                oneSignalLoggedInRef.current = uid;
                                await OneSignal.login(uid);
                            }
                            if (userEmail && userEmail.includes('@')) {
                                await OneSignal.User.addEmail(userEmail);
                            }
                            await OneSignal.User.addTags({
                                app: 'br',
                                goal: String(ud.userProfile?.goal || ud.userProfile?.objetivo_principal || 'geral'),
                                has_nutriscan: temAcessoNutriScan ? 'true' : 'false',
                                has_combo_ouro: temAcessoPremium ? 'true' : 'false',
                                has_desafio: hasDesafio ? 'true' : 'false',
                                free_scans_left: temAcessoNutriScan ? 'unlimited' : String(freeScansRemainingGlobal)
                            });
                        } catch {}
                    });
                }
            }, [ud.session, ud.userProfile, temAcessoNutriScan, temAcessoPremium, hasDesafio, freeScansRemainingGlobal]);
            
            useEffect(() => {
                const handleShowModal = () => {
                    if (suppressNextUpsellRef.current) {
                        suppressNextUpsellRef.current = false;
                        return;
                    }
                    if (!temAcessoNutriScan) {
                        const todayKey = safeFormatDate(new Date());
                        let lastShown = '';
                        try { lastShown = localStorage.getItem('nutri_upsell_last_shown_date') || ''; } catch {}
                        if (lastShown !== todayKey) {
                            try { localStorage.setItem('nutri_upsell_last_shown_date', todayKey); } catch {}
                            setNutriUpsellReason('post_workout');
                            setShowNutriScanUpsell(true);
                        }
                    }
                };
                window.addEventListener('triggerNutriScanUpsell', handleShowModal);
                return () => window.removeEventListener('triggerNutriScanUpsell', handleShowModal);
            }, [temAcessoNutriScan]);

            const handleTrackUpsell = async (action) => {
                if (ud.userProfile?.id && window.supabase) {
                    try {
                        await window.supabase.from('nutriscan_upsell_events').insert({
                            user_id: ud.userProfile.id,
                            action: action
                        });
                    } catch (e) {
                        console.error('Tracking erro:', e);
                    }
                }
            };

            const [search, setSearch] = useState('');
            const [cat, setCat] = useState('Todos');
            const [diff, setDiff] = useState('Todos');
            const [modFilter, setModFilter] = useState('base');
            const [sel, setSel] = useState(null);
            const [trackEx, setTrackEx] = useState(null);
            const [restTimer, setRestTimer] = useState(0);
            const [notifOpen, setNotifOpen] = useState(false);
            const [safeVideoModalOpen, setSafeVideoModalOpen] = useState(false);
            const [showBackToTop, setShowBackToTop] = useState(false);
            const [isLoadingExercises, setIsLoadingExercises] = useState(true);
            const [dailyWorkout, setDailyWorkout] = useState([]);
            const [dailyWorkoutOpen, setDailyWorkoutOpen] = useState(false);
            const [dailyWorkoutIndex, setDailyWorkoutIndex] = useState(0);
            const [completedDailyIds, setCompletedDailyIds] = useState([]); 
            const [streakCount, setStreakCount] = useState(0);
            const [allExercises, setAllExercises] = useState([]);
            const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

            const handleCloseVideo = useCallback(() => setSel(null), []);

            const navigateTo = useCallback((nextPage, opts = {}) => {
                if (nextPage === 'extras' && opts?.focusRedeem) {
                    setFocusRedeemOnExtras(true);
                }
                setPage(nextPage);
            }, []);

            const handleLogout = useCallback(async () => {
                if (window.supabase) {
                    await window.supabase.auth.signOut();
                }
                try { localStorage.clear(); sessionStorage.clear(); } catch {}
                window.location.reload();
            }, []);

            const fetchUserStreaks = useCallback(async () => {
                if (!window.supabase) return;
                const { data: { session } } = await window.supabase.auth.getSession();
                if (!session) return;

                try {
                    const { data, error } = await window.supabase
                        .from('workout_logs')
                        .select('created_at')
                        .eq('user_id', session.user.id)
                        .order('created_at', { ascending: false });

                    if (error) throw error;

                    if (data && data.length > 0) {
                        const localDates = data.map(log => safeFormatDate(log.created_at)).filter(Boolean);
                        const uniqueDates = [...new Set(localDates)];
                        if (uniqueDates.length === 0) { setStreakCount(0); return; }

                        const today = safeFormatDate(new Date());
                        const yesterdayDate = new Date();
                        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                        const yesterday = safeFormatDate(yesterdayDate);

                        if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
                            setStreakCount(0);
                            return;
                        }

                        let streak = 0;
                        let currentDayStr = uniqueDates[0];

                        for (let i = 0; i < uniqueDates.length; i++) {
                            const dateStr = uniqueDates[i];
                            const d1 = new Date(currentDayStr);
                            const d2 = new Date(dateStr);
                            const diffTime = Math.abs(d1 - d2);
                            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

                            if (i === 0) {
                                streak = 1;
                            } else if (diffDays === 1) {
                                streak++;
                                currentDayStr = dateStr;
                            } else if (diffDays > 1) {
                                break;
                            }
                        }
                        setStreakCount(streak);
                    } else {
                        setStreakCount(0);
                    }
                } catch (e) {
                    console.error("Erro ao calcular streaks:", e);
                }
            }, []);

            const fetchAllExercises = useCallback(async () => {
                if (!window.supabase) return;
                try {
                    const { data, error } = await window.supabase
                        .from('exercises')
                        .select('*')
                        .eq('is_enabled', true)
                        .order('title', { ascending: true });
                    if (data) setAllExercises(data);
                } catch (e) {
                    console.error('Erro ao buscar exercícios:', e);
                } finally {
                    setIsLoadingExercises(false);
                }
            }, []);

            useEffect(() => {
                if (ud.session) fetchAllExercises();
            }, [ud.session, fetchAllExercises]);



            useEffect(() => {
                const handleScroll = () => {
                    setShowBackToTop(window.scrollY > 400);
                };
                window.addEventListener('scroll', handleScroll);
                return () => window.removeEventListener('scroll', handleScroll);
            }, []);

            useEffect(() => {
                if (ud.session) fetchUserStreaks();
            }, [ud.session, fetchUserStreaks]);

            const completedExLogs = ud.completedLog || [];
            
            const completedExList = React.useMemo(() => {
                if (!allExercises || allExercises.length === 0) return [];
                return completedExLogs.map(lg => (allExercises || []).find(e => e.id === lg.id)).filter(Boolean);
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

            const getCategoryLabel = useCallback((title = "") => {
                const t = title.toLowerCase();
                if (t.includes("perna")) return "PERNAS";
                if (t.includes("abdom")) return "ABDOMINAIS";
                if (t.includes("peito") || t.includes("supino")) return "PEITO";
                if (t.includes("costas") || t.includes("remada")) return "COSTAS";
                if (t.includes("ombro")) return "OMBROS";
                if (t.includes("braço") || t.includes("braco") || t.includes("biceps") || t.includes("triceps")) return "BRAÇOS";
                if (t.includes("cardio") || t.includes("corrida") || t.includes("polichinelo")) return "CARDIO";
                return "EXERCÍCIO";
            }, []);

            const getBunnyEmbedUrl = useCallback((exercise) => {
                const BUNNY_LIBRARY_ID = '630822';
                if (!exercise) return null;

                const candidates = [
                    exercise.video_url,
                    exercise.bunnyVideoId,
                    exercise.bunny_id,
                    exercise.video_id,
                    exercise.videoId,
                ].filter(Boolean).map(String);

                for (const raw of candidates) {
                    const value = raw.trim();
                    if (!value) continue;

                    if (value.includes('iframe.mediadelivery.net/embed/')) return value;

                    const guidMatch = value.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
                    if (guidMatch && (value.includes('.b-cdn.net') || value.includes('mediadelivery.net'))) {
                        return `https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${guidMatch[1]}`;
                    }

                    if (value.match(/^[a-zA-Z0-9]{8,}$/) && !value.includes('youtube') && !value.includes('youtu.be')) {
                        return `https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${value}`;
                    }
                }

                return null;
            }, []);

            const generateDailyWorkout = useCallback((showFeedback = false) => {
                const bunnyOnly = allExercises.filter(ex => {
                    if (!getBunnyEmbedUrl(ex)) return false;
                    const cat = (ex.category || '').toLowerCase().trim();
                    return !['outros', 'outro', 'ignorado'].includes(cat);
                });
                if (bunnyOnly.length === 0) return [];
                setCompletedDailyIds([]);

                const isNewUser = (ud.completedLog?.length || 0) === 0;
                const targetCount = isNewUser ? 4 : 6;
                const goalStr = String(ud.userProfile?.goal || ud.userProfile?.objetivo_principal || '').toLowerCase();
                let preferredCats = ['pernas', 'abdominais', 'cardio', 'braços'];
                if (goalStr.includes('massa')) preferredCats = ['pernas', 'braços', 'costas', 'peito'];
                else if (goalStr.includes('tonificar') || goalStr.includes('definir')) preferredCats = ['pernas', 'abdominais', 'braços', 'costas'];
                else if (goalStr.includes('saúde') || goalStr.includes('saude') || goalStr.includes('mobilidade')) preferredCats = ['costas', 'pernas', 'ombros', 'abdominais'];

                const shuffleArr = (arr) => {
                    const copy = [...arr];
                    for (let i = copy.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [copy[i], copy[j]] = [copy[j], copy[i]];
                    }
                    return copy;
                };

                const prioritized = shuffleArr(bunnyOnly.filter(ex => preferredCats.includes((ex.category || '').toLowerCase().trim())));
                const others = shuffleArr(bunnyOnly.filter(ex => !preferredCats.includes((ex.category || '').toLowerCase().trim())));
                const generated = [...prioritized, ...others].slice(0, targetCount);
                setDailyWorkout(generated);
                if (showFeedback) {
                    setWorkoutSwappedMsg('✅ Nova sequência montada!');
                    setTimeout(() => setWorkoutSwappedMsg(''), 2500);
                }
                return generated;
            }, [allExercises, getBunnyEmbedUrl, ud.completedLog?.length, ud.userProfile?.goal, ud.userProfile?.objetivo_principal]);

            useEffect(() => {
                if (ud.localSynced && allExercises.length > 0 && dailyWorkout.length === 0) {
                    generateDailyWorkout(false);
                }
            }, [ud.localSynced, allExercises, dailyWorkout.length, generateDailyWorkout]);

            const startDailyWorkout = useCallback(() => {
                const queue = dailyWorkout.length ? dailyWorkout : generateDailyWorkout(false);
                if (!queue || queue.length === 0) return;
                setDailyWorkoutIndex(0);
                setDailyWorkoutOpen(true);
            }, [dailyWorkout, generateDailyWorkout]);

            const concludeDailyWorkout = useCallback(async () => {
                try {
                    const idsToCredit = completedDailyIds.length > 0 ? completedDailyIds : dailyWorkout.map(e => e.id);
                    if (idsToCredit.length > 0) {
                        suppressNextUpsellRef.current = true;
                        ud.completeWorkout(idsToCredit);
                    }
                    if (window.supabase) {
                        const { data: { session } } = await window.supabase.auth.getSession();
                        if (session) {
                            await window.supabase.from('workout_logs').insert({
                                user_id: session.user.id,
                                exercise_id: 'full-body-daily',
                                weight: 0,
                                reps: dailyWorkout.length || 4,
                                set_number: 1
                            });
                        }
                    }
                } catch (e) {
                    console.error('Erro ao concluir treino full body:', e);
                } finally {
                    setDailyWorkoutOpen(false);
                    setShowWorkoutVictory(true);
                    promptOneSignalPushIfNeeded();
                    fetchUserStreaks();
                }
            }, [completedDailyIds, dailyWorkout, ud.completeWorkout, fetchUserStreaks, promptOneSignalPushIfNeeded]);

            const isVipUser = temAcessoTotalVIP; 

            const handleAccessModule = useCallback((moduleId) => {
                if (moduleId === 'scanner_ia' || moduleId === 'nutricao') {
                    setPage('arsenal-vip');
                    return;
                }
                if (moduleId === 'desafio30' || moduleId === 'cronograma') {
                    setTreinoSubTab('desafio30');
                    setPage('treinos');
                    return;
                }
                if (moduleId === 'sono') {
                    setEvolucaoSubTab('sono');
                    setPage('evolucao');
                    return;
                }
                setModFilter(moduleId);
                if (moduleId === 'senior') setCat('Idosos');
                else if (moduleId === 'pilates') setCat('Pilates');
                else if (moduleId === 'gymnastics') setCat('Ginástica');
                else setCat('Todos');
                setDiff('Todos');
                setSearch('');
                setTreinoSubTab('exercicios');
                setPage('treinos');
            }, []);

            const calculateRecovery = useCallback(() => {
                const logs = ud.completedLog || [];
                const exercises = allExercises || [];
                const RECOVERY_WINDOW = 48 * 60 * 60 * 1000;
                const groups = {
                    superior: ["membros superiores", "braços", "bracos", "peito", "costas", "ombros"],
                    inferior: ["membros inferiores", "pernas", "glúteos", "gluteos"],
                    core: ["core", "abdominais", "abdômen", "abdomen"]
                };
                const getStatus = (groupNames) => {
                    const groupExIds = exercises
                        .filter(ex => groupNames.includes(String(ex.category || '').toLowerCase().trim()))
                        .map(ex => ex.id);
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

            if (ud.authLoading || (ud.session && !ud.localSynced && !ud.userProfile)) {
                return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1b1622', color: '#ff6b4a', fontWeight: 'bold', fontSize: '1.1rem' }}>Preparando seu plano...</div>;
            }

            if (!ud.session) {
                return <AuthModal />;
            }

            if (ud.recoveryMode) {
                return (
                    <div className="fixed inset-0 z-[15000] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
                        <div className="auth-card" style={{ maxWidth: '400px', width: '100%', position: 'relative' }}>
                            <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: '900', marginBottom: '12px' }}>Definir Nova Senha</h2>
                            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '20px' }}>
                                Insira sua nova senha abaixo para recuperar o acesso à sua conta.
                            </div>
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                setRecoveryError('');
                                const pwd = e.target.newPwd.value;
                                if (pwd.length < 6) return setRecoveryError('A senha deve ter pelo menos 6 caracteres.');
                                setRecoverySaving(true);
                                try {
                                    const { error } = await window.supabase.auth.updateUser({ password: pwd });
                                    if (error) setRecoveryError(error.message || 'Erro ao atualizar senha.');
                                    else {
                                        ud.setRecoveryMode(false);
                                    }
                                } finally {
                                    setRecoverySaving(false);
                                }
                            }}>
                                <div className="input-group" style={{ marginBottom: '16px' }}>
                                    <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Nova Senha</label>
                                    <input type="password" name="newPwd" className="ob-input" placeholder="Mínimo 6 caracteres" required disabled={recoverySaving} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                                </div>
                                {recoveryError && <div style={{ color: '#f87171', fontSize: '12px', fontWeight: '700', marginBottom: '12px' }}>{recoveryError}</div>}
                                <button type="submit" disabled={recoverySaving} className="ob-submit-btn" style={{ width: '100%', padding: '14px', borderRadius: '14px', background: '#ff6b4a', color: '#fff', fontWeight: '900', border: 'none', cursor: 'pointer', opacity: recoverySaving ? 0.6 : 1 }}>
                                    {recoverySaving ? 'Salvando...' : 'Salvar Nova Senha'}
                                </button>
                                <button type="button" onClick={() => ud.setRecoveryMode(false)} style={{ width: '100%', marginTop: '10px', padding: '10px', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}>
                                    Cancelar
                                </button>
                            </form>
                        </div>
                    </div>
                );
            }

            const isOnboardingIncomplete = !ud.userProfile || (!ud.userProfile.name && !(ud.userProfile.goal || ud.userProfile.objetivo_principal));
            if (isOnboardingIncomplete) {
                return (
                    <Onboarding
                        onComplete={async (n, g, gen, a, est, wa) => {
                            const res = await ud.saveProfile(n, g, gen, a, est, wa);
                            if (!res?.error) {
                                setTimeout(() => promptOneSignalPushIfNeeded(), 3500);
                            }
                            return res;
                        }}
                    />
                );
            }

            const totalCompleted = ud.completedLog?.length || 0;

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

            const nowForXP = new Date();
            const currentMonthXP = nowForXP.getMonth();
            const currentYearXP = nowForXP.getFullYear();
            
            const xpPorDia = {};
            (ud.completedLog || []).forEach(lg => {
                const rawTs = lg.ts || lg.created_at;
                const dObj = new Date(rawTs);
                if (dObj.getMonth() === currentMonthXP && dObj.getFullYear() === currentYearXP) {
                    const dStr = safeFormatDate(rawTs);
                    if (dStr) {
                        xpPorDia[dStr] = (xpPorDia[dStr] || 0) + 10;
                    }
                }
            });
            let totalExerciciosXP = 0;
            for (const day in xpPorDia) {
                totalExerciciosXP += Math.min(xpPorDia[day], 250);
            }

            let passiveMultiplier = 0;
            const isVipOrGold = ud.userProfile?.permissions?.vip || ud.userProfile?.permissions?.gold || temAcessoPremium || temAcessoTotalVIP;
            if (temAcessoNutriScan || isVipOrGold) passiveMultiplier += 1500;
            if (ud.userProfile?.permissions?.senior || isVipOrGold) passiveMultiplier += 1000;
            if (ud.userProfile?.permissions?.pilates || isVipOrGold) passiveMultiplier += 1000;
            if (ud.userProfile?.permissions?.gymnastics || isVipOrGold) passiveMultiplier += 1000;
            if (hasDesafio || isVipOrGold) passiveMultiplier += 1000;
            if (hasSono || isVipOrGold) passiveMultiplier += 1000;

            let passiveXP = 0;
            if (passiveMultiplier > 0) {
                const createdDate = ud.userProfile?.created_at ? new Date(ud.userProfile.created_at) : new Date();
                const startOfCurrentMonth = new Date(currentYearXP, currentMonthXP, 1);
                const startDate = createdDate > startOfCurrentMonth ? createdDate : startOfCurrentMonth;
                const diffTime = Math.abs(nowForXP - startDate);
                const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
                passiveXP = diffDays * 1000;
            }

            const homeXP = totalExerciciosXP + passiveXP + (ud.xpBonus || 0);
            const userLevel = Math.floor(homeXP / 1000) + 1;
            
            const top1Base = 1100;
            const top1Xp = homeXP >= 990 ? top1Base + (homeXP - 990) : top1Base;
            
            const sortedRanking = [
                { id: 'f1', name: 'Carla M.', xp: top1Xp, isFake: true, avatar: '👩🏻' },
                { id: 'f2', name: 'Patrícia S.', xp: 950, isFake: true, avatar: '👩🏽' },
                { id: 'f3', name: 'Juliana R.', xp: 780, isFake: true, avatar: '👩🏼' },
                { id: 'f4', name: 'Fernanda C.', xp: 600, isFake: true, avatar: '👩🏾' },
                { id: 'f5', name: 'Renata A.', xp: 300, isFake: true, avatar: '👩🏻‍🦱' },
                { id: 'u1', name: ud.userProfile?.name || 'Você', xp: homeXP, isFake: false, avatar: '✨' }
            ].sort((a, b) => b.xp - a.xp);
            // -----------------------------------

            const renderPage = () => {
                switch (page) {
                    case 'inicio': {
                        const completedExLogs = ud.completedLog || [];
                        const homeStreak = streakCount || 0;
                        const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1;
                        const weekDays = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

                        const startOfWeek = new Date(today);
                        startOfWeek.setDate(today.getDate() - dayOfWeek);
                        const weekActivity = [false, false, false, false, false, false, false];

                        const todayStr = safeFormatDate(today);
                        const startOfWeekStr = safeFormatDate(startOfWeek);

                        completedExLogs.forEach(lg => {
                            const rawTs = lg.ts || lg.created_at;
                            const lgDateStr = safeFormatDate(rawTs);
                            if (!lgDateStr) return;

                            if (lgDateStr >= startOfWeekStr) {
                                const dObj = new Date(rawTs);
                                const dStr = dObj.getDay();
                                const idx = dStr === 0 ? 6 : dStr - 1;
                                if (idx >= 0 && idx < 7) weekActivity[idx] = true;
                            }
                        });

                        // Variáveis Dinâmicas de Texto do Objetivo
                        const resolvedUserGoal = ud.metaProfile?.user_goal || ud.metaProfile?.objetivo_principal || ud.userProfile?.goal || ud.userProfile?.objetivo_principal || '';
                        const isGoalMassa = resolvedUserGoal.toLowerCase().includes('massa');
                        const safeAvatar = isSafeImageUrl(ud.userProfile?.avatar_url) ? ud.userProfile.avatar_url : null;

                        return (
                            <div className="w-full min-h-screen pb-24 px-5">
                                {/* 1. HEADER DINÂMICO PREMIUM */}
                                <div className="dashboard-header sticky top-0 z-[100] backdrop-blur-xl bg-slate-900/80 border-b border-white/5 py-3 px-5 -mx-5 -mt-5 mb-6 flex justify-between items-center gap-2">
                                    {/* Lado Esquerdo: Avatar & Identidade */}
                                    <div className="relative min-w-0">
                                        <button 
                                            type="button"
                                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                            className="flex items-center gap-3 active:scale-95 transition-all text-left group max-w-full"
                                        >
                                            <div
                                                style={{
                                                    width: '42px', height: '42px', borderRadius: '50%',
                                                    background: (ud.userProfile?.gender === 'Masculino' || ud.userProfile?.gender === 'male') 
                                                        ? 'url(avatar_male.png) center / 220% no-repeat'
                                                        : (ud.userProfile?.gender === 'Feminino' || ud.userProfile?.gender === 'female')
                                                        ? 'url(avatar_female.png) center / 220% no-repeat'
                                                        : safeAvatar
                                                        ? `url("${encodeURI(safeAvatar)}") center/cover`
                                                        : 'linear-gradient(135deg, #ff6b4a, #e85334)',
                                                    border: '2px solid rgba(255,255,255,0.1)'
                                                }}
                                                className="flex items-center justify-center font-bold text-white shadow-lg flex-shrink-0 group-hover:border-orange-400/50 transition-colors"
                                            >
                                                {(!safeAvatar && (ud.userProfile?.gender !== 'Masculino' && ud.userProfile?.gender !== 'Feminino' && ud.userProfile?.gender !== 'male' && ud.userProfile?.gender !== 'female')) && (ud.userProfile?.name ? ud.userProfile.name.charAt(0).toUpperCase() : 'A')}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <h1 className="text-sm sm:text-base font-black text-white leading-tight group-hover:text-orange-400 transition-colors flex items-center gap-1.5 truncate">
                                                    Olá, {ud.userProfile?.name || 'seja bem-vindo(a)'}!
                                                    <svg className={`transition-transform duration-300 shrink-0 ${isProfileMenuOpen ? 'rotate-180' : ''} text-white/30`} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                                </h1>
                                                <div className="flex items-center mt-0.5 gap-2">
                                                    <span className="bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black px-2 py-0.5 rounded-full tracking-wider uppercase">Nível {userLevel}</span>
                                                    <span className="text-[10px] text-yellow-500 font-bold flex items-center gap-1"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15 8L21 9L16 14L17.5 20L12 17L6.5 20L8 14L3 9L9 8L12 2Z"/></svg> {homeXP.toLocaleString('pt-BR')} XP</span>
                                                </div>
                                            </div>
                                        </button>

                                        {/* Dropdown Menu de Perfil */}
                                        {isProfileMenuOpen && (
                                            <>
                                                <div 
                                                    className="fixed inset-0 z-[110]" 
                                                    onClick={() => setIsProfileMenuOpen(false)}
                                                />
                                                <div className="absolute top-full left-0 mt-3 w-60 bg-slate-800/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-[120] overflow-hidden animate-fade-in-up" style={{ animation: 'fade-in-up 0.3s ease-out' }}>
                                                    <div className="p-4 border-b border-white/5">
                                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Seu Perfil</div>
                                                        <div className="text-sm font-bold text-white truncate">{ud.userProfile?.name || 'Aluno(a)'}</div>
                                                        {resolvedUserGoal && <div className="text-[11px] text-orange-400 font-semibold mt-0.5">Meta: {resolvedUserGoal}</div>}
                                                    </div>
                                                    <div className="p-2 space-y-1">
                                                        <button 
                                                            type="button"
                                                            onClick={() => { setIsProfileMenuOpen(false); setEditProfileOpen(true); }}
                                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white hover:bg-white/10 transition-colors text-sm font-bold"
                                                        >
                                                            <span>✏️</span> Editar Perfil
                                                        </button>
                                                        <button 
                                                            type="button"
                                                            onClick={() => { setIsProfileMenuOpen(false); setPage('ranking'); }}
                                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-200 hover:bg-white/10 transition-colors text-sm font-bold"
                                                        >
                                                            <span>🏆</span> Ranking
                                                        </button>
                                                        <button 
                                                            type="button"
                                                            onClick={() => { setIsProfileMenuOpen(false); setPage('ajuda'); }}
                                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-200 hover:bg-white/10 transition-colors text-sm font-bold"
                                                        >
                                                            <span>❓</span> Central de Ajuda
                                                        </button>
                                                        <div className="h-px bg-white/5 my-1"></div>
                                                        <button 
                                                            type="button"
                                                            onClick={handleLogout}
                                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-sm font-bold"
                                                        >
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                                            Sair da Conta
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Lado Direito: Streak, Ranking, Ajuda e Notificações */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-2xl border border-white/10 streak-glow" title="Dias seguidos">
                                            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                                                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                                            </svg>
                                            <span className="text-xs font-black text-white">{homeStreak}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setPage('ranking')}
                                            aria-label="Ranking"
                                            title="Ranking"
                                            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm hover:bg-white/10 transition-colors"
                                        >
                                            🏆
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPage('ajuda')}
                                            aria-label="Ajuda"
                                            title="Ajuda"
                                            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white text-xs font-black hover:bg-white/10 transition-colors"
                                        >
                                            ?
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="Notificações"
                                            onClick={() => {
                                                setNotifOpen(true);
                                                setNotifUnread(false);
                                                try { localStorage.setItem('notifs_seen_v2', '1'); } catch {}
                                            }}
                                            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white relative hover:bg-white/10 transition-colors"
                                        >
                                            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                                            {notifUnread && <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-slate-900"></span>}
                                        </button>
                                    </div>
                                </div>

                                <div className="home-dashboard p-4 sm:p-6 max-w-4xl mx-auto">
                                {/* 1. Indicador de Comunidade isolado */}
                                <div className="flex items-center justify-between gap-3 mb-5 opacity-90">
                                    <WarriorCountBadge />
                                    {resolvedUserGoal && (
                                        <span className="text-[10px] font-black text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                            🎯 {resolvedUserGoal}
                                        </span>
                                    )}
                                </div>

                                {/* 1.5 CHECKLIST DE INÍCIO RÁPIDO (ATIVAÇÃO DIA 1) */}
                                {!quickstartDismissed && (totalCompleted === 0 || (!temAcessoNutriScan && freeScansRemainingGlobal >= NUTRISCAN_FREE_LIMIT)) && (() => {
                                    const stepWorkoutDone = totalCompleted > 0;
                                    const stepNutriDone = temAcessoNutriScan || freeScansRemainingGlobal < NUTRISCAN_FREE_LIMIT;
                                    const doneCount = 1 + (stepWorkoutDone ? 1 : 0) + (stepNutriDone ? 1 : 0);
                                    return (
                                        <div className="mb-6 p-5 rounded-[26px] bg-gradient-to-br from-slate-800/80 to-slate-900/90 border border-orange-500/25 shadow-xl">
                                            <div className="flex items-center justify-between gap-2 mb-3">
                                                <div>
                                                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-400">Comece por aqui · {doneCount}/3</span>
                                                    <h3 className="text-base font-black text-white leading-tight">Seus Primeiros Passos Hoje</h3>
                                                </div>
                                                <button
                                                    type="button"
                                                    aria-label="Ocultar checklist"
                                                    onClick={() => {
                                                        setQuickstartDismissed(true);
                                                        try { localStorage.setItem('quickstart_dismissed_v1', '1'); } catch {}
                                                    }}
                                                    className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 text-sm flex items-center justify-center"
                                                >&times;</button>
                                            </div>
                                            <div className="space-y-2.5">
                                                <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="text-sm">✅</span>
                                                        <span className="text-xs font-bold text-emerald-200 line-through opacity-80">Conta criada & objetivo definido</span>
                                                    </div>
                                                    <span className="text-[10px] font-black text-emerald-400 uppercase">Feito</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={startDailyWorkout}
                                                    className={`w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-2xl border text-left transition-all ${stepWorkoutDone ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 hover:bg-white/10 border-orange-500/35'}`}
                                                >
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <span className="text-sm">{stepWorkoutDone ? '✅' : '⚡'}</span>
                                                        <span className={`text-xs font-bold truncate ${stepWorkoutDone ? 'text-emerald-200 line-through opacity-80' : 'text-white'}`}>
                                                            Fazer seu 1º treino rápido ({Math.max(12, dailyWorkout.length * 3)} min)
                                                        </span>
                                                    </div>
                                                    <span className={`text-[10px] font-black uppercase shrink-0 ${stepWorkoutDone ? 'text-emerald-400' : 'text-orange-400'}`}>
                                                        {stepWorkoutDone ? 'Feito' : 'Começar →'}
                                                    </span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => { setArsenalSubTab('nutricao'); setPage('arsenal-vip'); }}
                                                    className={`w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-2xl border text-left transition-all ${stepNutriDone ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 hover:bg-white/10 border-emerald-500/35'}`}
                                                >
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <span className="text-sm">{stepNutriDone ? '✅' : '📸'}</span>
                                                        <span className={`text-xs font-bold truncate ${stepNutriDone ? 'text-emerald-200 line-through opacity-80' : 'text-white'}`}>
                                                            Testar 1 foto grátis no Nutri-Scan IA
                                                        </span>
                                                    </div>
                                                    <span className={`text-[10px] font-black uppercase shrink-0 ${stepNutriDone ? 'text-emerald-400' : 'text-emerald-400'}`}>
                                                        {stepNutriDone ? 'Feito' : 'Testar →'}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* 1.8 ATALHOS VISÍVEIS: DESAFIO 30 DIAS + SONO PROFUNDO */}
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <button
                                        type="button"
                                        onClick={() => { setTreinoSubTab('desafio30'); setPage('treinos'); }}
                                        className="text-left p-4 rounded-3xl bg-gradient-to-br from-orange-500/15 to-slate-900/90 border border-orange-500/25 hover:border-orange-400/50 transition-all active:scale-[0.98]"
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xl">🔥</span>
                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${hasDesafio ? 'bg-emerald-500/20 text-emerald-300' : 'bg-orange-500/20 text-orange-300'}`}>
                                                {hasDesafio ? 'Liberado' : '🔒 Plano 30D'}
                                            </span>
                                        </div>
                                        <div className="text-sm font-black text-white leading-tight">Desafio 30 Dias</div>
                                        <div className="text-[11px] text-slate-400 font-medium mt-0.5">Treino pronto dia a dia →</div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setEvolucaoSubTab('sono'); setPage('evolucao'); }}
                                        className="text-left p-4 rounded-3xl bg-gradient-to-br from-indigo-500/15 to-slate-900/90 border border-indigo-500/25 hover:border-indigo-400/50 transition-all active:scale-[0.98]"
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xl">🌙</span>
                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${hasSono ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300'}`}>
                                                {hasSono ? 'Liberado' : '🔒 Áudios'}
                                            </span>
                                        </div>
                                        <div className="text-sm font-black text-white leading-tight">Sono Profundo</div>
                                        <div className="text-[11px] text-slate-400 font-medium mt-0.5">Dormir melhor & energia →</div>
                                    </button>
                                </div>

                                {/* 2. TREINO DO DIA NO TOPO */}
                                <div className="flex items-center justify-between gap-3 mb-3">
                                    <h2 className="text-xs sm:text-sm font-black text-slate-300 uppercase tracking-[0.18em] flex items-center gap-2">
                                        ⚡ Seu Treino de Hoje em Casa
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={() => generateDailyWorkout(true)}
                                        className="text-[11px] font-black uppercase tracking-[0.12em] text-orange-400 hover:text-orange-300 transition-colors"
                                        title="Trocar sequência"
                                    >
                                        ↻ Trocar Treino
                                    </button>
                                </div>
                                {workoutSwappedMsg && (
                                    <div className="mb-3 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                                        {workoutSwappedMsg}
                                    </div>
                                )}

                                <div className="relative overflow-hidden w-full bg-slate-800/40 rounded-3xl shadow-xl group mb-6">
                                    <img
                                        src="./assets/hero-bg.webp"
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none z-0 opacity-80"
                                        alt="Treino de Hoje"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1b1622] via-[#1b1622]/80 to-transparent pointer-events-none z-0"></div>

                                    <div className="absolute top-5 left-5 z-20 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 pointer-events-none">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                            {totalCompleted === 0 ? 'Treino Rápido de Boas-Vindas' : 'Corpo Inteiro com Elásticos'}
                                        </span>
                                    </div>

                                    <div className="relative z-10 p-6 pointer-events-auto flex flex-col gap-4 mt-[115px]">
                                        <div>
                                            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-1.5 drop-shadow-xl">
                                                {resolvedUserGoal.toLowerCase().includes('massa')
                                                    ? '💪 Força & Massa Muscular em Casa'
                                                    : resolvedUserGoal.toLowerCase().includes('tonificar') || resolvedUserGoal.toLowerCase().includes('definir')
                                                    ? '✨ Firmeza & Glúteos em Casa'
                                                    : resolvedUserGoal.toLowerCase().includes('saúde') || resolvedUserGoal.toLowerCase().includes('saude') || resolvedUserGoal.toLowerCase().includes('mobilidade')
                                                    ? '🌿 Mobilidade & Disposição em Casa'
                                                    : '🔥 Queima-Gordura Prática em Casa'}
                                            </h3>
                                            <p className="text-[13px] text-slate-300 font-medium leading-relaxed">
                                                {getMotivationalPhrase(resolvedUserGoal)}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2.5">
                                            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
                                                <div className="text-sm font-black text-white">{dailyWorkout.length} exercícios</div>
                                                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Treino pronto</div>
                                            </div>
                                            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
                                                <div className="text-sm font-black text-white">{Math.max(12, dailyWorkout.length * 3)} min</div>
                                                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Duração</div>
                                            </div>
                                            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
                                                <div className="text-sm font-black text-white">{homeStreak} dias</div>
                                                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Sequência</div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-2.5">
                                            <button
                                                onClick={startDailyWorkout}
                                                disabled={isLoadingExercises}
                                                className={`flex-1 py-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl text-white font-black tracking-[0.14em] uppercase text-sm shadow-[0_8px_25px_rgba(255,107,74,0.3)] hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 ${isLoadingExercises ? 'opacity-70 cursor-not-allowed' : ''}`}
                                            >
                                                {isLoadingExercises ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                        Carregando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
                                                        Começar Treino Agora
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setPage('treinos')}
                                                className="py-3.5 px-5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl text-white font-bold text-xs uppercase tracking-wider transition-all"
                                            >
                                                Ver +500 Exercícios
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. GANCHO DE DEGUSTAÇÃO NUTRI-SCAN (2 TESTES GRÁTIS NO DIA 1!) */}
                                {!temAcessoNutriScan && (
                                    <div
                                        onClick={() => {
                                            if (freeScansRemainingGlobal > 0) {
                                                setArsenalSubTab('nutricao');
                                                setPage('arsenal-vip');
                                            } else {
                                                openHotmartCheckout('https://pay.hotmart.com/H106107115U?checkoutMode=10', {
                                                    placement: 'home_nutri_exhausted',
                                                    product: 'nutri_scan',
                                                    ud
                                                });
                                            }
                                        }}
                                        className="rounded-[28px] p-6 mb-6 relative overflow-hidden cursor-pointer border border-emerald-500/35 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-2xl"
                                        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(27,22,34,0.96) 75%)' }}
                                    >
                                        <div className="flex items-center justify-between gap-2 mb-3">
                                            <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                                {freeScansRemainingGlobal > 0
                                                    ? `🎁 ${freeScansRemainingGlobal} ${freeScansRemainingGlobal === 1 ? 'TESTE GRÁTIS' : 'TESTES GRÁTIS'} LIBERADOS`
                                                    : '✨ 7 DIAS GRÁTIS NA HOTMART'}
                                            </span>
                                            <span className="text-2xl">📸</span>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
                                            Descubra as calorias do seu prato em 3 segundos
                                        </h3>
                                        <p className="text-[13px] text-slate-300 leading-relaxed font-medium mb-3">
                                            {freeScansRemainingGlobal > 0
                                                ? 'Sem balança e sem anotar tudo! Tire uma foto ou toque no que comeu hoje e veja o resultado na hora:'
                                                : 'Você já testou o Nutri-Scan™ IA! Libere análises ilimitadas com 7 dias grátis (depois só R$ 0,33/dia).'}
                                        </p>

                                        {/* MINI-PRÉVIA VISUAL DE UM PRATO ANALISADO */}
                                        <div className="mb-4 p-3 rounded-2xl bg-black/35 border border-emerald-400/25 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <span className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-lg shrink-0">🍽️</span>
                                                <div className="min-w-0">
                                                    <div className="text-xs font-black text-white truncate">Frango grelhado, arroz e feijão</div>
                                                    <div className="text-[10px] text-emerald-300 font-bold">Proteína 38g · Carb 42g · Gord 11g</div>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="text-sm font-black text-emerald-400 leading-none">460 kcal</div>
                                                <div className="text-[9px] text-slate-400 font-bold mt-0.5">⚡ 3 seg</div>
                                            </div>
                                        </div>

                                        <div className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 px-5 rounded-2xl text-xs uppercase tracking-[0.14em] text-center transition-colors shadow-lg shadow-emerald-500/20">
                                            {freeScansRemainingGlobal > 0 ? '📸 TESTAR NUTRI-SCAN GRÁTIS (1 TOQUE)' : '👉 LIBERAR MEUS 7 DIAS GRÁTIS'}
                                        </div>
                                    </div>
                                )}

                                {/* 4. OFERTA CONTEXTUAL PERSONALIZADA (OBJETIVO + STATUS DO DESAFIO 30D) */}
                                <div className="grid grid-cols-1 gap-4 mb-8">
                                    {hasDesafio && !temAcessoPremium ? (
                                        <div
                                            className="flash-quest-card rounded-[28px] p-6 relative overflow-hidden group cursor-pointer border border-amber-500/30"
                                            onClick={() => setPage('extras')}
                                        >
                                            <div className="flex items-center gap-2 mb-2.5">
                                                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.6)]"></span>
                                                <span className="text-[11px] text-amber-300 font-black uppercase tracking-widest">Upgrade para quem já faz o Desafio 30D</span>
                                            </div>
                                            <div className="text-2xl font-black text-white leading-tight tracking-tight mb-2">
                                                Complete sua rotina com o Combo de Ouro
                                            </div>
                                            <p className="text-[13px] text-slate-300 leading-relaxed font-medium mb-5">
                                                Você já garantiu o Desafio 30 Dias! Libere agora <strong className="text-white">Musculação em Casa + Pilates Modelador + Sono Profundo + Mini-Bands</strong> em um único pagamento vitalício de <strong className="text-amber-300">R$ 24,90</strong>.
                                            </p>
                                            <div className="bg-orange-500 text-white font-black py-3.5 px-6 rounded-2xl text-xs uppercase tracking-[0.15em] text-center group-hover:bg-orange-400 transition-colors">VER COMBO DE OURO (R$ 24,90 VITALÍCIO)</div>
                                        </div>
                                    ) : !temAcessoPremium ? (
                                        <div
                                            className="flash-quest-card rounded-[28px] p-6 relative overflow-hidden group cursor-pointer"
                                            onClick={() => setPage('extras')}
                                        >
                                            <div className="flex items-center gap-2 mb-2.5">
                                                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_14px_rgba(255,107,74,0.6)]"></span>
                                                <span className="text-[11px] text-orange-300 font-black uppercase tracking-widest">
                                                    {isGoalMassa ? 'Recomendado para Ganhar Massa em Casa' : 'O Mais Escolhido para Secar e Definir'}
                                                </span>
                                            </div>
                                            <div className="text-2xl sm:text-[26px] font-black text-white leading-tight tracking-tight mb-2">
                                                {isGoalMassa
                                                    ? 'Combo de Ouro: Musculação em Casa + Desafio 30D'
                                                    : 'Combo de Ouro: Desafio 30 Dias + 5 Programas VIP'}
                                            </div>
                                            <p className="text-[13px] text-slate-300 leading-relaxed font-medium mb-5">
                                                Leve o <strong className="text-white">Desafio 30 Dias passo a passo + Musculação em Casa + Pilates + Guias Bônus</strong> pagando uma única vez <strong className="text-orange-300">R$ 24,90</strong> (sem mensalidade!).
                                            </p>
                                            <div className="bg-orange-500 text-white font-black py-3.5 px-6 rounded-2xl text-xs uppercase tracking-[0.15em] text-center group-hover:bg-orange-400 transition-colors">CONHECER O COMBO DE OURO</div>
                                        </div>
                                    ) : !temAcessoTotalVIP ? (
                                        <div
                                            className="flash-quest-card rounded-[28px] p-6 relative overflow-hidden group cursor-pointer border-emerald-500/30"
                                            onClick={() => setPage('extras')}
                                        >
                                            <div className="flex items-center gap-2 mb-2.5">
                                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                                                <span className="text-[11px] text-emerald-300 font-black uppercase tracking-widest">Acesso Completo Sem Mensalidade</span>
                                            </div>
                                            <div className="text-2xl font-black text-white leading-tight mb-2">
                                                💎 Acesso Total VIP Vitalício
                                            </div>
                                            <p className="text-[13px] text-slate-300 leading-relaxed font-medium mb-5">
                                                Libere o Nutri-Scan™ IA vitalício + Comunidade VIP + todas as atualizações futuras pagando uma única vez (R$ 69,90).
                                            </p>
                                            <div className="bg-emerald-600 text-white font-black py-3.5 px-6 rounded-2xl text-xs uppercase tracking-[0.15em] text-center group-hover:bg-emerald-500 transition-colors">VER ACESSO TOTAL VIP</div>
                                        </div>
                                    ) : (
                                        <div
                                            className="flash-quest-card rounded-[28px] p-6 relative overflow-hidden border-amber-500/30"
                                            style={{ background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(27, 22, 34, 0.9) 100%)', borderColor: 'rgba(251, 191, 36, 0.4)' }}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                                                <span className="text-xs text-amber-300 font-black uppercase tracking-widest">Status: Acesso Total VIP</span>
                                            </div>
                                            <div className="text-2xl font-black text-white leading-tight mb-2">
                                                Tudo liberado para você! ✨
                                            </div>
                                            <p className="text-[13px] text-slate-300 leading-relaxed font-medium">
                                                Você já tem acesso completo a todos os treinos, guias e ao Nutri-Scan™ IA. Bora manter a consistência!
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                    {/* Body Status Card */}
                                    <div className="bg-[#251e2e]/40 backdrop-blur-md border border-white/5 rounded-[28px] p-6 flex flex-col shadow-xl">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">Status de Recuperação</h3>
                                                <p className={`text-[10px] font-bold uppercase tracking-widest ${recovery.superior >= 80 && recovery.inferior >= 80 ? 'text-green-500' : 'text-orange-500'}`}>
                                                    {recovery.superior >= 80 && recovery.inferior >= 80 ? 'Pronto para treinar' : 'Em recuperação'}
                                                </p>
                                            </div>
                                            <span className="text-xl">🧬</span>
                                        </div>
                                        
                                        <div className="flex gap-6 items-center">
                                            <div className="w-20 h-32 relative opacity-80">
                                                <svg viewBox="0 0 100 200" className="w-full h-full">
                                                    {/* Head */}
                                                    <circle cx="50" cy="20" r="15" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                                                    {/* Torso - Dinâmico baseado em Superior */}
                                                    <rect x="35" y="40" width="30" height="50" rx="5" 
                                                        fill={recovery.superior < 50 ? "rgba(239, 68, 68, 0.4)" : recovery.superior < 90 ? "rgba(255, 107, 74, 0.4)" : "rgba(34, 197, 94, 0.3)"} 
                                                        stroke={recovery.superior < 50 ? "#ef4444" : recovery.superior < 90 ? "#ff6b4a" : "#22c55e"} 
                                                        strokeWidth="1"/>
                                                    {/* Arms - Dinâmico */}
                                                    <rect x="20" y="40" width="12" height="60" rx="4" 
                                                        fill={recovery.superior < 50 ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.15)"} 
                                                        stroke={recovery.superior < 50 ? "#ef4444" : "#22c55e"} 
                                                        strokeWidth="1"/>
                                                    <rect x="68" y="40" width="12" height="60" rx="4" 
                                                        fill={recovery.superior < 50 ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.15)"} 
                                                        stroke={recovery.superior < 50 ? "#ef4444" : "#22c55e"} 
                                                        strokeWidth="1"/>
                                                    {/* Legs - Dinâmico baseado em Inferior */}
                                                    <rect x="36" y="95" width="13" height="80" rx="4" 
                                                        fill={recovery.inferior < 50 ? "rgba(239, 68, 68, 0.4)" : recovery.inferior < 90 ? "rgba(255, 107, 74, 0.4)" : "rgba(34, 197, 94, 0.3)"} 
                                                        stroke={recovery.inferior < 50 ? "#ef4444" : recovery.inferior < 90 ? "#ff6b4a" : "#22c55e"} 
                                                        strokeWidth="1"/>
                                                    <rect x="51" y="95" width="13" height="80" rx="4" 
                                                        fill={recovery.inferior < 50 ? "rgba(239, 68, 68, 0.4)" : recovery.inferior < 90 ? "rgba(255, 107, 74, 0.4)" : "rgba(34, 197, 94, 0.3)"} 
                                                        stroke={recovery.inferior < 50 ? "#ef4444" : recovery.inferior < 90 ? "#ff6b4a" : "#22c55e"} 
                                                        strokeWidth="1"/>
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                                                        <span className="text-slate-400">Superior / Braços</span>
                                                        <span className={recovery.superior < 50 ? "text-red-500" : recovery.superior < 90 ? "text-orange-500" : "text-green-500"}>{recovery.superior}%</span>
                                                    </div>
                                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                        <div className="h-full transition-all duration-1000" style={{ width: `${recovery.superior}%`, backgroundColor: recovery.superior < 50 ? '#ef4444' : recovery.superior < 90 ? '#ff6b4a' : '#22c55e' }}></div>
                                                    </div>
                                                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                                                        <span className="text-slate-400">Core (Abdominais)</span>
                                                        <span className={recovery.core < 50 ? "text-red-500" : recovery.core < 90 ? "text-orange-500" : "text-green-500"}>{recovery.core}%</span>
                                                    </div>
                                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                        <div className="h-full transition-all duration-1000" style={{ width: `${recovery.core}%`, backgroundColor: recovery.core < 50 ? '#ef4444' : recovery.core < 90 ? '#ff6b4a' : '#22c55e' }}></div>
                                                    </div>
                                                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                                                        <span className="text-slate-400">Membros Inferiores</span>
                                                        <span className={recovery.inferior < 50 ? "text-red-500" : recovery.inferior < 90 ? "text-orange-500" : "text-green-500"}>{recovery.inferior}%</span>
                                                    </div>
                                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                        <div className="h-full transition-all duration-1000" style={{ width: `${recovery.inferior}%`, backgroundColor: recovery.inferior < 50 ? '#ef4444' : recovery.inferior < 90 ? '#ff6b4a' : '#22c55e' }}></div>
                                                    </div>
                                                </div>
                                                <p className="text-[11px] text-slate-300 font-medium leading-relaxed mt-4 italic">
                                                    {recovery.inferior === 100 && recovery.superior === 100 
                                                        ? "\"Energia total! Momento ideal para fazer o seu treino de hoje.\""
                                                        : recovery.inferior > recovery.superior 
                                                        ? "\"Foco em Pernas e Glúteos hoje. Superiores em recuperação.\""
                                                        : "\"Foco em Braços e Costas hoje. Pernas em recuperação.\""}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <HydrationSection session={ud.session} userProfile={ud.userProfile} />
                                </div>

                                {/* 6. Seu Progresso (Móvel) */}
                                <div className="bg-slate-800/40 backdrop-blur-md border border-white/5 rounded-[28px] p-6 flex flex-col shadow-xl relative overflow-hidden mb-8">
                                    <h3 className="text-xs text-slate-400 font-black uppercase tracking-widest mb-4">Seu Progresso Geral</h3>

                                    <div className="flex items-center justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="text-4xl font-black text-white leading-none mb-1">{totalCompleted.toLocaleString()}</div>
                                            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Exercícios concluídos</div>
                                        </div>
                                        
                                        <div className="h-12 w-px bg-white/10"></div>

                                        <div className="flex-1">
                                            <div className="text-4xl font-black text-white leading-none mb-1">{homeStreak}</div>
                                            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Dias seguidos</div>
                                        </div>

                                        <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-400/30 rounded-2xl px-3 py-3 shadow-[0_0_20px_rgba(251,191,36,0.1)]">
                                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                                                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>


                                {/* Footer (Landing) */}
                                <div className="mt-10 pt-8 border-t border-white/5">
                                    <div className="flex items-start justify-between gap-4 flex-wrap">
                                        <div>
                                            <div className="text-xs font-black text-white/90">Plataforma Premium de Treino</div>
                                            <div className="text-[11px] text-slate-400 mt-1">Foco em consistência, precisão e resultados.</div>
                                        </div>
                                        <div className="flex gap-4">
                                            <a href="#termos" className="text-[11px] text-slate-400 hover:text-white transition-colors">Termos</a>
                                            <a href="#privacidade" className="text-[11px] text-slate-400 hover:text-white transition-colors">Privacidade</a>
                                        </div>
                                    </div>
                                    <div id="termos" className="mt-4 text-[11px] text-slate-600">
                                        Ao continuar, você confirma que aceita os termos de uso da plataforma.
                                    </div>
                                    <div id="privacidade" className="mt-2 text-[11px] text-slate-600">
                                        Sua privacidade é prioridade: coleta e tratamento de dados apenas para melhorar sua experiência.
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                    }
                    case 'treinos': {
                        return (
                            <div className="w-full">
                                <div className="flex gap-2 px-4 pt-3 pb-2 max-w-4xl mx-auto">
                                    <button
                                        type="button"
                                        onClick={() => setTreinoSubTab('exercicios')}
                                        className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm transition-all ${treinoSubTab === 'exercicios' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/25' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
                                    >
                                        ⚡ +500 Exercícios
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setTreinoSubTab('desafio30')}
                                        className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm transition-all ${treinoSubTab === 'desafio30' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/25' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
                                    >
                                        {hasDesafio ? '🔥 Desafio 30 Dias' : '🔒 Desafio 30 Dias'}
                                    </button>
                                </div>
                                {treinoSubTab === 'desafio30' ? (
                                    hasDesafio ? (
                                        <Cronograma
                                            challengeLog={ud.challengeLog}
                                            onCompleteDay={ud.completeChallengeDay}
                                            onNav={navigateTo}
                                            ud={ud}
                                            onSelect={setSel}
                                        />
                                    ) : (
                                        <TeaserDesafioPage ud={ud} exercises={allExercises} onSelectExercise={setSel} onGoToExtras={() => navigateTo('extras')} />
                                    )
                                ) : (
                                    <TreinoModuleLive 
                                        ud={ud}
                                        setSel={setSel} 
                                        hasAccess={temAcessoPremium} 
                                        hasDesafio={hasDesafio}
                                        hasMusculacao={hasMusculacao}
                                        hasPilates={hasPilates}
                                        onOpenDesafio={() => setTreinoSubTab('desafio30')}
                                        onGoToExtras={(scrollToRedeem = false) => navigateTo('extras', { focusRedeem: scrollToRedeem })} 
                                    />
                                )}
                            </div>
                        );
                    }

                    case 'arsenal-vip': {
                        return (
                            <ArsenalVIP 
                                ud={ud} 
                                onNav={navigateTo} 
                                temAcessoNutriScan={temAcessoNutriScan}
                                onOpenNutriUpsell={openNutriScanUpsell}
                            />
                        );
                    }

                    case 'evolucao': {
                        return (
                            <div className="w-full">
                                <div className="flex gap-2 px-4 pt-3 pb-2 max-w-2xl mx-auto">
                                    <button
                                        type="button"
                                        onClick={() => setEvolucaoSubTab('peso')}
                                        className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm transition-all ${evolucaoSubTab === 'peso' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/25' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
                                    >
                                        ⚖️ Meu Peso
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEvolucaoSubTab('sono')}
                                        className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm transition-all ${evolucaoSubTab === 'sono' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
                                    >
                                        {hasSono ? '🌙 Sono Profundo' : '🔒 Sono Profundo'}
                                    </button>
                                </div>
                                {evolucaoSubTab === 'sono' ? (
                                    hasSono ? (
                                        <SonoProfundo ud={ud} />
                                    ) : (
                                        <TeaserSonoPage ud={ud} onGoToExtras={() => navigateTo('extras')} />
                                    )
                                ) : (
                                    <EvolucaoCorporal
                                        session={ud.session}
                                        userProfile={ud.userProfile}
                                        onOpenNutriScan={() => setPage('arsenal-vip')}
                                    />
                                )}
                            </div>
                        );
                    }

                    case 'extras': {
                        return <ExtrasHub 
                            ud={ud}
                            onNav={navigateTo}
                            onAccessModule={handleAccessModule} 
                            freeScansRemaining={freeScansRemainingGlobal}
                            focusRedeem={focusRedeemOnExtras}
                            onClearFocusRedeem={() => setFocusRedeemOnExtras(false)}
                            onOpenNutriScan={() => { setArsenalSubTab('nutricao'); setPage('arsenal-vip'); }}
                        />;
                    }

                    case 'ranking': {
                        return <RankingTab session={ud.session} userProfile={ud.userProfile} currentXP={homeXP} onGoToTreinos={() => setPage('treinos')} onOpenEditProfile={() => setEditProfileOpen(true)} />;
                    }

                    case 'ajuda': {
                        return <HelpDashboard onLogout={handleLogout} />;
                    }

                    case 'progresso': {
                        if (isLoadingExercises) {
                            return (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', background: 'rgba(255,255,255,0.02)', margin: '20px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255, 107, 74,0.1)', borderTopColor: '#ff6b4a', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                    <p style={{ marginTop: '20px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', letterSpacing: '1px' }}>A SINCRONIZAR DADOS...</p>
                                </div>
                            );
                        }

                        const progressXP = (totalCompleted * 100) + (ud.xpBonus || 0);
                        const progressLevel = Math.floor(progressXP / 1000) + 1;
                        const xpNextLevel = progressLevel * 1000;
                        const xpCurrentLevelProgress = progressXP % 1000;
                        const progressPct = (xpCurrentLevelProgress / 1000) * 100;
                        const progressStreak = streakCount || 0;

                        return (
                            <div className="progress-dashboard">
                                <div className="page-header"><h1>📊 O Seu Progresso</h1></div>
                                <div className="progress-level-card">
                                    <div className="level-info">
                                        <div>
                                            <h2 style={{ fontSize: '28px', fontWeight: '900', color: 'var(--accent)' }}>Nível {progressLevel}</h2>
                                            <p style={{ color: 'var(--text-secondary)' }}>{progressXP} XP Total</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{Math.round(progressPct)}%</h3>
                                            <p style={{ color: 'var(--text-secondary)' }}>Faltam {xpNextLevel - progressXP} XP</p>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(255, 107, 74,0.08)', border: '1px solid rgba(255, 107, 74,0.18)', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                        <span style={{ fontSize: '20px', flexShrink: 0 }}>🧠</span>
                                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                                            {progressStreak === 0 && 'O descanso é parte do treino! Amanhã voltamos à carga com tudo. 💪'}
                                            {progressStreak >= 1 && `Streak de ${progressStreak} dias! A consistência é o segredo.`}
                                        </p>
                                    </div>
                                </div>
                                <MetabolismCard metaProfile={ud.metaProfile} saveMetaProfile={ud.saveMetaProfile} completedExList={completedExList} />
                            </div>
                        );
                    }

                    case 'guardados': {
                        if (!temAcessoPremium) return <TeaserArsenalPage ud={ud} onGoToExtras={() => setPage('extras')} />;
                        const catalog = allExercises.length > 0 ? allExercises : EXERCISES;
                        const favs = catalog.filter(e => ud.favoritedIds.includes(e.id));
                        return (
                            <div>
                                <div className="page-header">
                                    <h1 className="text-4xl font-black italic tracking-tighter mb-2">❤️ Salvos</h1>
                                </div>
                                {favs.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {favs.map(ex => (
                                            <ExerciseCard 
                                                key={ex.id} 
                                                exercise={ex} 
                                                isCompleted={ud.isCompleted(ex.id)} 
                                                isFavorited={true} 
                                                onClick={setSel} 
                                                onFav={ud.toggleFavorite} 
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white/5 p-12 rounded-[32px] text-center border border-dashed border-white/10">
                                        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Nenhum exercício salvo.</p>
                                    </div>
                                )}
                            </div>
                        );
                    }
                }
            };

            return (
                <div className="app-layout">

                    <Sidebar page={page} onLogout={handleLogout} onNav={(p) => {
                        if (p === 'explorar_senior') {
                            setModFilter('senior');
                            setCat('Idosos');
                            setPage('treinos');
                        } else if (p === 'explorar_pilates') {
                            setModFilter('pilates');
                            setCat('Pilates');
                            setPage('treinos');
                        } else if (p === 'explorar_gymnastics') {
                            setModFilter('gymnastics');
                            setCat('Ginástica');
                            setPage('treinos');
                        } else {
                            if (p === 'treinos') setTreinoSubTab('exercicios');
                            if (p === 'evolucao') setEvolucaoSubTab('peso');
                            if (p === 'explorar') setModFilter('base');
                            setPage(p);
                        }
                    }} userProfile={ud.userProfile} />
                    <div className="app-content" style={{ position: 'relative', zIndex: 1 }}>
                        <main className="main" style={{ minHeight: '100dvh' }}>{renderPage()}</main>
                    </div>
                    {createPortal(
                        <nav className="bottom-nav" aria-label="Navegação principal">
                            {MOBILE_NAV.map(n => {
                                const showFreeNutriPill = n.id === 'arsenal-vip' && !temAcessoNutriScan && freeScansRemainingGlobal > 0;
                                const showVipPill = n.id === 'extras' && !temAcessoPremium && !temAcessoTotalVIP;
                                return (
                                    <button 
                                        key={n.id} 
                                        type="button"
                                        className={`bottom-nav-item ${page === n.id ? 'active' : ''}`} 
                                        style={{ position: 'relative' }}
                                        onClick={() => {
                                            if (n.id === 'treinos') { setModFilter('base'); setTreinoSubTab('exercicios'); }
                                            if (n.id === 'evolucao') setEvolucaoSubTab('peso');
                                            setPage(n.id);
                                        }}
                                    >
                                        {showFreeNutriPill && (
                                            <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#10b981', color: '#022c22', fontSize: '7.5px', fontWeight: '900', padding: '1px 6px', borderRadius: '99px', lineHeight: '1.25', letterSpacing: '0.03em', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(16,185,129,0.5)', pointerEvents: 'none' }}>
                                                {freeScansRemainingGlobal} GRÁTIS
                                            </span>
                                        )}
                                        {showVipPill && (
                                            <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#ff6b4a', color: '#ffffff', fontSize: '7.5px', fontWeight: '900', padding: '1px 6px', borderRadius: '99px', lineHeight: '1.25', letterSpacing: '0.04em', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(255,107,74,0.45)', pointerEvents: 'none' }}>
                                                VIP
                                            </span>
                                        )}
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                            <path d={n.d} strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span>{n.label}</span>
                                    </button>
                                );
                            })}
                        </nav>,
                        document.getElementById('portal-root') || document.body
                    )}

                    {sel && (
                        <VideoModal
                            exercise={sel}
                            isCompleted={ud.isCompleted(sel.id)}
                            onClose={handleCloseVideo}
                            onToggle={ud.toggleComplete}
                            hasNutriScanAccess={temAcessoNutriScan}
                            freeScansRemaining={freeScansRemainingGlobal}
                            onOpenNutriScan={() => { setArsenalSubTab('nutricao'); setPage('arsenal-vip'); }}
                        />
                    )}

                    {editProfileOpen && (
                        <Onboarding
                            initialProfile={ud.userProfile}
                            onCancel={() => setEditProfileOpen(false)}
                            onComplete={async (n, g, gen, a, est, wa) => {
                                await ud.saveProfile(n, g, gen, a, est, wa);
                                setEditProfileOpen(false);
                            }}
                        />
                    )}

                    {page !== 'ranking' && createPortal(
                        <button type="button" aria-label="Voltar ao topo" className={`back-to-top ${showBackToTop ? 'show' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: '20px', height: '20px' }}><path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>,
                        document.getElementById('portal-root') || document.body
                    )}

                    {trackEx && <TrackSetsModal ex={trackEx} onClose={() => setTrackEx(null)} onShowTimer={setRestTimer} onUpdateStreak={fetchUserStreaks} />}
                    {restTimer > 0 && <SmartRestTimer timeSeconds={restTimer} onComplete={() => setRestTimer(0)} onSkip={() => setRestTimer(0)} />}

                    {notifOpen && (
                        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setNotifOpen(false)} style={{ zIndex: 11000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className="password-modal-content" style={{ width: '90%', maxWidth: '400px', padding: '24px' }}>
                                <button onClick={() => setNotifOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)', fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer' }}>&times;</button>
                                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>🔔 Novidades para Você</h2>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    
                                    {/* Notificação 1: 2 Testes Grátis Nutri-Scan (CLICÁVEL) */}
                                    <div 
                                        onClick={() => { setNotifOpen(false); setArsenalSubTab('nutricao'); setPage('arsenal-vip'); }}
                                        className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
                                        style={{ background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.16) 0%, rgba(16, 185, 129, 0.05) 100%)', borderLeft: '4px solid #10b981', padding: '16px', borderRadius: '0 12px 12px 0' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <h4 style={{ color: '#fff', marginBottom: '6px', fontSize: '14px', fontWeight: '800' }}>🎁 Nutri-Scan™ IA Liberado</h4>
                                            <span style={{ fontSize: '9px', color: '#10b981', fontWeight: '900', background: 'rgba(16,185,129,0.2)', padding: '2px 6px', borderRadius: '4px' }}>TESTE GRÁTIS</span>
                                        </div>
                                        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12.5px', lineHeight: '1.45' }}>
                                            {temAcessoNutriScan
                                                ? 'Seu Nutri-Scan™ IA está ativo! Toque aqui para fotografar sua próxima refeição.'
                                                : `Você tem ${freeScansRemainingGlobal > 0 ? freeScansRemainingGlobal + ' análises grátis' : '7 dias grátis'} para descobrir as calorias do seu prato pela foto. Toque para abrir →`}
                                        </p>
                                    </div>

                                    {/* Notificação 2: Combo de Ouro (CLICÁVEL) */}
                                    {!temAcessoPremium && (
                                        <div 
                                            onClick={() => { setNotifOpen(false); setPage('extras'); }}
                                            className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
                                            style={{ background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.16) 0%, rgba(245, 158, 11, 0.05) 100%)', borderLeft: '4px solid #f59e0b', padding: '16px', borderRadius: '0 12px 12px 0' }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <h4 style={{ color: '#fff', marginBottom: '6px', fontSize: '14px', fontWeight: '800' }}>🥇 Combo de Ouro Vitalício</h4>
                                                <span style={{ fontSize: '9px', color: '#f59e0b', fontWeight: '900', background: 'rgba(245,158,11,0.2)', padding: '2px 6px', borderRadius: '4px' }}>R$ 24,90</span>
                                            </div>
                                            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12.5px', lineHeight: '1.45' }}>
                                                Desafio 30 Dias + Musculação em Casa + Pilates + 3 Guias Bônus em pagamento único (sem mensalidade). Toque para ver →
                                            </p>
                                        </div>
                                    )}

                                    {/* Notificação 3: Treino de Hoje (CLICÁVEL) */}
                                    <div 
                                        onClick={() => { setNotifOpen(false); setPage('treinos'); }}
                                        className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
                                        style={{ background: 'linear-gradient(90deg, rgba(255, 107, 74, 0.16) 0%, rgba(255, 107, 74, 0.05) 100%)', borderLeft: '4px solid #ff6b4a', padding: '16px', borderRadius: '0 12px 12px 0' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <h4 style={{ color: '#fff', marginBottom: '6px', fontSize: '14px', fontWeight: '800' }}>⚡ +500 Exercícios em Vídeo</h4>
                                        </div>
                                        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12.5px', lineHeight: '1.45' }}>
                                            Escolha o grupo muscular que quer treinar hoje em casa com seus elásticos. Toque para abrir →
                                        </p>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    )}

                    {safeVideoModalOpen && (
                        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSafeVideoModalOpen(false)} style={{ zIndex: 11000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className="password-modal-content" style={{ width: '90%', maxWidth: '400px', padding: '32px', textAlign: 'center' }}>
                                <button onClick={() => setSafeVideoModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)', fontSize: '24px', background: 'none', border: 'none' }}>&times;</button>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
                                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>Vídeo em Construção</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>Estamos gravando este vídeo em resolução 4K com a nossa equipe para garantir a melhor qualidade para você. Em breve estará disponível!</p>
                                <button className="btn-primary" onClick={() => setSafeVideoModalOpen(false)} style={{ marginTop: '24px', width: '100%' }}>Compreendido</button>
                            </div>
                        </div>
                    )}

                    {dailyWorkoutOpen && dailyWorkout.length > 0 && (
                        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDailyWorkoutOpen(false)} style={{ zIndex: 12000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className="password-modal-content" style={{ width: '95%', maxWidth: '860px', padding: '16px', maxHeight: '95vh', overflowY: 'auto' }}>
                                <div style={{ position: 'sticky', top: '-16px', background: '#1b1622', padding: '12px 0 10px', marginBottom: '12px', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                    <div>
                                        <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#fff', margin: 0, textAlign: 'left' }}>Treino do Dia</h2>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: '2px 0 0', textAlign: 'left' }}>
                                            {completedDailyIds.length} de {dailyWorkout.length} exercícios concluídos
                                        </p>
                                    </div>
                                    <button type="button" aria-label="Fechar treino do dia" onClick={() => setDailyWorkoutOpen(false)} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '22px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
                                </div>

                                <div className="full-body-workout-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {dailyWorkout.map((ex, idx) => {
                                        const embedUrl = getBunnyEmbedUrl(ex);
                                        const isActive = dailyWorkoutIndex === idx;
                                        const isDone = completedDailyIds.includes(ex.id);
                                        const categoryLabel = getCategoryLabel(ex.title);

                                        const guidMatch = embedUrl?.match(/embed\/630822\/([a-f0-9-]+)/i);
                                        const videoSrc = guidMatch ? `https://vz-f56588b2-589.b-cdn.net/${guidMatch[1]}/play_720p.mp4` : null;
                                        const posterUrl = guidMatch ? `https://vz-f56588b2-589.b-cdn.net/${guidMatch[1]}/thumbnail.jpg` : null;

                                        const toggleDone = (e) => {
                                            e.stopPropagation();
                                            setCompletedDailyIds(prev =>
                                                prev.includes(ex.id) ? prev.filter(id => id !== ex.id) : [...prev, ex.id]
                                            );
                                        };

                                        return (
                                            <div key={`${ex.id}-${idx}`} className={`full-body-item ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`} style={{
                                                padding: '0',
                                                border: isActive ? '2px solid #22d3ee' : '1px solid rgba(255,255,255,0.05)',
                                                borderRadius: '20px',
                                                overflow: 'hidden',
                                                background: isDone ? 'rgba(34,211,238,0.03)' : 'rgba(255,255,255,0.02)',
                                                opacity: isDone && !isActive ? '0.6' : '1',
                                                transition: 'all 0.3s ease'
                                            }}>
                                                <div className="full-body-item-header" onClick={() => setDailyWorkoutIndex(idx)} style={{ padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isActive ? 'rgba(34,211,238,0.05)' : 'transparent' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                                                        <div onClick={toggleDone} style={{
                                                            width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                                                            border: `2px solid ${isDone ? '#22d3ee' : 'rgba(255,255,255,0.2)'}`,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            background: isDone ? '#22d3ee' : 'transparent',
                                                            transition: 'all 0.2s'
                                                        }}>
                                                            {isDone && <svg viewBox="0 0 24 24" width="14" height="14" stroke="#000" strokeWidth="4" fill="none"><path d="M20 6L9 17L4 12" /></svg>}
                                                        </div>
                                                        <div style={{ minWidth: 0 }}>
                                                            <div style={{ fontSize: '14px', fontWeight: '900', color: '#fff', lineHeight: '1.25' }}>{ex.title || categoryLabel}</div>
                                                            <div style={{ fontSize: '10px', color: '#22d3ee', marginTop: '3px', fontWeight: '800', letterSpacing: '0.5px' }}>{categoryLabel} • 3 SÉRIES • 12-15 REPS</div>
                                                        </div>
                                                    </div>
                                                    <div style={{ color: isActive ? '#22d3ee' : 'rgba(255,255,255,0.2)', flexShrink: 0 }}>
                                                        {isActive ? (
                                                            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" /></svg>
                                                        ) : (
                                                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                                                        )}
                                                    </div>
                                                </div>

                                                {isActive && (
                                                    <div style={{ animation: 'fade-in 0.3s ease-out', padding: '0 12px 20px 12px' }}>
                                                        <div className="full-body-video-wrapper" style={{ aspectRatio: '16/9', background: '#000', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                                                            {videoSrc ? (
                                                                <video
                                                                    src={videoSrc}
                                                                    poster={posterUrl}
                                                                    controls
                                                                    playsInline
                                                                    preload="metadata"
                                                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                                />
                                                            ) : (
                                                                <iframe
                                                                    src={embedUrl}
                                                                    title={ex.title || 'Vídeo do exercício'}
                                                                    style={{ width: '100%', height: '100%', border: 'none' }}
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                                    allowFullScreen
                                                                />
                                                            )}
                                                        </div>

                                                        <div style={{ marginTop: '16px', padding: '0 4px' }}>
                                                            <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: '800', marginBottom: '8px' }}>Execução Correta:</h4>
                                                            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.6' }}>
                                                                {ex.description || "Siga o movimento do vídeo com técnica apurada. Expire no esforço e mantenha o abdômen contraído."}
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={toggleDone}
                                                                style={{
                                                                    marginTop: '16px', width: '100%', padding: '12px',
                                                                    borderRadius: '12px', background: isDone ? 'rgba(34,211,238,0.1)' : '#fff',
                                                                    color: isDone ? '#22d3ee' : '#000', fontWeight: '900', fontSize: '12px',
                                                                    textTransform: 'uppercase', letterSpacing: '1px', border: isDone ? '1px solid #22d3ee' : 'none',
                                                                    transition: 'all 0.2s', cursor: 'pointer'
                                                                }}
                                                            >
                                                                {isDone ? '✓ EXERCÍCIO CONCLUÍDO' : 'MARCAR COMO FEITO'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <button
                                    type="button"
                                    className="btn-conclude-workout"
                                    style={{
                                        marginTop: '24px',
                                        width: '100%',
                                        padding: '18px',
                                        borderRadius: '16px',
                                        background: 'linear-gradient(135deg, #14b8a6, #0f766e)',
                                        color: '#fff',
                                        fontWeight: '900',
                                        fontSize: '16px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        boxShadow: '0 8px 24px rgba(20, 184, 166, 0.2)'
                                    }}
                                    onClick={concludeDailyWorkout}
                                >
                                    Concluir Treino de Hoje (+500 XP)
                                </button>
                            </div>
                        </div>
                    )}

                    {showWorkoutVictory && (
                        <div className="fixed inset-0 z-[100001] bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setShowWorkoutVictory(false)}>
                            <div className="bg-slate-900 border border-white/15 rounded-[28px] w-full max-w-md p-6 text-center relative shadow-2xl animate-in zoom-in-95 duration-300">
                                <button
                                    type="button"
                                    onClick={() => setShowWorkoutVictory(false)}
                                    aria-label="Fechar"
                                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center"
                                >&times;</button>
                                <div className="text-5xl mb-3">🎉</div>
                                <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                                    +500 XP · 🔥 {Math.max(1, streakCount)} {Math.max(1, streakCount) === 1 ? 'dia seguido' : 'dias seguidos'}
                                </div>
                                <h2 className="text-2xl font-black text-white leading-tight mb-2">
                                    Parabéns, {ud.userProfile?.name || 'campeã'}! Treino pago!
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                                    {!temAcessoNutriScan && freeScansRemainingGlobal > 0
                                        ? 'Você mandou super bem! Agora cuide do que faz 70% do resultado: use 1 foto grátis no Nutri-Scan IA para calcular seu pós-treino em 3 segundos.'
                                        : !temAcessoNutriScan
                                        ? 'Treino garantido! Libere o Nutri-Scan IA ilimitado com 7 dias grátis para acompanhar sua alimentação sem balança.'
                                        : !hasDesafio
                                        ? 'Gostou de treinar em casa? Experimente grátis o Dia 1 do Desafio 30 Dias para ter um plano pronto na ordem certa!'
                                        : 'Consistência é o que transforma o corpo! Nos vemos no próximo treino amanhã.'}
                                </p>
                                <div className="flex flex-col gap-2.5">
                                    {!temAcessoNutriScan && freeScansRemainingGlobal > 0 ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                trackConversionEvent('victory_cta_nutri_free', { placement: 'workout_victory' });
                                                setShowWorkoutVictory(false);
                                                setPage('arsenal-vip');
                                            }}
                                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/25"
                                        >
                                            📸 Usar 1 Foto Grátis no Nutri-Scan ({freeScansRemainingGlobal} {freeScansRemainingGlobal === 1 ? 'restante' : 'restantes'})
                                        </button>
                                    ) : !temAcessoNutriScan ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowWorkoutVictory(false);
                                                openHotmartCheckout('https://pay.hotmart.com/H106107115U?checkoutMode=10', { placement: 'workout_victory_nutri_7d', product: 'nutri_scan', ud });
                                            }}
                                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/25"
                                        >
                                            👉 Liberar Nutri-Scan (7 Dias Grátis · R$ 0,33/dia)
                                        </button>
                                    ) : !hasDesafio ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                trackConversionEvent('victory_cta_desafio', { placement: 'workout_victory' });
                                                setShowWorkoutVictory(false);
                                                setTreinoSubTab('desafio30');
                                                setPage('treinos');
                                            }}
                                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-600/25"
                                        >
                                            🔥 Ver Dia 1 Grátis do Desafio 30 Dias →
                                        </button>
                                    ) : null}
                                    <button
                                        type="button"
                                        onClick={() => setShowWorkoutVictory(false)}
                                        className="w-full py-2.5 text-xs text-slate-400 hover:text-white font-bold"
                                    >
                                        Voltar para o Início
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <NutriScanUpsellModal 
                        isOpen={showNutriScanUpsell} 
                        onClose={() => setShowNutriScanUpsell(false)} 
                        onTrackEvent={handleTrackUpsell} 
                        reason={nutriUpsellReason}
                        mealContext={nutriUpsellContext}
                        ud={ud}
                        freeScansRemaining={freeScansRemainingGlobal}
                        onTryFreeNow={() => { setArsenalSubTab('nutricao'); setPage('arsenal-vip'); }}
                        onGoToExtras={() => setPage('extras')}
                    />
                </div>);
        }

        createRoot(document.getElementById('root')).render(<App />);

        // Desregistra o antigo sw.js de cache de vídeo (que colidia com OneSignal e HTTP 206 no iOS/Safari)
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations()
                .then(regs => {
                    regs.forEach(reg => {
                        const scriptUrl = reg.active?.scriptURL || reg.installing?.scriptURL || reg.waiting?.scriptURL || '';
                        if (scriptUrl.endsWith('/sw.js')) {
                            reg.unregister();
                        }
                    });
                })
                .catch(() => {});
        }
    