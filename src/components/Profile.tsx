import React, { useState } from 'react';
import { Calendar, LayoutDashboard, Utensils, Flower2, User, Settings, HelpCircle, Bell, ChevronRight, Crown, Shield, LogOut, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface ProfileProps {
  onNavigate: (page: string, props?: any) => void;
  isNutriScanUnlocked?: boolean;
}

export default function Profile({ onNavigate, isNutriScanUnlocked }: ProfileProps) {
  const username = localStorage.getItem('activeUsername') || 'Utilizador Gratuito';
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const renderModalContent = () => {
    switch (activeModal) {
      case 'privacy':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-3xl mb-6 flex flex-col items-center text-center">
              <Shield className="w-12 h-12 text-blue-500 mb-4" />
              <h2 className="text-xl font-extrabold text-black mb-2">A tua privacidade importa</h2>
              <p className="text-gray-500 text-sm font-medium">Os teus dados pessoais, fotos e métricas estão protegidos com encriptação de ponta a ponta.</p>
            </div>
            
            <h3 className="font-extrabold text-black text-lg">Como usamos os teus dados</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-gray-600">Para personalizar os teus planos de treino e alimentação com precisão.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-gray-600">A análise fotográfica do Nutri-Scan é privada e não é partilhada com terceiros.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-gray-600">Podes apagar o teu histórico a qualquer momento.</p>
              </div>
            </div>
          </div>
        );
      case 'install':
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 p-6 rounded-3xl mb-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-extrabold text-3xl mb-4 shadow-sm pb-1">
                 +
              </div>
              <h2 className="text-xl font-extrabold text-black mb-2">Instalar a Aplicação</h2>
              <p className="text-gray-500 text-sm font-medium">Tem a tua IA Pessoal de Fitness sempre à mão no ecrã inicial do teu telemóvel.</p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white border-2 border-gray-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#007AFF]"></div>
                <h4 className="font-extrabold text-black mb-3 flex items-center gap-2">
                  🍎 iPhone (Safari)
                </h4>
                <ol className="list-decimal pl-5 text-[13px] font-semibold text-gray-500 space-y-3">
                  <li>Abre a app no teu <strong>Safari</strong>.</li>
                  <li>Toca no ícone de Partilha <span className="inline-block border border-gray-300 rounded px-1 text-[10px] mx-1">↑</span> (ao centro em baixo).</li>
                  <li>Desliza para baixo e escolhe <strong>'Adicionar ao Ecrã Principal'</strong>.</li>
                  <li>Toca em 'Adicionar' no canto superior direito.</li>
                </ol>
              </div>

              <div className="bg-white border-2 border-gray-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#3DDC84]"></div>
                <h4 className="font-extrabold text-black mb-3 flex items-center gap-2">
                  🤖 Android (Chrome)
                </h4>
                <ol className="list-decimal pl-5 text-[13px] font-semibold text-gray-500 space-y-3">
                  <li>Abre a app no teu <strong>Chrome</strong>.</li>
                  <li>Toca nos <strong>três pontinhos</strong> (canto superior direito).</li>
                  <li>Escolhe <strong>'Adicionar ao ecrã principal'</strong> (Add to Home screen).</li>
                  <li>Toca em 'Adicionar' para confirmar.</li>
                </ol>
              </div>
            </div>
          </div>
        );
      case 'help':
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 p-6 rounded-3xl mb-6 flex flex-col items-center text-center">
              <HelpCircle className="w-12 h-12 text-purple-500 mb-4" />
              <h2 className="text-xl font-extrabold text-black mb-2">Precisas de ajuda?</h2>
              <p className="text-gray-500 text-sm font-medium">A nossa equipa está sempre pronta para responder às tuas questões.</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white border-2 border-gray-100 p-4 rounded-2xl shadow-sm">
                <h4 className="font-extrabold text-black mb-2 text-sm">Como funciona o Nutri-Scan?</h4>
                <p className="text-xs font-medium text-gray-500 leading-relaxed">
                  Basta tirares uma fotografia à tua refeição. A nossa IA analisa imediatamente a imagem para estimar calorias, macronutrientes e criar recomendações.
                </p>
              </div>
              
              <div className="bg-white border-2 border-gray-100 p-4 rounded-2xl shadow-sm">
                <h4 className="font-extrabold text-black mb-2 text-sm">Como mudo o meu plano de treino?</h4>
                <p className="text-xs font-medium text-gray-500 leading-relaxed">
                  Podes falar com qualquer treinador de IA no chat e pedir para ajustar a tua carga, objetivo ou frequência semanal.
                </p>
              </div>

              <a href="mailto:grupomachado171@gmail.com" className="w-full bg-black text-white font-extrabold py-4 rounded-xl mt-4 shadow-sm hover:bg-gray-800 transition-colors text-center block">
                Contactar Suporte (Email)
              </a>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (activeModal) {
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto bg-white relative font-sans animate-slide-in">
        {/* Header Modal */}
        <div className="px-6 pt-10 pb-4 shrink-0 bg-white z-10 flex items-center gap-4 shadow-sm">
          <button onClick={() => setActiveModal(null)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-6 h-6 text-black" />
          </button>
          <h1 className="text-2xl font-extrabold tracking-tight text-black capitalize">
            {activeModal === 'privacy' ? 'Privacidade' : activeModal === 'install' ? 'Como Instalar' : 'Ajuda e Suporte'}
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 hide-scrollbar">
          {renderModalContent()}
        </div>
        
        <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .animate-slide-in { animation: slideIn 0.25s ease-out; }
          @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F9F9F9] relative font-sans animate-fade-in">
      
      {/* Header */}
      <div className="px-6 pt-10 pb-6 shrink-0 bg-[#F9F9F9] z-10 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-black">Perfil</h1>
        <button className="text-black bg-white p-2 rounded-full shadow-sm">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-28 hide-scrollbar space-y-6">
        
        {/* User Card */}
        <div className="bg-white rounded-[32px] p-6 flex flex-col items-center shadow-sm relative overflow-hidden">
          <div className="w-24 h-24 bg-gray-100 rounded-full mb-4 flex items-center justify-center relative shadow-inner">
            <User className="w-10 h-10 text-gray-400" />
            {isNutriScanUnlocked && (
              <div className="absolute -bottom-2 -right-2 bg-[#b3ff3b] p-2 rounded-full shadow-sm border-[3px] border-white">
                <Crown className="w-4 h-4 text-black" />
              </div>
            )}
          </div>
          
          <h2 className="text-2xl font-extrabold text-black mb-1">
            {isNutriScanUnlocked ? username : 'Convidado'}
          </h2>
          
          <p className="text-gray-400 font-bold text-sm mb-4">
            {isNutriScanUnlocked ? 'Membro Premium' : 'Plano Gratuito'}
          </p>

          {!isNutriScanUnlocked && (
            <button 
              onClick={() => onNavigate('nutri-scan-intro', { source: 'profile' })}
              className="w-full bg-[#b3ff3b] text-black font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-sm hover:opacity-90"
            >
              <Crown className="w-5 h-5" />
              Desbloquear PRO
            </button>
          )}
        </div>

        {/* Menu Options */}
        <div className="bg-white rounded-[32px] p-4 shadow-sm space-y-1">
          
          <div onClick={() => setActiveModal('privacy')} className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 rounded-2xl transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-black text-[15px]">Privacidade</h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">Os teus dados estão seguros</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </div>

          <div onClick={() => setActiveModal('install')} className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 rounded-2xl transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 font-extrabold text-xl pb-1">
                +
              </div>
              <div>
                <h3 className="font-extrabold text-black text-[15px]">Como Instalar</h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">Mete a App no teu ecrã</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </div>

          <div onClick={() => setActiveModal('help')} className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 rounded-2xl transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-500">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-black text-[15px]">Ajuda e Suporte</h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">Fala com a nossa equipa</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </div>
          
        </div>

        {/* Logout */}
        <div 
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="bg-white rounded-[24px] p-5 flex items-center justify-center gap-2 cursor-pointer hover:bg-red-50 text-red-500 transition-colors shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-extrabold text-[15px]">Terminar Sessão</span>
        </div>

      </div>

      {/* Floating Bottom Menu */}
      <div className="absolute bottom-6 left-6 right-6 bg-white rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] flex justify-between px-6 py-4 z-50">
        <button onClick={() => onNavigate('home')} className="flex flex-col items-center gap-1 group hover:-translate-y-1 transition-transform">
          <Calendar className="w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" />
          <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-900 transition-colors">Meu plano</span>
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
        <button className="flex flex-col items-center gap-1 group relative">
          <div className="absolute -top-3 w-1.5 h-1.5 bg-blue-500 rounded-full scale-100 transition-transform"></div>
          <User className="w-6 h-6 text-blue-500" />
          <span className="text-[10px] font-extrabold text-blue-500">Perfil</span>
        </button>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
