import React, { useState } from 'react';
import { Check } from 'lucide-react';
import Home from './components/Home';
import PlanOverview from './components/PlanOverview';
import Nutrition from './components/Nutrition';
import NutriScanWizard from './components/NutriScanWizard';
import NutriScanChat from './components/NutriScanChat';
import Workouts from './components/Workouts';
import Mind from './components/Mind';
import MuscleGroup from './components/MuscleGroup';
import RecipeDetail from './components/RecipeDetail';
import AIBodyScan from './components/AIBodyScan';
import Profile from './components/Profile';
import ActivePlan from './components/ActivePlan';
import { coaches } from './data/coaches';

function App() {
  // View navigation state
  const [currentView, setCurrentView] = useState('home');
  const [currentMuscleData, setCurrentMuscleData] = useState({ id: 'costas', title: 'Costas', img: '' });
  const [isNutriScanUnlocked, setIsNutriScanUnlocked] = useState(localStorage.getItem('nutriScanUnlocked_v2') === 'true');
  const [currentProps, setCurrentProps] = useState<any>({});
  
  // State for selections
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [focuses, setFocuses] = useState<string[]>([]);
  const [gender, setGender] = useState<string>('Masculino');
  const [selectedCoachId, setSelectedCoachId] = useState<string>('mike');
  
  // Chat state per coach
  const [chats, setChats] = useState<Record<string, {role: 'user' | 'model', text: string}[]>>({});
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Get current messages for the selected coach
  const currentMessages = chats[selectedCoachId] || [];

  const navigateTo = (view: string, props: any = {}) => {
    if (view === 'coach-intro' && !isNutriScanUnlocked) {
      setCurrentView('nutri-scan');
      setCurrentProps({ source: 'profile' });
      return;
    }
    setCurrentView(view);
    setCurrentProps(props);
  };

  const sendMessage = async (text: string = inputValue) => {
    if (!text.trim()) return;
    
    // Add user message to the specific coach's chat
    const userMsg = { role: 'user' as const, text };
    setChats(prev => ({
      ...prev,
      [selectedCoachId]: [...(prev[selectedCoachId] || []), userMsg]
    }));
    
    setInputValue('');
    setIsTyping(true);
    
    // Scroll to bottom
    setTimeout(() => {
      const container = document.getElementById('chat-messages-container');
      if (container) container.scrollTop = container.scrollHeight;
    }, 100);

    try {
      const coach = coaches.find(c => c.id === selectedCoachId);
      
      const response = await fetch('https://wutjxjubudszwgvxedgm.supabase.co/functions/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          coachName: coach?.name || 'Treinador',
          coachDescription: coach?.description || 'Um especialista em fitness.'
        })
      });
      
      const data = await response.json();
      
      if (data.reply) {
        setChats(prev => ({
          ...prev,
          [selectedCoachId]: [...(prev[selectedCoachId] || []), { role: 'model', text: data.reply }]
        }));
      } else {
        setChats(prev => ({
          ...prev,
          [selectedCoachId]: [...(prev[selectedCoachId] || []), { role: 'model', text: 'Desculpe, tive um problema ao processar isso.' }]
        }));
      }
    } catch (error) {
      console.error(error);
      setChats(prev => ({
        ...prev,
        [selectedCoachId]: [...(prev[selectedCoachId] || []), { role: 'model', text: 'Erro de conexão com o servidor.' }]
      }));
    } finally {
      setIsTyping(false);
      setTimeout(() => {
        const container = document.getElementById('chat-messages-container');
        if (container) container.scrollTop = container.scrollHeight;
      }, 100);
    }
  };

  const toggleSpecialty = (opt: string) => {
    setSpecialties(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt]);
  };

  const toggleFocus = (opt: string) => {
    setFocuses(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt]);
  };

  return (
    <div className="w-full h-full">
      {currentView === 'home' && <Home onNavigate={navigateTo} />}
      {currentView === 'nutrition' && <Nutrition onNavigate={navigateTo} isNutriScanUnlocked={isNutriScanUnlocked} />}
      {currentView === 'nutri-scan-intro' && <NutriScanWizard onNavigate={navigateTo} onUnlock={() => { setIsNutriScanUnlocked(true); localStorage.setItem('nutriScanUnlocked_v2', 'true'); }} isUnlocked={isNutriScanUnlocked} source={currentProps?.source || 'profile'} />}
      {currentView === 'nutri-scan-chat' && <NutriScanChat onNavigate={navigateTo} />}
      {currentView === 'workouts' && <Workouts onNavigate={navigateTo} />}
      {currentView === 'mind' && <Mind onNavigate={navigateTo} />}
      {currentView === 'muscle-group' && <MuscleGroup onNavigate={navigateTo} muscleData={{ id: currentProps.muscleId, title: currentProps.title, img: currentProps.img }} />}
      {currentView === 'recipe-detail' && <RecipeDetail onNavigate={navigateTo} recipe={currentProps.recipe} />}
      {currentView === 'ai-body-scan' && <AIBodyScan onNavigate={navigateTo} isNutriScanUnlocked={isNutriScanUnlocked} />} 
      {currentView === 'profile' && <Profile onNavigate={navigateTo} isNutriScanUnlocked={isNutriScanUnlocked} />}
      {currentView === 'plan-overview' && (
        <PlanOverview 
          onBack={() => navigateTo('home')} 
          onStart={() => isNutriScanUnlocked ? navigateTo('active-plan', currentProps) : navigateTo('nutri-scan-intro', { source: 'workouts' })} 
          {...currentProps} 
        />
      )}
      {currentView === 'active-plan' && (
        <ActivePlan onNavigate={navigateTo} planData={currentProps} />
      )}
      {currentView === 'coach-intro' && (
        <div className="flex flex-col h-screen max-w-md mx-auto bg-white relative p-6">
          <div className="flex justify-between items-center mb-8">
            <button onClick={() => navigateTo('home')} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold">
              ←
            </button>
            <div className="w-6 h-6 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <h1 className="text-3xl font-extrabold mb-8 text-black leading-tight">
            Obtenha conselhos personalizados dos nossos treinadores de IA
          </h1>
          
          <div className="flex -space-x-4 mb-6 justify-center">
             <div className="w-16 h-24 bg-gray-300 rounded-xl overflow-hidden border-2 border-white relative z-10"><img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=300&fit=crop" className="object-cover w-full h-full" alt="coach"/></div>
             <div className="w-16 h-24 bg-gray-300 rounded-xl overflow-hidden border-2 border-white relative z-20 scale-110"><img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=300&fit=crop" className="object-cover w-full h-full" alt="coach"/></div>
             <div className="w-16 h-24 bg-gray-300 rounded-xl overflow-hidden border-2 border-white relative z-30 scale-125"><img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=300&fit=crop" className="object-cover w-full h-full" alt="coach"/></div>
             <div className="w-16 h-24 bg-gray-300 rounded-xl overflow-hidden border-2 border-white relative z-20 scale-110"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=300&fit=crop" className="object-cover w-full h-full" alt="coach"/></div>
             <div className="w-16 h-24 bg-gray-300 rounded-xl overflow-hidden border-2 border-white relative z-10"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop" className="object-cover w-full h-full" alt="coach"/></div>
          </div>
          
          <p className="text-gray-600 font-medium text-lg text-center mt-8 mb-auto">
            Nossa equipe de treinadores de IA está aqui para ajudar com qualquer dúvida sobre fitness. Seja nutrição, sono, bem-estar mental ou condicionamento, temos o coach ideal para você!
          </p>

          <button onClick={() => navigateTo('coach-step-specialty')} className="w-full bg-[#84D82C] text-black font-extrabold text-lg py-4 rounded-full mt-8 hover:opacity-90">
            Continuar
          </button>
        </div>
      )}
      
      {currentView === 'coach-step-specialty' && (
        <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F9F9F9] relative p-6">
          <div className="flex justify-between items-center mb-8">
            <button onClick={() => navigateTo('coach-intro')} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold hover:bg-gray-300">
              ←
            </button>
            <div className="w-6 h-6 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          
          <h1 className="text-3xl font-extrabold mb-2 text-black leading-tight">
            Busca um coach com especialidade específica?
          </h1>
          <p className="text-gray-500 mb-6 font-semibold">Selecione todas as opções que se aplicam</p>
          
          <div className="flex-1 overflow-y-auto space-y-3 pb-28">
            {['Perda de peso', 'Ganho de força e músculo', 'Sono e recuperação', 'Bem-estar mental e coaching', 'Longevidade e biohacking', 'Corrida e resistência', 'Nutrição e suplementos', 'Fitness geral', 'Desempenho esportivo e psicologia'].map(opt => {
              const isSelected = specialties.includes(opt);
              return (
                <div key={opt} onClick={() => toggleSpecialty(opt)} className="flex items-center justify-between bg-white p-4 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-extrabold text-black text-lg">{opt}</span>
                  <div className={`w-6 h-6 flex items-center justify-center rounded-md border-2 ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                    {isSelected && <Check size={14} className="text-white" strokeWidth={4} />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-0 left-0 w-full p-6 pt-10 bg-gradient-to-t from-[#F9F9F9] via-[#F9F9F9] to-transparent">
             <button 
               onClick={() => navigateTo('coach-step-focus')} 
               disabled={specialties.length === 0}
               className={`w-full font-extrabold text-lg py-4 rounded-full transition-all duration-300 shadow-sm ${
                 specialties.length > 0 ? 'bg-[#84D82C] text-black hover:opacity-90' : 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed'
               }`}>
              Continuar
             </button>
          </div>
        </div>
      )}

      {currentView === 'coach-step-focus' && (
        <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F9F9F9] relative p-6">
          <div className="flex justify-between items-center mb-8">
            <button onClick={() => navigateTo('coach-step-specialty')} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold hover:bg-gray-300">
              ←
            </button>
            <div className="w-6 h-6 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          
          <h1 className="text-3xl font-extrabold mb-2 text-black leading-tight">
            No que você quer focar com seu coach?
          </h1>
          <p className="text-gray-500 mb-6 font-semibold">Selecione todas as opções que se aplicam</p>
          
          <div className="flex-1 overflow-y-auto space-y-3 pb-28">
            {['Motivação para treinar', 'Regularidade nos treinos', 'Hábitos saudáveis', 'Qualidade do sono', 'Gerenciar estresse e ansiedade', 'Acompanhar meu progresso', 'Suplementação', 'Melhorar flexibilidade', 'Treinar para um evento', 'Definir metas realistas', 'Horário das refeições e treinos', 'Calistenia', 'Jejum intermitente'].map(opt => {
              const isSelected = focuses.includes(opt);
              return (
                <div key={opt} onClick={() => toggleFocus(opt)} className="flex items-center justify-between bg-white p-4 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-extrabold text-black text-lg">{opt}</span>
                  <div className={`w-6 h-6 flex items-center justify-center rounded-md border-2 ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                    {isSelected && <Check size={14} className="text-white" strokeWidth={4} />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-0 left-0 w-full p-6 pt-10 bg-gradient-to-t from-[#F9F9F9] via-[#F9F9F9] to-transparent">
             <button 
               onClick={() => navigateTo('coach-step-gender')}
               disabled={focuses.length === 0}
               className={`w-full font-extrabold text-lg py-4 rounded-full transition-all duration-300 shadow-sm ${
                 focuses.length > 0 ? 'bg-[#84D82C] text-black hover:opacity-90' : 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed'
               }`}>
              Continuar
             </button>
          </div>
        </div>
      )}
      
      {currentView === 'coach-step-gender' && (
        <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F9F9F9] relative p-6">
          <div className="flex justify-between items-center mb-8">
            <button onClick={() => navigateTo('coach-step-focus')} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold hover:bg-gray-300">
              ←
            </button>
            <div className="w-6 h-6 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          
          <h1 className="text-3xl font-extrabold mb-6 text-black leading-tight">
            Seu treinador ideal é:
          </h1>
          
          <div className="flex-1 space-y-3 pb-28">
            {['Feminino', 'Masculino', 'Sem preferência'].map((opt) => {
              const isSelected = gender === opt;
              return (
                <div key={opt} onClick={() => setGender(opt)} className={`flex items-center justify-between bg-white p-4 rounded-2xl cursor-pointer border-2 transition-all duration-200 ${isSelected ? 'border-blue-500' : 'border-transparent hover:border-gray-200'}`}>
                  <span className="font-extrabold text-black text-lg">{opt}</span>
                  <div className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-0 left-0 w-full p-6 pt-10 bg-gradient-to-t from-[#F9F9F9] via-[#F9F9F9] to-transparent">
             <button 
               onClick={() => navigateTo('coach-step-showcase')}
               className="w-full bg-[#84D82C] text-black font-extrabold text-lg py-4 rounded-full shadow-sm hover:opacity-90 transition-all duration-300">
              Continuar
             </button>
          </div>
        </div>
      )}

      {currentView === 'coach-step-showcase' && (
        <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F9F9F9] relative p-6">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => navigateTo('coach-step-gender')} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold hover:bg-gray-300">
              ←
            </button>
            <div className="w-6 h-6 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          
          <h1 className="text-3xl font-extrabold mb-6 text-black leading-tight">
            Fale com seu coach a qualquer hora, sobre qualquer coisa
          </h1>
          
          <div className="relative rounded-3xl overflow-hidden mb-6 h-72">
             <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" alt="coach showcase" />
             <div className="absolute inset-0 bg-black/10"></div>
             
             <div className="absolute top-1/4 left-4 bg-white px-3 py-2 rounded-xl text-center shadow-lg border border-gray-100">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#84D82C] text-black w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">💪</div>
                <p className="text-[10px] font-bold text-black mt-1">Me motive para<br/>o treino de<br/>hoje!</p>
             </div>
             
             <div className="absolute top-1/3 right-4 bg-white px-3 py-2 rounded-xl text-center shadow-lg border border-gray-100">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#84D82C] text-black w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">🥗</div>
                <p className="text-[10px] font-bold text-black mt-1">Quero<br/>tentar a<br/>dieta<br/>cetogênica</p>
             </div>
             
             <div className="absolute bottom-4 right-8 bg-white px-3 py-2 rounded-xl text-center shadow-lg border border-gray-100">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#84D82C] text-black w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">⏱️</div>
                <p className="text-[10px] font-bold text-black mt-1">Como definir o<br/>abdômen rápido?</p>
             </div>
          </div>
          
          <p className="text-gray-600 font-medium text-lg mt-auto mb-8">
            O que estiver na sua mente, seu coach está disponível 24/7 para dar recomendações personalizadas para seus objetivos.
          </p>

          <button onClick={() => navigateTo('coach-list')} className="w-full bg-[#84D82C] text-black font-extrabold text-lg py-4 rounded-full mt-auto hover:opacity-90 transition-all duration-300">
            Continuar
          </button>
        </div>
      )}

      {currentView === 'coach-list' && (
        <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F9F9F9] relative">
          <div className="flex justify-between items-center p-6 pb-2">
            <h1 className="text-3xl font-extrabold text-black leading-tight">
              Perfeito para você
            </h1>
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors" onClick={() => navigateTo('home')}>
              X
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-4 pt-4">
             {coaches.map(coach => (
               <div 
                 key={coach.id}
                 className="bg-white rounded-[32px] overflow-hidden shadow-sm relative cursor-pointer hover:shadow-md transition-shadow" 
                 onClick={() => {
                   setSelectedCoachId(coach.id);
                   navigateTo('coach-chat');
                 }}
               >
                  {coach.isBestMatch && (
                    <div className="absolute top-4 left-4 bg-[#E2FF7D] text-black text-xs font-bold px-3 py-1.5 rounded-full z-10 flex items-center gap-1">
                       <span>⭐ Melhor Correspondência</span>
                    </div>
                  )}
                  <img src={coach.image} className="w-full h-48 object-cover object-top" alt={coach.name} />
                  <div className="absolute inset-0 h-48 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
                  
                  <div className="p-5 pt-0 relative z-20 -mt-8">
                     <div className="flex items-end gap-3 mb-3">
                       <img src={coach.face} className="w-14 h-14 rounded-full border-4 border-white object-cover" alt={`${coach.name} profile`} />
                       <h2 className="text-2xl font-extrabold text-black">{coach.name}</h2>
                     </div>
                     <div className="flex flex-wrap gap-2 mb-3">
                       {coach.tags.map(tag => (
                         <span key={tag} className="border border-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">{tag}</span>
                       ))}
                     </div>
                     <p className="text-gray-500 text-sm font-medium">{coach.description}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {currentView === 'coach-chat' && (
        <div className="flex flex-col h-screen max-w-md mx-auto bg-gradient-to-b from-[#E6F5EE] to-[#E6F0F5] relative">
          <div className="flex justify-between items-center p-4 pt-6">
            <button onClick={() => navigateTo('coach-list')} className="w-10 h-10 flex items-center justify-center font-bold text-xl text-black hover:bg-white/30 rounded-full transition-colors">
              &lt;
            </button>
            <div className="flex items-center gap-2 bg-white/50 px-4 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
               <img src={coaches.find(c => c.id === selectedCoachId)?.face} className="w-6 h-6 rounded-full object-cover" alt={coaches.find(c => c.id === selectedCoachId)?.name} />
               <span className="font-extrabold text-sm text-black">{coaches.find(c => c.id === selectedCoachId)?.name}</span>
            </div>
            <div className="w-10"></div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4" id="chat-messages-container">
             <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-black font-semibold max-w-[85%]">
               Olá! Sou o {coaches.find(c => c.id === selectedCoachId)?.name}, o teu treinador pessoal de IA 💪 Embora eu não seja humano, tenho conhecimento e experiência que ninguém mais tem. É um prazer ser o teu treinador! 🔥
             </div>
             
             {currentMessages.map((msg, idx) => (
                <div key={idx} className={`p-4 rounded-2xl shadow-sm font-semibold max-w-[85%] ${msg.role === 'user' ? 'bg-[#84D82C] text-black ml-auto rounded-tr-none' : 'bg-white text-black rounded-tl-none'}`}>
                  {msg.text}
                </div>
             ))}

             {isTyping && (
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-gray-400 font-semibold max-w-[85%] flex gap-1 items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
             )}
          </div>
          
          <div className="bg-white rounded-t-3xl p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
             {currentMessages.length === 0 && (
               <>
                 <div className="flex items-center justify-between mb-4 cursor-pointer">
                   <span className="font-extrabold text-sm text-gray-800">Não sabe o que perguntar? &gt;</span>
                 </div>
                 <div className="space-y-2 mb-4">
                   {['O que devo comer para atingir meu objetivo?', 'Qual é o melhor horário para os meus treinos?', 'Me motive para o treino de hoje!'].map(q => (
                     <div key={q} onClick={() => sendMessage(q)} className="bg-gray-100 rounded-full px-4 py-2.5 text-sm font-bold text-gray-600 flex gap-2 cursor-pointer hover:bg-gray-200 transition-colors">
                       <span>&quot;</span> {q}
                     </div>
                   ))}
                 </div>
               </>
             )}
             
             <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1.5 mt-auto">
               <button className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-sm">📷</button>
               <button className="w-8 h-8 flex items-center justify-center font-bold text-blue-500 text-xs">GIF</button>
               <input 
                 type="text" 
                 value={inputValue}
                 onChange={(e) => setInputValue(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                 placeholder="Aa" 
                 className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-semibold text-black px-2 outline-none" 
               />
               <button onClick={() => sendMessage()} className="w-8 h-8 flex items-center justify-center text-gray-400 font-bold hover:text-blue-500 transition-colors">↑</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;











