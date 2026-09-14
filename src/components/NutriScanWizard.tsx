import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Lock, Camera, Zap, Dumbbell, User } from 'lucide-react';
import { supabase } from '../supabase';

interface NutriScanWizardProps {
  onNavigate: (page: string) => void;
  isUnlocked: boolean;
  onUnlock: () => void;
  source?: 'nutrition' | 'workouts' | 'profile';
}

export default function NutriScanWizard({ onNavigate, isUnlocked, onUnlock, source = 'profile' }: NutriScanWizardProps) {
  const [step, setStep] = useState(1);
  const [q1, setQ1] = useState<string[]>([]);
  const [q2, setQ2] = useState<string[]>([]);
  const [q3, setQ3] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const config = {
    nutrition: {
      step1: { title: 'Qual é a sua maior dificuldade?', options: ['Controlar porções', 'Falta de tempo', 'Não saber o que comer', 'Comer doces'] },
      step2: { title: 'Que tipo de dieta você prefere?', options: ['Sem restrições', 'Vegetariana', 'Low Carb', 'Sem Glúten'] },
      step3: { title: 'Quantos litros de água você bebe por dia?', options: ['Menos de 1L', '1 a 2L', '2 a 3L', 'Mais de 3L'] },
      step4: 'Preparando o seu perfil nutricional...',
      step5: {
        title: 'Informações de nutrição rapidinho!',
        subtitle: 'Escaneie sua refeição para ver instantaneamente calorias, macronutrientes e dicas.',
        btn: 'Escanear agora',
        icon: <Camera className="w-6 h-6" />
      }
    },
    workouts: {
      step1: { title: 'Qual é o seu objetivo principal?', options: ['Perder peso', 'Ganhar massa muscular', 'Tonificar', 'Mais energia'] },
      step2: { title: 'Quantos dias por semana você pode treinar?', options: ['2 a 3 dias', '4 dias', '5 ou mais dias'] },
      step3: { title: 'Qual é o seu nível de experiência?', options: ['Iniciante', 'Intermediário', 'Avançado'] },
      step4: 'Criando o seu plano de treinos...',
      step5: {
        title: 'Treinos gerados sob medida!',
        subtitle: 'A IA cria planos semanais dinâmicos, ajustados ao seu nível e objetivo.',
        btn: 'Ver Planos',
        icon: <Dumbbell className="w-6 h-6" />
      }
    },
    profile: {
      step1: { title: 'O que trouxe você à IA hoje?', options: ['Quero comer melhor', 'Quero treinar melhor', 'Preciso de motivação', 'Mudar de vida'] },
      step2: { title: 'Como você descreve a sua forma física?', options: ['Sedentário', 'Ativo ocasionalmente', 'Atleta amador'] },
      step3: { title: 'Onde você prefere treinar?', options: ['Na academia', 'Em casa', 'Ao ar livre'] },
      step4: 'Construindo a sua IA pessoal...',
      step5: {
        title: 'Seu Treinador e Nutricionista 24/7',
        subtitle: 'A IA acompanha você em cada passo, ajustando treinos e refeições todos os dias.',
        btn: 'Descobrir IA',
        icon: <Zap className="w-6 h-6 text-yellow-500" />
      }
    }
  }[source] || {
    step1: { title: 'O que trouxe você à IA hoje?', options: ['Quero comer melhor', 'Quero treinar melhor', 'Preciso de motivação', 'Mudar de vida'] },
    step2: { title: 'Como você descreve a sua forma física?', options: ['Sedentário', 'Ativo ocasionalmente', 'Atleta amador'] },
    step3: { title: 'Onde você prefere treinar?', options: ['Na academia', 'Em casa', 'Ao ar livre'] },
    step4: 'Construindo a sua IA pessoal...',
    step5: { title: 'Seu Treinador e Nutricionista 24/7', subtitle: 'A IA acompanha você em cada passo.', btn: 'Descobrir IA', icon: <Zap className="w-6 h-6" /> }
  };

  const nextStep = () => { if (step < 6) setStep(step + 1); };
  const prevStep = () => { if (step > 1) setStep(step - 1); else onNavigate('home'); };

  const toggleQ1 = (option: string) => setQ1(prev => prev.includes(option) ? prev.filter(i => i !== option) : [...prev, option]);
  const toggleQ2 = (option: string) => setQ2(prev => prev.includes(option) ? prev.filter(i => i !== option) : [...prev, option]);

  useEffect(() => {
    if (step === 4) {
      const timer = setTimeout(() => setStep(5), 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleUnlock = async () => {
    if (accessCode.trim().toLowerCase() === 'planopro2025' && username.trim().length >= 3) {
      try {
        const { data, error: sbError } = await supabase
          .from('profiles')
          .upsert({ username: username.trim(), access_code: 'planopro2025', has_ai_access: true, updated_at: new Date().toISOString() }, { onConflict: 'username' })
          .select().single();
        
        // Even if supabase fails (e.g. RLS policies), unlock locally for the user
        if (sbError) {
          console.error("Supabase upsert failed, unlocking locally:", sbError);
        }
        
        localStorage.setItem('activeUsername', username.trim());
        onUnlock();
        onNavigate('home');
      } catch (err) {
        console.error("Network error, unlocking locally:", err);
        localStorage.setItem('activeUsername', username.trim());
        onUnlock();
        onNavigate('home');
      }
    } else {
      setError('Código inválido ou nome de utilizador curto (mínimo 3 letras).');
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white relative font-sans">
      
      {step < 4 && (
        <div className="px-5 pt-6 pb-2 flex items-center shrink-0">
          <button onClick={prevStep} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors shrink-0">
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>
          
          <div className="flex-1 flex justify-center items-center gap-1.5 px-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${step >= i ? 'bg-[#84D82C] w-8' : 'bg-gray-200 w-4'}`}></div>
            ))}
          </div>
          <div className="w-10 opacity-0 shrink-0"></div>
        </div>
      )}

      {step === 1 && (
        <div className="flex-1 flex flex-col p-5 animate-fade-in">
          <h1 className="text-3xl font-extrabold text-black mb-8 leading-tight">{config.step1.title}</h1>
          <div className="space-y-3">
            {config.step1.options.map(option => (
              <button key={option} onClick={() => toggleQ1(option)} className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-sm transition-all border-2 ${q1.includes(option) ? 'border-[#84D82C] bg-[#84D82C]/10 text-black' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}>
                {option}
              </button>
            ))}
          </div>
          <button onClick={nextStep} disabled={q1.length === 0} className="w-full bg-black text-white font-extrabold text-lg py-4 rounded-xl mt-auto mb-6 disabled:opacity-50 transition-opacity">Continuar</button>
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 flex flex-col p-5 animate-fade-in">
          <h1 className="text-3xl font-extrabold text-black mb-8 leading-tight">{config.step2.title}</h1>
          <div className="space-y-3">
            {config.step2.options.map(option => (
              <button key={option} onClick={() => toggleQ2(option)} className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-sm transition-all border-2 ${q2.includes(option) ? 'border-[#84D82C] bg-[#84D82C]/10 text-black' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}>
                {option}
              </button>
            ))}
          </div>
          <button onClick={nextStep} disabled={q2.length === 0} className="w-full bg-black text-white font-extrabold text-lg py-4 rounded-xl mt-auto mb-6 disabled:opacity-50 transition-opacity">Continuar</button>
        </div>
      )}

      {step === 3 && (
        <div className="flex-1 flex flex-col p-5 animate-fade-in">
          <h1 className="text-3xl font-extrabold text-black mb-8 leading-tight">{config.step3.title}</h1>
          <div className="space-y-3">
            {config.step3.options.map(option => (
              <button key={option} onClick={() => setQ3(option)} className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-sm transition-all border-2 ${q3 === option ? 'border-[#84D82C] bg-[#84D82C]/10 text-black' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}>
                {option}
              </button>
            ))}
          </div>
          <button onClick={nextStep} disabled={!q3} className="w-full bg-black text-white font-extrabold text-lg py-4 rounded-xl mt-auto mb-6 disabled:opacity-50 transition-opacity">Continuar</button>
        </div>
      )}

      {step === 4 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in text-center">
          <div className="w-24 h-24 border-4 border-gray-100 border-t-[#84D82C] rounded-full animate-spin mb-8"></div>
          <h2 className="text-2xl font-extrabold text-black">{config.step4}</h2>
          <p className="text-gray-400 font-bold mt-2 text-sm">Personalizando a sua experiência...</p>
        </div>
      )}

      {step === 5 && (
        <div className="flex-1 flex flex-col p-5 pt-6 animate-fade-in text-center relative overflow-y-auto hide-scrollbar">
          <h1 className="text-3xl font-extrabold text-black mb-4 leading-tight">{config.step5.title}</h1>
          <p className="text-black font-semibold text-sm mb-10 px-4">{config.step5.subtitle}</p>
          
          {source === 'nutrition' && (
            <div className="relative w-full max-w-[300px] mx-auto h-64 flex items-center justify-center mb-auto mt-8">
              <div className="absolute inset-0 border-[6px] border-[#84D82C] rounded-[40px] opacity-20"></div>
              <div className="absolute inset-0 border-[6px] border-[#84D82C] rounded-[40px] clip-scanner"></div>
              <img src="/assets/salada_kale.jpg" className="w-56 h-56 object-cover rounded-full shadow-lg" alt="Food" />
              <div className="absolute -top-4 right-0 bg-black text-white px-4 py-3 rounded-2xl font-extrabold shadow-xl z-20 rotate-3">
                <div className="text-2xl">628</div>
                <div className="text-xs">Calorias</div>
              </div>
              <div className="absolute top-8 -left-4 bg-white text-black px-4 py-2 rounded-xl font-extrabold shadow-lg text-sm z-20">Gorduras 26 g</div>
              <div className="absolute top-24 -right-4 bg-white text-black px-4 py-2 rounded-xl font-extrabold shadow-lg text-sm z-20">Proteína 35 g</div>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white text-black px-5 py-2.5 rounded-xl font-extrabold shadow-lg text-sm z-20 whitespace-nowrap">Carboidratos 67 g</div>
              <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[120%] bg-[#007AFF] text-white px-4 py-3 rounded-xl font-semibold text-xs shadow-lg z-20">
                <span className="font-extrabold">Dica:</span> Troque o arroz por quinoa para energia estável.
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#007AFF] rotate-45"></div>
              </div>
            </div>
          )}

          {source === 'workouts' && (
            <div className="relative w-full max-w-[300px] mx-auto mb-auto mt-8 flex flex-col gap-4">
               <div className="bg-gray-100 rounded-3xl p-6 text-left shadow-sm border-2 border-[#84D82C]">
                 <h3 className="font-extrabold text-black text-xl mb-1">Dia 1: Peito e Tricep</h3>
                 <p className="text-sm font-bold text-gray-500 mb-4">Treino Gerado • 6 Exercícios</p>
                 <div className="space-y-3">
                   <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm">
                     <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0"></div>
                     <div><p className="font-extrabold text-[13px]">Supino Plano</p><p className="text-[10px] text-gray-400 font-bold">4 Séries • 8-10 Reps</p></div>
                   </div>
                   <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm opacity-60">
                     <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0"></div>
                     <div><p className="font-extrabold text-[13px]">Extensão na Polia</p><p className="text-[10px] text-gray-400 font-bold">3 Séries • 12 Reps</p></div>
                   </div>
                 </div>
               </div>
            </div>
          )}

          {source === 'profile' && (
            <div className="relative w-full max-w-[300px] mx-auto mb-auto mt-8">
               <div className="w-32 h-32 bg-[#b3ff3b] rounded-full mx-auto flex items-center justify-center shadow-lg mb-6 animate-pulse">
                 <User className="w-12 h-12 text-black" />
               </div>
               <div className="bg-gray-100 p-4 rounded-2xl text-left border-l-4 border-black">
                 <p className="text-sm font-bold text-black">"Bom dia! Vi que o seu objetivo é melhorar a forma. Preparei os seus macros de hoje e o seu treino de costas. Vamos lá?"</p>
               </div>
            </div>
          )}

          <button onClick={nextStep} className="w-full bg-[#84D82C] text-black font-extrabold text-lg py-4 rounded-xl mt-24 shadow-sm hover:bg-[#75C825] transition-colors flex items-center justify-center gap-2">
            {config.step5.icon} {config.step5.btn}
          </button>
        </div>
      )}

      {step === 6 && (
        <div className="flex-1 flex flex-col p-5 pt-4 animate-fade-in relative justify-center bg-white overflow-y-auto hide-scrollbar">
          <div className="text-center mb-3">
            <div className="inline-block px-2 py-1 bg-black text-white text-[9px] font-extrabold rounded-full mb-1 tracking-widest uppercase">Acesso PRO</div>
            <h1 className="text-2xl font-extrabold text-black mb-1 leading-tight">Desbloqueie a sua IA</h1>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100 shadow-sm">
            <h3 className="font-extrabold text-black mb-2 text-sm">O que está incluído:</h3>
            <ul className="space-y-1.5 text-[11px] font-semibold text-gray-600">
              <li className="flex items-start gap-2 leading-tight"><span className="text-[#84D82C] text-[10px]">✅</span> <span><strong>Nutri-Scan:</strong> A IA diz o que está no prato e o que comer a seguir.</span></li>
              <li className="flex items-start gap-2 leading-tight"><span className="text-[#84D82C] text-[10px]">✅</span> <span><strong>+100 Receitas PRO:</strong> Acesso a refeições exclusivas e macros.</span></li>
              <li className="flex items-start gap-2 leading-tight"><span className="text-[#84D82C] text-[10px]">✅</span> <span><strong>AI Body Scan:</strong> Lê o seu corpo e recomenda o caminho certo.</span></li>
              <li className="flex items-start gap-2 leading-tight"><span className="text-[#84D82C] text-[10px]">✅</span> <span><strong>Treinadores IA 24/7:</strong> Especialistas em treino, nutrição e sono.</span></li>
              <li className="flex items-start gap-2 leading-tight"><span className="text-[#84D82C] text-[10px]">✅</span> <span><strong>Perda de Peso:</strong> Programas intensivos de 5 semanas.</span></li>
              <li className="flex items-start gap-2 leading-tight"><span className="text-[#84D82C] text-[10px]">✅</span> <span><strong>Ganho Muscular:</strong> Treinos avançados de 8 a 12 semanas.</span></li>
            </ul>
          </div>

          <p className="text-gray-500 font-semibold text-[10px] mb-3 px-2 text-center leading-tight">Crie o seu Nome de Usuário e insira o código de acesso (enviado por email após a compra) para ter acesso vitalício.</p>

          <div className="w-full">
            <input type="text" placeholder="Nome de Usuário (ex: joao_silva)" value={username} onChange={(e) => { setUsername(e.target.value); setError(''); }} className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-100 bg-white text-xs font-bold text-black mb-2 focus:border-[#84D82C] focus:ring-0 outline-none placeholder-gray-300 shadow-sm" />
            <input type="text" placeholder="Código de Acesso" value={accessCode} onChange={(e) => { setAccessCode(e.target.value); setError(''); }} className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-100 bg-white text-xs font-bold text-black focus:border-[#84D82C] focus:ring-0 outline-none placeholder-gray-300 shadow-sm" />
            {error && <p className="text-red-500 text-[10px] font-bold mt-1 text-center">{error}</p>}
          </div>

          <button onClick={handleUnlock} className="w-full bg-black text-white font-extrabold text-[13px] py-3 rounded-xl mt-3 mb-3 shadow-sm hover:bg-gray-800 transition-transform active:scale-95 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Validar Código
          </button>

          <div className="relative flex py-2 items-center mb-3">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-[9px] font-bold uppercase">Ou adquira agora</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <a 
            href={`https://pay.hotmart.com/Q107612850W?checkoutMode=10&src=${username}`}
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={(e) => {
              if (username.trim().length < 3) {
                e.preventDefault();
                setError('Por favor, cria um Nome de Utilizador primeiro para associarmos a tua compra!');
              } else {
                localStorage.setItem('activeUsername', username.trim());
              }
            }}
            className="w-full bg-gradient-to-r from-[#FF512F] to-[#DD2476] text-white font-extrabold text-[14px] py-3.5 rounded-xl shadow-md hover:opacity-90 transition-opacity flex items-center justify-center"
          >
            Comprar Acesso PRO
          </a>
          <p className="text-gray-400 text-[9px] font-bold mt-2 text-center pb-2">Pagamento 100% seguro via Hotmart</p>
        </div>
      )}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .clip-scanner { animation: scan 3s infinite linear; }
        @keyframes scan {
          0% { clip-path: inset(0 0 100% 0); }
          50% { clip-path: inset(0 0 0 0); }
          100% { clip-path: inset(100% 0 0 0); }
        }
      `}</style>
    </div>
  );
}
