import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Camera, Droplets, ArrowUp } from 'lucide-react';
import { supabase } from '../supabase';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export default function NutriScanChat({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Olá! Sou o **Nutri-Scan**, a tua IA especialista em nutrição. 🍏\n\nPara eu te passar exatamente **o que deves comer ao longo do dia**, diz-me:\n\n1. Qual é o teu peso e altura?\n2. Qual é o teu objetivo? (Emagrecer, Manter ou Ganhar massa)' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    // Supabase Regex Capture (Weight and Height)
    const pesoMatch = text.match(/(?:peso|tenho|peso|kg)[\s:]*(\d{2,3})(?:\s*kg)?/i);
    const alturaMatch = text.match(/(?:altura|tenho|m)[\s:]*([1-2][\.,]\d{2})(?:\s*m)?/i);

    if (pesoMatch || alturaMatch) {
      const peso = pesoMatch ? parseFloat(pesoMatch[1]) : null;
      const altura = alturaMatch ? parseFloat(alturaMatch[1].replace(',', '.')) : null;
      
      try {
        await supabase.from('evolucao_corporal').insert({
          user_id: localStorage.getItem('nutriscan_userId') || '00000000-0000-0000-0000-000000000000',
          peso: peso,
          altura: altura
        });
        console.log('Guardado na Supabase com sucesso!', { peso, altura });
      } catch (e) {
        console.error('Erro ao guardar na Supabase', e);
      }
    }

    const newMessages = [...messages, { role: 'user', text }];
    setMessages(newMessages as Message[]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('https://wutjxjubudszwgvxedgm.supabase.co/functions/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          coachName: 'Nutri-Scan',
          coachDescription: 'És um especialista em nutrição. Quando o utilizador te der o peso e objetivo, CRIA UM PLANO ALIMENTAR diário completo (pequeno-almoço, almoço, lanches e jantar) específico para o seu objetivo (emagrecer, manter ou ganhar massa). Sê direto e super simpático. NUNCA uses notação matemática como \\times, usa sempre um "x" ou palavras. Formata a tua resposta de forma bonita usando bold e listas.'
        })
      });

      const data = await response.json();
      
      setMessages([...newMessages, { 
        role: 'ai', 
        text: data.reply || 'Desculpa, não consegui processar a tua resposta agora.' 
      }] as Message[]);
    } catch (error) {
      setMessages([...newMessages, { 
        role: 'ai', 
        text: 'Desculpa, parece que o servidor de IA está offline. 🤖' 
      }] as Message[]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F4F5F7] relative font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-5 bg-[#F4F5F7] z-10 sticky top-0">
        <button onClick={() => onNavigate('nutrition')} className="w-10 h-10 flex items-center justify-center font-extrabold text-xl text-black hover:bg-gray-200 rounded-full transition-colors">
          {'<'}
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#b3ff3b] flex items-center justify-center text-xl shadow-sm border-2 border-white">
            🍏
          </div>
          <span className="font-extrabold text-lg text-black tracking-tight">Nutri-Scan IA</span>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 pb-6 pt-2 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`p-4 shadow-sm font-semibold max-w-[85%] text-[15px] leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-[#c0ff59] text-black rounded-[24px] rounded-br-sm' 
                : 'bg-white text-black rounded-[24px] rounded-bl-sm border border-gray-100'
            }`}>
              <div className="markdown-content"><ReactMarkdown>{msg.text}</ReactMarkdown></div>
            </div>
            <span className="text-[10px] text-gray-400 mt-1 px-1 font-bold">
              {msg.role === 'user' ? 'Tu' : 'Nutri-Scan'} • agora
            </span>
          </div>
        ))}
        {isTyping && (
          <div className="flex flex-col items-start">
            <div className="bg-white p-4 rounded-[24px] rounded-bl-sm shadow-sm text-gray-400 max-w-[85%] flex gap-1.5 items-center h-12 border border-gray-100">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-transparent px-5 pb-6 pt-2">
        
        {/* Quick Prompts - Horizontal Scroll */}
        {messages.length < 3 && (
          <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar snap-x">
            {[
              { text: 'Quero emagrecer 📉', short: 'Tenho 75kg e quero emagrecer e perder gordura. O que devo comer num dia?' },
              { text: 'Ganhar Massa 💪', short: 'Quero ganhar massa muscular. Podes fazer-me um planão para o dia todo?' },
              { text: 'Manter Peso ⚖️', short: 'O meu objetivo é manter o peso atual, que tipo de refeições recomendas num dia?' }
            ].map((q) => (
              <div 
                key={q.text} 
                onClick={() => sendMessage(q.short)}
                className="bg-white border border-gray-200 rounded-full px-5 py-2.5 text-sm font-bold text-gray-700 flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors whitespace-nowrap snap-start shadow-sm"
              >
                {q.text}
              </div>
            ))}
          </div>
        )}

        {/* Floating Input Bar */}
        <div className="bg-white rounded-full p-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex items-center gap-2 border border-gray-100">
          <button onClick={() => sendMessage("Analisar a foto da minha refeição 📸")} className="w-10 h-10 bg-[#e8ffc2] hover:bg-[#c0ff59] rounded-full flex items-center justify-center text-[#6eb314] transition-colors">
            <Camera className="w-5 h-5" />
          </button>
          
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Responder à Nutri-Scan..." 
            className="flex-1 bg-transparent border-none focus:ring-0 text-[15px] font-semibold text-gray-700 px-2 outline-none w-full placeholder-gray-400"
          />
          
          <button onClick={() => sendMessage()} className="w-10 h-10 flex items-center justify-center text-white bg-black rounded-full hover:bg-gray-800 transition-transform active:scale-95 shadow-sm">
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .markdown-content p {
          margin-bottom: 0.5em;
        }
        .markdown-content p:last-child {
          margin-bottom: 0;
        }
        .markdown-content strong {
          font-weight: 800;
          color: #111;
        }
        .markdown-content ul {
          list-style-type: disc;
          padding-left: 1.5em;
          margin-bottom: 0.5em;
        }
      `}</style>
      
    </div>
  );
}
