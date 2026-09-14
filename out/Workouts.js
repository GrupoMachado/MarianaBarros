import React from "react";
import { Calendar, LayoutDashboard, Utensils, Flower2, User, List } from "lucide-react";
export default function Workouts({ onNavigate }) {
  const muscleGroups = [
    { id: "costas", title: "Costas", img: "/assets/costas_musculo.jpg" },
    { id: "pernas", title: "Pernas", img: "/assets/pernas_musculo.jpg" },
    { id: "peito", title: "Peito", img: "/assets/peito_musculo.jpg" },
    { id: "bracos", title: "Bra\xE7os", img: "/assets/bicep_musculo.jpg" }
  ];
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col h-screen max-w-md mx-auto bg-[#F9F9F9] relative font-sans overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center p-6 pb-2" }, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-extrabold text-black tracking-tight" }, "Treinos"), /* @__PURE__ */ React.createElement("button", { className: "w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-black hover:bg-gray-200 transition-colors" }, /* @__PURE__ */ React.createElement(List, { className: "w-5 h-5" }))), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto px-6 pb-28 space-y-4 hide-scrollbar" }, muscleGroups.map((group) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: group.id,
      onClick: () => onNavigate("muscle-group", { muscleId: group.id, title: group.title, img: group.img }),
      className: "bg-white rounded-[24px] shadow-sm flex items-center justify-between overflow-hidden cursor-pointer hover:shadow-md transition-shadow border border-transparent hover:border-gray-100 relative h-28"
    },
    /* @__PURE__ */ React.createElement("div", { className: "pl-6 z-10 w-1/2" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-extrabold text-black" }, group.title)),
    /* @__PURE__ */ React.createElement("div", { className: "w-1/2 h-full relative" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10" }), /* @__PURE__ */ React.createElement("img", { src: group.img, className: "w-full h-full object-cover object-center", alt: group.title }))
  )), /* @__PURE__ */ React.createElement("div", { onClick: () => onNavigate("ai-body-scan"), className: "mt-8 mb-10 relative rounded-[32px] overflow-hidden bg-white shadow-sm h-64 cursor-pointer" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "/assets/ai_scan.jpg",
      alt: "AI Body Scan",
      className: "w-full h-full object-cover object-top"
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" }), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-0 left-0 w-full p-5 flex justify-between items-end" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "bg-[#b3ff3b] text-black text-[10px] font-bold px-3 py-1 rounded-full mb-2 inline-block" }, "Novo"), /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-extrabold text-white mb-1" }, "AI Body Scan"), /* @__PURE__ */ React.createElement("p", { className: "text-white/80 font-semibold text-sm max-w-[200px] leading-tight" }, "Escaneie o seu corpo para um plano de treino 100% \xE0 medida.")), /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
    e.stopPropagation();
    onNavigate("ai-body-scan");
  }, className: "bg-white text-black font-extrabold px-5 py-2.5 rounded-full shadow-lg text-sm" }, "Scan")))), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-6 left-6 right-6 bg-white rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] flex justify-between px-6 py-4 z-20" }, /* @__PURE__ */ React.createElement("button", { onClick: () => onNavigate("home"), className: "flex flex-col items-center gap-1 group hover:-translate-y-1 transition-transform" }, /* @__PURE__ */ React.createElement(Calendar, { className: "w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" }), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold text-gray-400 group-hover:text-gray-900 transition-colors" }, "Meu Plano")), /* @__PURE__ */ React.createElement("button", { className: "flex flex-col items-center gap-1 group relative" }, /* @__PURE__ */ React.createElement("div", { className: "absolute -top-3 w-1.5 h-1.5 bg-blue-500 rounded-full scale-100 transition-transform" }), /* @__PURE__ */ React.createElement(LayoutDashboard, { className: "w-6 h-6 text-blue-500" }), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-extrabold text-blue-500" }, "Treinos")), /* @__PURE__ */ React.createElement("button", { onClick: () => onNavigate("nutrition"), className: "flex flex-col items-center gap-1 group hover:-translate-y-1 transition-transform" }, /* @__PURE__ */ React.createElement(Utensils, { className: "w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" }), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold text-gray-400 group-hover:text-gray-900 transition-colors" }, "Alimentos")), /* @__PURE__ */ React.createElement("button", { className: "flex flex-col items-center gap-1 group hover:-translate-y-1 transition-transform" }, /* @__PURE__ */ React.createElement(Flower2, { className: "w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" }), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold text-gray-400 group-hover:text-gray-900 transition-colors" }, "Mente")), /* @__PURE__ */ React.createElement("button", { className: "flex flex-col items-center gap-1 group hover:-translate-y-1 transition-transform" }, /* @__PURE__ */ React.createElement(User, { className: "w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" }), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold text-gray-400 group-hover:text-gray-900 transition-colors" }, "Perfil"))), /* @__PURE__ */ React.createElement("style", null, `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `));
}
