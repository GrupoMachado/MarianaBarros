import React, { useState } from "react";
import { Check } from "lucide-react";
import Home from "./components/Home";
import PlanOverview from "./components/PlanOverview";
import Nutrition from "./components/Nutrition";
import NutriScanWizard from "./components/NutriScanWizard";
import NutriScanChat from "./components/NutriScanChat";
import Workouts from "./components/Workouts";
import MuscleGroup from "./components/MuscleGroup";
import RecipeDetail from "./components/RecipeDetail";
import AIBodyScan from "./components/AIBodyScan";
import Profile from "./components/Profile";
import ActivePlan from "./components/ActivePlan";
import { coaches } from "./data/coaches";
function App() {
  const [currentView, setCurrentView] = useState("home");
  const [currentMuscleData, setCurrentMuscleData] = useState({ id: "costas", title: "Costas", img: "" });
  const [isNutriScanUnlocked, setIsNutriScanUnlocked] = useState(localStorage.getItem("nutriScanUnlocked_v2") === "true");
  const [currentProps, setCurrentProps] = useState({});
  const [specialties, setSpecialties] = useState([]);
  const [focuses, setFocuses] = useState([]);
  const [gender, setGender] = useState("Masculino");
  const [selectedCoachId, setSelectedCoachId] = useState("mike");
  const [chats, setChats] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const currentMessages = chats[selectedCoachId] || [];
  const navigateTo = (view, props = {}) => {
    setCurrentView(view);
    setCurrentProps(props);
  };
  const sendMessage = async (text = inputValue) => {
    if (!text.trim()) return;
    const userMsg = { role: "user", text };
    setChats((prev) => ({
      ...prev,
      [selectedCoachId]: [...prev[selectedCoachId] || [], userMsg]
    }));
    setInputValue("");
    setIsTyping(true);
    setTimeout(() => {
      const container = document.getElementById("chat-messages-container");
      if (container) container.scrollTop = container.scrollHeight;
    }, 100);
    try {
      const coach = coaches.find((c) => c.id === selectedCoachId);
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          coachName: coach?.name || "Treinador",
          coachDescription: coach?.description || "Um especialista em fitness."
        })
      });
      const data = await response.json();
      if (data.reply) {
        setChats((prev) => ({
          ...prev,
          [selectedCoachId]: [...prev[selectedCoachId] || [], { role: "model", text: data.reply }]
        }));
      } else {
        setChats((prev) => ({
          ...prev,
          [selectedCoachId]: [...prev[selectedCoachId] || [], { role: "model", text: "Desculpe, tive um problema ao processar isso." }]
        }));
      }
    } catch (error) {
      console.error(error);
      setChats((prev) => ({
        ...prev,
        [selectedCoachId]: [...prev[selectedCoachId] || [], { role: "model", text: "Erro de conex\xE3o com o servidor." }]
      }));
    } finally {
      setIsTyping(false);
      setTimeout(() => {
        const container = document.getElementById("chat-messages-container");
        if (container) container.scrollTop = container.scrollHeight;
      }, 100);
    }
  };
  const toggleSpecialty = (opt) => {
    setSpecialties((prev) => prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]);
  };
  const toggleFocus = (opt) => {
    setFocuses((prev) => prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "w-full h-full" }, currentView === "home" && /* @__PURE__ */ React.createElement(Home, { onNavigate: navigateTo }), currentView === "nutrition" && /* @__PURE__ */ React.createElement(Nutrition, { onNavigate: navigateTo, isNutriScanUnlocked }), currentView === "nutri-scan-intro" && /* @__PURE__ */ React.createElement(NutriScanWizard, { onNavigate: navigateTo, onUnlock: () => {
    setIsNutriScanUnlocked(true);
    localStorage.setItem("nutriScanUnlocked_v2", "true");
  }, isUnlocked: isNutriScanUnlocked, source: currentProps?.source || "profile" }), currentView === "nutri-scan-chat" && /* @__PURE__ */ React.createElement(NutriScanChat, { onNavigate: navigateTo }), currentView === "workouts" && /* @__PURE__ */ React.createElement(Workouts, { onNavigate: navigateTo }), currentView === "muscle-group" && /* @__PURE__ */ React.createElement(MuscleGroup, { onNavigate: navigateTo, muscleData: { id: currentProps.muscleId, title: currentProps.title, img: currentProps.img } }), currentView === "recipe-detail" && /* @__PURE__ */ React.createElement(RecipeDetail, { onNavigate: navigateTo, recipe: currentProps.recipe }), currentView === "ai-body-scan" && /* @__PURE__ */ React.createElement(AIBodyScan, { onNavigate: navigateTo, isNutriScanUnlocked }), currentView === "profile" && /* @__PURE__ */ React.createElement(Profile, { onNavigate: navigateTo, isNutriScanUnlocked }), currentView === "plan-overview" && /* @__PURE__ */ React.createElement(
    PlanOverview,
    {
      onBack: () => navigateTo("home"),
      onStart: () => isNutriScanUnlocked ? navigateTo("active-plan", currentProps) : navigateTo("nutri-scan-intro", { source: "workouts" }),
      ...currentProps
    }
  ), currentView === "active-plan" && /* @__PURE__ */ React.createElement(ActivePlan, { onNavigate: navigateTo, planData: currentProps }), currentView === "coach-intro" && /* @__PURE__ */ React.createElement("div", { className: "flex flex-col h-screen max-w-md mx-auto bg-white relative p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-8" }, /* @__PURE__ */ React.createElement("button", { onClick: () => navigateTo("home"), className: "w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold" }, "\u2190"), /* @__PURE__ */ React.createElement("div", { className: "w-6 h-6 border-2 border-blue-500 rounded-full border-t-transparent animate-spin" })), /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-extrabold mb-8 text-black leading-tight" }, "Obtenha conselhos personalizados dos nossos treinadores de IA"), /* @__PURE__ */ React.createElement("div", { className: "flex -space-x-4 mb-6 justify-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-16 h-24 bg-gray-300 rounded-xl overflow-hidden border-2 border-white relative z-10" }, /* @__PURE__ */ React.createElement("img", { src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=300&fit=crop", className: "object-cover w-full h-full", alt: "coach" })), /* @__PURE__ */ React.createElement("div", { className: "w-16 h-24 bg-gray-300 rounded-xl overflow-hidden border-2 border-white relative z-20 scale-110" }, /* @__PURE__ */ React.createElement("img", { src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=300&fit=crop", className: "object-cover w-full h-full", alt: "coach" })), /* @__PURE__ */ React.createElement("div", { className: "w-16 h-24 bg-gray-300 rounded-xl overflow-hidden border-2 border-white relative z-30 scale-125" }, /* @__PURE__ */ React.createElement("img", { src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=300&fit=crop", className: "object-cover w-full h-full", alt: "coach" })), /* @__PURE__ */ React.createElement("div", { className: "w-16 h-24 bg-gray-300 rounded-xl overflow-hidden border-2 border-white relative z-20 scale-110" }, /* @__PURE__ */ React.createElement("img", { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=300&fit=crop", className: "object-cover w-full h-full", alt: "coach" })), /* @__PURE__ */ React.createElement("div", { className: "w-16 h-24 bg-gray-300 rounded-xl overflow-hidden border-2 border-white relative z-10" }, /* @__PURE__ */ React.createElement("img", { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop", className: "object-cover w-full h-full", alt: "coach" }))), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 font-medium text-lg text-center mt-8 mb-auto" }, "Nossa equipe de treinadores de IA est\xE1 aqui para ajudar com qualquer d\xFAvida sobre fitness. Seja nutri\xE7\xE3o, sono, bem-estar mental ou condicionamento, temos o coach ideal para voc\xEA!"), /* @__PURE__ */ React.createElement("button", { onClick: () => navigateTo("coach-step-specialty"), className: "w-full bg-[#84D82C] text-black font-extrabold text-lg py-4 rounded-full mt-8 hover:opacity-90" }, "Continuar")), currentView === "coach-step-specialty" && /* @__PURE__ */ React.createElement("div", { className: "flex flex-col h-screen max-w-md mx-auto bg-[#F9F9F9] relative p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-8" }, /* @__PURE__ */ React.createElement("button", { onClick: () => navigateTo("coach-intro"), className: "w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold hover:bg-gray-300" }, "\u2190"), /* @__PURE__ */ React.createElement("div", { className: "w-6 h-6 border-2 border-blue-500 rounded-full border-t-transparent animate-spin" })), /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-extrabold mb-2 text-black leading-tight" }, "Busca um coach com especialidade espec\xEDfica?"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-500 mb-6 font-semibold" }, "Selecione todas as op\xE7\xF5es que se aplicam"), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto space-y-3 pb-28" }, ["Perda de peso", "Ganho de for\xE7a e m\xFAsculo", "Sono e recupera\xE7\xE3o", "Bem-estar mental e coaching", "Longevidade e biohacking", "Corrida e resist\xEAncia", "Nutri\xE7\xE3o e suplementos", "Fitness geral", "Desempenho esportivo e psicologia"].map((opt) => {
    const isSelected = specialties.includes(opt);
    return /* @__PURE__ */ React.createElement("div", { key: opt, onClick: () => toggleSpecialty(opt), className: "flex items-center justify-between bg-white p-4 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors" }, /* @__PURE__ */ React.createElement("span", { className: "font-extrabold text-black text-lg" }, opt), /* @__PURE__ */ React.createElement("div", { className: `w-6 h-6 flex items-center justify-center rounded-md border-2 ${isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"}` }, isSelected && /* @__PURE__ */ React.createElement(Check, { size: 14, className: "text-white", strokeWidth: 4 })));
  })), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-0 left-0 w-full p-6 pt-10 bg-gradient-to-t from-[#F9F9F9] via-[#F9F9F9] to-transparent" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => navigateTo("coach-step-focus"),
      disabled: specialties.length === 0,
      className: `w-full font-extrabold text-lg py-4 rounded-full transition-all duration-300 shadow-sm ${specialties.length > 0 ? "bg-[#84D82C] text-black hover:opacity-90" : "bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed"}`
    },
    "Continuar"
  ))), currentView === "coach-step-focus" && /* @__PURE__ */ React.createElement("div", { className: "flex flex-col h-screen max-w-md mx-auto bg-[#F9F9F9] relative p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-8" }, /* @__PURE__ */ React.createElement("button", { onClick: () => navigateTo("coach-step-specialty"), className: "w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold hover:bg-gray-300" }, "\u2190"), /* @__PURE__ */ React.createElement("div", { className: "w-6 h-6 border-2 border-blue-500 rounded-full border-t-transparent animate-spin" })), /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-extrabold mb-2 text-black leading-tight" }, "No que voc\xEA quer focar com seu coach?"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-500 mb-6 font-semibold" }, "Selecione todas as op\xE7\xF5es que se aplicam"), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto space-y-3 pb-28" }, ["Motiva\xE7\xE3o para treinar", "Regularidade nos treinos", "H\xE1bitos saud\xE1veis", "Qualidade do sono", "Gerenciar estresse e ansiedade", "Acompanhar meu progresso", "Suplementa\xE7\xE3o", "Melhorar flexibilidade", "Treinar para um evento", "Definir metas realistas", "Hor\xE1rio das refei\xE7\xF5es e treinos", "Calistenia", "Jejum intermitente"].map((opt) => {
    const isSelected = focuses.includes(opt);
    return /* @__PURE__ */ React.createElement("div", { key: opt, onClick: () => toggleFocus(opt), className: "flex items-center justify-between bg-white p-4 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors" }, /* @__PURE__ */ React.createElement("span", { className: "font-extrabold text-black text-lg" }, opt), /* @__PURE__ */ React.createElement("div", { className: `w-6 h-6 flex items-center justify-center rounded-md border-2 ${isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"}` }, isSelected && /* @__PURE__ */ React.createElement(Check, { size: 14, className: "text-white", strokeWidth: 4 })));
  })), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-0 left-0 w-full p-6 pt-10 bg-gradient-to-t from-[#F9F9F9] via-[#F9F9F9] to-transparent" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => navigateTo("coach-step-gender"),
      disabled: focuses.length === 0,
      className: `w-full font-extrabold text-lg py-4 rounded-full transition-all duration-300 shadow-sm ${focuses.length > 0 ? "bg-[#84D82C] text-black hover:opacity-90" : "bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed"}`
    },
    "Continuar"
  ))), currentView === "coach-step-gender" && /* @__PURE__ */ React.createElement("div", { className: "flex flex-col h-screen max-w-md mx-auto bg-[#F9F9F9] relative p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-8" }, /* @__PURE__ */ React.createElement("button", { onClick: () => navigateTo("coach-step-focus"), className: "w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold hover:bg-gray-300" }, "\u2190"), /* @__PURE__ */ React.createElement("div", { className: "w-6 h-6 border-2 border-blue-500 rounded-full border-t-transparent animate-spin" })), /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-extrabold mb-6 text-black leading-tight" }, "Seu treinador ideal \xE9:"), /* @__PURE__ */ React.createElement("div", { className: "flex-1 space-y-3 pb-28" }, ["Feminino", "Masculino", "Sem prefer\xEAncia"].map((opt) => {
    const isSelected = gender === opt;
    return /* @__PURE__ */ React.createElement("div", { key: opt, onClick: () => setGender(opt), className: `flex items-center justify-between bg-white p-4 rounded-2xl cursor-pointer border-2 transition-all duration-200 ${isSelected ? "border-blue-500" : "border-transparent hover:border-gray-200"}` }, /* @__PURE__ */ React.createElement("span", { className: "font-extrabold text-black text-lg" }, opt), /* @__PURE__ */ React.createElement("div", { className: `w-6 h-6 flex items-center justify-center rounded-full border-2 ${isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"}` }, isSelected && /* @__PURE__ */ React.createElement("div", { className: "w-2.5 h-2.5 bg-white rounded-full" })));
  })), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-0 left-0 w-full p-6 pt-10 bg-gradient-to-t from-[#F9F9F9] via-[#F9F9F9] to-transparent" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => navigateTo("coach-step-showcase"),
      className: "w-full bg-[#84D82C] text-black font-extrabold text-lg py-4 rounded-full shadow-sm hover:opacity-90 transition-all duration-300"
    },
    "Continuar"
  ))), currentView === "coach-step-showcase" && /* @__PURE__ */ React.createElement("div", { className: "flex flex-col h-screen max-w-md mx-auto bg-[#F9F9F9] relative p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-6" }, /* @__PURE__ */ React.createElement("button", { onClick: () => navigateTo("coach-step-gender"), className: "w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold hover:bg-gray-300" }, "\u2190"), /* @__PURE__ */ React.createElement("div", { className: "w-6 h-6 border-2 border-blue-500 rounded-full border-t-transparent animate-spin" })), /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-extrabold mb-6 text-black leading-tight" }, "Fale com seu coach a qualquer hora, sobre qualquer coisa"), /* @__PURE__ */ React.createElement("div", { className: "relative rounded-3xl overflow-hidden mb-6 h-72" }, /* @__PURE__ */ React.createElement("img", { src: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop", className: "w-full h-full object-cover", alt: "coach showcase" }), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-black/10" }), /* @__PURE__ */ React.createElement("div", { className: "absolute top-1/4 left-4 bg-white px-3 py-2 rounded-xl text-center shadow-lg border border-gray-100" }, /* @__PURE__ */ React.createElement("div", { className: "absolute -top-3 left-1/2 -translate-x-1/2 bg-[#84D82C] text-black w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs" }, "\u{1F4AA}"), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] font-bold text-black mt-1" }, "Me motive para", /* @__PURE__ */ React.createElement("br", null), "o treino de", /* @__PURE__ */ React.createElement("br", null), "hoje!")), /* @__PURE__ */ React.createElement("div", { className: "absolute top-1/3 right-4 bg-white px-3 py-2 rounded-xl text-center shadow-lg border border-gray-100" }, /* @__PURE__ */ React.createElement("div", { className: "absolute -top-3 left-1/2 -translate-x-1/2 bg-[#84D82C] text-black w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs" }, "\u{1F957}"), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] font-bold text-black mt-1" }, "Quero", /* @__PURE__ */ React.createElement("br", null), "tentar a", /* @__PURE__ */ React.createElement("br", null), "dieta", /* @__PURE__ */ React.createElement("br", null), "cetog\xEAnica")), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-4 right-8 bg-white px-3 py-2 rounded-xl text-center shadow-lg border border-gray-100" }, /* @__PURE__ */ React.createElement("div", { className: "absolute -top-3 left-1/2 -translate-x-1/2 bg-[#84D82C] text-black w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs" }, "\u23F1\uFE0F"), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] font-bold text-black mt-1" }, "Como definir o", /* @__PURE__ */ React.createElement("br", null), "abd\xF4men r\xE1pido?"))), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 font-medium text-lg mt-auto mb-8" }, "O que estiver na sua mente, seu coach est\xE1 dispon\xEDvel 24/7 para dar recomenda\xE7\xF5es personalizadas para seus objetivos."), /* @__PURE__ */ React.createElement("button", { onClick: () => navigateTo("coach-list"), className: "w-full bg-[#84D82C] text-black font-extrabold text-lg py-4 rounded-full mt-auto hover:opacity-90 transition-all duration-300" }, "Continuar")), currentView === "coach-list" && /* @__PURE__ */ React.createElement("div", { className: "flex flex-col h-screen max-w-md mx-auto bg-[#F9F9F9] relative" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center p-6 pb-2" }, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-extrabold text-black leading-tight" }, "Perfeito para voc\xEA"), /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors", onClick: () => navigateTo("home") }, "X")), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto px-6 pb-24 space-y-4 pt-4" }, coaches.map((coach) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: coach.id,
      className: "bg-white rounded-[32px] overflow-hidden shadow-sm relative cursor-pointer hover:shadow-md transition-shadow",
      onClick: () => {
        setSelectedCoachId(coach.id);
        navigateTo("coach-chat");
      }
    },
    coach.isBestMatch && /* @__PURE__ */ React.createElement("div", { className: "absolute top-4 left-4 bg-[#E2FF7D] text-black text-xs font-bold px-3 py-1.5 rounded-full z-10 flex items-center gap-1" }, /* @__PURE__ */ React.createElement("span", null, "\u2B50 Melhor Correspond\xEAncia")),
    /* @__PURE__ */ React.createElement("img", { src: coach.image, className: "w-full h-48 object-cover object-top", alt: coach.name }),
    /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 h-48 bg-gradient-to-t from-white via-white/40 to-transparent" }),
    /* @__PURE__ */ React.createElement("div", { className: "p-5 pt-0 relative z-20 -mt-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-end gap-3 mb-3" }, /* @__PURE__ */ React.createElement("img", { src: coach.face, className: "w-14 h-14 rounded-full border-4 border-white object-cover", alt: `${coach.name} profile` }), /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-extrabold text-black" }, coach.name)), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2 mb-3" }, coach.tags.map((tag) => /* @__PURE__ */ React.createElement("span", { key: tag, className: "border border-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-full" }, tag))), /* @__PURE__ */ React.createElement("p", { className: "text-gray-500 text-sm font-medium" }, coach.description))
  )))), currentView === "coach-chat" && /* @__PURE__ */ React.createElement("div", { className: "flex flex-col h-screen max-w-md mx-auto bg-gradient-to-b from-[#E6F5EE] to-[#E6F0F5] relative" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center p-4 pt-6" }, /* @__PURE__ */ React.createElement("button", { onClick: () => navigateTo("coach-list"), className: "w-10 h-10 flex items-center justify-center font-bold text-xl text-black hover:bg-white/30 rounded-full transition-colors" }, "<"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 bg-white/50 px-4 py-1.5 rounded-full backdrop-blur-sm shadow-sm" }, /* @__PURE__ */ React.createElement("img", { src: coaches.find((c) => c.id === selectedCoachId)?.face, className: "w-6 h-6 rounded-full object-cover", alt: coaches.find((c) => c.id === selectedCoachId)?.name }), /* @__PURE__ */ React.createElement("span", { className: "font-extrabold text-sm text-black" }, coaches.find((c) => c.id === selectedCoachId)?.name)), /* @__PURE__ */ React.createElement("div", { className: "w-10" })), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", id: "chat-messages-container" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-black font-semibold max-w-[85%]" }, "Ol\xE1! Sou o ", coaches.find((c) => c.id === selectedCoachId)?.name, ", o teu treinador pessoal de IA \u{1F4AA} Embora eu n\xE3o seja humano, tenho conhecimento e experi\xEAncia que ningu\xE9m mais tem. \xC9 um prazer ser o teu treinador! \u{1F525}"), currentMessages.map((msg, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, className: `p-4 rounded-2xl shadow-sm font-semibold max-w-[85%] ${msg.role === "user" ? "bg-[#84D82C] text-black ml-auto rounded-tr-none" : "bg-white text-black rounded-tl-none"}` }, msg.text)), isTyping && /* @__PURE__ */ React.createElement("div", { className: "bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-gray-400 font-semibold max-w-[85%] flex gap-1 items-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce" }), /* @__PURE__ */ React.createElement("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce", style: { animationDelay: "0.1s" } }), /* @__PURE__ */ React.createElement("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce", style: { animationDelay: "0.2s" } }))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-t-3xl p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]" }, currentMessages.length === 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-4 cursor-pointer" }, /* @__PURE__ */ React.createElement("span", { className: "font-extrabold text-sm text-gray-800" }, "N\xE3o sabe o que perguntar? >")), /* @__PURE__ */ React.createElement("div", { className: "space-y-2 mb-4" }, ["O que devo comer para atingir meu objetivo?", "Qual \xE9 o melhor hor\xE1rio para os meus treinos?", "Me motive para o treino de hoje!"].map((q) => /* @__PURE__ */ React.createElement("div", { key: q, onClick: () => sendMessage(q), className: "bg-gray-100 rounded-full px-4 py-2.5 text-sm font-bold text-gray-600 flex gap-2 cursor-pointer hover:bg-gray-200 transition-colors" }, /* @__PURE__ */ React.createElement("span", null, '"'), " ", q)))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 bg-gray-100 rounded-full p-1.5 mt-auto" }, /* @__PURE__ */ React.createElement("button", { className: "w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-sm" }, "\u{1F4F7}"), /* @__PURE__ */ React.createElement("button", { className: "w-8 h-8 flex items-center justify-center font-bold text-blue-500 text-xs" }, "GIF"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: inputValue,
      onChange: (e) => setInputValue(e.target.value),
      onKeyDown: (e) => e.key === "Enter" && sendMessage(),
      placeholder: "Aa",
      className: "flex-1 bg-transparent border-none focus:ring-0 text-sm font-semibold text-black px-2 outline-none"
    }
  ), /* @__PURE__ */ React.createElement("button", { onClick: () => sendMessage(), className: "w-8 h-8 flex items-center justify-center text-gray-400 font-bold hover:text-blue-500 transition-colors" }, "\u2191")))));
}
export default App;
