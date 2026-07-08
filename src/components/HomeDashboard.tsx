import React, { useState } from "react";
import { Play, Plus, Dumbbell, ClipboardList, Edit2, Flame, Award } from "lucide-react";
import InfoTooltip from "./InfoTooltip";
import { SetRecord, Exercise, WorkoutTemplate } from "../types";

type Props = {
  sets: SetRecord[];
  exercises: Exercise[];
  templates: WorkoutTemplate[];
  onStartEmptySession: () => void;
  onOpenCreateExercise: () => void;
  onOpenCreateTemplate: () => void;
  onViewTemplate: (template: WorkoutTemplate) => void;
};

export default function HomeDashboard({
  sets,
  exercises,
  templates,
  onStartEmptySession,
  onOpenCreateExercise,
  onOpenCreateTemplate,
  onViewTemplate,
}: Props) {
  const [filterLevel, setFilterLevel] = useState<string>("");
  const [filterGoal, setFilterGoal] = useState<string>("");
  const [filterEquipment, setFilterEquipment] = useState<string>("");

  const filteredTemplates = templates.filter(t => {
    if (filterLevel && t.level !== filterLevel) return false;
    if (filterGoal && t.goal !== filterGoal) return false;
    if (filterEquipment && t.equipment !== filterEquipment) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Quick Start Action */}
      <section>
        <button
          onClick={onStartEmptySession}
          className="w-full bg-blue-500 text-white font-bold text-lg py-5 rounded-2xl flex flex-col items-center justify-center gap-1 hover:bg-blue-600 active:scale-95 transition-all shadow-md shadow-blue-500/20 group"
        >
          <div className="flex items-center gap-2">
            <Play size={24} fill="currentColor" />
            START WORKOUT
          </div>
          <span className="text-xs font-medium text-white/80">Empty session</span>
        </button>
      </section>

      {/* Templates */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="bg-gray-100 p-2 rounded-xl text-gray-500">
              <ClipboardList size={20} />
            </div>
            Your Routines
          </h2>
          <button
            onClick={onOpenCreateTemplate}
            className="text-sm font-bold text-blue-500 hover:text-blue-700 transition-colors"
          >
            + Create
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-500 shadow-sm">
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <select value={filterGoal} onChange={(e) => setFilterGoal(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-500 shadow-sm">
            <option value="">All Goals</option>
            <option value="gain muscle">Gain Muscle</option>
            <option value="strength">Strength</option>
            <option value="lose weight">Lose Weight</option>
          </select>
          <select value={filterEquipment} onChange={(e) => setFilterEquipment(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-500 shadow-sm">
            <option value="">All Equipment</option>
            <option value="gym">Gym</option>
            <option value="dumbbells">Dumbbells</option>
            <option value="none">None</option>
          </select>
          {(filterLevel || filterGoal || filterEquipment) && (
            <button onClick={() => { setFilterLevel(""); setFilterGoal(""); setFilterEquipment(""); }} className="text-xs text-gray-400 hover:text-gray-600 px-2 font-medium">Clear</button>
          )}
        </div>

        {templates.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
            <div className="bg-gray-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <ClipboardList className="text-gray-400" />
            </div>
            <p className="text-gray-900 font-bold text-lg mb-1 tracking-tight">No routines found</p>
            <p className="text-gray-500 mb-5 text-sm">Create a routine to follow a structured plan.</p>
            <button
              onClick={onOpenCreateTemplate}
              className="text-sm font-bold bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl hover:bg-blue-100 transition-colors"
            >
              + Create Routine
            </button>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm">
            <p className="text-gray-500">No routines match your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-white border border-gray-100 p-5 rounded-2xl transition-all active:scale-95 shadow-sm hover:shadow-md cursor-pointer"
              >
                <div onClick={() => onViewTemplate(tpl)}>
                  <div className="mb-3">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{tpl.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tpl.level && <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-lg capitalize">{tpl.level}</span>}
                      {tpl.goal && <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-lg capitalize">{tpl.goal}</span>}
                      {tpl.equipment && <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-lg capitalize">{tpl.equipment}</span>}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-500 mt-2 flex items-center gap-1.5">
                    <Dumbbell size={14} /> {tpl.exerciseIds.length} exercises
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Gamification Widget */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
          <div className="bg-orange-50 text-orange-500 w-12 h-12 rounded-full flex items-center justify-center mb-2">
            <Flame size={24} fill="currentColor" />
          </div>
          <p className="text-gray-900 font-bold text-xl leading-tight">3 Days</p>
          <p className="text-gray-500 text-xs font-medium mt-0.5">Current Streak</p>
        </div>
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
          <div className="bg-yellow-50 text-yellow-500 w-12 h-12 rounded-full flex items-center justify-center mb-2">
            <Award size={24} />
          </div>
          <p className="text-gray-900 font-bold text-xl leading-tight">Beginner</p>
          <p className="text-gray-500 text-xs font-medium mt-0.5">Current Level</p>
        </div>
      </section>

      {/* Manage Data */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="bg-gray-100 p-2 rounded-xl text-gray-500">
            <Dumbbell size={20} />
          </div>
          Exercises
        </h2>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-gray-900 font-bold text-lg tracking-tight">{exercises.length} Exercises Available</p>
            <p className="text-sm text-gray-500 mt-0.5">Add custom movements</p>
          </div>
          <button
            onClick={onOpenCreateExercise}
            className="bg-gray-50 border border-gray-200 text-gray-700 p-3 rounded-xl hover:bg-gray-100 active:scale-95 transition-all"
          >
            <Plus size={20} />
          </button>
        </div>
      </section>
    </div>
  );
}
