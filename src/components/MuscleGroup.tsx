import React, { useState, useEffect } from 'react';
import { ArrowLeft, PlayCircle, ChevronRight, Activity, ChevronLeft, X } from 'lucide-react';
import { supabase } from '../supabase';

export default function MuscleGroup({ 
  onNavigate, 
  muscleData 
}: { 
  onNavigate: (page: string, props?: any) => void, 
  muscleData: { id: string, title: string, img: string } 
}) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExercises() {
      // Fetch from Supabase
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('category', muscleData.title);
        
      if (data) {
        // Ordenação natural para que "peito 2" venha antes de "peito 10"
        const sortedData = data.sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' }));
        setExercises(sortedData);
      } else if (error) {
        console.error("Error fetching exercises:", error);
      }
      setLoading(false);
    }
    fetchExercises();
  }, [muscleData.title]);

  // Se for peito, não mostramos opções, mostramos logo tudo.
  const isDirectList = muscleData.id === 'peito';

  // Obter subcategorias únicas (ex: Glúteos, Quadríceps)
  const subcategories = Array.from(new Set(exercises.map(ex => ex.target_muscle))).filter(Boolean);

  // Filtrar os vídeos consoante o estado atual
  const displayedVideos = isDirectList 
    ? exercises 
    : exercises.filter(ex => ex.target_muscle === selectedSubcategory);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F9F9F9] relative font-sans overflow-hidden">
      
      {/* Header Image */}
      <div className="relative w-full h-64 bg-white shrink-0">
        <button 
          onClick={() => onNavigate('workouts')}
          className="absolute top-6 left-6 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-black z-20 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute inset-0 bg-gradient-to-t from-[#F9F9F9] via-transparent to-transparent z-10"></div>
        {muscleData?.img ? (
          <img src={muscleData.img} className="w-full h-full object-cover object-top" alt={muscleData.title} />
        ) : (
          <div className="w-full h-full bg-gray-200"></div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-12 -mt-4 relative z-20 hide-scrollbar">
        <h1 className="text-4xl font-extrabold text-black mb-3">{muscleData.title}</h1>
        <p className="text-gray-500 font-semibold text-sm mb-8 leading-relaxed">
          Melhore sua força e resistência. Escolha um exercício de {muscleData.title.toLowerCase()} e veja os resultados!
        </p>

        {/* Video Player Modal */}
        {activeVideo && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-lg bg-black relative animate-fade-in">
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-2 right-2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white z-50 shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>
            <video 
              src={exercises.find(v => v.id === activeVideo)?.video_url} 
              controls 
              autoPlay 
              className="w-full aspect-video object-contain"
            />
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-3">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
            <p className="text-gray-400 font-bold text-sm">A carregar vídeos...</p>
          </div>
        ) : (
          <div className="mb-6">
            
            {/* 1. SE NÃO FOR PEITO, E NENHUMA SUBCATEGORIA ESTIVER SELECCIONADA -> MOSTRAR OPÇÕES */}
            {!isDirectList && !selectedSubcategory && (
              <div className="space-y-3 animate-fade-in">
                <h2 className="text-xl font-extrabold text-black mb-4">Escolha a zona muscular</h2>
                {subcategories.map(subcat => {
                  const count = exercises.filter(e => e.target_muscle === subcat).length;
                  return (
                    <div 
                      key={subcat}
                      onClick={() => setSelectedSubcategory(subcat)}
                      className="bg-white rounded-2xl p-5 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition-all border border-transparent hover:border-gray-100 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                          <Activity className="w-5 h-5 text-black" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-black text-lg">{subcat}</h3>
                          <p className="text-gray-400 text-xs font-bold">{count} vídeos</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 2. MOSTRAR LISTA DE VÍDEOS (Direto ou Subcategoria Selecionada) */}
            {(isDirectList || selectedSubcategory) && (
              <div className="animate-fade-in">
                
                {/* Header for Subcategory */}
                {!isDirectList && (
                  <div className="flex items-center gap-3 mb-6">
                    <button 
                      onClick={() => { setSelectedSubcategory(null); setActiveVideo(null); }}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-black"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <h2 className="text-xl font-extrabold text-black">{selectedSubcategory}</h2>
                  </div>
                )}
                
                {isDirectList && (
                  <h2 className="text-xl font-extrabold text-black mb-4">Todos os Exercícios</h2>
                )}

                {displayedVideos.length === 0 ? (
                  <p className="text-gray-400 text-sm font-semibold">Sem vídeos encontrados nesta categoria.</p>
                ) : (
                  <div className="space-y-4">
                    {displayedVideos.map(video => (
                      <div 
                        key={video.id}
                        onClick={() => setActiveVideo(video.id)}
                        className={`bg-white rounded-2xl p-3 flex items-center gap-4 cursor-pointer shadow-sm hover:shadow-md transition-shadow border ${activeVideo === video.id ? 'border-black' : 'border-transparent hover:border-gray-100'}`}
                      >
                        {/* Thumbnail Placeholder */}
                        <div className="w-20 h-20 rounded-xl overflow-hidden relative shrink-0 bg-gray-100 flex items-center justify-center">
                          <PlayCircle className="w-8 h-8 text-black/40" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 pr-2">
                          <h3 className="font-extrabold text-black text-[14px] leading-snug mb-1.5 line-clamp-2">{video.title}</h3>
                          <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded">
                            {video.target_muscle}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
          </div>
        )}

      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: nãone; }
        .hide-scrollbar { -ms-overflow-style: nãone; scrollbar-width: nãone; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
