import React, { useState, useEffect } from "react";
import { ChevronLeft, CheckCircle2, Dumbbell, Flame, Trophy } from "lucide-react";
import { exerciseDB, pickRandom } from "../data/exerciseDB";
export default function ActivePlan({ onNavigate, planData }) {
  const { title = "Meu Plano PRO", duration = "12 semanas", workoutsPerWeek = 4, goal = "Ganhar M\xFAsculo" } = planData || {};
  const totalWeeks = parseInt(duration.split(" ")[0]) || 12;
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState(null);
  const [weekSchedule, setWeekSchedule] = useState([]);
  useEffect(() => {
    generateWeekSchedule(workoutsPerWeek);
  }, [selectedWeek, workoutsPerWeek]);
  const generateWeekSchedule = (freq) => {
    const days = [];
    let workoutDays = [];
    if (freq === 3) workoutDays = [1, 3, 5];
    else if (freq === 4) workoutDays = [1, 2, 4, 5];
    else if (freq === 5) workoutDays = [1, 2, 3, 5, 6];
    else workoutDays = [1, 3, 5];
    const splits = [
      { name: "Peito e Tricep", muscles: ["peito", "tricep"] },
      { name: "Costas e Bicep", muscles: ["costas", "bicep"] },
      { name: "Pernas", muscles: ["pernas"] },
      { name: "Ombros e ABS", muscles: ["ombros", "abs"] },
      { name: "Full Body", muscles: ["peito", "costas", "pernas"] }
    ];
    let workoutCount = 0;
    for (let i = 1; i <= 7; i++) {
      if (workoutDays.includes(i)) {
        const split = splits[workoutCount % splits.length];
        let exercises = [];
        split.muscles.forEach((muscle) => {
          const dbKey = muscle;
          if (exerciseDB[dbKey]) {
            const picked = pickRandom(exerciseDB[dbKey], 2);
            exercises = [...exercises, ...picked];
          }
        });
        const cardio = pickRandom(exerciseDB["cardio"], 1);
        exercises = [...exercises, ...cardio];
        days.push({
          dayNum: i,
          type: "workout",
          title: split.name,
          exercises,
          completed: false
        });
        workoutCount++;
      } else {
        days.push({
          dayNum: i,
          type: "rest",
          title: "Dia de Descanso",
          completed: false
        });
      }
    }
    setWeekSchedule(days);
    setSelectedDay(null);
  };
  const handleDayClick = (dayIdx) => {
    if (selectedDay === dayIdx) {
      setSelectedDay(null);
    } else {
      setSelectedDay(dayIdx);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col h-screen max-w-md mx-auto bg-[#F9F9F9] relative font-sans" }, /* @__PURE__ */ React.createElement("div", { className: "px-6 pt-10 pb-6 shrink-0 bg-white z-10 shadow-sm rounded-b-[32px]" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center mb-6" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => onNavigate("home"),
      className: "w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shadow-sm"
    },
    /* @__PURE__ */ React.createElement(ChevronLeft, { className: "w-6 h-6 text-black" })
  ), /* @__PURE__ */ React.createElement("h1", { className: "text-xl font-extrabold tracking-tight text-black ml-4 flex-1 truncate" }, title)), /* @__PURE__ */ React.createElement("div", { className: "flex gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x" }, Array.from({ length: totalWeeks }).map((_, idx) => {
    const weekNum = idx + 1;
    const isSelected = selectedWeek === weekNum;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: weekNum,
        onClick: () => setSelectedWeek(weekNum),
        className: `shrink-0 snap-start px-5 py-3 rounded-2xl font-extrabold text-sm transition-all shadow-sm border-2 ${isSelected ? "bg-black text-white border-black" : "bg-white text-gray-400 border-gray-100 hover:border-gray-300"}`
      },
      "Semana ",
      weekNum
    );
  }))), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto px-6 py-6 hide-scrollbar" }, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-extrabold text-black mb-6 flex items-center gap-2" }, "A tua Rotina ", /* @__PURE__ */ React.createElement("span", { className: "text-[#84D82C]" }, "Semana ", selectedWeek)), /* @__PURE__ */ React.createElement("div", { className: "space-y-4 pb-12" }, weekSchedule.map((day, idx) => {
    const isWorkout = day.type === "workout";
    const isSelected = selectedDay === idx;
    return /* @__PURE__ */ React.createElement("div", { key: idx, className: `bg-white rounded-3xl overflow-hidden shadow-sm transition-all duration-300 border-2 ${isSelected ? "border-black" : "border-transparent"}` }, /* @__PURE__ */ React.createElement(
      "div",
      {
        onClick: () => handleDayClick(idx),
        className: "p-5 flex items-center cursor-pointer"
      },
      /* @__PURE__ */ React.createElement("div", { className: `w-12 h-12 rounded-2xl flex flex-col items-center justify-center mr-4 shrink-0 shadow-sm ${isWorkout ? "bg-[#b3ff3b]" : "bg-gray-100"}` }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold text-gray-600" }, "DIA"), /* @__PURE__ */ React.createElement("span", { className: "text-lg font-extrabold text-black leading-none" }, day.dayNum)),
      /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement("h3", { className: "font-extrabold text-black text-[17px]" }, day.title), isWorkout ? /* @__PURE__ */ React.createElement("p", { className: "text-xs font-bold text-gray-400 flex items-center gap-1 mt-1" }, /* @__PURE__ */ React.createElement(Dumbbell, { className: "w-3 h-3" }), " Treino \u2022 ", day.exercises.length, " Exs") : /* @__PURE__ */ React.createElement("p", { className: "text-xs font-bold text-gray-400 flex items-center gap-1 mt-1" }, /* @__PURE__ */ React.createElement(CheckCircle2, { className: "w-3 h-3 text-green-500" }), " Recupera\xE7\xE3o"))
    ), isSelected && isWorkout && /* @__PURE__ */ React.createElement("div", { className: "px-5 pb-5 pt-2 border-t border-gray-50 bg-gray-50/50" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-3 mt-3" }, day.exercises.map((ex, exIdx) => /* @__PURE__ */ React.createElement("div", { key: exIdx, className: "bg-white p-3 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-100" }, /* @__PURE__ */ React.createElement("img", { src: ex.img, alt: ex.name, className: "w-16 h-16 rounded-xl object-cover" }), /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement("h4", { className: "font-extrabold text-black text-[13px] leading-tight mb-1" }, ex.name), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold" }, ex.sets, " S\xE9ries"), /* @__PURE__ */ React.createElement("span", { className: "bg-[#b3ff3b]/30 text-black px-2 py-0.5 rounded text-[10px] font-extrabold" }, ex.reps, " Reps")))))), /* @__PURE__ */ React.createElement("button", { className: "w-full bg-black text-white font-extrabold py-4 rounded-xl mt-6 flex items-center justify-center gap-2 shadow-sm hover:bg-gray-800 transition-colors" }, /* @__PURE__ */ React.createElement(Flame, { className: "w-5 h-5 text-[#b3ff3b]" }), " Iniciar Treino")), isSelected && !isWorkout && /* @__PURE__ */ React.createElement("div", { className: "px-5 pb-6 pt-2 border-t border-gray-50 bg-gray-50/50 text-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3" }, /* @__PURE__ */ React.createElement(Trophy, { className: "w-8 h-8 text-blue-500" })), /* @__PURE__ */ React.createElement("h4", { className: "font-extrabold text-black mb-1" }, "Os m\xFAsculos crescem no descanso"), /* @__PURE__ */ React.createElement("p", { className: "text-[13px] font-semibold text-gray-500" }, "Mant\xE9m a tua hidrata\xE7\xE3o alta hoje e come prote\xEDnas suficientes para recuperar.")));
  }))), /* @__PURE__ */ React.createElement("style", null, `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `));
}
