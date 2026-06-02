const fs = require('fs');

const file = 'c:/Users/rafae/Desktop/APP/index.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Component MealScanner Definition
const mealScannerComponent = `
        const MealScanner = ({ isOpen, onClose }) => {
            const { useState, useRef } = React;
            const [imageSrc, setImageSrc] = useState(null);
            const [textValue, setTextValue] = useState('');
            const [loading, setLoading] = useState(false);
            const [result, setResult] = useState(null);
            const [addOil, setAddOil] = useState(false);
            const [addSauce, setAddSauce] = useState(false);
            const [error, setError] = useState('');
            const fileInputRef = useRef(null);

            const handleFileChange = (e) => {
                const file = e.target.files[0];
                if (!file) return;

                setImageSrc(null);
                setResult(null);
                setError('');
                setAddOil(false);
                setAddSauce(false);

                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;
                        const MAX_DIM = 800; 

                        if (width > height) {
                            if (width > MAX_DIM) {
                                height *= MAX_DIM / width;
                                width = MAX_DIM;
                            }
                        } else {
                            if (height > MAX_DIM) {
                                width *= MAX_DIM / height;
                                height = MAX_DIM;
                            }
                        }
                        
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
                        setImageSrc(compressedBase64);
                        // Análise agora é disparada pelo botão "Analisar"
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            };

            const analyzeMeal = async () => {
                if (!imageSrc && !textValue.trim()) return;
                
                setLoading(true);
                setError('');
                try {
                    const base64Data = imageSrc ? imageSrc.split(',')[1] : null;
                    const { data, error } = await window.supabase.functions.invoke('analyze-meal', {
                        body: { 
                            image: base64Data, 
                            mimeType: imageSrc ? 'image/jpeg' : null,
                            textInput: textValue 
                        }
                    });
                    
                    if(error || !data) throw new Error(error?.message || 'Erro na resposta da IA.');

                    setResult(data);
                } catch(err) {
                    console.error("🚨 ERRO NO SCANNER:", err);
                    setResult({
                        mealName: textValue ? "Análise por Texto" : "Refeição não identificada",
                        calories: 0, protein: 0, carbs: 0, fat: 0,
                        description: textValue || "Não foi possível analisar automaticamente."
                    });
                } finally {
                    setLoading(false);
                }
            };

            const manualCals = (addOil ? 110 : 0) + (addSauce ? 80 : 0);
            const manualFat = (addOil ? 12 : 0) + (addSauce ? 4 : 0);

            if (!isOpen) return null;

            return ReactDOM.createPortal(
                <div style={{ position: 'fixed', inset: 0, zIndex: 100000, background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
                    <div className="header" style={{ justifyContent: 'space-between', display: 'flex', alignItems: 'center', padding: '0 20px', height: '60px', borderBottom: '1px solid var(--border)' }}>
                        <h2 style={{ fontSize: '18px', margin: 0 }}>Scanner Nutricional 🔥</h2>
                        <button onClick={onClose} style={{ fontSize: '32px', color: 'var(--text-primary)' }}>&times;</button>
                    </div>
                    
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                        {!result && !loading && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fade-in 0.4s' }}>
                                
                                {/* Photo Preview Area */}
                                <div 
                                    onClick={() => fileInputRef.current.click()}
                                    style={{ 
                                        width: '100%', 
                                        height: '200px', 
                                        background: 'var(--bg-surface)', 
                                        borderRadius: '24px', 
                                        border: '2px dashed var(--border)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}
                                >
                                    {imageSrc ? (
                                        <img src={imageSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '40px', marginBottom: '8px' }}>📸</div>
                                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Tirar Foto ou Upload</div>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                                </div>

                                {/* Text Description Area */}
                                <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: '24px', border: '1px solid var(--border)' }}>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '900', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                                        Detalhes da Refeição
                                    </label>
                                    <textarea 
                                        value={textValue}
                                        onChange={(e) => setTextValue(e.target.value)}
                                        placeholder="Opcional: Descreve a refeição (ex: 500ml de leite meio gordo) ou adiciona detalhes à foto."
                                        style={{ 
                                            width: '100%', 
                                            background: 'rgba(0,0,0,0.2)', 
                                            border: '1px solid var(--border)', 
                                            borderRadius: '16px', 
                                            padding: '16px', 
                                            color: '#fff', 
                                            fontSize: '15px', 
                                            minHeight: '100px',
                                            outline: 'none',
                                            resize: 'none'
                                        }}
                                    />
                                </div>

                                {/* Action Button */}
                                {(imageSrc || textValue.trim()) && (
                                    <button 
                                        onClick={analyzeMeal}
                                        style={{ 
                                            width: '100%', 
                                            padding: '20px', 
                                            background: 'linear-gradient(135deg, var(--accent), #ff9a44)', 
                                            color: '#fff', 
                                            borderRadius: 'var(--radius-full)', 
                                            fontWeight: '900', 
                                            fontSize: '18px',
                                            textTransform: 'uppercase',
                                            boxShadow: '0 8px 32px var(--accent-glow)',
                                            transition: 'transform 0.2s',
                                            animation: 'slideUp 0.3s ease-out'
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                    >
                                        🚀 Analisar AGORA
                                    </button>
                                )}
                            </div>
                        )}

                        {loading && (
                            <div style={{ textAlign: 'center', padding: '60px 0', animation: 'fade-in 0.3s ease' }}>
                                <div style={{ animation: 'spin 3s linear infinite', fontSize: '60px', marginBottom: '24px', display: 'inline-block' }}>🤖</div>
                                <h3 style={{ margin: '0 0 12px 0', fontSize: '24px', fontWeight: '900' }}>Processando...</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>A IA está a calcular os teus macros...</p>
                                <style>{'@keyframes spin { 100% { transform: rotate(360deg); } }'}</style>
                            </div>
                        )}

                        {result && !loading && (
                            <div style={{ animation: 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', padding: '20px', borderRadius: '16px', marginBottom: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                                    <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{result.mealName || 'Alimentos Detetados'}</h3>
                                    <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '16px', lineHeight: '1.6', fontWeight: '500' }}>{result.description}</p>
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
                                    <div style={{ background: 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95))', border: '1px outset rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>Kcal Totais</div>
                                        <div style={{ fontSize: '32px', fontWeight: '900', margin: '8px 0' }}>
                                            {result.calories + manualCals} 
                                        </div>
                                    </div>
                                    <div style={{ background: 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95))', border: '1px outset rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '13px', color: 'var(--green)', fontWeight: '600', textTransform: 'uppercase' }}>Proteína</div>
                                        <div style={{ fontSize: '32px', fontWeight: '900', margin: '8px 0', color: 'var(--green)' }}>
                                            {result.protein}<span style={{fontSize: '16px', fontWeight: 'normal' }}>g</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
                                    <div style={{ flex: 1, background: 'rgba(30,41,59,0.6)', padding: '16px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Hidratos</div>
                                        <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '6px' }}>{result.carbs}g</div>
                                    </div>
                                    <div style={{ flex: 1, background: 'rgba(30,41,59,0.6)', padding: '16px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Gordura</div>
                                        <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '6px' }}>{result.fat + manualFat}g</div>
                                    </div>
                                </div>

                                <h4 style={{ marginBottom: '16px', paddingLeft: '4px', fontSize: '15px' }}>Ajustes Manuais Rituais</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-surface)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', padding: '8px 0' }}>
                                        <input type="checkbox" checked={addOil} onChange={(e) => setAddOil(e.target.checked)} style={{ width: '22px', height: '22px', accentColor: 'var(--accent)' }} />
                                        <span style={{ fontSize: '16px', fontWeight: '500' }}>Adicionei Azeite/Óleo <br/><span style={{ color: 'var(--accent)', fontSize: '14px', fontWeight: '400' }}>(+110 kcal / colher)</span></span>
                                    </label>
                                    <div style={{ width: '100%', height: '1px', background: 'var(--border)' }}></div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', padding: '8px 0' }}>
                                        <input type="checkbox" checked={addSauce} onChange={(e) => setAddSauce(e.target.checked)} style={{ width: '22px', height: '22px', accentColor: 'var(--accent)' }} />
                                        <span style={{ fontSize: '16px', fontWeight: '500' }}>Adicionei Molho <br/><span style={{ color: 'var(--accent)', fontSize: '14px', fontWeight: '400' }}>(+80 kcal / dose)</span></span>
                                    </label>
                                </div>
                                
                                <button 
                                    onClick={() => {setImageSrc(null); setResult(null); setAddOil(false); setAddSauce(false); fileInputRef.current.click()}}
                                    style={{ margin: '32px 0', width: '100%', padding: '18px', background: 'transparent', border: '2px solid var(--text-muted)', color: 'var(--text-primary)', borderRadius: 'var(--radius-full)', fontWeight: 'bold', fontSize: '16px' }}>
                                    Analizar Outro Prato
                                </button>
                            </div>
                        )
                    }}
                        <style>{\`
                            @keyframes slideUp { from {opacity: 0; transform: translateY(20px);} to {opacity: 1; transform: translateY(0);} }
                            @keyframes fade-in { from {opacity: 0;} to {opacity: 1;} }
                        \`}</style>
                    </div>
                </div>,
                document.getElementById('portal-root') || document.body
            );
        };
`;

// Insert Component before `function App()`
content = content.replace('function App() {', mealScannerComponent + '\n\n        function App() {\n            const [isScannerOpen, setIsScannerOpen] = useState(false);');

// Create the FAB Button component to inject inside the Render of App
const fabButtonHTML = `
                {/* Floating Action Button for Meal Scanner */}
                {page === 'inicio' && (
                    <button 
                        onClick={() => setIsScannerOpen(true)}
                        style={{
                            position: 'fixed',
                            bottom: '90px', // Acima da bottom bar
                            right: '24px',
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--accent), #ff9a44)',
                            color: 'white',
                            fontSize: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 32px var(--accent-glow)',
                            zIndex: 90,
                            border: 'none',
                            cursor: 'pointer',
                            animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                        aria-label="Scanner de Calorias"
                    >
                        📸
                    </button>
                )}
                
                <MealScanner isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
`;

// Find where to inject FAB inside the `<div className="app-content">`
// Let's inject it right before `<main className="main">` or at the end of `<div className="app-layout">`
// We will look for return ( \n <div className="app-layout"... Wait!
// `Select-String` didn't show `return (` so let's find `</main>` or similar to insert at bottom.
// Inside App() usually we find `<BottomNav ... />` or something similar. Let's just find the end of `div className="app-content"`.
// Safer to add right before the BottomNav.
const regexMainEnd = /(<div className="bottom-nav-container".*?>)/g;
content = content.replace(regexMainEnd, fabButtonHTML + '\n$1');

fs.writeFileSync(file, content, 'utf8');
console.log('Component injected successfully!');
