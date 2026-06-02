const fs = require('fs');

const file = 'c:/Users/rafae/Desktop/APP/index.html';
let content = fs.readFileSync(file, 'utf8');

const fabButtonHTML = `
                {/* Floating Action Button for Meal Scanner */}
                {page === 'inicio' && (
                    <button 
                        onClick={() => setIsScannerOpen(true)}
                        style={{
                            position: 'fixed',
                            bottom: '90px',
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

content = content.replace('</main></div>', '</main></div>\\n' + fabButtonHTML);

fs.writeFileSync(file, content, 'utf8');
console.log('FAB Inject success!');
