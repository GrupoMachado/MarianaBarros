import React, { useState, useEffect } from "react";
import { ArrowLeft, PlayCircle, ChevronRight, Activity, ChevronLeft, X } from "lucide-react";
import { supabase } from "../supabase";
export default function MuscleGroup({
  onNavigate,
  muscleData
}) {
  const [activeVideo, setActiveVideo] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  useEffect(() => {
    async function fetchExercises() {
      const { data, error } = await supabase.from("exercises").select("*").eq("category", muscleData.title);
      if (data) {
        const sortedData = data.sort((a, b) => a.title.localeCompare(b.title, void 0, { numeric: true, sensitivity: "base" }));
        setExercises(sortedData);
      } else if (error) {
        console.error("Error fetching exercises:", error);
      }
      setLoading(false);
    }
    fetchExercises();
  }, [muscleData.title]);
  const isDirectList = muscleData.id === "peito";
  const subcategories = Array.from(new Set(exercises.map((ex) => ex.target_muscle))).filter(Boolean);
  const displayedVideos = isDirectList ? exercises : exercises.filter((ex) => ex.target_muscle === selectedSubcategory);
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col h-screen max-w-md mx-auto bg-[#F9F9F9] relative font-sans overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "relative w-full h-64 bg-white shrink-0" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => onNavigate("workouts"),
      className: "absolute top-6 left-6 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-black z-20 shadow-sm"
    },
    /* @__PURE__ */ React.createElement(ArrowLeft, { className: "w-5 h-5" })
  ), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-[#F9F9F9] via-transparent to-transparent z-10" }), muscleData?.img ? /* @__PURE__ */ React.createElement("img", { src: muscleData.img, className: "w-full h-full object-cover object-top", alt: muscleData.title }) : /* @__PURE__ */ React.createElement("div", { className: "w-full h-full bg-gray-200" })), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto px-6 pb-12 -mt-4 relative z-20 hide-scrollbar" }, /* @__PURE__ */ React.createElement("h1", { className: "text-4xl font-extrabold text-black mb-3" }, muscleData.title), /* @__PURE__ */ React.createElement("p", { className: "text-gray-500 font-semibold text-sm mb-8 leading-relaxed" }, "Melhore sua for\xE7a e resist\xEAncia. Escolha um exerc\xEDcio de ", muscleData.title.toLowerCase(), " e veja os resultados!"), activeVideo && /* @__PURE__ */ React.createElement("div", { className: "mb-8 rounded-2xl overflow-hidden shadow-lg bg-black relative animate-fade-in" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setActiveVideo(null),
      className: "absolute top-2 right-2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white z-50 shadow-lg"
    },
    /* @__PURE__ */ React.createElement(X, { className: "w-6 h-6" })
  ), /* @__PURE__ */ React.createElement(
    "video",
    {
      src: exercises.find((v) => v.id === activeVideo)?.video_url,
      controls: true,
      autoPlay: true,
      className: "w-full aspect-video object-contain"
    }
  )), loading ? /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center py-10 space-y-3" }, /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" }), /* @__PURE__ */ React.createElement("p", { className: "text-gray-400 font-bold text-sm" }, "A carregar v\xEDdeos...")) : /* @__PURE__ */ React.createElement("div", { className: "mb-6" }, !isDirectList && !selectedSubcategory && /* @__PURE__ */ React.createElement("div", { className: "space-y-3 animate-fade-in" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-extrabold text-black mb-4" }, "Escolha a zona muscular"), subcategories.map((subcat) => {
    const count = exercises.filter((e) => e.target_muscle === subcat).length;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: subcat,
        onClick: () => setSelectedSubcategory(subcat),
        className: "bg-white rounded-2xl p-5 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition-all border border-transparent hover:border-gray-100 group"
      },
      /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center" }, /* @__PURE__ */ React.createElement(Activity, { className: "w-5 h-5 text-black" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-extrabold text-black text-lg" }, subcat), /* @__PURE__ */ React.createElement("p", { className: "text-gray-400 text-xs font-bold" }, count, " v\xEDdeos"))),
      /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors" }, /* @__PURE__ */ React.createElement(ChevronRight, { className: "w-4 h-4" }))
    );
  })), (isDirectList || selectedSubcategory) && /* @__PURE__ */ React.createElement("div", { className: "animate-fade-in" }, !isDirectList && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-6" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setSelectedSubcategory(null);
        setActiveVideo(null);
      },
      className: "w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-black"
    },
    /* @__PURE__ */ React.createElement(ChevronLeft, { className: "w-4 h-4" })
  ), /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-extrabold text-black" }, selectedSubcategory)), isDirectList && /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-extrabold text-black mb-4" }, "Todos os Exerc\xEDcios"), displayedVideos.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "text-gray-400 text-sm font-semibold" }, "Sem v\xEDdeos encontrados nesta categoria.") : /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, displayedVideos.map((video) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: video.id,
      onClick: () => setActiveVideo(video.id),
      className: `bg-white rounded-2xl p-3 flex items-center gap-4 cursor-pointer shadow-sm hover:shadow-md transition-shadow border ${activeVideo === video.id ? "border-black" : "border-transparent hover:border-gray-100"}`
    },
    /* @__PURE__ */ React.createElement("div", { className: "w-20 h-20 rounded-xl overflow-hidden relative shrink-0 bg-gray-100 flex items-center justify-center" }, /* @__PURE__ */ React.createElement(PlayCircle, { className: "w-8 h-8 text-black/40" })),
    /* @__PURE__ */ React.createElement("div", { className: "flex-1 pr-2" }, /* @__PURE__ */ React.createElement("h3", { className: "font-extrabold text-black text-[14px] leading-snug mb-1.5 line-clamp-2" }, video.title), /* @__PURE__ */ React.createElement("span", { className: "bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded" }, video.target_muscle))
  )))))), /* @__PURE__ */ React.createElement("style", null, `
        .hide-scrollbar::-webkit-scrollbar { display: n\xE3one; }
        .hide-scrollbar { -ms-overflow-style: n\xE3one; scrollbar-width: n\xE3one; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `));
}
