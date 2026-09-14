import React from "react";
import { Calendar, LayoutDashboard, Utensils, Flower2, User, Heart, Filter, Search, Lock, AlertTriangle } from "lucide-react";
import { recipesData } from "../data/recipes";
export default function Nutrition({ onNavigate, isNutriScanUnlocked }) {
  const handleRecipeClick = (recipe) => {
    if (recipe.pro && !isNutriScanUnlocked) {
      onNavigate("nutri-scan-intro");
      return;
    }
    onNavigate("recipe-detail", { recipe });
  };
  const categories = [
    { title: "Caf\xE9 da manh\xE3", icon: "\u2615" },
    { title: "Almo\xE7o", icon: "\u{1F372}" },
    { title: "Jantar", icon: "\u{1F35C}" },
    { title: "Sem a\xE7\xFAcar", icon: "\u{1F964}" },
    { title: "Poucas calorias", icon: "\u2696\uFE0F" },
    { title: "Vegetariana", icon: "\u{1F966}" },
    { title: "Lanche", icon: "\u{1F9C1}" },
    { title: "Salada", icon: "\u{1F957}" },
    { title: "Sopa", icon: "\u{1F963}" }
  ];
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col h-screen max-w-md mx-auto bg-[#F9F9F9] relative font-sans overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "px-6 pt-10 pb-4 shrink-0 bg-[#F9F9F9] z-10 flex justify-between items-center" }, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-extrabold tracking-tight text-black" }, "Alimentos"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-4" }, /* @__PURE__ */ React.createElement("button", { className: "text-black" }, /* @__PURE__ */ React.createElement(Heart, { className: "w-6 h-6" })), /* @__PURE__ */ React.createElement("button", { className: "text-black" }, /* @__PURE__ */ React.createElement(Filter, { className: "w-6 h-6" })), /* @__PURE__ */ React.createElement("button", { className: "text-black" }, /* @__PURE__ */ React.createElement(Search, { className: "w-6 h-6" })))), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto px-6 pb-28 space-y-8 hide-scrollbar relative z-0" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-lg font-extrabold text-gray-500 mb-4 flex items-center gap-2" }, "Livre para experimentar ", /* @__PURE__ */ React.createElement(Lock, { className: "w-4 h-4" })), /* @__PURE__ */ React.createElement("div", { className: "flex gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-4 snap-x" }, recipesData.free.map((item, idx) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: idx,
      onClick: () => handleRecipeClick(item),
      className: "shrink-0 w-44 bg-white rounded-3xl overflow-hidden shadow-sm snap-start cursor-pointer hover:shadow-md transition-all relative"
    },
    /* @__PURE__ */ React.createElement("div", { className: "absolute top-3 right-3 z-20" }, /* @__PURE__ */ React.createElement(Heart, { className: "w-5 h-5 text-black" })),
    /* @__PURE__ */ React.createElement("div", { className: "h-44 w-full relative" }, /* @__PURE__ */ React.createElement("img", { src: item.img, alt: item.title, className: "w-full h-full object-cover" })),
    /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-white relative -mt-4 rounded-t-3xl" }, /* @__PURE__ */ React.createElement("h3", { className: "font-extrabold text-black text-[15px] leading-tight mb-2 line-clamp-2" }, item.title), /* @__PURE__ */ React.createElement("div", { className: "flex items-center text-gray-400 text-xs font-bold gap-2" }, /* @__PURE__ */ React.createElement("span", null, "\u23F1 ", item.time), /* @__PURE__ */ React.createElement("span", null, "\u{1F525} ", item.cal)))
  )))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-lg font-extrabold text-gray-500 mb-4 flex items-center gap-2" }, "Principais categorias \u2B50"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-3" }, categories.map((cat, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, className: "bg-white rounded-2xl p-3 flex flex-col items-center justify-center gap-2 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors" }, /* @__PURE__ */ React.createElement("span", { className: "text-2xl" }, cat.icon), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold text-black text-center leading-tight" }, cat.title))))), /* @__PURE__ */ React.createElement(
    "div",
    {
      onClick: () => onNavigate("nutri-scan-intro"),
      className: "bg-[#b3ff3b] rounded-3xl p-5 relative overflow-hidden flex shadow-sm cursor-pointer hover:shadow-md transition-shadow"
    },
    /* @__PURE__ */ React.createElement("div", { className: "w-2/3 relative z-10 pr-2" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-extrabold text-black leading-tight mb-1" }, "Tire uma foto da sua refei\xE7\xE3o para insights instant\xE2neos")),
    /* @__PURE__ */ React.createElement("div", { className: "absolute -right-2 top-1/2 -translate-y-1/2 w-28 h-28 opacity-90" }, /* @__PURE__ */ React.createElement("div", { className: "w-full h-full bg-white rounded-full p-1.5 shadow-sm" }, /* @__PURE__ */ React.createElement("img", { src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=200&auto=format&fit=crop", className: "w-full h-full rounded-full object-cover", alt: "Salad" })), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 border-[3px] border-green-600 rounded-lg scale-90 opacity-40" }))
  ), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-lg font-extrabold text-gray-500 mb-4 flex items-center gap-2" }, "Descubra com ", /* @__PURE__ */ React.createElement("span", { className: "bg-white text-black px-2 py-0.5 rounded shadow-sm text-sm ml-1 flex items-center gap-1" }, /* @__PURE__ */ React.createElement("span", { className: "text-gray-400 text-xs" }, "\u27F3"), " AI Fitify")), /* @__PURE__ */ React.createElement(
    "div",
    {
      onClick: () => onNavigate("nutri-scan-intro"),
      className: "bg-white rounded-3xl overflow-hidden shadow-sm cursor-pointer"
    },
    /* @__PURE__ */ React.createElement("div", { className: "h-40 bg-gradient-to-br from-green-100 to-green-300 relative flex items-center justify-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-6xl" }, "\u23F1\u{1F957}\u{1F3CB}\uFE0F"), /* @__PURE__ */ React.createElement("div", { className: "absolute top-3 left-3 bg-white/50 backdrop-blur rounded-full w-6 h-6 flex items-center justify-center text-xs text-gray-600" }, "\u27F3")),
    /* @__PURE__ */ React.createElement("div", { className: "p-6 text-center" }, /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-extrabold text-black leading-tight mb-2" }, "Quando treinar durante o jejum"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-400 font-semibold text-sm mb-4" }, "Otimize seus resultados"), /* @__PURE__ */ React.createElement("button", { className: "bg-gray-100 text-black font-extrabold px-6 py-2 rounded-full text-sm" }, "Pergunte \xE0 AI Fitify"))
  )), recipesData.sections.map((section, idx) => /* @__PURE__ */ React.createElement("div", { key: idx }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-4" }, /* @__PURE__ */ React.createElement("h2", { className: "text-lg font-extrabold text-gray-500 flex items-center gap-2" }, section.title, " ", /* @__PURE__ */ React.createElement("span", null, section.icon)), /* @__PURE__ */ React.createElement("button", { className: "text-black font-extrabold text-sm flex items-center" }, "Mais ", /* @__PURE__ */ React.createElement(ChevronRight, { className: "w-4 h-4 ml-1" }))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-4 snap-x" }, section.items.map((item, itemIdx) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: itemIdx,
      onClick: () => handleRecipeClick(item),
      className: "shrink-0 w-44 bg-white rounded-3xl overflow-hidden shadow-sm snap-start cursor-pointer group hover:shadow-md transition-all relative"
    },
    /* @__PURE__ */ React.createElement("div", { className: "absolute top-3 right-3 z-20" }, /* @__PURE__ */ React.createElement(Heart, { className: "w-5 h-5 text-black" })),
    /* @__PURE__ */ React.createElement("div", { className: "h-44 w-full relative" }, /* @__PURE__ */ React.createElement("img", { src: item.img, alt: item.title, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" }), item.pro && /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-3 left-3 bg-[#b3ff3b] text-black text-[10px] font-extrabold px-2 py-1 rounded flex items-center gap-1 shadow-sm z-20" }, /* @__PURE__ */ React.createElement(Lock, { className: "w-3 h-3" }), " Pro")),
    /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-white relative -mt-4 rounded-t-3xl" }, /* @__PURE__ */ React.createElement("h3", { className: "font-extrabold text-black text-[15px] leading-tight mb-2 line-clamp-2 pr-6" }, item.title), /* @__PURE__ */ React.createElement("div", { className: "flex items-center text-gray-400 text-xs font-bold gap-2" }, /* @__PURE__ */ React.createElement("span", null, "\u23F1 ", item.time), /* @__PURE__ */ React.createElement("span", null, "\u{1F525} ", item.cal)), item.warning && /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-4 right-4 text-orange-500 bg-orange-100 rounded-full w-6 h-6 flex items-center justify-center" }, /* @__PURE__ */ React.createElement(AlertTriangle, { className: "w-4 h-4" })))
  )))))), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-6 left-6 right-6 bg-white rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] flex justify-between px-6 py-4 z-50" }, /* @__PURE__ */ React.createElement("button", { onClick: () => onNavigate("home"), className: "flex flex-col items-center gap-1 group hover:-translate-y-1 transition-transform" }, /* @__PURE__ */ React.createElement(Calendar, { className: "w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" }), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold text-gray-400 group-hover:text-gray-900 transition-colors" }, "Meu plano")), /* @__PURE__ */ React.createElement("button", { onClick: () => onNavigate("workouts"), className: "flex flex-col items-center gap-1 group hover:-translate-y-1 transition-transform" }, /* @__PURE__ */ React.createElement(LayoutDashboard, { className: "w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" }), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold text-gray-400 group-hover:text-gray-900 transition-colors" }, "Treinos")), /* @__PURE__ */ React.createElement("button", { className: "flex flex-col items-center gap-1 group relative" }, /* @__PURE__ */ React.createElement("div", { className: "absolute -top-3 w-1.5 h-1.5 bg-blue-500 rounded-full scale-100 transition-transform" }), /* @__PURE__ */ React.createElement(Utensils, { className: "w-6 h-6 text-blue-500" }), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-extrabold text-blue-500" }, "Alimentos")), /* @__PURE__ */ React.createElement("button", { className: "flex flex-col items-center gap-1 group hover:-translate-y-1 transition-transform" }, /* @__PURE__ */ React.createElement(Flower2, { className: "w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" }), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold text-gray-400 group-hover:text-gray-900 transition-colors" }, "Mente")), /* @__PURE__ */ React.createElement("button", { className: "flex flex-col items-center gap-1 group hover:-translate-y-1 transition-transform" }, /* @__PURE__ */ React.createElement(User, { className: "w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" }), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold text-gray-400 group-hover:text-gray-900 transition-colors" }, "Perfil"))), /* @__PURE__ */ React.createElement("style", null, `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `));
}
