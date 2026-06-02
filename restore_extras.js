const fs = require('fs');

const file = 'c:/Users/rafae/Desktop/APP/index.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Injetar página no switch (page)
const extrasPageCode = `
                    case 'extras': {
                        return (
                            <div className="w-full min-h-screen pb-32 overflow-y-auto px-5">
                                <div className="dashboard-header sticky top-0 z-[100] backdrop-blur-xl bg-slate-900/80 border-b border-white/5 py-5 px-5 -mx-5 -mt-5 mb-6 flex flex-col gap-3">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10">🛒</div>
                                        <div className="flex flex-col">
                                            <h1 className="text-xl font-black text-white leading-tight">Módulos Extra</h1>
                                            <p className="text-xs text-slate-400 mt-0.5">Expanda a sua biblioteca com conteúdos especializados.</p>
                                        </div>
                                    </div>
                                    <div className="relative mt-1">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
                                        <input type="text" placeholder="Pesquisar módulo..." className="w-full bg-slate-100/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors shadow-inner" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-5">
                                    {/* 1. Combo de Ouro */}
                                    <div className="relative bg-slate-800/40 backdrop-blur-sm border border-white/10 p-5 rounded-2xl flex flex-col overflow-hidden shadow-xl">
                                        <div className="absolute top-4 -right-10 bg-red-600 text-white text-[10px] font-black px-12 py-1.5 rotate-45 shadow-lg tracking-widest">69% OFF</div>
                                        <div className="text-4xl mb-3 text-center mt-2 drop-shadow-md">⭐</div>
                                        <h2 className="text-lg font-black text-center text-white mb-2 uppercase tracking-wide">Combo de Ouro</h2>
                                        <p className="text-xs text-slate-400 text-center mb-5 leading-relaxed">Acesso vitalício a todos os recursos premium para resultados máximos.</p>
                                        <div className="bg-slate-900/60 rounded-xl p-3 flex flex-col items-center mb-5 border border-white/5">
                                            <span className="text-orange-500 font-black text-3xl">R$ 24,90</span>
                                            <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">Pagamento Único</span>
                                            <span className="text-[11px] text-slate-500 line-through mt-0.5">R$ 79,90</span>
                                        </div>
                                        <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 border border-orange-400/30 text-white font-black py-4 rounded-xl shadow-[0_8px_20px_rgba(249,115,22,0.3)] active:scale-95 transition-all mb-4 text-sm tracking-wide">GARANTIR ACESSO AGORA ➔</button>
                                        <button onClick={() => prompt('Insira o código de acesso (Combo de Ouro):')} className="text-[11px] text-slate-500 hover:text-slate-300 underline underline-offset-4 text-center w-full bg-transparent border-none transition-colors">Já comprei? Ativar código de acesso</button>
                                    </div>

                                    {/* 2. Desafio 30 Dias (Comprado) */}
                                    <div className="relative bg-slate-800/40 backdrop-blur-sm border border-emerald-500/30 p-5 rounded-2xl flex flex-col shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                        <div className="text-4xl mb-3 text-center mt-2 drop-shadow-md">📅</div>
                                        <h2 className="text-lg font-black text-center text-white mb-2 uppercase tracking-wide">Desafio 30 Dias</h2>
                                        <p className="text-xs text-slate-400 text-center mb-5 leading-relaxed">Um programa intenso para transformar o seu corpo num mês.</p>
                                        <button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 border border-emerald-400/30 text-white font-black py-4 rounded-xl shadow-[0_8px_20px_rgba(16,185,129,0.3)] active:scale-95 transition-all text-sm tracking-wide flex items-center justify-center gap-2">
                                            <span className="text-lg">✅</span> ACESSAR CONTEÚDO
                                        </button>
                                    </div>

                                    {/* NOVO: Scanner de Refeições IA */}
                                    <div className="relative bg-slate-800/60 backdrop-blur-md border border-cyan-500/40 p-5 rounded-2xl flex flex-col shadow-[0_0_30px_rgba(6,182,212,0.15)] overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-white text-[9px] font-black px-4 py-1.5 rounded-b-lg uppercase tracking-widest shadow-[0_5px_15px_rgba(6,182,212,0.5)]">Novo LANÇAMENTO</div>
                                        <div className="text-4xl mb-3 text-center mt-4 drop-shadow-md">📸</div>
                                        <h2 className="text-lg font-black text-center text-white mb-2 uppercase tracking-wide">Scanner Mecânico IA</h2>
                                        <p className="text-xs text-slate-400 text-center mb-5 leading-relaxed">O fim de contar calorias à mão. Tire uma foto ao seu prato e a nossa IA calcula macros e calorias em segundos.</p>
                                        <div className="bg-slate-900/60 rounded-xl p-3 flex flex-col items-center mb-5 border border-white/5">
                                            <span className="text-orange-500 font-black text-3xl">R$ 16,90</span>
                                            <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">Pagamento Único</span>
                                        </div>
                                        <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 border border-orange-400/30 text-white font-black py-4 rounded-xl shadow-[0_8px_20px_rgba(249,115,22,0.3)] active:scale-95 transition-all mb-4 text-sm tracking-wide">GARANTIR ACESSO AGORA ➔</button>
                                        <button onClick={() => prompt('Insira o código de acesso (Scanner IA):')} className="text-[11px] text-slate-500 hover:text-slate-300 underline underline-offset-4 text-center w-full bg-transparent border-none transition-colors">Já comprei? Ativar código de acesso</button>
                                    </div>

                                    {/* 3. Atividades para Idosos */}
                                    <div className="relative bg-slate-800/40 backdrop-blur-sm border border-white/10 p-5 rounded-2xl flex flex-col shadow-xl">
                                        <div className="text-4xl mb-3 text-center mt-2 drop-shadow-md">🧓</div>
                                        <h2 className="text-lg font-black text-center text-white mb-2 uppercase tracking-wide">Atividades para Idosos</h2>
                                        <p className="text-xs text-slate-400 text-center mb-5 leading-relaxed">Exercícios de baixo impacto para mobilidade postural e saúde na terceira idade.</p>
                                        <div className="bg-slate-900/60 rounded-xl p-3 flex flex-col items-center mb-5 border border-white/5">
                                            <span className="text-orange-500 font-black text-3xl">R$ 19,90</span>
                                            <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">Pagamento Único</span>
                                        </div>
                                        <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 border border-orange-400/30 text-white font-black py-4 rounded-xl shadow-[0_8px_20px_rgba(249,115,22,0.3)] active:scale-95 transition-all mb-4 text-sm tracking-wide">GARANTIR ACESSO AGORA ➔</button>
                                        <button onClick={() => prompt('Insira o código de acesso (Idosos):')} className="text-[11px] text-slate-500 hover:text-slate-300 underline underline-offset-4 text-center w-full bg-transparent border-none transition-colors">Já comprei? Ativar código de acesso</button>
                                    </div>

                                    {/* 4. Dinâmicas de Pilates */}
                                    <div className="relative bg-slate-800/40 backdrop-blur-sm border border-white/10 p-5 rounded-2xl flex flex-col shadow-xl">
                                        <div className="text-4xl mb-3 text-center mt-2 drop-shadow-md">🧘‍♀️</div>
                                        <h2 className="text-lg font-black text-center text-white mb-2 uppercase tracking-wide">Dinâmicas de Pilates</h2>
                                        <p className="text-xs text-slate-400 text-center mb-5 leading-relaxed">Fortaleça o core, melhore a postura e a elasticidade corporal em casa.</p>
                                        <div className="bg-slate-900/60 rounded-xl p-3 flex flex-col items-center mb-5 border border-white/5">
                                            <span className="text-orange-500 font-black text-3xl">R$ 19,90</span>
                                            <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">Pagamento Único</span>
                                        </div>
                                        <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 border border-orange-400/30 text-white font-black py-4 rounded-xl shadow-[0_8px_20px_rgba(249,115,22,0.3)] active:scale-95 transition-all mb-4 text-sm tracking-wide">GARANTIR ACESSO AGORA ➔</button>
                                        <button onClick={() => prompt('Insira o código de acesso (Pilates):')} className="text-[11px] text-slate-500 hover:text-slate-300 underline underline-offset-4 text-center w-full bg-transparent border-none transition-colors">Já comprei? Ativar código de acesso</button>
                                    </div>

                                    {/* 5. Atividades de Ginástica */}
                                    <div className="relative bg-slate-800/40 backdrop-blur-sm border border-white/10 p-5 rounded-2xl flex flex-col shadow-xl">
                                        <div className="text-4xl mb-3 text-center mt-2 drop-shadow-md">🤸‍♀️</div>
                                        <h2 className="text-lg font-black text-center text-white mb-2 uppercase tracking-wide">Ginástica Localizada</h2>
                                        <p className="text-xs text-slate-400 text-center mb-5 leading-relaxed">Aulas dinâmicas para queimar calorias extremas e melhorar condicionamento.</p>
                                        <div className="bg-slate-900/60 rounded-xl p-3 flex flex-col items-center mb-5 border border-white/5">
                                            <span className="text-orange-500 font-black text-3xl">R$ 19,90</span>
                                            <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">Pagamento Único</span>
                                        </div>
                                        <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 border border-orange-400/30 text-white font-black py-4 rounded-xl shadow-[0_8px_20px_rgba(249,115,22,0.3)] active:scale-95 transition-all mb-4 text-sm tracking-wide">GARANTIR ACESSO AGORA ➔</button>
                                        <button onClick={() => prompt('Insira o código de acesso (Ginástica):')} className="text-[11px] text-slate-500 hover:text-slate-300 underline underline-offset-4 text-center w-full bg-transparent border-none transition-colors">Já comprei? Ativar código de acesso</button>
                                    </div>
                                    
                                    <div className="text-center text-[10px] text-slate-600 mt-2 mb-4 uppercase tracking-widest font-bold">
                                        🔒 Todos os pagamentos são seguros e criptografados.
                                    </div>
                                </div>
                            </div>
                        );
                    }
`;

if (!content.includes("case 'extras':")) {
  content = content.replace('switch (page) {', 'switch (page) {\n' + extrasPageCode);
  console.log('Injetado o case extras');
} else {
  console.log('Case extras já existia(?)');
}

// 2. Injetar na NAV
if (!content.includes("{ id: 'extras',")) {
    const navItem = `{ id: 'extras', label: 'Extras 🛒', d: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },`;
    
    // We add it to const NAV array. Let's find const NAV = [
    // And insert after `const NAV = [\n`
    content = content.replace('const NAV = [', 'const NAV = [\n            ' + navItem);
    console.log('Injetado o NAV extras');
}

fs.writeFileSync(file, content, 'utf8');
console.log('Script finalizado com sucesso.');
