import React from "react";
import { Activity, TrendingUp, Trophy, Home } from "lucide-react";
import { SetRecord, Exercise } from "../types";

import ProgressChart from "./ProgressChart";

type Props = {
  sessionSets: SetRecord[];
  allSets: SetRecord[];
  exercises: Exercise[];
  onStartNew: () => void;
};

export default function WorkoutSummary({ sessionSets, allSets, exercises, onStartNew }: Props) {
  const validSets = sessionSets.filter(s => s.type !== "warmup");
  const totalVolume = validSets.reduce((total, s) => total + s.weight * s.reps, 0);
  const prsCount = sessionSets.filter(s => s.isPR).length;

  const getExerciseName = (id: string) => {
    return exercises.find(e => e.id === id)?.name || "Unknown Exercise";
  };

  // Group session sets by exercise
  const setsByExercise = sessionSets.reduce((acc, set) => {
    if (!acc[set.exerciseId]) acc[set.exerciseId] = [];
    acc[set.exerciseId].push(set);
    return acc;
  }, {} as Record<string, SetRecord[]>);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center py-6">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Workout Complete!</h2>
        <p className="text-gray-500 font-medium">Great job. Here's a summary of your session.</p>
      </div>

      <section className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Activity size={18} />
            <h2 className="text-sm font-bold">Total Volume</h2>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-gray-900 tracking-tighter">{totalVolume}</span>
            <span className="text-gray-400 font-medium mb-1">kg</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <TrendingUp size={18} />
            <h2 className="text-sm font-bold">Sets Completed</h2>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-blue-600 tracking-tighter">{validSets.length}</span>
            <span className="text-gray-400 font-medium mb-1">sets</span>
          </div>
        </div>
        {prsCount > 0 && (
          <div className="col-span-2 bg-yellow-50 border border-yellow-200 rounded-3xl p-5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
                <Trophy size={24} />
              </div>
              <div>
                <h3 className="font-bold text-yellow-900 text-lg tracking-tight">New Records Broken!</h3>
                <p className="text-yellow-700 text-sm font-medium">You achieved {prsCount} new PRs this session.</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* History Summary */}
      {/* History Summary */}
      <section className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">Session Breakdown</h3>
        {Object.entries(setsByExercise).length === 0 ? (
          <p className="text-gray-400 text-center py-4 font-medium">No exercises logged.</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(setsByExercise).map(([exerciseId, exerciseSets]) => (
              <div key={exerciseId}>
                <h4 className="text-blue-600 font-bold mb-2">{getExerciseName(exerciseId)}</h4>
                <div className="space-y-2">
                  {[...exerciseSets].reverse().map((set, i) => (
                    <div key={set.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 font-bold text-xs">Set {i + 1}</span>
                        <span className="text-gray-900 text-sm font-bold">{set.weight}kg × {set.reps}</span>
                      </div>
                      <div className="flex gap-2">
                        {set.isPR && <Trophy size={14} className="text-yellow-500" />}
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-white border border-gray-200 px-1.5 py-0.5 rounded-md">{set.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Progress Chart showing overall volume progress */}
      <div className="mt-8">
        <ProgressChart sets={allSets} />
      </div>

      <button 
        onClick={onStartNew}
        className="w-full bg-blue-500 text-white font-bold text-lg py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-600 active:scale-95 transition-all shadow-md shadow-blue-500/20 mt-8"
      >
        <Home size={24} strokeWidth={2.5} />
        HOME
      </button>
    </div>
  );
}
