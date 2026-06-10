import React, { useState } from "react";
import { Plus, Minus, Check, Edit2, Trash2, Trophy } from "lucide-react";
import InfoTooltip from "./InfoTooltip";
import { Exercise, SetType, SetRecord } from "../types";

type Props = {
  exercise: Exercise;
  sets: SetRecord[];
  onSave: (weight: number, reps: number, setType: SetType) => void;
  onUpdateSet: (setId: string, weight: number, reps: number, setType: SetType) => void;
  onDelete: (id: string) => void;
  onRemoveExercise: () => void;
  showTimer?: boolean;
  restTime?: number;
  onAddTime?: (amount: number) => void;
  onSkipTimer?: () => void;
};

export default function ActiveLogger({ 
  exercise, sets, onSave, onUpdateSet, onDelete, onRemoveExercise, 
  showTimer, restTime, onAddTime, onSkipTimer 
}: Props) {
  // Use string states for the main logger to allow clearing
  const [weightStr, setWeightStr] = useState("60");
  const [repsStr, setRepsStr] = useState("8");
  const [setType, setSetType] = useState<SetType>("working");

  const [editingSetId, setEditingSetId] = useState<string | null>(null);
  const [editWeightStr, setEditWeightStr] = useState("");
  const [editRepsStr, setEditRepsStr] = useState("");
  const [editType, setEditType] = useState<SetType>("working");

  const handleSave = () => {
    const w = Number(weightStr);
    const r = Number(repsStr);
    if (!isNaN(w) && !isNaN(r)) {
      onSave(w, r, setType);
    }
  };

  const startEdit = (set: SetRecord) => {
    setEditingSetId(set.id);
    setEditWeightStr(set.weight.toString());
    setEditRepsStr(set.reps.toString());
    setEditType(set.type);
  };

  const saveEdit = (setId: string) => {
    const w = Number(editWeightStr);
    const r = Number(editRepsStr);
    if (!isNaN(w) && !isNaN(r)) {
      onUpdateSet(setId, w, r, editType);
    }
    setEditingSetId(null);
  };

  const getSetTypeColor = (type: string) => {
    switch (type) {
      case "warmup": return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      case "drop": return "text-purple-400 bg-purple-400/10 border-purple-400/20";
      default: return "text-neutral-400 bg-neutral-800 border-neutral-700";
    }
  };

  return (
    <section className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#deff9a] opacity-[0.03] blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white">{exercise.name}</h2>
            <p className="text-sm text-neutral-400 mt-1">{exercise.category}</p>
          </div>
          <button 
            onClick={onRemoveExercise}
            className="text-neutral-500 hover:text-red-400 hover:bg-neutral-800 p-2 rounded-xl transition"
            title="Remove exercise from session"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Input Controls */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Weight Input */}
            <div>
              <label className="flex items-center justify-center gap-1 text-sm font-medium text-neutral-400 mb-2">
                Weight (kg)
                <InfoTooltip text="Enter total weight. Leave as 0 if bodyweight only." />
              </label>
              <div className="flex items-center justify-between bg-neutral-900 rounded-2xl p-1 border border-neutral-800">
                <button 
                  onClick={() => setWeightStr(w => Math.max(0, Number(w) - 2.5).toString())}
                  className="w-10 h-10 flex items-center justify-center bg-neutral-800 rounded-xl hover:bg-neutral-700 active:scale-95 transition"
                >
                  <Minus size={20} className="text-white" />
                </button>
                <input
                  type="number"
                  value={weightStr}
                  onChange={(e) => setWeightStr(e.target.value)}
                  className="w-16 bg-transparent text-center text-3xl font-bold font-mono tracking-tighter text-white focus:outline-none placeholder-neutral-700"
                  placeholder="0"
                />
                <button 
                  onClick={() => setWeightStr(w => (Number(w) + 2.5).toString())}
                  className="w-10 h-10 flex items-center justify-center bg-neutral-800 rounded-xl hover:bg-neutral-700 active:scale-95 transition"
                >
                  <Plus size={20} className="text-white" />
                </button>
              </div>
            </div>

            {/* Reps Input */}
            <div>
              <label className="flex items-center justify-center gap-1 text-sm font-medium text-neutral-400 mb-2">
                Reps
                <InfoTooltip text="Number of times you performed the movement in a row." />
              </label>
              <div className="flex items-center justify-between bg-neutral-900 rounded-2xl p-1 border border-neutral-800">
                <button 
                  onClick={() => setRepsStr(r => Math.max(0, Number(r) - 1).toString())}
                  className="w-10 h-10 flex items-center justify-center bg-neutral-800 rounded-xl hover:bg-neutral-700 active:scale-95 transition"
                >
                  <Minus size={20} className="text-white" />
                </button>
                <input
                  type="number"
                  value={repsStr}
                  onChange={(e) => setRepsStr(e.target.value)}
                  className="w-16 bg-transparent text-center text-3xl font-bold font-mono tracking-tighter text-white focus:outline-none placeholder-neutral-700"
                  placeholder="0"
                />
                <button 
                  onClick={() => setRepsStr(r => (Number(r) + 1).toString())}
                  className="w-10 h-10 flex items-center justify-center bg-neutral-800 rounded-xl hover:bg-neutral-700 active:scale-95 transition"
                >
                  <Plus size={20} className="text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Set Type Selector */}
          <div className="relative">
            <div className="absolute -top-7 right-0 text-xs text-neutral-500 flex items-center">
              Set Type <InfoTooltip text="Warmup: Light weight to prep. Working: Main heavy sets. Drop: Lower weight done right after failure." />
            </div>
            <div className="flex p-1 bg-neutral-900 rounded-xl border border-neutral-800">
              {(["warmup", "working", "drop"] as SetType[]).map((t) => (
              <button
                key={t}
                onClick={() => setSetType(t)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition ${
                  setType === t 
                    ? "bg-neutral-800 text-white shadow-sm" 
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                {t}
              </button>
            ))}
            </div>
          </div>

          {/* Save Button */}
          <button 
            onClick={handleSave}
            className="w-full bg-[#deff9a] text-black font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#cbf078] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(222,255,154,0.15)]"
          >
            <Check size={24} strokeWidth={3} />
            LOG SET
          </button>

          {/* Rest Timer */}
          {showTimer && restTime !== undefined && (
            <div className="bg-[#deff9a]/10 border border-[#deff9a]/20 rounded-xl p-4 flex items-center justify-between animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-10 h-10">
                  <svg className="w-10 h-10 transform -rotate-90">
                    <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(222,255,154,0.2)" strokeWidth="4" />
                    <circle cx="20" cy="20" r="18" fill="none" stroke="#deff9a" strokeWidth="4" strokeDasharray="113" strokeDashoffset={113 - (restTime / (exercise.defaultRestTime || 60)) * 113} className="transition-all duration-1000 ease-linear" />
                  </svg>
                  <span className="absolute text-xs font-bold text-[#deff9a]">
                    {Math.floor(restTime / 60)}:{(restTime % 60).toString().padStart(2, "0")}
                  </span>
                </div>
                <div className="text-sm font-bold text-[#deff9a]">Resting</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onAddTime?.(30)} className="text-xs bg-[#deff9a]/10 text-[#deff9a] hover:bg-[#deff9a]/20 px-3 py-2 rounded-lg font-bold transition">+30s</button>
                <button onClick={onSkipTimer} className="text-xs bg-[#deff9a]/10 text-[#deff9a] hover:bg-[#deff9a]/20 px-3 py-2 rounded-lg font-bold transition">Skip</button>
              </div>
            </div>
          )}
        </div>

        {/* Local History List */}
        {sets.length > 0 && (
          <div className="mt-8 space-y-3">
            <h3 className="text-sm font-medium text-neutral-400 mb-3 border-b border-neutral-800 pb-2">Exercise History</h3>
            {sets.map((set, index) => {
              const isEditing = editingSetId === set.id;

              if (isEditing) {
                return (
                  <div key={set.id} className="flex flex-col gap-2 bg-neutral-800/80 p-3 rounded-xl border border-[#deff9a]/50">
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={editWeightStr} 
                        onChange={(e) => setEditWeightStr(e.target.value)} 
                        className="w-16 bg-neutral-900 rounded p-1 text-center text-sm text-white border border-neutral-700" 
                        placeholder="kg"
                      />
                      <span className="text-neutral-500 text-sm">×</span>
                      <input 
                        type="number" 
                        value={editRepsStr} 
                        onChange={(e) => setEditRepsStr(e.target.value)} 
                        className="w-16 bg-neutral-900 rounded p-1 text-center text-sm text-white border border-neutral-700" 
                        placeholder="reps"
                      />
                      <select 
                        value={editType} 
                        onChange={(e) => setEditType(e.target.value as SetType)} 
                        className="bg-neutral-900 rounded p-1 text-xs text-white border border-neutral-700 ml-auto focus:outline-none"
                      >
                        <option value="warmup">Warmup</option>
                        <option value="working">Working</option>
                        <option value="drop">Drop</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                      <button onClick={() => setEditingSetId(null)} className="text-xs bg-neutral-700 px-3 py-1 rounded text-white transition hover:bg-neutral-600">Cancel</button>
                      <button onClick={() => saveEdit(set.id)} className="text-xs bg-[#deff9a] text-black px-3 py-1 rounded font-bold transition hover:bg-[#cbf078]">Save</button>
                    </div>
                  </div>
                );
              }

              return (
                <div key={set.id} className="flex flex-col gap-2 bg-neutral-900/50 p-3 rounded-xl border border-neutral-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-500 font-mono font-medium text-xs">
                        #{sets.length - index}
                      </span>
                      <span className="font-bold text-white">
                        {set.weight} <span className="text-neutral-500 text-xs font-normal">kg</span>
                      </span>
                      <span className="text-neutral-600 text-sm">×</span>
                      <span className="font-bold text-white">
                        {set.reps} <span className="text-neutral-500 text-xs font-normal">reps</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {set.isPR && (
                        <div className="flex items-center gap-1 text-[10px] font-bold bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full border border-yellow-500/30">
                          <Trophy size={10} />
                          PR
                        </div>
                      )}
                      <div className={`text-[10px] px-1.5 py-0.5 rounded border capitalize ${getSetTypeColor(set.type)}`}>
                        {set.type}
                      </div>
                      <button onClick={() => startEdit(set)} className="text-neutral-500 hover:text-white p-1 transition">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => onDelete(set.id)} className="text-neutral-500 hover:text-red-400 p-1 transition">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
