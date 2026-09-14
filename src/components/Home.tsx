import React from 'react';
import { Calendar, LayoutDashboard, Utensils, Flower2, User, MessageCircle } from 'lucide-react';

export default function Home({ onNavigate }: { onNavigate: (page: string, props?: any) => void }) {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F9F9F9] relative overflow-hidden font-sans">

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24 px-5">
        
        {/* Header */}
        <div className="flex justify-between items-start mt-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-black mb-2">
              Selecione um plano<br/>de fitness!
            </h1>
            <p className="text-gray-500 font-medium text-sm">
              Todos os planos são personalizados para você.
            </p>
          </div>
          <div className="relative cursor-pointer" onClick={() => onNavigate('coach-intro')}>
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <MessageCircle size={24} className="text-gray-600" />
            </div>
            <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-[#F9F9F9] flex items-center justify-center text-[8px] text-white font-bold">1</div>
          </div>
        </div>

        {/* Featured Big Card */}
        <div 
          onClick={() => onNavigate('plan-overview', { title: 'Força em todo o corpo', duration: '12 semanas', image: '/assets/ai_bearded_man.jpg', tag: 'Seu plano pessoal', workoutsPerWeek: 4, minutes: '25 - 40 min', goal: 'Ganhar músculo' })}
          className="mb-8 relative rounded-[32px] overflow-hidden bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        >
          <img 
            src="/assets/ai_bearded_man.jpg" 
            alt="Homem após treino em casa" 
            className="w-full h-64 object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent top-1/3"></div>
          
          <div className="absolute bottom-0 left-0 w-full p-5">
            <div className="flex space-x-2 mb-3">
              <span className="bg-[#E2FF7D] text-black text-xs font-bold px-3 py-1.5 rounded-full">Seu plano pessoal</span>
              <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full">12 semanas</span>
            </div>
            <h2 className="text-2xl font-extrabold text-black mb-3">Força em todo o corpo</h2>
            
            <div className="flex space-x-4 items-center">
              <div className="flex items-center space-x-1.5">
                <div className="flex items-end space-x-0.5 h-3">
                  <div className="w-1 h-1.5 bg-[#84D82C] rounded-sm"></div>
                  <div className="w-1 h-2 bg-gray-300 rounded-sm"></div>
                  <div className="w-1 h-3 bg-gray-300 rounded-sm"></div>
                </div>
                <span className="text-gray-500 text-sm font-semibold">Cardiovascular</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="flex items-end space-x-0.5 h-3">
                  <div className="w-1 h-1.5 bg-[#84D82C] rounded-sm"></div>
                  <div className="w-1 h-2 bg-[#84D82C] rounded-sm"></div>
                  <div className="w-1 h-3 bg-gray-300 rounded-sm"></div>
                </div>
                <span className="text-gray-500 text-sm font-semibold">Força</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Body Scan Card */}
        <div onClick={() => onNavigate('ai-body-scan')} className="mb-10 relative rounded-[32px] overflow-hidden bg-white shadow-sm h-64 cursor-pointer">
          <img 
            src="/assets/ai_scan.jpg" 
            alt="AI Body Scan" 
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full p-5 flex justify-between items-end">
            <div>
              <span className="bg-[#b3ff3b] text-black text-[10px] font-bold px-3 py-1 rounded-full mb-2 inline-block">Novo</span>
              <h2 className="text-2xl font-extrabold text-white mb-1">AI Body Scan</h2>
              <p className="text-white/80 font-semibold text-sm max-w-[200px] leading-tight">Escaneie o seu corpo para um plano de treino 100% à medida.</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); onNavigate('ai-body-scan'); }} className="bg-white text-black font-extrabold px-5 py-2.5 rounded-full shadow-lg text-sm">
              Scan
            </button>
          </div>
        </div>

        {/* Ganhar músculo */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-2xl font-extrabold text-black">Ganhar músculo</h2>
            
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            
            {/* Card 1 */}
            <div 
              onClick={() => onNavigate('plan-overview', { title: 'Iniciar força e músculo', duration: '5 semanas', image: '/assets/ai_band.jpg', tag: '5 semanas', workoutsPerWeek: 3, minutes: '20 - 30 min', goal: 'Ganhar músculo' })}
              className="relative rounded-[24px] overflow-hidden bg-white h-56 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <img 
                src="/assets/ai_band.jpg" 
                alt="Mulher alongando" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                <span className="bg-white/80 backdrop-blur-sm text-black text-[10px] font-bold px-2 py-1 rounded-full mb-2 inline-block">5 semanas</span>
                <h3 className="text-lg font-extrabold leading-tight mb-2">Iniciar força<br/>e músculo</h3>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center space-x-1">
                    <div className="flex items-end space-x-0.5 h-2 w-4">
                      <div className="w-1 h-1 bg-white rounded-sm"></div>
                      <div className="w-1 h-1 bg-white/40 rounded-sm"></div>
                      <div className="w-1 h-1 bg-white/40 rounded-sm"></div>
                    </div>
                    <span className="text-white/80 text-[9px] font-bold">Cardio</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="flex items-end space-x-0.5 h-2 w-4">
                      <div className="w-1 h-1 bg-white rounded-sm"></div>
                      <div className="w-1 h-1.5 bg-white rounded-sm"></div>
                      <div className="w-1 h-1 bg-white/40 rounded-sm"></div>
                    </div>
                    <span className="text-white/80 text-[9px] font-bold">Força</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div 
              onClick={() => onNavigate('plan-overview', { title: 'Avançado de força', duration: '8 semanas', image: '/assets/ai_bearded_man.jpg', tag: '8 semanas', workoutsPerWeek: 4, minutes: '45 - 60 min', goal: 'Ganhar músculo' })}
              className="relative rounded-[24px] overflow-hidden bg-white h-56 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <img 
                src="/assets/ai_bearded_man.jpg" 
                alt="Treino força" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                <span className="bg-white/80 backdrop-blur-sm text-black text-[10px] font-bold px-2 py-1 rounded-full mb-2 inline-block">8 semanas</span>
                <h3 className="text-lg font-extrabold leading-tight mb-2">Avançado<br/>de força</h3>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center space-x-1">
                    <div className="flex items-end space-x-0.5 h-2 w-4">
                      <div className="w-1 h-1 bg-white rounded-sm"></div>
                      <div className="w-1 h-1.5 bg-white rounded-sm"></div>
                      <div className="w-1 h-1 bg-white/40 rounded-sm"></div>
                    </div>
                    <span className="text-white/80 text-[9px] font-bold">Cardio</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="flex items-end space-x-0.5 h-2 w-4">
                      <div className="w-1 h-1 bg-white rounded-sm"></div>
                      <div className="w-1 h-1.5 bg-white rounded-sm"></div>
                      <div className="w-1 h-2 bg-white rounded-sm"></div>
                    </div>
                    <span className="text-white/80 text-[9px] font-bold">Força</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Perder gordura */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-2xl font-extrabold text-black">Perder gordura</h2>
            
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            
            {/* Card 3 */}
            <div 
              onClick={() => onNavigate('plan-overview', { title: 'Iniciando a perda de peso', duration: '5 semanas', image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=400&auto=format&fit=crop', tag: '5 semanas', workoutsPerWeek: 3, minutes: '20 - 30 min', goal: 'Perder peso' })}
              className="relative rounded-[24px] overflow-hidden bg-white h-56 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <img 
                src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=400&auto=format&fit=crop" 
                alt="Perda de peso" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                <span className="bg-white/80 backdrop-blur-sm text-black text-[10px] font-bold px-2 py-1 rounded-full mb-2 inline-block">5 semanas</span>
                <h3 className="text-lg font-extrabold leading-tight mb-2">Iniciando a perda<br/>de peso</h3>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center space-x-1">
                    <div className="flex items-end space-x-0.5 h-2 w-4">
                      <div className="w-1 h-1 bg-white rounded-sm"></div>
                      <div className="w-1 h-1.5 bg-white rounded-sm"></div>
                      <div className="w-1 h-1 bg-white/40 rounded-sm"></div>
                    </div>
                    <span className="text-white/80 text-[9px] font-bold">Cardio</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="flex items-end space-x-0.5 h-2 w-4">
                      <div className="w-1 h-1 bg-white rounded-sm"></div>
                      <div className="w-1 h-1 bg-white/40 rounded-sm"></div>
                      <div className="w-1 h-1 bg-white/40 rounded-sm"></div>
                    </div>
                    <span className="text-white/80 text-[9px] font-bold">Força</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div 
              onClick={() => onNavigate('plan-overview', { title: 'Super queima de calorias', duration: '12 semanas', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop', tag: '12 semanas', workoutsPerWeek: 5, minutes: '35 - 50 min', goal: 'Perder peso' })}
              className="relative rounded-[24px] overflow-hidden bg-white h-56 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <img 
                src="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop" 
                alt="Queima de calorias" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                <span className="bg-white/80 backdrop-blur-sm text-black text-[10px] font-bold px-2 py-1 rounded-full mb-2 inline-block">12 semanas</span>
                <h3 className="text-lg font-extrabold leading-tight mb-2">Super queima<br/>de calorias</h3>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center space-x-1">
                    <div className="flex items-end space-x-0.5 h-2 w-4">
                      <div className="w-1 h-1 bg-white rounded-sm"></div>
                      <div className="w-1 h-1.5 bg-white rounded-sm"></div>
                      <div className="w-1 h-2 bg-white rounded-sm"></div>
                    </div>
                    <span className="text-white/80 text-[9px] font-bold">Cardio</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="flex items-end space-x-0.5 h-2 w-4">
                      <div className="w-1 h-1 bg-white rounded-sm"></div>
                      <div className="w-1 h-1.5 bg-white rounded-sm"></div>
                      <div className="w-1 h-1 bg-white/40 rounded-sm"></div>
                    </div>
                    <span className="text-white/80 text-[9px] font-bold">Força</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Floating Bottom Menu (UI/UX upgraded) */}
      <div className="absolute bottom-6 left-6 right-6 bg-white rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] flex justify-between px-6 py-4 z-20">
        <button className="flex flex-col items-center gap-1 group relative">
          <div className="absolute -top-3 w-1.5 h-1.5 bg-black rounded-full scale-100 transition-transform"></div>
          <Calendar className="w-6 h-6 text-black" />
          <span className="text-[10px] font-extrabold text-black">Meu Plano</span>
        </button>
        <button onClick={() => onNavigate('workouts')} className="flex flex-col items-center gap-1 group hover:-translate-y-1 transition-transform">
          <LayoutDashboard className="w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" />
          <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-900 transition-colors">Treinos</span>
        </button>
        <button onClick={() => onNavigate('nutrition')} className="flex flex-col items-center gap-1 group hover:-translate-y-1 transition-transform">
          <Utensils className="w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" />
          <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-900 transition-colors">Alimentos</span>
        </button>
        <button className="flex flex-col items-center gap-1 group hover:-translate-y-1 transition-transform">
          <Flower2 className="w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" />
          <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-900 transition-colors">Mente</span>
        </button>
        <button onClick={() => onNavigate('profile')} className="flex flex-col items-center gap-1 group hover:-translate-y-1 transition-transform">
          <User className="w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" />
          <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-900 transition-colors">Perfil</span>
        </button>
      </div>

    </div>
  );
}
