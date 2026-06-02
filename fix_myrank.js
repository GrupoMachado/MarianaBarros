const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const target =                                     #{myRank || '?'}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '13px', fontWeight: '900', color: '#fff' }}>Minha Posição</div>
                                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', fontWeight: '700' }}>
                                        ?? Próximo Alvo: <span className=" text-orange-500\>Faltam {(150 + Math.floor(Math.random() * 50))} XP</span> para subir.
 </div>
 </div>;

const replacement = #{(!myRank || myRank > 50) ? '?' : myRank}
 </div>
 <div style={{ flex: 1 }}>
 <div style={{ fontSize: '13px', fontWeight: '900', color: '#fff' }}>Minha Posição</div>
 <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', fontWeight: '700' }}>
 {(!myRank || myRank > 50) ? (
 <>?? Alvo: <span className=\text-orange-500\>Faltam {Math.max(1, (topUsers[49]?.xp || 0) - currentXP)} XP</span> para entrar no ranking</>
 ) : myRank === 1 ? (
 <>?? <span className=\text-orange-500\>És o Top 1!</span> Mantém a posição.</>
 ) : (
 <>?? Próximo Alvo: <span className=\text-orange-500\>Faltam {Math.max(1, (topUsers[myRank - 2]?.xp || 0) - currentXP)} XP</span> para subir.</>
 )}
 </div>
 </div>;

code = code.replace(target, replacement);
fs.writeFileSync('index.html', code);
console.log('Done!');
