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
      case "warmup": return "text-orange-600 bg-orange-100 border-orange-200";
      case "drop": return "text-purple-600 bg-purple-100 border-purple-200";
      default: return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  return (
    <section className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
      <div className="flex items-center gap-2 text-gray-500 mb-4">
        <History size={18} />
        <h2 className="font-bold text-gray-900 tracking-tight">Today's Sets</h2>
      </div>
      
      {sets.length === 0 ? (
        <div className="text-center py-8 text-gray-500 font-medium bg-gray-50 rounded-2xl border border-gray-100">
          No sets logged yet. Let's get to work!
        </div>
      ) : (
        <div className="space-y-3">
          {[...sets].reverse().map((set, index) => (
            <div key={set.id} className="flex flex-col gap-2 bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-gray-300 transition-colors">
              
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-blue-600">
                  {getExerciseName(set.exerciseId)}
                </div>
                {set.isPR && (
                  <div className="flex items-center gap-1 text-xs font-bold bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full border border-yellow-200">
                    <Trophy size={12} />
                    NEW PR
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 font-bold text-sm bg-white w-6 h-6 flex items-center justify-center rounded-md border border-gray-100 shadow-sm">
                    {index + 1}
                  </span>
                  <span className="font-bold text-gray-900 text-lg">
                    {set.weight} <span className="text-gray-400 text-sm font-medium">kg</span>
                  </span>
                  <span className="text-gray-300 font-bold">×</span>
                  <span className="font-bold text-gray-900 text-lg">
                    {set.reps} <span className="text-gray-400 text-sm font-medium">reps</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`text-xs font-bold px-2 py-1 rounded border capitalize ${getSetTypeColor(set.type)}`}>
                    {set.type}
                  </div>
                  
                  <button 
                    onClick={() => onEdit(set)}
                    className="text-gray-400 hover:text-blue-500 p-1 hover:bg-blue-50 rounded-md transition"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => onDelete(set.id)}
                    className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-md transition"
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
