import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Camera, Upload, RefreshCw, ChevronRight } from 'lucide-react';

export default function AIBodyScan({ onNavigate, isNutriScanUnlocked }: { onNavigate: (page: string) => void, isNutriScanUnlocked?: boolean }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysisResult(null); // Reset anterior
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Por favor, analise o meu corpo a partir desta foto. Estime a percentagem de massa gorda (valor aproximado), pontos fortes musculares, e dê conselhos sobre postura.',
          coachName: 'AI Body Scanner',
          coachDescription: 'um especialista em biometria avançada, avaliação física e postura. O teu objetivo éé olhar para a foto do utilizador, estimar a % de massa gorda de forma realista (mesmo que seja um palpite educado baseado em referências visuais), destacar os músculos mais desenvolvidos e identificar possíveis assimetrias ou dicas de postura. Sê profissional, encorajador, usa bold e emojis. Mantém a resposta muito estruturada.',
          imageBase64: selectedImage
        })
      });

      const data = await response.json();
      setAnalysisResult(data.reply);
    } catch (error) {
      setAnalysisResult('Ocorreu um erro ao conectar aos servidores de AI. Tente novamente mais tarde.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white relative font-sans overflow-y-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center p-6 pb-2 sticky top-0 bg-white/90 backdrop-blur-md z-20">
        <button onClick={() => onNavigate('workouts')} className="w-10 h-10 flex items-center justify-center font-extrabold text-xl text-black hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-extrabold text-lg text-black">AI Body Scan</span>
        <div className="w-10"></div>
      </div>

      <div className="px-6 py-4 flex-1 flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-black mb-2">A tua evolução.</h1>
          <p className="text-gray-500 font-semibold text-sm">
            Tira uma foto em frente ao espelho ou carrega um vídeo rápido. A nossa IA avançada fará uma leitura biométrica instantânea!
          </p>
        </div>

        {/* Upload / Image Display Area */}
        <div className="relative w-full aspect-[3/4] bg-[#F4F5F7] rounded-[32px] overflow-hidden shadow-inner mb-6 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center group transition-colors hover:border-[#84D82C]">
          
          {selectedImage ? (
            <>
              <img src={selectedImage} alt="Body scan" className="w-full h-full object-cover z-0" />
              {!isAnalyzing && !analysisResult && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/70 z-10"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center text-center p-6 z-10" onClick={() => fileInputRef.current?.click()}>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 cursor-pointer">
                <Camera className="w-8 h-8 text-[#84D82C]" />
              </div>
              <h3 className="font-extrabold text-black text-lg mb-1">Tirar foto</h3>
              <p className="text-gray-400 text-xs font-semibold">Toca para abrir a câmara ou galeria</p>
            </div>
          )}

          {/* Scanning Animation */}
          {isAnalyzing && (
            <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-[#84D82C]/10 backdrop-blur-[1px]"></div>
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#84D82C] shadow-[0_0_15px_5px_#84D82C] animate-scan-fast"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analisando biometria...
              </div>
            </div>
          )}

          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImageUpload}
          />
        </div>

        {/* Action Button */}
        {selectedImage && !analysisResult && !isAnalyzing && (
          <button 
            onClick={startAnalysis}
            className="w-full bg-black text-white font-extrabold text-lg py-4 rounded-xl shadow-lg hover:bg-gray-800 transition-transform active:scale-95 flex items-center justify-center gap-2 mb-8"
          >
            Iniciar Scanner Corporal
          </button>
        )}

        {/* Results Area */}
        {analysisResult && (
          <div className="bg-[#f0ffdb] rounded-[24px] p-6 shadow-sm border border-[#84D82C]/30 mb-8 animate-fade-in">
            <h3 className="text-lg font-extrabold text-black flex items-center gap-2 mb-4">
              <span className="text-xl">📊</span> Resultados da Análise
            </h3>
            <div className="markdown-content text-sm text-black/80 font-semibold leading-relaxed">
              <ReactMarkdown>{analysisResult}</ReactMarkdown>
            </div>
            
            <button 
              onClick={() => onNavigate(isNutriScanUnlocked ? 'nutri-scan-chat' : 'nutri-scan-intro')}
              className="mt-6 w-full bg-white text-black font-extrabold py-3 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              Ligar ao Nutri-Scan IA <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scanFast {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-fast {
          animation: scanFast 2s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .markdown-content p { margin-bottom: 0.75em; }
        .markdown-content p:last-child { margin-bottom: 0; }
        .markdown-content strong { font-weight: 800; color: #000; }
        .markdown-content ul { list-style-type: none; padding-left: 0; margin-bottom: 1em; }
        .markdown-content li { position: relative; padding-left: 1.5em; margin-bottom: 0.5em; }
        .markdown-content li::before { content: "•"; color: #84D82C; position: absolute; left: 0; font-weight: bold; font-size: 1.2em; }
      `}</style>

    </div>
  );
}

