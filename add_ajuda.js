const fs = require('fs');

try {
    let content = fs.readFileSync('index.html', 'utf8');

    // 1. Modificar NAV
    content = content.replace(
        "{ id: 'extras', label: 'Extras 🛒', d: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' }",
        "{ id: 'extras', label: 'Extras 🛒', d: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },\n            { id: 'ajuda', label: 'Ajuda 💬', d: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }"
    );

    // 2. Add HelpDashboard before App()
    const helpDashboardStr = `
        function HelpDashboard() {
            const [faqOpen, setFaqOpen] = React.useState(null);

            const handleReset = () => {
                if(window.confirm('Tem certeza que deseja apagar todos os dados da aplicação e limpar a cache do seu dispositivo? Esta ação fará log-out e não pode ser desfeita.')) {
                    localStorage.clear();
                    window.location.reload();
                }
            };
            
            const toggleFaq = (idx) => {
                setFaqOpen(faqOpen === idx ? null : idx);
            };

            const faqs = [
                { q: "Como acessar os Módulos Premium?", a: "Se adquiriu o Combo de Ouro, todos os módulos extra (Pilates, Idosos, Ginástica Pélvica) estarão disponíveis na aba 'Extras', bastando ativá-los gratuitamente se já estão desbloqueados na sua conta." },
                { q: "Como funciona a Matemática Calórica?", a: "Utilizamos a fórmula profissional de Mifflin-St Jeor no Raio-X corporal. A calculadora estipula o seu gasto diário (TDEE) cruzando o seu nível cardiorespiratório e musculatura com o seu objetivo em dias ativos vs dias de descanso." },
                { q: "Onde configuro o Peso Inicial?", a: "Pode configurar clicando no botão do Raio-X na aba de Evolução Corporal. Os seus registros permanecerão seguros mesmo que feche o app." },
                { q: "Posso perder o meu registro de treinos de hoje?", a: "Apenas se limpar o cache do celular manualmente ou clicar em 'Limpar Cache do App' nas opções avançadas. A melhor prática é 'Instalar' a plataforma web como App para a tela inicial." }
            ];

            return (
                <div className="progress-dashboard">
                    <div className="page-header" style={{ marginBottom: '16px' }}>
                        <h1>Central de Suporte</h1>
                    </div>
                    
                    <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e', animation: 'pulse 2s infinite' }}></div>
                        <span style={{ color: '#22c55e', fontWeight: '700', fontSize: '15px' }}>Sistemas Operacionais: 100% 🟢</span>
                    </div>

                    <div className="install-app-card" style={{ marginBottom: '32px' }}>
                        <h3 className="install-app-card-title">📱 Como instalar a App</h3>
                        <p className="install-app-card-text">
                            Adicione a plataforma à sua Tela Inicial para que atue como um aplicativo nativo. Para Android ou iOS, clique em <strong style={{ color: 'var(--text-primary)' }}>Compartilhar</strong> (ícone exportar/opções) e depois em <strong style={{ color: 'var(--accent)' }}>"Adicionar à Tela Inicial"</strong>.
                        </p>
                        <div style={{ width: '100%', maxWidth: '280px', borderRadius: '8px', overflow: 'hidden', margin: '0 auto', marginTop: '16px' }}>
                            <wistia-player media-id="62fxa7yq9p" aspect="0.4528301886792453"></wistia-player>
                        </div>
                    </div>

                    <h3 className="ps-title" style={{ marginTop: '32px' }}>Mini-Glossário da Plataforma</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '32px' }}>
                        <div style={{ background: 'linear-gradient(135deg, rgba(30,41,59,0.4), rgba(15,23,42,0.8))', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏆</div>
                            <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>XP & Ranking</h4>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Ganhe XP a cada treino e suba o seu nível competitivo no Hall of Fame de Elite.</p>
                        </div>
                        <div style={{ background: 'linear-gradient(135deg, rgba(30,41,59,0.4), rgba(15,23,42,0.8))', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📈</div>
                            <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>Avaliação Física</h4>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Mantenha as suas métricas visuais no Raio-X baseadas no Mifflin-St Jeor.</p>
                        </div>
                        <div style={{ background: 'linear-gradient(135deg, rgba(30,41,59,0.4), rgba(15,23,42,0.8))', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔓</div>
                            <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>Módulos Extra</h4>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>O ecossistema extra e de reabilitação. Explore de acordo com a permissão (VIP).</p>
                        </div>
                    </div>

                    <h3 className="ps-title" style={{ marginTop: '32px' }}>Perguntas Frequentes (FAQ)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                        {faqs.map((f, i) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                                <button onClick={() => toggleFaq(i)} style={{ width: '100%', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
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

                    <h3 className="ps-title" style={{ marginTop: '32px' }}>Fala Connosco</h3>
                    <div style={{ background: 'linear-gradient(135deg, rgba(30,41,59,0.5), rgba(15,23,42,0.8))', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '32px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
                            Descobriu um bug? Tem alguma sugestão de melhoria fenomenal para o nosso ecossistema? Envie um e-mail com detalhes.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <a href="mailto:suporte@app.com" style={{ display: 'inline-block', background: 'var(--accent)', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', boxShadow: '0 4px 12px rgba(249,115,22,0.3)', flex: 1, maxWidth: '280px' }}>
                                ✉️ Reportar Erro / Suporte
                            </a>
                        </div>
                    </div>

                    <h3 className="ps-title" style={{ marginTop: '32px', color: 'var(--red)' }}>Opções Avançadas</h3>
                    <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '24px', borderRadius: '16px', marginBottom: '40px' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>Encontrou um erro grave de cache que está a corromper as suas estatísticas? Use o botão para deslogar e limpar a Base local interna do seu perfil.</p>
                        <button onClick={handleReset} style={{ width: '100%', background: 'transparent', border: '1px solid var(--red)', color: 'var(--red)', padding: '12px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            Limpar Cache da App
                        </button>
                    </div>

                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', paddingBottom: '30px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                        <div style={{ marginBottom: '6px', fontWeight: '700' }}>Plataforma Centralizada de Treino</div>
                        <div style={{ letterSpacing: '1px', opacity: 0.7 }}>Versão 1.1.0</div>
                        <div style={{ marginTop: '12px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
                            <a href="#termos" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>Termos & Condições</a>
                            <a href="#privacidade" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>Privacidade</a>
                        </div>
                    </div>
                </div>
            );
        }

        function App() {`;
    content = content.replace('function App() {', helpDashboardStr);

    // 3. Remove install app card exactly where it is in 'inicio'
    const inicioTarget = `<div className="install-app-card" id="install-app-guide">
                                <h3 className="install-app-card-title">📱 Instale o App no seu Celular</h3>
                                <p className="install-app-card-text">
                                    Para um acesso mais rápido, adicione esta plataforma à sua Tela Inicial. É só clicar em <strong style={{ color: 'var(--text-primary)' }}>Compartilhar</strong> e depois em <strong style={{ color: 'var(--accent)' }}>"Adicionar à Tela Inicial"</strong>.
                                </p>
                                <div style={{ width: '100%', maxWidth: '280px', borderRadius: '8px', overflow: 'hidden', margin: '0 auto' }}>
                                    <wistia-player media-id="62fxa7yq9p" aspect="0.4528301886792453"></wistia-player>
                                </div>
                            </div>`;
    content = content.replace(inicioTarget, '');

    // 4. Add case 'ajuda' inside renderPage()
    const renderPageTarget = `case 'evolucao':
                        return <EvolucaoCorporal session={ud.session} />;

                    default: return null;`;
    const renderPageReplacement = `case 'evolucao':
                        return <EvolucaoCorporal session={ud.session} />;

                    case 'ajuda':
                        return <HelpDashboard />;

                    default: return null;`;
    content = content.replace(renderPageTarget, renderPageReplacement);

    // 5. Update icon replacement in the bottom navigation item map
    content = content.replace(
        ".replace(' 🔥', '').replace(' 🛒', '').replace(' 💡', '')}",
        ".replace(' 🔥', '').replace(' 🛒', '').replace(' 💡', '').replace(' 💬', '').replace(' 🏆', '').replace(' 📈', '')}"
    );

    fs.writeFileSync('index.html', content, 'utf8');
    console.log("SUCCESS!");
} catch(e) {
    console.log("FAILED: " + e.message);
}
