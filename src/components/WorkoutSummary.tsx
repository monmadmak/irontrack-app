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
        <h2 className="text-3xl font-bold text-white mb-2">Workout Complete!</h2>
        <p className="text-neutral-400">Great job. Here's a summary of your session.</p>
      </div>

      <section className="grid grid-cols-2 gap-4">
        <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-neutral-400 mb-2">
            <Activity size={18} />
            <h2 className="text-sm font-medium">Total Volume</h2>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-white">{totalVolume}</span>
            <span className="text-neutral-500 mb-1">kg</span>
          </div>
        </div>
        <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-neutral-400 mb-2">
            <TrendingUp size={18} />
            <h2 className="text-sm font-medium">Sets Completed</h2>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-[#deff9a]">{validSets.length}</span>
            <span className="text-neutral-500 mb-1">sets</span>
          </div>
        </div>
        {prsCount > 0 && (
          <div className="col-span-2 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-500/20 rounded-full text-yellow-500">
                <Trophy size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">New Records Broken!</h3>
                <p className="text-yellow-500/80 text-sm">You achieved {prsCount} new PRs this session.</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* History Summary */}
      <section className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-5">
        <h3 className="text-lg font-bold text-white mb-4">Session Breakdown</h3>
        {Object.entries(setsByExercise).length === 0 ? (
          <p className="text-neutral-500 text-center py-4">No exercises logged.</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(setsByExercise).map(([exerciseId, exerciseSets]) => (
              <div key={exerciseId}>
                <h4 className="text-[#deff9a] font-medium mb-2">{getExerciseName(exerciseId)}</h4>
                <div className="space-y-2">
                  {exerciseSets.map((set, i) => (
                    <div key={set.id} className="flex items-center justify-between bg-neutral-900 px-3 py-2 rounded-lg border border-neutral-800">
                      <div className="flex items-center gap-3">
                        <span className="text-neutral-500 font-mono text-xs">Set {exerciseSets.length - i}</span>
                        <span className="text-white text-sm font-medium">{set.weight}kg × {set.reps}</span>
                      </div>
                      <div className="flex gap-2">
                        {set.isPR && <Trophy size={14} className="text-yellow-500" />}
                        <span className="text-[10px] uppercase text-neutral-500 border border-neutral-700 px-1 rounded">{set.type}</span>
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
        className="w-full bg-[#deff9a] text-black font-bold text-lg py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#cbf078] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(222,255,154,0.15)] mt-8"
      >
        <Home size={24} strokeWidth={2.5} />
        HOME
      </button>
    </div>
  );
}
