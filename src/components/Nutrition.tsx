import React from 'react';
import { Calendar, LayoutDashboard, Utensils, Flower2, User, Heart, Filter, Search, Lock, AlertTriangle, Camera, ChevronRight, Flame } from 'lucide-react';
import { recipesData } from '../data/recipes';

export default function Nutrition({ onNavigate, isNutriScanUnlocked }: { onNavigate: (page: string, props?: any) => void, isNutriScanUnlocked?: boolean }) {
  
  const handleRecipeClick = (recipe: any) => {
    if (recipe.pro && !isNutriScanUnlocked) {
      onNavigate('nutri-scan-intro', { source: 'nutrition' });
      return;
    }
    onNavigate('recipe-detail', { recipe });
  };

  const categories = [
    { title: 'Café da manhã', icon: '☕' },
    { title: 'Almoço', icon: '🍲' },
    { title: 'Jantar', icon: '🍜' },
    { title: 'Sem açúcar', icon: '🥤' },
    { title: 'Poucas calorias', icon: '⚖️' },
    { title: 'Vegetariana', icon: '🥦' },
    { title: 'Lanche', icon: '🧁' },
    { title: 'Salada', icon: '🥗' },
    { title: 'Sopa', icon: '🥣' }
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F9F9F9] relative font-sans overflow-hidden">
      
      {/* Top Bar */}
      <div className="px-6 pt-10 pb-4 shrink-0 bg-[#F9F9F9] z-10 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-black">Alimentos</h1>
        <div className="flex gap-4">
          <button className="text-black"><Heart className="w-6 h-6" /></button>
          <button className="text-black"><Filter className="w-6 h-6" /></button>
          <button className="text-black"><Search className="w-6 h-6" /></button>
        </div>
      </div>

      {/* Main Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-28 space-y-8 hide-scrollbar relative z-0">
        
        {/* Livre para experimentar */}
        <div>
          <h2 className="text-lg font-extrabold text-gray-500 mb-4 flex items-center gap-2">
            Livre para experimentar <Lock className="w-4 h-4" />
          </h2>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-4 snap-x">
            {recipesData.free.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => handleRecipeClick(item)}
                className="shrink-0 w-44 bg-white rounded-3xl overflow-hidden shadow-sm snap-start cursor-pointer hover:shadow-md transition-all relative"
              >
                <div className="absolute top-3 right-3 z-20">
                  <Heart className="w-5 h-5 text-black" />
                </div>
                <div className="h-44 w-full relative">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 bg-white relative -mt-4 rounded-t-3xl">
                  <h3 className="font-extrabold text-black text-[15px] leading-tight mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center text-gray-400 text-xs font-bold gap-2">
                    <span>⏱ {item.time}</span>
                    <span>🔥 {item.cal}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Principais Categorias */}
        <div>
          <h2 className="text-lg font-extrabold text-gray-500 mb-4 flex items-center gap-2">
            Principais categorias ⭐
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-3 flex flex-col items-center justify-center gap-2 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-[10px] font-bold text-black text-center leading-tight">{cat.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nutri-Scan Unified Banner */}
        <div>
          <h2 className="text-lg font-extrabold text-gray-500 mb-4 flex items-center gap-2">
            Descubra com o <span className="bg-white text-black px-2 py-0.5 rounded shadow-sm text-sm ml-1 flex items-center gap-1"><span className="text-[#84D82C] text-xs">🤖</span> Nutri-Scan</span>
          </h2>
          <div 
            onClick={() => onNavigate('nutri-scan-intro', { source: 'nutrition' })}
            className="bg-white rounded-3xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow group"
          >
            {/* Top Image Banner - similar to 'a de cima' */}
            <div className="bg-[#b3ff3b] p-6 relative flex items-center justify-between overflow-hidden h-40">
              
              <div className="w-[60%] relative z-10 pr-2">
                <h2 className="text-[20px] font-extrabold text-black leading-tight mb-1 drop-shadow-sm">
                  Tire uma foto para insights instantâneos
                </h2>
              </div>

              <div className="relative z-10 w-28 h-28 shrink-0 absolute -right-2">
                <div className="w-full h-full bg-white rounded-full p-1.5 shadow-sm group-hover:scale-105 transition-transform duration-500">
                  <img src="/assets/salada_kale.jpg" className="w-full h-full rounded-full object-cover" alt="Salad" />
                </div>
                {/* Fake scanner overlay */}
                <div className="absolute inset-0 border-[3px] border-[#84D82C] rounded-lg scale-90 opacity-60"></div>
              </div>
            </div>

            {/* Bottom Info Section */}
            <div className="p-6 text-center bg-white relative">
              <h3 className="text-xl font-extrabold text-black leading-tight mb-3">
                A sua Nutricionista IA
              </h3>
              <p className="text-gray-500 font-semibold text-[13px] mb-6 leading-relaxed">
                A IA diz-lhe <strong>tudo o que está no prato</strong> (calorias) e <strong>diz o que comer</strong> guiando-se pela sua forma física e objetivo.
              </p>
              <button className="w-full bg-black text-white font-extrabold px-6 py-4 rounded-xl text-[15px] hover:bg-gray-800 transition-colors shadow-lg">
                Pergunte ao Nutri-Scan
              </button>
            </div>
          </div>
        </div>


        {/* Dynamic Recipe Sections */}
        {recipesData.sections.map((section, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-gray-500 flex items-center gap-2">
                {section.title} <span>{section.icon}</span>
              </h2>
              <button className="text-black font-extrabold text-sm flex items-center">
                Mais <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            
            <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-4 snap-x">
              {section.items.map((item, itemIdx) => (
                <div 
                  key={itemIdx}
                  onClick={() => handleRecipeClick(item)}
                  className="shrink-0 w-44 bg-white rounded-3xl overflow-hidden shadow-sm snap-start cursor-pointer group hover:shadow-md transition-all relative"
                >
                  <div className="absolute top-3 right-3 z-20">
                    <Heart className="w-5 h-5 text-black" />
                  </div>
                  <div className="h-44 w-full relative">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    
                    {item.pro && (
                      <div className="absolute bottom-3 left-3 bg-[#b3ff3b] text-black text-[10px] font-extrabold px-2 py-1 rounded flex items-center gap-1 shadow-sm z-20">
                        <Lock className="w-3 h-3" /> Pro
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-white relative -mt-4 rounded-t-3xl">
                    <h3 className="font-extrabold text-black text-[15px] leading-tight mb-2 line-clamp-2 pr-6">
                      {item.title}
                    </h3>
                    <div className="flex items-center text-gray-400 text-xs font-bold gap-2">
                      <span>⏱ {item.time}</span>
                      <span>🔥 {item.cal}</span>
                    </div>
                    {item.warning && (
                      <div className="absolute bottom-4 right-4 text-orange-500 bg-orange-100 rounded-full w-6 h-6 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
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
        <button className="flex flex-col items-center gap-1 group relative">
          <div className="absolute -top-3 w-1.5 h-1.5 bg-blue-500 rounded-full scale-100 transition-transform"></div>
          <Utensils className="w-6 h-6 text-blue-500" />
          <span className="text-[10px] font-extrabold text-blue-500">Alimentos</span>
        </button>
        <button onClick={() => onNavigate('mind')} className="flex flex-col items-center gap-1 group hover:-translate-y-1 transition-transform">
          <Flower2 className="w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" />
          <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-900 transition-colors">Mente</span>
        </button>
        <button onClick={() => onNavigate('profile')} className="flex flex-col items-center gap-1 group hover:-translate-y-1 transition-transform">
          <User className="w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" />
          <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-900 transition-colors">Perfil</span>
        </button>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
