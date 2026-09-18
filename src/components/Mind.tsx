import React, { useState, useEffect, useRef } from 'react';
import { Calendar, LayoutDashboard, Utensils, Flower2, User, Lock, Play, Square, Plus, Moon, Brain, Activity } from 'lucide-react';

const NavMenu = ({ onNavigate }: { onNavigate: (page: string) => void }) => (
  <div className="absolute bottom-6 left-6 right-6 bg-white rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] flex justify-between px-6 py-4 z-[9999]">
    <button onClick={() => onNavigate('home')} className="flex flex-col items-center gap-1 group hover:-translate-y-1 transition-transform">
      <Calendar className="w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" />
      <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-900 transition-colors">Meu Plano</span>
    </button>
    <button onClick={() => onNavigate('workouts')} className="flex flex-col items-center gap-1 group hover:-translate-y-1 transition-transform">
      <LayoutDashboard className="w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" />
      <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-900 transition-colors">Treinos</span>
    </button>
    <button onClick={() => onNavigate('nutrition')} className="flex flex-col items-center gap-1 group hover:-translate-y-1 transition-transform">
      <Utensils className="w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" />
      <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-900 transition-colors">Alimentos</span>
    </button>
    <button className="flex flex-col items-center gap-1 group relative">
      <div className="absolute -top-3 w-1.5 h-1.5 bg-black rounded-full scale-100 transition-transform"></div>
      <Flower2 className="w-6 h-6 text-black" />
      <span className="text-[10px] font-extrabold text-black">Mente</span>
    </button>
    <button onClick={() => onNavigate('profile')} className="flex flex-col items-center gap-1 group hover:-translate-y-1 transition-transform">
      <User className="w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" />
      <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-900 transition-colors">Perfil</span>
    </button>
  </div>
);

function SleepLogModal({ onClose, onSave }: any) {
  const [form, setForm] = useState({ 
      deitar: '23:00', 
      acordar: '07:00', 
      qualidade: 8, 
  });

  const handleSave = () => {
      const [dh, dm] = form.deitar.split(':').map(Number);
      const [ah, am] = form.acordar.split(':').map(Number);
      let d = new Date(0, 0, 0, dh, dm);
      let a = new Date(0, 0, 0, ah, am);
      if (a < d) a.setDate(a.getDate() + 1);
      const horas = ((a.getTime() - d.getTime()) / (1000 * 60 * 60)).toFixed(1);

      const dataLogs = JSON.parse(localStorage.getItem('registos_sono_local') || '[]');
      dataLogs.push({ ...form, horas_dormidas: horas });
      localStorage.setItem('registos_sono_local', JSON.stringify(dataLogs));
      onSave();
      onClose();
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[#F9F9F9] w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 sm:p-8 animate-in slide-in-from-bottom-full duration-300">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6 sm:hidden"></div>
          <h3 className="text-2xl font-extrabold text-black mb-6">Registar Sono</h3>
          
          <div className="space-y-4 mb-8">
              <div className="flex gap-4">
                  <div className="flex-1">
                      <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Deitar</label>
                      <input type="time" value={form.deitar} onChange={e => setForm({...form, deitar: e.target.value})} className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-black font-bold outline-none focus:border-[#84D82C] focus:ring-1 focus:ring-[#84D82C]" />
                  </div>
                  <div className="flex-1">
                      <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Acordar</label>
                      <input type="time" value={form.acordar} onChange={e => setForm({...form, acordar: e.target.value})} className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-black font-bold outline-none focus:border-[#84D82C] focus:ring-1 focus:ring-[#84D82C]" />
                  </div>
              </div>
              
              <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Qualidade (1-10)</label>
                    <span className="font-extrabold text-lg text-black">{form.qualidade}</span>
                  </div>
                  <input type="range" min="1" max="10" value={form.qualidade} onChange={e => setForm({...form, qualidade: parseInt(e.target.value)})} className="w-full accent-[#84D82C]" />
              </div>
          </div>
          
          <button onClick={handleSave} className="w-full bg-[#84D82C] text-black font-extrabold text-lg py-4 rounded-full hover:opacity-90 transition-opacity">
              Guardar Registo
          </button>
      </div>
    </div>
  )
}

export default function Mind({ onNavigate }: { onNavigate: (page: string, props?: any) => void }) {
  const [isPro, setIsPro] = useState(localStorage.getItem('nutriScanUnlocked_v2') === 'true');
  const [code, setCode] = useState('');
  
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [logs, setLogs] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setLogs(JSON.parse(localStorage.getItem('registos_sono_local') || '[]'));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [showModal]);

  const playAudio = (id: string, file: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (currentAudioId === id) {
      setCurrentAudioId(null);
      return;
    }
    const audio = new Audio('/' + file);
    audio.loop = true;
    audio.play().catch(e => console.error(e));
    audioRef.current = audio;
    setCurrentAudioId(id);
  };

  useEffect(() => {
    if (!isPro) {
      onNavigate('nutri-scan-intro', { source: 'mind' });
    }
  }, [isPro, onNavigate]);

  if (!isPro) return null;

  const lastLog = logs.length > 0 ? logs[logs.length - 1] : { horas_dormidas: '0', qualidade: '-' };
  const progress = Math.min((parseFloat(lastLog.horas_dormidas) / 8) * 100, 100) || 0;

  const getSleepInsight = (log: any) => {
    if (!log || log.horas_dormidas === '0') return {
        title: 'A aguardar dados...',
        text: 'Registe a sua ultima noite para obter uma analise instantanea do seu estado de recuperacao e prontidao.',
        color: 'text-gray-500',
        bg: 'bg-gray-100'
    };
    const h = parseFloat(log.horas_dormidas);
    if (h < 6) return {
        title: '🔴 Alerta de Prontidao',
        text: 'Defice de sono critico. O seu foco e metabolismo estao comprometidos hoje. Evite treinos intensos e use os audios de relaxamento.',
        color: 'text-red-600',
        bg: 'bg-red-50'
    };
    if (h < 7.5) return {
        title: '🟡 Recuperacao Aceitavel',
        text: 'Suficiente para o dia-a-dia, mas sub-otimo para construcao muscular. Tente deitar-se 30 minutos mais cedo hoje usando a tecnica 4-7-8.',
        color: 'text-yellow-600',
        bg: 'bg-yellow-50'
    };
    return {
        title: '🟢 Prontidao Maxima',
        text: 'Recuperacao de elite alcancada! O seu sistema nervoso e reparacao celular estao no pico absoluto de performance.',
        color: 'text-green-700',
        bg: 'bg-[#84D82C]/20'
    };
  };

  const insight = getSleepInsight(lastLog);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F9F9F9] relative overflow-hidden font-sans">
      <div className="flex-1 overflow-y-auto pb-32 px-5 pt-8">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-black leading-none mb-1">Mente &<br />Recuperacao</h1>
            <p className="text-gray-500 font-medium text-sm mt-2">Um espaco dedicado a otimizar o seu descanso e foco mental.</p>
          </div>
          <div className="bg-black text-[#84D82C] px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mt-1">
            PRO
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-extrabold text-black">O seu Descanso</h3>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">Resumo dos dados do seu ultimo registo de sono.</p>
        </div>

        {/* Bento Grid Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          
          {/* Main Stat - Horas */}
          <div className="col-span-2 bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">Ultima Noite</p>
              <div className="flex items-baseline gap-1">
                <h2 className="text-5xl font-extrabold text-black">{lastLog.horas_dormidas}</h2>
                <span className="text-xl font-bold text-gray-400">h</span>
              </div>
              <p className="text-sm font-bold text-[#84D82C] mt-1">Objetivo: 8h</p>
            </div>
            {/* Circular Progress */}
            <div className="relative w-20 h-20">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-[#84D82C]" strokeWidth="3" strokeDasharray={`${progress}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Moon size={24} className="text-black" fill="currentColor" />
              </div>
            </div>
          </div>

          {/* Sub Stat - Quality */}
          <div className="bg-white rounded-[20px] p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-1">
              <Activity size={16} className="text-[#84D82C]" />
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">Qualidade</p>
            </div>
            <p className="text-[10px] text-gray-400 font-medium mb-2 leading-tight">Como se sentiu hoje ao acordar.</p>
            <div>
              <h3 className="text-3xl font-extrabold text-black">{lastLog.qualidade}<span className="text-lg text-gray-400">/10</span></h3>
            </div>
          </div>

          {/* Sub Stat - Protocol */}
          <div className="bg-white rounded-[20px] p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-1">
              <Brain size={16} className="text-[#84D82C]" />
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">Respiracao</p>
            </div>
            <p className="text-[10px] text-gray-400 font-medium mb-2 leading-tight">Inspire 4s, segure 7s, expire 8s.</p>
            <div>
              <h3 className="text-3xl font-extrabold text-black">4-7-8</h3>
            </div>
          </div>
        </div>

        {/* Insight Output */}
        <div className={`rounded-[20px] p-4 mb-6 ${insight.bg} border border-black/5`}>
            <h4 className={`font-extrabold text-sm mb-1 ${insight.color}`}>{insight.title}</h4>
            <p className={`text-xs font-medium leading-relaxed ${insight.color === 'text-gray-500' ? 'text-gray-500' : 'text-black'}`}>{insight.text}</p>
        </div>

        {/* Log Action */}
        <button onClick={() => setShowModal(true)} className="w-full bg-black text-white font-extrabold text-lg py-4 rounded-full mb-8 shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95">
          <Plus size={20} />
          Registar Sono
        </button>

        {/* Audio Player */}
        <div className="mb-4 mt-8">
          <h3 className="text-lg font-extrabold text-black">Frequencias para Adormecer</h3>
          <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">Audios continuos desenvolvidos para abrandar a atividade cerebral e bloquear ruidos externos indesejados.</p>
        </div>
        <div className="flex flex-col gap-3 mb-8">
          
          <div onClick={() => playAudio('brown', 'brown-noise.mp3')} className={`cursor-pointer w-full p-4 rounded-[20px] border transition-all ${currentAudioId === 'brown' ? 'border-[#84D82C] bg-[#84D82C]/10 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${currentAudioId === 'brown' ? 'bg-[#84D82C] text-black shadow-md' : 'bg-gray-50 text-gray-500'}`}>
                  {currentAudioId === 'brown' ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </div>
                <div className="text-left">
                  <span className="font-extrabold text-black block leading-tight">Ruido Castanho</span>
                  <span className="text-xs text-gray-500 font-medium">Ondas Delta (1-4 Hz)</span>
                </div>
              </div>
              {currentAudioId === 'brown' && (
                <div className="flex gap-1 items-end h-4 mr-2">
                  <div className="w-1.5 h-full bg-[#84D82C] rounded-full animate-pulse" style={{animationDelay: '0ms'}}></div>
                  <div className="w-1.5 h-2/3 bg-[#84D82C] rounded-full animate-pulse" style={{animationDelay: '150ms'}}></div>
                  <div className="w-1.5 h-full bg-[#84D82C] rounded-full animate-pulse" style={{animationDelay: '300ms'}}></div>
                </div>
              )}
            </div>
          </div>

          <div onClick={() => playAudio('forest', 'forest-noise.mp3')} className={`cursor-pointer w-full p-4 rounded-[20px] border transition-all ${currentAudioId === 'forest' ? 'border-[#84D82C] bg-[#84D82C]/10 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${currentAudioId === 'forest' ? 'bg-[#84D82C] text-black shadow-md' : 'bg-gray-50 text-gray-500'}`}>
                  {currentAudioId === 'forest' ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </div>
                <div className="text-left">
                  <span className="font-extrabold text-black block leading-tight">Floresta Profunda</span>
                  <span className="text-xs text-gray-500 font-medium">Ruido Branco Natural</span>
                </div>
              </div>
              {currentAudioId === 'forest' && (
                <div className="flex gap-1 items-end h-4 mr-2">
                  <div className="w-1.5 h-full bg-[#84D82C] rounded-full animate-pulse" style={{animationDelay: '0ms'}}></div>
                  <div className="w-1.5 h-2/3 bg-[#84D82C] rounded-full animate-pulse" style={{animationDelay: '150ms'}}></div>
                  <div className="w-1.5 h-full bg-[#84D82C] rounded-full animate-pulse" style={{animationDelay: '300ms'}}></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Military Technique Info Box */}
        <div className="bg-black rounded-[24px] p-6 text-white relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#84D82C]/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <h3 className="text-lg font-extrabold mb-1 relative z-10">Protocolo Militar de Sono</h3>
          <p className="text-xs text-gray-400 font-medium mb-5 relative z-10 leading-relaxed">Siga estes passos, desenhados originalmente pela marinha para conseguir adormecer sob pressao extrema.</p>
          <ul className="space-y-4 relative z-10">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">1</div>
              <p className="text-sm text-gray-300 font-medium leading-tight pt-0.5">Relaxe os musculos do rosto, incluindo os olhos.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">2</div>
              <p className="text-sm text-gray-300 font-medium leading-tight pt-0.5">Baixe os ombros o maximo possivel e solte os bracos.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">3</div>
              <p className="text-sm text-gray-300 font-medium leading-tight pt-0.5">Expire profundamente e relaxe o peito e as pernas.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">4</div>
              <p className="text-sm text-gray-300 font-medium leading-tight pt-0.5">Esvazie a mente por 10 segundos focado na respiracao.</p>
            </li>
          </ul>
        </div>

      </div>

      <NavMenu onNavigate={onNavigate} />
      
      {showModal && <SleepLogModal onClose={() => setShowModal(false)} onSave={() => {}} />}
    </div>
  );
}
