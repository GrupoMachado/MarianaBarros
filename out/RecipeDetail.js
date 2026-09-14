import React, { useState } from "react";
import { ArrowLeft, Clock, Flame, ChefHat, Minus, Plus, Heart } from "lucide-react";
export default function RecipeDetail({ onNavigate, recipe }) {
  const [portions, setPortions] = useState(recipe.defaultPortions || 1);
  const [showPortionModal, setShowPortionModal] = useState(false);
  const multiplier = portions / (recipe.defaultPortions || 1);
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col h-screen max-w-md mx-auto bg-[#F9F9F9] relative font-sans overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "relative w-full h-72 bg-white shrink-0 rounded-b-[40px] shadow-sm overflow-hidden" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => onNavigate("nutrition"),
      className: "absolute top-6 left-6 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-black z-20 shadow-sm"
    },
    /* @__PURE__ */ React.createElement(ArrowLeft, { className: "w-5 h-5" })
  ), /* @__PURE__ */ React.createElement("button", { className: "absolute top-6 right-6 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-black z-20 shadow-sm" }, /* @__PURE__ */ React.createElement(Heart, { className: "w-5 h-5" })), /* @__PURE__ */ React.createElement("img", { src: recipe.img, className: "w-full h-full object-cover", alt: recipe.title })), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto px-6 pt-6 pb-28 relative z-20 hide-scrollbar bg-[#F9F9F9]" }, /* @__PURE__ */ React.createElement("h1", { className: "text-2xl font-extrabold text-black mb-6 text-center leading-tight" }, recipe.title), /* @__PURE__ */ React.createElement("div", { className: "flex justify-center gap-8 mb-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center" }, /* @__PURE__ */ React.createElement(Clock, { className: "w-6 h-6 text-blue-500 mb-1" }), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-extrabold text-black" }, recipe.time)), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center" }, /* @__PURE__ */ React.createElement(Flame, { className: "w-6 h-6 text-orange-500 mb-1" }), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-extrabold text-black" }, recipe.cal)), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center" }, /* @__PURE__ */ React.createElement(ChefHat, { className: "w-6 h-6 text-green-500 mb-1" }), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-extrabold text-black" }, recipe.difficulty || "F\xE1cil"))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap justify-center gap-2 mb-8" }, recipe.tags && recipe.tags.map((tag, idx) => /* @__PURE__ */ React.createElement("span", { key: idx, className: "border border-gray-300 text-gray-500 text-[11px] font-bold px-3 py-1.5 rounded-full" }, tag))), /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-extrabold text-black mb-4" }, "Ingredientes"), /* @__PURE__ */ React.createElement(
    "div",
    {
      onClick: () => setShowPortionModal(true),
      className: "bg-white rounded-2xl p-4 flex items-center justify-between mb-4 shadow-sm cursor-pointer"
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center" }, /* @__PURE__ */ React.createElement("span", { className: "text-gray-500 text-lg" }, "\u{1F372}")), /* @__PURE__ */ React.createElement("span", { className: "font-extrabold text-black text-lg" }, portions, " por\xE7\xF5es")),
    /* @__PURE__ */ React.createElement(ChevronRightIcon, null)
  ), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-2xl p-5 shadow-sm mb-8 space-y-4" }, recipe.ingredients && recipe.ingredients.map((ing, idx) => {
    const amount = typeof ing.amount === "number" ? (ing.amount * multiplier).toFixed(ing.amount % 1 === 0 ? 0 : 1).replace(".0", "") : ing.amount;
    return /* @__PURE__ */ React.createElement("div", { key: idx, className: "flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0" }, /* @__PURE__ */ React.createElement("span", { className: "text-black font-extrabold w-1/3" }, amount, " ", ing.unit), /* @__PURE__ */ React.createElement("span", { className: "text-gray-600 font-semibold w-2/3" }, ing.name));
  })), /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-extrabold text-black mb-4" }, "Preparo"), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, recipe.steps && recipe.steps.map((step, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, className: "bg-white rounded-2xl p-5 shadow-sm" }, /* @__PURE__ */ React.createElement("h3", { className: "text-gray-400 font-bold text-sm mb-2" }, "Etapa ", idx + 1), /* @__PURE__ */ React.createElement("p", { className: "text-black font-semibold text-[15px] leading-relaxed" }, step))))), showPortionModal && /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fade-in" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white w-full rounded-t-[32px] p-6 pb-12 flex flex-col relative animate-slide-up" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setShowPortionModal(false),
      className: "absolute top-6 right-6 text-black"
    },
    "\u2715"
  ), /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-extrabold text-black mb-8 text-center" }, "Por\xE7\xF5es"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center gap-8 mb-10" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setPortions(Math.max(1, portions - 1)),
      className: "w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-black active:bg-gray-200 transition-colors"
    },
    /* @__PURE__ */ React.createElement(Minus, { className: "w-8 h-8" })
  ), /* @__PURE__ */ React.createElement("span", { className: "text-5xl font-extrabold text-black w-16 text-center" }, portions), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setPortions(portions + 1),
      className: "w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-black active:bg-gray-200 transition-colors"
    },
    /* @__PURE__ */ React.createElement(Plus, { className: "w-8 h-8" })
  )), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setShowPortionModal(false),
      className: "w-full bg-[#b3ff3b] text-black font-extrabold py-4 rounded-full text-lg shadow-sm"
    },
    "Conclu\xEDdo"
  ))), /* @__PURE__ */ React.createElement("style", null, `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
        .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `));
}
function ChevronRightIcon() {
  return /* @__PURE__ */ React.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "text-gray-400" }, /* @__PURE__ */ React.createElement("polyline", { points: "9 18 15 12 9 6" }));
}
