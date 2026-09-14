import React, { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, Camera, Zap, Dumbbell, User } from "lucide-react";
import { supabase } from "../supabase";
export default function NutriScanWizard({ onNavigate, isUnlocked, onUnlock, source = "profile" }) {
  const [step, setStep] = useState(source === "workouts" ? 0 : 1);
  const [gender, setGender] = useState(null);
  const [q1, setQ1] = useState([]);
  const [q2, setQ2] = useState([]);
  const [q3, setQ3] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const config = {
    nutrition: {
      step1: { title: "Qual \xE9 a tua maior dificuldade?", options: ["Controlar por\xE7\xF5es", "Falta de tempo", "N\xE3o saber o que comer", "Comer doces"] },
      step2: { title: "Que tipo de dieta preferes?", options: ["Sem restri\xE7\xF5es", "Vegetariana", "Low Carb", "Sem Gl\xFAten"] },
      step3: { title: "Quantos litros de \xE1gua bebes por dia?", options: ["Menos de 1L", "1 a 2L", "2 a 3L", "Mais de 3L"] },
      step4: "A preparar o teu perfil nutricional...",
      step5: {
        title: "Informa\xE7\xF5es de nutri\xE7\xE3o rapidinho!",
        subtitle: "Escaneie sua refei\xE7\xE3o para ver instantaneamente calorias, macronutrientes e dicas.",
        btn: "Escanear agora",
        icon: /* @__PURE__ */ React.createElement(Camera, { className: "w-6 h-6" })
      }
    },
    workouts: {
      step1: { title: "Qual \xE9 o teu objetivo principal?", options: ["Perder peso", "Ganhar m\xFAsculo", "Tonificar", "Mais energia"] },
      step2: { title: "Quantos dias por semana podes treinar?", options: ["2 a 3 dias", "4 dias", "5 ou mais dias"] },
      step3: { title: "Qual \xE9 o teu n\xEDvel de experi\xEAncia?", options: ["Iniciante", "Interm\xE9dio", "Avan\xE7ado"] },
      step4: "A criar o teu plano de treinos...",
      step5: {
        title: gender === "female" ? "Treinos focados nos teus Gl\xFAteos!" : "Treinos focados nos teus Bra\xE7os!",
        subtitle: "A IA cria planos semanais din\xE2micos, ajustados ao teu n\xEDvel e objetivo.",
        btn: "Ver Planos",
        icon: /* @__PURE__ */ React.createElement(Dumbbell, { className: "w-6 h-6" })
      }
    },
    profile: {
      step1: { title: "O que te trouxe \xE0 IA hoje?", options: ["Quero comer melhor", "Quero treinar melhor", "Preciso de motiva\xE7\xE3o", "Mudar de vida"] },
      step2: { title: "Como descreves a tua forma f\xEDsica?", options: ["Sedent\xE1rio", "Ativo ocasionalmente", "Atleta amador"] },
      step3: { title: "Onde preferes treinar?", options: ["No gin\xE1sio", "Em casa", "Ao ar livre"] },
      step4: "A construir a tua IA pessoal...",
      step5: {
        title: "O teu Treinador e Nutricionista 24/7",
        subtitle: "A IA acompanha-te em cada passo, ajustando treinos e refei\xE7\xF5es todos os dias.",
        btn: "Descobrir IA",
        icon: /* @__PURE__ */ React.createElement(Zap, { className: "w-6 h-6 text-yellow-500" })
      }
    }
  }[source] || {
    step1: { title: "O que te trouxe \xE0 IA hoje?", options: ["Quero comer melhor", "Quero treinar melhor", "Preciso de motiva\xE7\xE3o", "Mudar de vida"] },
    step2: { title: "Como descreves a tua forma f\xEDsica?", options: ["Sedent\xE1rio", "Ativo ocasionalmente", "Atleta amador"] },
    step3: { title: "Onde preferes treinar?", options: ["No gin\xE1sio", "Em casa", "Ao ar livre"] },
    step4: "A construir a tua IA pessoal...",
    step5: { title: "O teu Treinador e Nutricionista 24/7", subtitle: "A IA acompanha-te em cada passo.", btn: "Descobrir IA", icon: /* @__PURE__ */ React.createElement(Zap, { className: "w-6 h-6" }) }
  };
  const nextStep = () => {
    if (step < 6) setStep(step + 1);
  };
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
    else if (step === 1 && source === "workouts") setStep(0);
    else onNavigate("home");
  };
  const toggleQ1 = (option) => setQ1((prev) => prev.includes(option) ? prev.filter((i) => i !== option) : [...prev, option]);
  const toggleQ2 = (option) => setQ2((prev) => prev.includes(option) ? prev.filter((i) => i !== option) : [...prev, option]);
  useEffect(() => {
    if (step === 4) {
      const timer = setTimeout(() => setStep(5), 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);
  const handleUnlock = async () => {
    if (accessCode.trim().toUpperCase() === "IA2026" && username.trim().length >= 3) {
      const { data, error: sbError } = await supabase.from("profiles").upsert({ username: username.trim(), access_code: "IA2026", has_ai_access: true, updated_at: (/* @__PURE__ */ new Date()).toISOString() }, { onConflict: "username" }).select().single();
      if (!sbError) {
        localStorage.setItem("activeUsername", username.trim());
        onUnlock();
        onNavigate("home");
      }
    } else {
      setError("C\xF3digo inv\xE1lido ou nome de utilizador curto (m\xEDnimo 3 letras).");
    }
  };
  const workoutPreview = gender === "female" ? { day: "Dia 1: Gl\xFAteos e Pernas", ex1: "Hip Thrust com Barra", ex1info: "4 S\xE9ries \u2022 12 Reps", ex2: "Agachamento Sum\xF4", ex2info: "3 S\xE9ries \u2022 15 Reps" } : { day: "Dia 1: Bra\xE7os e Peito", ex1: "Curl com Barra (Bicep)", ex1info: "4 S\xE9ries \u2022 10-12 Reps", ex2: "Supino Plano", ex2info: "3 S\xE9ries \u2022 8-10 Reps" };
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col h-screen max-w-md mx-auto bg-white relative font-sans" }, step >= 1 && step <= 3 && /* @__PURE__ */ React.createElement("div", { className: "px-5 pt-6 pb-2 flex items-center shrink-0" }, /* @__PURE__ */ React.createElement("button", { onClick: prevStep, className: "w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors shrink-0" }, /* @__PURE__ */ React.createElement(ArrowLeft, { className: "w-5 h-5 text-black" })), /* @__PURE__ */ React.createElement("div", { className: "flex-1 flex justify-center items-center gap-1.5 px-4" }, [1, 2, 3].map((i) => /* @__PURE__ */ React.createElement("div", { key: i, className: `h-1.5 rounded-full transition-all ${step >= i ? "bg-[#84D82C] w-8" : "bg-gray-200 w-4"}` }))), /* @__PURE__ */ React.createElement("div", { className: "w-10 opacity-0 shrink-0" })), step === 0 && /* @__PURE__ */ React.createElement("div", { className: "flex-1 flex flex-col items-center justify-center p-6 animate-fade-in" }, /* @__PURE__ */ React.createElement("button", { onClick: () => onNavigate("home"), className: "self-start mb-6 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center" }, /* @__PURE__ */ React.createElement(ArrowLeft, { className: "w-5 h-5 text-black" })), /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-extrabold text-black mb-3 leading-tight text-center" }, "\xC9s Homem ou Mulher?"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-400 font-semibold text-sm mb-10 text-center" }, "Vamos personalizar os treinos para o teu corpo."), /* @__PURE__ */ React.createElement("div", { className: "flex gap-4 w-full" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setGender("male");
        setStep(1);
      },
      className: "flex-1 flex flex-col items-center justify-center gap-4 p-6 rounded-3xl border-2 border-gray-100 bg-gray-50 hover:border-black transition-all active:scale-95"
    },
    /* @__PURE__ */ React.createElement("span", { className: "text-6xl" }, "\u{1F9D4}"),
    /* @__PURE__ */ React.createElement("span", { className: "font-extrabold text-black text-lg" }, "Homem")
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setGender("female");
        setStep(1);
      },
      className: "flex-1 flex flex-col items-center justify-center gap-4 p-6 rounded-3xl border-2 border-gray-100 bg-gray-50 hover:border-[#FF6B9D] transition-all active:scale-95"
    },
    /* @__PURE__ */ React.createElement("span", { className: "text-6xl" }, "\u{1F469}"),
    /* @__PURE__ */ React.createElement("span", { className: "font-extrabold text-black text-lg" }, "Mulher")
  ))), step === 1 && /* @__PURE__ */ React.createElement("div", { className: "flex-1 flex flex-col p-5 animate-fade-in" }, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-extrabold text-black mb-8 leading-tight" }, config.step1.title), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, config.step1.options.map((option) => /* @__PURE__ */ React.createElement("button", { key: option, onClick: () => toggleQ1(option), className: `w-full text-left px-5 py-4 rounded-2xl font-bold text-sm transition-all border-2 ${q1.includes(option) ? "border-[#84D82C] bg-[#84D82C]/10 text-black" : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"}` }, option))), /* @__PURE__ */ React.createElement("button", { onClick: nextStep, disabled: q1.length === 0, className: "w-full bg-black text-white font-extrabold text-lg py-4 rounded-xl mt-auto mb-6 disabled:opacity-50 transition-opacity" }, "Continuar")), step === 2 && /* @__PURE__ */ React.createElement("div", { className: "flex-1 flex flex-col p-5 animate-fade-in" }, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-extrabold text-black mb-8 leading-tight" }, config.step2.title), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, config.step2.options.map((option) => /* @__PURE__ */ React.createElement("button", { key: option, onClick: () => toggleQ2(option), className: `w-full text-left px-5 py-4 rounded-2xl font-bold text-sm transition-all border-2 ${q2.includes(option) ? "border-[#84D82C] bg-[#84D82C]/10 text-black" : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"}` }, option))), /* @__PURE__ */ React.createElement("button", { onClick: nextStep, disabled: q2.length === 0, className: "w-full bg-black text-white font-extrabold text-lg py-4 rounded-xl mt-auto mb-6 disabled:opacity-50 transition-opacity" }, "Continuar")), step === 3 && /* @__PURE__ */ React.createElement("div", { className: "flex-1 flex flex-col p-5 animate-fade-in" }, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-extrabold text-black mb-8 leading-tight" }, config.step3.title), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, config.step3.options.map((option) => /* @__PURE__ */ React.createElement("button", { key: option, onClick: () => setQ3(option), className: `w-full text-left px-5 py-4 rounded-2xl font-bold text-sm transition-all border-2 ${q3 === option ? "border-[#84D82C] bg-[#84D82C]/10 text-black" : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"}` }, option))), /* @__PURE__ */ React.createElement("button", { onClick: nextStep, disabled: !q3, className: "w-full bg-black text-white font-extrabold text-lg py-4 rounded-xl mt-auto mb-6 disabled:opacity-50 transition-opacity" }, "Continuar")), step === 4 && /* @__PURE__ */ React.createElement("div", { className: "flex-1 flex flex-col items-center justify-center p-8 animate-fade-in text-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-24 h-24 border-4 border-gray-100 border-t-[#84D82C] rounded-full animate-spin mb-8" }), /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-extrabold text-black" }, config.step4), /* @__PURE__ */ React.createElement("p", { className: "text-gray-400 font-bold mt-2 text-sm" }, "A personalizar a tua experi\xEAncia...")), step === 5 && /* @__PURE__ */ React.createElement("div", { className: "flex-1 flex flex-col p-5 pt-6 animate-fade-in text-center relative overflow-y-auto hide-scrollbar" }, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-extrabold text-black mb-4 leading-tight" }, config.step5.title), /* @__PURE__ */ React.createElement("p", { className: "text-black font-semibold text-sm mb-10 px-4" }, config.step5.subtitle), source === "nutrition" && /* @__PURE__ */ React.createElement("div", { className: "relative w-full max-w-[300px] mx-auto h-64 flex items-center justify-center mb-auto mt-8" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 border-[6px] border-[#84D82C] rounded-[40px] opacity-20" }), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 border-[6px] border-[#84D82C] rounded-[40px] clip-scanner" }), /* @__PURE__ */ React.createElement("img", { src: "/assets/salada_kale.jpg", className: "w-56 h-56 object-cover rounded-full shadow-lg", alt: "Food" }), /* @__PURE__ */ React.createElement("div", { className: "absolute -top-4 right-0 bg-black text-white px-4 py-3 rounded-2xl font-extrabold shadow-xl z-20 rotate-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl" }, "628"), /* @__PURE__ */ React.createElement("div", { className: "text-xs" }, "Calorias")), /* @__PURE__ */ React.createElement("div", { className: "absolute top-8 -left-4 bg-white text-black px-4 py-2 rounded-xl font-extrabold shadow-lg text-sm z-20" }, "Gorduras 26 g"), /* @__PURE__ */ React.createElement("div", { className: "absolute top-24 -right-4 bg-white text-black px-4 py-2 rounded-xl font-extrabold shadow-lg text-sm z-20" }, "Prote\xEDna 35 g"), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-8 left-1/2 -translate-x-1/2 bg-white text-black px-5 py-2.5 rounded-xl font-extrabold shadow-lg text-sm z-20 whitespace-nowrap" }, "Carboidratos 67 g"), /* @__PURE__ */ React.createElement("div", { className: "absolute -bottom-20 left-1/2 -translate-x-1/2 w-[120%] bg-[#007AFF] text-white px-4 py-3 rounded-xl font-semibold text-xs shadow-lg z-20" }, /* @__PURE__ */ React.createElement("span", { className: "font-extrabold" }, "Dica:"), " Troque o arroz por quinoa para energia est\xE1vel.", /* @__PURE__ */ React.createElement("div", { className: "absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#007AFF] rotate-45" }))), source === "workouts" && /* @__PURE__ */ React.createElement("div", { className: "relative w-full max-w-[300px] mx-auto mb-auto mt-8 flex flex-col gap-4" }, /* @__PURE__ */ React.createElement("div", { className: `rounded-3xl p-6 text-left shadow-sm border-2 ${gender === "female" ? "bg-pink-50 border-pink-300" : "bg-gray-100 border-[#84D82C]"}` }, /* @__PURE__ */ React.createElement("h3", { className: "font-extrabold text-black text-xl mb-1" }, workoutPreview.day), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-bold text-gray-500 mb-4" }, "Treino Gerado \u2022 6 Exerc\xEDcios"), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm" }, /* @__PURE__ */ React.createElement("div", { className: `w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-xl ${gender === "female" ? "bg-pink-100" : "bg-gray-100"}` }, gender === "female" ? "\u{1F351}" : "\u{1F4AA}"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "font-extrabold text-[13px]" }, workoutPreview.ex1), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-gray-400 font-bold" }, workoutPreview.ex1info))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm opacity-70" }, /* @__PURE__ */ React.createElement("div", { className: `w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-xl ${gender === "female" ? "bg-pink-100" : "bg-gray-100"}` }, gender === "female" ? "\u{1F9B5}" : "\u{1F3CB}\uFE0F"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "font-extrabold text-[13px]" }, workoutPreview.ex2), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-gray-400 font-bold" }, workoutPreview.ex2info)))))), source === "profile" && /* @__PURE__ */ React.createElement("div", { className: "relative w-full max-w-[300px] mx-auto mb-auto mt-8" }, /* @__PURE__ */ React.createElement("div", { className: "w-32 h-32 bg-[#b3ff3b] rounded-full mx-auto flex items-center justify-center shadow-lg mb-6 animate-pulse" }, /* @__PURE__ */ React.createElement(User, { className: "w-12 h-12 text-black" })), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-100 p-4 rounded-2xl text-left border-l-4 border-black" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-bold text-black" }, '"Bom dia! Vi que o teu objetivo \xE9 melhorar a forma. Preparei os teus macros de hoje e o teu treino. Vamos a isso?"'))), /* @__PURE__ */ React.createElement("button", { onClick: nextStep, className: "w-full bg-[#84D82C] text-black font-extrabold text-lg py-4 rounded-xl mt-24 shadow-sm hover:bg-[#75C825] transition-colors flex items-center justify-center gap-2" }, config.step5.icon, " ", config.step5.btn)), step === 6 && /* @__PURE__ */ React.createElement("div", { className: "flex-1 flex flex-col p-5 pt-4 animate-fade-in relative justify-center bg-white overflow-y-auto hide-scrollbar" }, /* @__PURE__ */ React.createElement("div", { className: "text-center mb-3" }, /* @__PURE__ */ React.createElement("div", { className: "inline-block px-2 py-1 bg-black text-white text-[9px] font-extrabold rounded-full mb-1 tracking-widest uppercase" }, "Acesso PRO"), /* @__PURE__ */ React.createElement("h1", { className: "text-2xl font-extrabold text-black mb-1 leading-tight" }, "Desbloqueia a tua IA")), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100 shadow-sm" }, /* @__PURE__ */ React.createElement("h3", { className: "font-extrabold text-black mb-2 text-sm" }, "O que est\xE1 inclu\xEDdo:"), /* @__PURE__ */ React.createElement("ul", { className: "space-y-1.5 text-[11px] font-semibold text-gray-600" }, /* @__PURE__ */ React.createElement("li", { className: "flex items-start gap-2 leading-tight" }, /* @__PURE__ */ React.createElement("span", { className: "text-[#84D82C] text-[10px]" }, "\u2705"), " ", /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", null, "Nutri-Scan:"), " A IA diz o que est\xE1 no prato e o que comer a seguir.")), /* @__PURE__ */ React.createElement("li", { className: "flex items-start gap-2 leading-tight" }, /* @__PURE__ */ React.createElement("span", { className: "text-[#84D82C] text-[10px]" }, "\u2705"), " ", /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", null, "+100 Receitas PRO:"), " Acesso a refei\xE7\xF5es exclusivas e macros.")), /* @__PURE__ */ React.createElement("li", { className: "flex items-start gap-2 leading-tight" }, /* @__PURE__ */ React.createElement("span", { className: "text-[#84D82C] text-[10px]" }, "\u2705"), " ", /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", null, "AI Body Scan:"), " L\xEA o teu corpo e recomenda o caminho certo.")), /* @__PURE__ */ React.createElement("li", { className: "flex items-start gap-2 leading-tight" }, /* @__PURE__ */ React.createElement("span", { className: "text-[#84D82C] text-[10px]" }, "\u2705"), " ", /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", null, "Treinadores IA 24/7:"), " Especialistas em treino, nutri\xE7\xE3o e sono.")), /* @__PURE__ */ React.createElement("li", { className: "flex items-start gap-2 leading-tight" }, /* @__PURE__ */ React.createElement("span", { className: "text-[#84D82C] text-[10px]" }, "\u2705"), " ", /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", null, "Perda de Peso:"), " Programas intensivos de 5 semanas.")), /* @__PURE__ */ React.createElement("li", { className: "flex items-start gap-2 leading-tight" }, /* @__PURE__ */ React.createElement("span", { className: "text-[#84D82C] text-[10px]" }, "\u2705"), " ", /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", null, "Ganho Muscular:"), " Treinos avan\xE7ados de 8 a 12 semanas.")))), /* @__PURE__ */ React.createElement("p", { className: "text-gray-500 font-semibold text-[10px] mb-3 px-2 text-center leading-tight" }, "Cria o teu Nome de Utilizador e insere o c\xF3digo de acesso (enviado por email ap\xF3s a compra) para teres acesso vital\xEDcio."), /* @__PURE__ */ React.createElement("div", { className: "w-full" }, /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Nome de Utilizador (ex: joao_silva)", value: username, onChange: (e) => {
    setUsername(e.target.value);
    setError("");
  }, className: "w-full px-4 py-2.5 rounded-lg border-2 border-gray-100 bg-white text-xs font-bold text-black mb-2 focus:border-[#84D82C] focus:ring-0 outline-none placeholder-gray-300 shadow-sm" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "C\xF3digo de Acesso", value: accessCode, onChange: (e) => {
    setAccessCode(e.target.value);
    setError("");
  }, className: "w-full px-4 py-2.5 rounded-lg border-2 border-gray-100 bg-white text-xs font-bold text-black focus:border-[#84D82C] focus:ring-0 outline-none placeholder-gray-300 shadow-sm" }), error && /* @__PURE__ */ React.createElement("p", { className: "text-red-500 text-[10px] font-bold mt-1 text-center" }, error)), /* @__PURE__ */ React.createElement("button", { onClick: handleUnlock, className: "w-full bg-black text-white font-extrabold text-[13px] py-3 rounded-xl mt-3 mb-3 shadow-sm hover:bg-gray-800 transition-transform active:scale-95 flex items-center justify-center gap-2" }, /* @__PURE__ */ React.createElement(CheckCircle2, { className: "w-4 h-4" }), " Validar C\xF3digo"), /* @__PURE__ */ React.createElement("div", { className: "relative flex py-2 items-center mb-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex-grow border-t border-gray-200" }), /* @__PURE__ */ React.createElement("span", { className: "flex-shrink-0 mx-4 text-gray-400 text-[9px] font-bold uppercase" }, "Ou adquire agora"), /* @__PURE__ */ React.createElement("div", { className: "flex-grow border-t border-gray-200" })), /* @__PURE__ */ React.createElement("a", { href: "https://pay.hotmart.com/H106107115U?checkoutMode=10", target: "_blank", rel: "noopener noreferrer", className: "w-full bg-gradient-to-r from-[#FF512F] to-[#DD2476] text-white font-extrabold text-[14px] py-3.5 rounded-xl shadow-md hover:opacity-90 transition-opacity flex items-center justify-center" }, "Comprar Acesso PRO"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-400 text-[9px] font-bold mt-2 text-center pb-2" }, "Pagamento 100% seguro via Hotmart")), /* @__PURE__ */ React.createElement("style", null, `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .clip-scanner { animation: scan 3s infinite linear; }
        @keyframes scan {
          0% { clip-path: inset(0 0 100% 0); }
          50% { clip-path: inset(0 0 0 0); }
          100% { clip-path: inset(100% 0 0 0); }
        }
      `));
}
