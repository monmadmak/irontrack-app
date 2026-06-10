import React from "react";
import { History, Trash2, Edit2, Trophy } from "lucide-react";
import { SetRecord, Exercise } from "../types";

type Props = {
  sets: SetRecord[];
  exercises: Exercise[];
  onDelete: (id: string) => void;
  onEdit: (set: SetRecord) => void;
};

export default function HistoryList({ sets, exercises, onDelete, onEdit }: Props) {
  const getExerciseName = (id: string) => {
    return exercises.find((e) => e.id === id)?.name || "Unknown Exercise";
  };

  const getSetTypeColor = (type: string) => {
    switch (type) {
      case "warmup": return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      case "drop": return "text-purple-400 bg-purple-400/10 border-purple-400/20";
      default: return "text-neutral-400 bg-neutral-800 border-neutral-700";
    }
  };

  return (
    <section className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 text-neutral-400 mb-4">
        <History size={18} />
        <h2 className="font-medium text-white">Today's Sets</h2>
      </div>
      
      {sets.length === 0 ? (
        <div className="text-center py-8 text-neutral-600 font-medium">
          No sets logged yet. Let's get to work!
        </div>
      ) : (
        <div className="space-y-3">
          {sets.map((set, index) => (
            <div key={set.id} className="flex flex-col gap-2 bg-neutral-900 p-4 rounded-xl border border-neutral-800/50">
              
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-[#deff9a]">
                  {getExerciseName(set.exerciseId)}
                </div>
                {set.isPR && (
                  <div className="flex items-center gap-1 text-xs font-bold bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/30">
                    <Trophy size={12} />
                    NEW PR
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-neutral-500 font-mono font-medium text-sm">
                    #{sets.length - index}
                  </span>
                  <span className="font-bold text-white text-lg">
                    {set.weight} <span className="text-neutral-500 text-sm font-normal">kg</span>
                  </span>
                  <span className="text-neutral-600">×</span>
                  <span className="font-bold text-white text-lg">
                    {set.reps} <span className="text-neutral-500 text-sm font-normal">reps</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`text-xs px-2 py-1 rounded border capitalize ${getSetTypeColor(set.type)}`}>
                    {set.type}
                  </div>
                  
                  <button 
                    onClick={() => onEdit(set)}
                    className="text-neutral-500 hover:text-white p-1 transition"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => onDelete(set.id)}
                    className="text-neutral-500 hover:text-red-400 p-1 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
