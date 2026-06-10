import React, { useState } from "react";
import { Play, Plus, Dumbbell, ClipboardList, Edit2 } from "lucide-react";
import ProgressChart from "./ProgressChart";
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
          className="w-full bg-[#deff9a] text-black font-bold text-lg py-5 rounded-3xl flex flex-col items-center justify-center gap-1 hover:bg-[#cbf078] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(222,255,154,0.15)]"
        >
          <div className="flex items-center gap-2">
            <Play size={24} fill="currentColor" />
            START EMPTY WORKOUT
          </div>
          <span className="text-xs font-medium text-black/60">For advanced users who freestyle</span>
        </button>
      </section>

      {/* Templates */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ClipboardList size={20} className="text-[#deff9a]" />
            Your Routines
            <InfoTooltip text="Routines are pre-made lists of exercises. Choose one below or create your own!" />
          </h2>
          <button
            onClick={onOpenCreateTemplate}
            className="text-sm font-medium text-neutral-400 hover:text-white transition"
          >
            + Create
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#deff9a]">
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <select value={filterGoal} onChange={(e) => setFilterGoal(e.target.value)} className="bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#deff9a]">
            <option value="">All Goals</option>
            <option value="gain muscle">Gain Muscle</option>
            <option value="strength">Strength</option>
            <option value="lose weight">Lose Weight</option>
          </select>
          <select value={filterEquipment} onChange={(e) => setFilterEquipment(e.target.value)} className="bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#deff9a]">
            <option value="">All Equipment</option>
            <option value="gym">Gym</option>
            <option value="dumbbells">Dumbbells</option>
            <option value="none">None</option>
          </select>
          {(filterLevel || filterGoal || filterEquipment) && (
            <button onClick={() => { setFilterLevel(""); setFilterGoal(""); setFilterEquipment(""); }} className="text-xs text-red-400 hover:text-red-300 px-2">Clear</button>
          )}
        </div>

        {templates.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6 text-center border-dashed">
            <div className="bg-neutral-800/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <ClipboardList className="text-neutral-500" />
            </div>
            <p className="text-white font-bold mb-1">No routines found</p>
            <p className="text-neutral-500 mb-4 text-sm">Create a routine to follow a structured plan.</p>
            <button
              onClick={onOpenCreateTemplate}
              className="text-sm bg-neutral-800 text-white px-4 py-2 rounded-lg hover:bg-neutral-700 transition"
            >
              + Create Routine
            </button>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6 text-center">
            <p className="text-neutral-500">No routines match your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-[#1a1a1a] border border-neutral-800 p-4 rounded-2xl transition group relative"
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => onViewTemplate(tpl)}
                >
                  <div className="mb-2">
                    <h3 className="font-bold text-white text-lg leading-tight">{tpl.name}</h3>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {tpl.level && <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded capitalize">{tpl.level}</span>}
                      {tpl.goal && <span className="text-[10px] px-1.5 py-0.5 bg-green-500/10 text-green-400 rounded capitalize">{tpl.goal}</span>}
                      {tpl.equipment && <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/10 text-purple-400 rounded capitalize">{tpl.equipment}</span>}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    {tpl.exerciseIds.length} exercises
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Progress Chart */}
      <ProgressChart sets={sets} />

      {/* Manage Data */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Dumbbell size={20} className="text-[#deff9a]" />
          Exercises
        </h2>
        <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-white font-medium">{exercises.length} Exercises Available</p>
            <p className="text-xs text-neutral-500">Add custom movements to your library</p>
          </div>
          <button
            onClick={onOpenCreateExercise}
            className="bg-neutral-800 text-white p-2 rounded-xl hover:bg-neutral-700 transition"
          >
            <Plus size={20} />
          </button>
        </div>
      </section>
    </div>
  );
}
