import React, { useState } from 'react';
import { CheckCircle2, Dumbbell, Target, Clock, Calendar, Flame, Droplets, Star, ChevronLeft } from 'lucide-react';

interface PlanOverviewProps {
  onBack: () => void;
  onStart: () => void;
  title?: string;
  duration?: string;
  image?: string;
  tag?: string;
  workoutsPerWeek?: number;
  minutes?: string;
  goal?: string;
}

export default function PlanOverview({ 
  onBack, 
  onStart,
  title = 'Força em todo o corpo',
  duration = '12 semanas',
  image = 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop',
  tag = 'Seu plano pessoal',
  workoutsPerWeek = 4,
  minutes = '25 - 40 min',
  goal = 'Ganhar músculo'
}: PlanOverviewProps) {
  
  const weeksNum = parseInt(duration.split(' ')[0]);

  return (
    <div className="bg-white min-h-screen pb-24 font-sans text-black relative">
      {/* Header / Hero */}
      <div className="relative h-[300px] w-full bg-gray-100">
        <button 
          onClick={onBack}
          className="absolute top-6 left-4 z-10 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-sm"
        >
          <ChevronLeft className="w-6 h-6 text-black" />
        </button>
        
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${image}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
        
        <div className="absolute bottom-4 left-0 right-0 px-6 flex flex-col items-center text-center">
          <span className="bg-[#b3ff3b] text-black px-4 py-1 rounded-full text-xs font-bold mb-3 shadow-sm">
            {tag}
          </span>
          <h1 className="text-3xl font-extrabold text-black">{title}</h1>
        </div>
      </div>

      <div className="px-6 pt-4 space-y-8">
        {/* 3 Stat Cards */}
        <div className="flex justify-between gap-3">
          <div className="flex-1 bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm border border-gray-100">
            <div className="w-8 h-8 flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
            </div>
            <span className="text-xs font-bold text-gray-500">Cardiovascular</span>
          </div>
          <div className="flex-1 bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm border border-gray-100">
            <div className="w-8 h-8 flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
            </div>
            <span className="text-xs font-bold text-gray-500">Força</span>
          </div>
          <div className="flex-1 bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm border border-gray-100">
            <div className="text-2xl font-black text-black mb-1">{weeksNum}</div>
            <span className="text-xs font-bold text-gray-500">Semanas</span>
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-3">
          {[
            `Seu objetivo: ${goal}`,
            'Desenvolva músculos com eficácia',
            'Desenvolva força funcional',
            'Crie disciplina, melhore o visual, sinta-se mais forte'
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#84D82C] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold text-[15px]">{item}</span>
            </div>
          ))}
        </div>

        {/* Como? */}
        <div>
          <h2 className="text-xl font-extrabold mb-4">Como?</h2>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-2 text-blue-600">
                <Dumbbell className="w-4 h-4" />
              </div>
              <p className="font-bold text-[11px] leading-tight">Desenvolvimento de força</p>
            </div>
            <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-2 text-blue-600">
                <Target className="w-4 h-4" />
              </div>
              <p className="font-bold text-[11px] leading-tight">Treino de corpo inteiro</p>
            </div>
            <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-2 text-blue-600">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </div>
              <p className="font-bold text-[11px] leading-tight">Poucas repetições</p>
            </div>
          </div>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-3xl flex flex-col items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-50">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-xs font-bold text-gray-500 mb-1">Treino</span>
            <span className="font-extrabold text-black">{minutes}</span>
          </div>
          <div className="bg-white p-4 rounded-3xl flex flex-col items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-50">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-xs font-bold text-gray-500 mb-1">Dias por semana</span>
            <span className="font-extrabold text-black">{workoutsPerWeek}</span>
          </div>
          <div className="bg-white p-4 rounded-3xl flex flex-col items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-50">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2">
              <Flame className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-xs font-bold text-gray-500 mb-1">Aquecimento</span>
            <span className="font-extrabold text-black">3 min</span>
          </div>
          <div className="bg-white p-4 rounded-3xl flex flex-col items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-50">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2">
              <Droplets className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-xs font-bold text-gray-500 mb-1">Recuperação</span>
            <span className="font-extrabold text-black">5 - 10 min</span>
          </div>
        </div>

        {/* Plan Overview - Dynamic Sections */}
        <div>
          <h2 className="text-2xl font-extrabold mb-4">Plan Overview</h2>
          <div className="space-y-3">
            
            <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-[10px] font-bold mb-2 inline-block">
                    Semana 1
                  </span>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-blue-500">📋</div>
                    <h3 className="font-extrabold text-black text-lg">Semana de teste</h3>
                  </div>
                  <p className="text-gray-500 text-sm font-semibold leading-tight">O treinador testará seu desempenho para elaborar um plano de treino ideal</p>
                </div>
              </div>
            </div>

            {weeksNum > 5 ? (
              <>
                <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-[10px] font-bold mb-2 inline-block">
                        Semanas 2-{weeksNum - 2}
                      </span>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-blue-500">🔥</div>
                        <h3 className="font-extrabold text-black text-lg">Parte principal</h3>
                      </div>
                      <p className="text-gray-500 text-sm font-semibold leading-tight">Treino totalmente personalizado com base no seu desempenho</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-[10px] font-bold mb-2 inline-block">
                        Semana {weeksNum - 1}
                      </span>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-blue-500">🌊</div>
                        <h3 className="font-extrabold text-black text-lg">Semana leve</h3>
                      </div>
                      <p className="text-gray-500 text-sm font-semibold leading-tight">Prepare o corpo para a demanda elevada da semana seguinte</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-[10px] font-bold mb-2 inline-block">
                        Semana {weeksNum}
                      </span>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-blue-500">💪</div>
                        <h3 className="font-extrabold text-black text-lg">Semana brutal</h3>
                      </div>
                      <p className="text-gray-500 text-sm font-semibold leading-tight">Alcance todo o seu potencial na semana final</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-[10px] font-bold mb-2 inline-block">
                        Semanas 2-{weeksNum - 1}
                      </span>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-blue-500">🔥</div>
                        <h3 className="font-extrabold text-black text-lg">Parte principal</h3>
                      </div>
                      <p className="text-gray-500 text-sm font-semibold leading-tight">Treino totalmente personalizado com base no seu desempenho</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-[10px] font-bold mb-2 inline-block">
                        Semana {weeksNum}
                      </span>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-blue-500">💪</div>
                        <h3 className="font-extrabold text-black text-lg">Semana final</h3>
                      </div>
                      <p className="text-gray-500 text-sm font-semibold leading-tight">Ultrapasse os seus limites para finalizar o plano em alta</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-2xl font-extrabold mb-4 leading-tight">Ouça o que nossa comunidade tem a dizer</h2>
          <div className="space-y-3">
            {[
              { name: 'Ethan Q.', text: 'Ganhei massa e força em todos os lugares. É um plano abrangente de ganho de músculos.' },
              { name: 'Claire H.', text: 'Os ganhos são reais! Este plano atinge todo o corpo de forma eficaz.' },
              { name: 'Gregory T.', text: 'Vi um aumento significativo na minha massa muscular geral.' }
            ].map((review, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="font-extrabold text-black mb-1">{review.name}</h4>
                <div className="flex gap-1 mb-2">
                  {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-700 font-semibold text-sm">{review.text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 flex justify-center z-20">
        <button 
          onClick={onStart}
          className="w-full max-w-md bg-[#b3ff3b] hover:bg-[#a1e635] text-black font-black py-4 px-6 rounded-full transition-colors flex items-center justify-center gap-2 relative shadow-lg"
        >
          Iniciar plano
          <span className="absolute right-4 border border-black/20 px-2 py-0.5 rounded-md text-xs">Pro</span>
        </button>
      </div>
    </div>
  );
}

