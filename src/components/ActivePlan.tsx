import React, { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle2, Dumbbell, Flame, Trophy, PlayCircle, X } from 'lucide-react';
import { supabase } from '../supabase';

interface ActivePlanProps {
  onNavigate: (page: string) => void;
  planData: any;
}

export default function ActivePlan({ onNavigate, planData }: ActivePlanProps) {
  const { title = 'Meu Plano PRO', duration = '12 semanas', workoutsPerWeek = 4 } = planData || {};
  
  const totalWeeks = parseInt(duration.split(' ')[0]) || 12;
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [weekSchedule, setWeekSchedule] = useState<any[]>([]);
  const [allExercises, setAllExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDB() {
      const { data } = await supabase.from('exercises').select('*');
      if (data) setAllExercises(data);
      setLoading(false);
    }
    fetchDB();
  }, []);

  useEffect(() => {
    if (allExercises.length > 0) {
      generateWeekSchedule(workoutsPerWeek, allExercises);
    }
  }, [selectedWeek, workoutsPerWeek, allExercises]);

  const pickRandom = (array: any[], count: number) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const generateWeekSchedule = (freq: number, db: any[]) => {
    const days = [];
    
    let workoutDays = [];
    if (freq === 3) workoutDays = [1, 3, 5];
    else if (freq === 4) workoutDays = [1, 2, 4, 5];
    else if (freq === 5) workoutDays = [1, 2, 3, 5, 6];
    else workoutDays = [1, 3, 5];

    const splits = [
      { name: 'Peito e Tricep', filters: [{ cat: 'Peito' }, { mus: 'Tríceps' }] },
      { name: 'Costas e Bicep', filters: [{ cat: 'Costas' }, { mus: 'Bíceps' }] },
      { name: 'Pernas', filters: [{ cat: 'Pernas' }] },
      { name: 'Ombros e ABS', filters: [{ cat: 'Ombros' }, { cat: 'Abdominais' }] },
      { name: 'Full Body', filters: [{ cat: 'Peito' }, { cat: 'Costas' }, { cat: 'Pernas' }] },
    ];

    let workoutCount = 0;

    for (let i = 1; i <= 7; i++) {
      if (workoutDays.includes(i)) {
        const split = splits[workoutCount % splits.length];
        
        let exercisesForDay: any[] = [];
        
        split.filters.forEach(filter => {
          let available = [];
          if (filter.cat) {
            available = db.filter(e => e.category === filter.cat);
          } else if (filter.mus) {
            available = db.filter(e => e.target_muscle === filter.mus);
          }
          if (available.length > 0) {
            const picked = pickRandom(available, 2);
            // Default sets/reps
            picked.forEach(p => {
              exercisesForDay.push({ ...p, sets: 4, reps: '10-12' });
            });
          }
        });

        const cardioAvailable = db.filter(e => e.category === 'Cardio');
        if (cardioAvailable.length > 0) {
          const pickedCardio = pickRandom(cardioAvailable, 1)[0];
          exercisesForDay.push({ ...pickedCardio, sets: 1, reps: '15 mins' });
        }

        days.push({
          dayNum: i,
          type: 'workout',
          title: split.name,
          exercises: exercisesForDay,
          completed: false
        });
        
        workoutCount++;
      } else {
        days.push({
          dayNum: i,
          type: 'rest',
          title: 'Dia de Descanso',
          completed: false
        });
      }
    }
    setWeekSchedule(days);
    setSelectedDay(null);
  };

  const handleDayClick = (dayIdx: number) => {
    if (selectedDay === dayIdx) setSelectedDay(null);
    else setSelectedDay(dayIdx);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto items-center justify-center bg-[#F9F9F9]">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        <p className="mt-4 font-bold text-gray-500">A gerar o teu plano ideal...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F9F9F9] relative font-sans overflow-hidden">
      
      {/* Modal de Vídeo */}
      {activeVideo && (
        <div className="absolute inset-0 z-50 bg-black/95 flex flex-col justify-center animate-fade-in">
          <button 
            onClick={() => setActiveVideo(null)}
            className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white z-50 shadow-lg"
          >
            <X className="w-6 h-6" />
          </button>
          <video 
            src={activeVideo} 
            controls 
            autoPlay 
            className="w-full aspect-video object-contain"
          />
        </div>
      )}

      {/* Header */}
      <div className="px-6 pt-10 pb-6 shrink-0 bg-white z-10 shadow-sm rounded-b-[32px]">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => onNavigate('home')}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shadow-sm"
          >
            <ChevronLeft className="w-6 h-6 text-black" />
          </button>
          <h1 className="text-xl font-extrabold tracking-tight text-black ml-4 flex-1 truncate">{title}</h1>
        </div>

        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x">
          {Array.from({ length: totalWeeks }).map((_, idx) => {
            const weekNum = idx + 1;
            const isSelected = selectedWeek === weekNum;
            return (
              <button
                key={weekNum}
                onClick={() => setSelectedWeek(weekNum)}
                className={`shrink-0 snap-start px-5 py-3 rounded-2xl font-extrabold text-sm transition-all shadow-sm border-2 ${
                  isSelected ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                }`}
              >
                Semana {weekNum}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 hide-scrollbar relative z-0">
        <h2 className="text-2xl font-extrabold text-black mb-6 flex items-center gap-2">
          A tua Rotina <span className="text-[#84D82C]">Semana {selectedWeek}</span>
        </h2>

        <div className="space-y-4 pb-12">
          {weekSchedule.map((day, idx) => {
            const isWorkout = day.type === 'workout';
            const isSelected = selectedDay === idx;

            return (
              <div key={idx} className={`bg-white rounded-3xl overflow-hidden shadow-sm transition-all duration-300 border-2 ${isSelected ? 'border-black' : 'border-transparent'}`}>
                
                <div onClick={() => handleDayClick(idx)} className="p-5 flex items-center cursor-pointer">
                  <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center mr-4 shrink-0 shadow-sm ${isWorkout ? 'bg-[#b3ff3b]' : 'bg-gray-100'}`}>
                    <span className="text-xs font-bold text-gray-600">DIA</span>
                    <span className="text-lg font-extrabold text-black leading-none">{day.dayNum}</span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-extrabold text-black text-[17px]">{day.title}</h3>
                    {isWorkout ? (
                      <p className="text-xs font-bold text-gray-400 flex items-center gap-1 mt-1">
                        <Dumbbell className="w-3 h-3" /> Treino • {day.exercises.length} Exs
                      </p>
                    ) : (
                      <p className="text-xs font-bold text-gray-400 flex items-center gap-1 mt-1">
                        <CheckCircle2 className="w-3 h-3 text-green-500" /> Recuperação
                      </p>
                    )}
                  </div>
                </div>

                {isSelected && isWorkout && (
                  <div className="px-5 pb-5 pt-2 border-t border-gray-50 bg-gray-50/50">
                    <div className="space-y-3 mt-3">
                      {day.exercises.map((ex: any, exIdx: number) => (
                        <div 
                          key={exIdx} 
                          onClick={() => setActiveVideo(ex.video_url)}
                          className="bg-white p-3 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-100 cursor-pointer hover:border-[#84D82C] transition-colors group"
                        >
                          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden relative">
                            {/* The exercises in DB don't have thumbnails usually, just video URLs, so let's show an icon */}
                            <PlayCircle className="w-8 h-8 text-[#84D82C] group-hover:scale-110 transition-transform" />
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-extrabold text-black text-[13px] leading-tight mb-1 capitalize">{ex.title}</h4>
                            <div className="flex items-center gap-2">
                              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold">{ex.sets} Séries</span>
                              <span className="bg-[#b3ff3b]/30 text-black px-2 py-0.5 rounded text-[10px] font-extrabold">{ex.reps} Reps</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <button className="w-full bg-black text-white font-extrabold py-4 rounded-xl mt-6 flex items-center justify-center gap-2 shadow-sm hover:bg-gray-800 transition-colors">
                      <Flame className="w-5 h-5 text-[#b3ff3b]" /> Feito
                    </button>
                  </div>
                )}

                {isSelected && !isWorkout && (
                  <div className="px-5 pb-6 pt-2 border-t border-gray-50 bg-gray-50/50 text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Trophy className="w-8 h-8 text-blue-500" />
                    </div>
                    <h4 className="font-extrabold text-black mb-1">Os músculos crescem no descanso</h4>
                    <p className="text-[13px] font-semibold text-gray-500">Mantém a tua hidratação alta hoje e come proteínas suficientes para recuperar.</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
