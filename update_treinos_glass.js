const fs = require('fs');
const code = fs.readFileSync('index.html', 'utf8');

let newCode = code.replace(
    /const props = \{ width:"32", height:"32", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round", className:"text-white mb-3" \};/,
    `const props = { width:"48", height:"48", viewBox:"0 0 24 24", fill:"none", stroke:"rgba(255,255,255,0.9)", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round", style: { filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.2))' } };`
);

const searchStr = `            return (
                <div style={{ animation: 'fade-in 0.4s ease-out', paddingBottom: '40px', width: '100%', maxWidth: '600px', margin: '0 auto' }}>`;

const replaceStr = `            return (
                <div style={{ 
                    animation: 'fade-in 0.4s ease-out', 
                    paddingBottom: '40px', 
                    width: '100%',
                    minHeight: '100vh',
                    position: 'relative',
                    background: 'linear-gradient(135deg, #020617, #0f172a, #000000)'
                }}>
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.05,
                        backgroundImage: "url('muscles.png')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        pointerEvents: 'none'
                    }} />
                    
                    <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto' }}>`;

let newCode2 = newCode.replace(searchStr, replaceStr);

const catsRegex = /\{viewMode === 'categories' && \([\s\S]*?\<div className="grid grid-cols-2 gap-4 p-6 w-full"\>[\s\S]*?\{categories\.map\(cat => \{[\s\S]*?return \([\s\S]*?<button[\s\S]*?\>[\s\S]*?\{getCategoryIcon\(cat\)\}[\s\S]*?<span.*?<\/span>[\s\S]*?<\/button>[\s\S]*?\);[\s\S]*?\}\)\}[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?\)\}/;

const newCatsView = `{viewMode === 'categories' && (
                        <div style={{ animation: 'fade-in 0.3s ease' }}>
                            <div style={{ padding: '24px', fontSize: '24px', fontWeight: '900', color: 'white', textAlign: 'left' }}>
                                O que vamos treinar hoje?
                            </div>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '24px',
                                padding: '24px',
                                width: '100%'
                            }}>
                                {categories.map(cat => {
                                    return (
                                        <button 
                                            key={cat}
                                            onClick={() => {
                                                setActiveTab(cat);
                                                setViewMode('exercises');
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'scale(1.05)';
                                                e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.6)';
                                                e.currentTarget.style.boxShadow = '0 0 20px rgba(249, 115, 22, 0.4), 0 25px 50px -12px rgba(0, 0, 0, 0.8)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'scale(1)';
                                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.8)';
                                            }}
                                            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                                            onMouseUp={(e) => {
                                                e.currentTarget.style.transform = 'scale(1.05)';
                                            }}
                                            onFocus={(e) => {
                                                e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.6)';
                                                e.currentTarget.style.boxShadow = '0 0 20px rgba(249, 115, 22, 0.4), 0 25px 50px -12px rgba(0, 0, 0, 0.8)';
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.8)';
                                            }}
                                            style={{
                                                outline: 'none',
                                                position: 'relative',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: '24px',
                                                background: 'rgba(30, 41, 59, 0.6)',
                                                backdropFilter: 'blur(24px)',
                                                WebkitBackdropFilter: 'blur(24px)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '40px',
                                                aspectRatio: '4 / 5',
                                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
                                                overflow: 'hidden',
                                                transition: 'all 0.3s ease',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {getCategoryIcon(cat)}
                                            <span style={{
                                                color: 'white',
                                                fontWeight: '900',
                                                fontSize: '24px',
                                                letterSpacing: '-0.025em',
                                                marginTop: '16px',
                                                textTransform: 'uppercase'
                                            }}>{cat}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}`;

let newCode3 = newCode2.replace(catsRegex, newCatsView);

let newCode4 = newCode3.replace(/(\{viewMode === 'exercises' [\s\S]*?<\/div>\s*?<\/div>\s*?\);)/, '                    </div>\n                    $1');

fs.writeFileSync('index.html', newCode4, 'utf8');
console.log('Modifications written to index.html successfully!');
