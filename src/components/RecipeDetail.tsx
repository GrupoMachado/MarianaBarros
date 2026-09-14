import React, { useState } from 'react';
import { ArrowLeft, Clock, Flame, ChefHat, Minus, Plus, Heart } from 'lucide-react';

export default function RecipeDetail({ onNavigate, recipe }: { onNavigate: (page: string, props?: any) => void, recipe: any }) {
  const [portions, setPortions] = useState(recipe.defaultPortions || 1);
  const [showPortionModal, setShowPortionModal] = useState(false);

  // Multiplier for ingredients
  const multiplier = portions / (recipe.defaultPortions || 1);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F9F9F9] relative font-sans overflow-hidden">
      
      {/* Header Image */}
      <div className="relative w-full h-72 bg-white shrink-0 rounded-b-[40px] shadow-sm overflow-hidden">
        <button 
          onClick={() => onNavigate('nutrition')}
          className="absolute top-6 left-6 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-black z-20 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button className="absolute top-6 right-6 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-black z-20 shadow-sm">
          <Heart className="w-5 h-5" />
        </button>
        <img src={recipe.img} className="w-full h-full object-cover" alt={recipe.title} />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-28 relative z-20 hide-scrollbar bg-[#F9F9F9]">
        
        {/* Title and Info */}
        <h1 className="text-2xl font-extrabold text-black mb-6 text-center leading-tight">{recipe.title}</h1>
        
        <div className="flex justify-center gap-8 mb-6">
          <div className="flex flex-col items-center">
            <Clock className="w-6 h-6 text-blue-500 mb-1" />
            <span className="text-sm font-extrabold text-black">{recipe.time}</span>
          </div>
          <div className="flex flex-col items-center">
            <Flame className="w-6 h-6 text-orange-500 mb-1" />
            <span className="text-sm font-extrabold text-black">{recipe.cal}</span>
          </div>
          <div className="flex flex-col items-center">
            <ChefHat className="w-6 h-6 text-green-500 mb-1" />
            <span className="text-sm font-extrabold text-black">{recipe.difficulty || 'Fácil'}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {recipe.tags && recipe.tags.map((tag: string, idx: number) => (
            <span key={idx} className="border border-gray-300 text-gray-500 text-[11px] font-bold px-3 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Ingredients */}
        <h2 className="text-xl font-extrabold text-black mb-4">Ingredientes</h2>
        
        <div 
          onClick={() => setShowPortionModal(true)}
          className="bg-white rounded-2xl p-4 flex items-center justify-between mb-4 shadow-sm cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-lg">🍲</span>
            </div>
            <span className="font-extrabold text-black text-lg">{portions} porções</span>
          </div>
          <ChevronRightIcon />
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm mb-8 space-y-4">
          {recipe.ingredients && recipe.ingredients.map((ing: any, idx: number) => {
            const amount = typeof ing.amount === 'number' 
              ? (ing.amount * multiplier).toFixed(ing.amount % 1 === 0 ? 0 : 1).replace('.0', '')
              : ing.amount; // if it's text, leave it alone, but we should strictly use numbers for scalable ingredients
            
            return (
              <div key={idx} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <span className="text-black font-extrabold w-1/3">{amount} {ing.unit}</span>
                <span className="text-gray-600 font-semibold w-2/3">{ing.name}</span>
              </div>
            );
          })}
        </div>

        {/* Preparation */}
        <h2 className="text-xl font-extrabold text-black mb-4">Preparo</h2>
        
        <div className="space-y-4">
          {recipe.steps && recipe.steps.map((step: string, idx: number) => (
            <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-gray-400 font-bold text-sm mb-2">Etapa {idx + 1}</h3>
              <p className="text-black font-semibold text-[15px] leading-relaxed">
                {step}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* Portion Modal */}
      {showPortionModal && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full rounded-t-[32px] p-6 pb-12 flex flex-col relative animate-slide-up">
            <button 
              onClick={() => setShowPortionModal(false)}
              className="absolute top-6 right-6 text-black"
            >
              ✕
            </button>
            <h2 className="text-2xl font-extrabold text-black mb-8 text-center">Porções</h2>
            
            <div className="flex items-center justify-center gap-8 mb-10">
              <button 
                onClick={() => setPortions(Math.max(1, portions - 1))}
                className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-black active:bg-gray-200 transition-colors"
              >
                <Minus className="w-8 h-8" />
              </button>
              <span className="text-5xl font-extrabold text-black w-16 text-center">{portions}</span>
              <button 
                onClick={() => setPortions(portions + 1)}
                className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-black active:bg-gray-200 transition-colors"
              >
                <Plus className="w-8 h-8" />
              </button>
            </div>
            
            <button 
              onClick={() => setShowPortionModal(false)}
              className="w-full bg-[#b3ff3b] text-black font-extrabold py-4 rounded-full text-lg shadow-sm"
            >
              Concluído
            </button>
          </div>
        </div>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
        .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
}
