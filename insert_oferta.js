const fs = require('fs');

const offerHTML = `
                    {/* --- INICIO OFERTA VIP CHECKOUT --- */}
                    <div className="offer-checkout-section" style={{ marginTop: '60px', padding: '40px 20px', background: 'linear-gradient(180deg, rgba(15, 23, 42, 0), rgba(15, 23, 42, 0.8))', borderRadius: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 10 }}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#fff', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '-0.5px', lineHeight: '1.2' }}>
                                <span style={{ color: '#ea580c', marginRight: '8px' }}>🔥</span>A OFERTA IRRECUSÁVEL
                            </h2>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                (Válida apenas nesta página)
                            </p>
                        </div>

                        <div className="offer-copy" style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 40px', padding: '0 10px' }}>
                            <p style={{ marginBottom: '16px' }}>
                                Um Personal Trainer cobraria, no mínimo, <strong>R$ 150 por uma única hora</strong> para corrigir o seu movimento.
                            </p>
                            <p style={{ marginBottom: '24px' }}>
                                Hoje, como você já deu um voto de confiança no nosso material, você não vai pagar <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>R$ 100/mês</span>.
                            </p>
                            <p style={{ fontSize: '18px', color: '#fff', marginBottom: '12px', lineHeight: '1.4' }}>
                                Você pode ter os nossos treinadores analisando os seus vídeos, os desafios semanais e a comunidade de elite por apenas <strong style={{ color: '#ea580c', fontSize: '24px', display: 'block', marginTop: '8px' }}>R$ 46,99 mensais</strong>.
                            </p>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: '1.5' }}>
                                (Isso dá cerca de R$ 1,50 por dia. Menos do que um cafezinho na padaria para ter a certeza absoluta de que cada gota de suor sua está construindo o corpo que você quer).
                            </p>
                        </div>

                        <div className="checkout-box" style={{ background: '#1e293b', borderRadius: '12px', padding: '32px 24px', maxWidth: '400px', margin: '0 auto', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', textAlign: 'center', position: 'relative' }}>
                            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textTransform: 'lowercase', letterSpacing: '1px', marginBottom: '24px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="rgba(255,255,255,0.4)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
                                hotmart
                            </div>
                            <button style={{ width: '100%', padding: '20px 24px', fontSize: '18px', fontWeight: '900', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(234, 88, 12, 0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'transform 0.2s' }} onClick={() => alert('Link de Checkout externo em breve!')} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                Garantir Acesso VIP Agora
                            </button>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                Pagamento 100% Seguro
                            </div>
                        </div>
                    </div>
                    {/* --- FIM OFERTA VIP CHECKOUT --- */}
`;

let content = fs.readFileSync('index.html', 'utf8');

const targetStr = `
                        })}
                    </div>
                </div>
            );
        }

        function Cronograma`;

const replacementStr = `
                        })}
                    </div>
` + offerHTML + `
                </div>
            );
        }

        function Cronograma`;

if (content.includes("A OFERTA IRRECUSÁVEL")) {
    console.log("Oferta já inserida.");
} else {
    content = content.replace(targetStr, replacementStr);
    fs.writeFileSync('index.html', content, 'utf8');
    console.log("Oferta VIP inserida com sucesso.");
}
