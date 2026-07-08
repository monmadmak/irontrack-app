import React, { useState } from "react";
import { Plus, Minus, Check, Edit2, Trash2, Trophy } from "lucide-react";
import InfoTooltip from "./InfoTooltip";
import RestTimerDisplay from "./RestTimerDisplay";
import { Exercise, SetType, SetRecord } from "../types";

type Props = {
  exercise: Exercise;
  sets: SetRecord[];
  onSave: (weight: number, reps: number, setType: SetType) => void;
  onUpdateSet: (setId: string, weight: number, reps: number, setType: SetType) => void;
  onDelete: (id: string) => void;
  onRemoveExercise: () => void;
  showTimer?: boolean;
  timerTargetTime?: number | null;
  onAddTime?: (amount: number) => void;
  onSkipTimer?: () => void;
};

export default function ActiveLogger({ 
  exercise, sets, onSave, onUpdateSet, onDelete, onRemoveExercise, 
  showTimer, timerTargetTime, onAddTime, onSkipTimer 
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
      case "warmup": return "text-orange-600 bg-orange-100 border-orange-200";
      case "drop": return "text-purple-600 bg-purple-100 border-purple-200";
      default: return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  return (
    <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
      <div className="relative z-10">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{exercise.name}</h2>
            <p className="text-sm font-medium text-blue-500 mt-1 uppercase tracking-wider">{exercise.category}</p>
          </div>
          <button 
            onClick={onRemoveExercise}
            className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2.5 rounded-xl transition-all"
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
              <label className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                Weight (kg)
                <InfoTooltip text="Enter total weight. Leave as 0 if bodyweight only." />
              </label>
              <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-1.5 border border-gray-200">
                <button 
                  onClick={() => setWeightStr(w => Math.max(0, Number(w) - 2.5).toString())}
                  className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-600 active:scale-95 transition-transform"
                >
                  <Minus size={22} />
                </button>
                <input
                  type="number"
                  value={weightStr}
                  onChange={(e) => setWeightStr(e.target.value)}
                  className="w-20 bg-transparent text-center text-3xl font-bold text-gray-900 focus:outline-none placeholder-gray-300"
                  placeholder="0"
                />
                <button 
                  onClick={() => setWeightStr(w => (Number(w) + 2.5).toString())}
                  className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-600 active:scale-95 transition-transform"
                >
                  <Plus size={22} />
                </button>
              </div>
            </div>

            {/* Reps Input */}
            <div>
              <label className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                Reps
                <InfoTooltip text="Number of times you performed the movement in a row." />
              </label>
              <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-1.5 border border-gray-200">
                <button 
                  onClick={() => setRepsStr(r => Math.max(0, Number(r) - 1).toString())}
                  className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-600 active:scale-95 transition-transform"
                >
                  <Minus size={22} />
                </button>
                <input
                  type="number"
                  value={repsStr}
                  onChange={(e) => setRepsStr(e.target.value)}
                  className="w-20 bg-transparent text-center text-3xl font-bold text-gray-900 focus:outline-none placeholder-gray-300"
                  placeholder="0"
                />
                <button 
                  onClick={() => setRepsStr(r => (Number(r) + 1).toString())}
                  className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-600 active:scale-95 transition-transform"
                >
                  <Plus size={22} />
                </button>
              </div>
            </div>
          </div>

          {/* Set Type Selector */}
          <div className="relative">
            <div className="absolute -top-6 right-0 text-xs font-bold text-gray-400 flex items-center uppercase tracking-wide">
              Set Type <InfoTooltip text="Warmup: Light weight to prep. Working: Main heavy sets. Drop: Lower weight done right after failure." />
            </div>
            <div className="flex p-1 bg-gray-100 rounded-xl">
              {(["warmup", "working", "drop"] as SetType[]).map((t) => (
              <button
                key={t}
                onClick={() => setSetType(t)}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg capitalize transition-all ${
                  setType === t 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
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
            className="w-full bg-blue-500 text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-600 active:scale-95 transition-all shadow-md shadow-blue-500/20"
          >
            <Check size={24} strokeWidth={3} />
            LOG SET
          </button>

          {/* Rest Timer */}
          {showTimer && (
            <RestTimerDisplay 
              targetTime={timerTargetTime ?? null}
              defaultRestTime={exercise.defaultRestTime || 60}
              onAddTime={(a) => onAddTime?.(a)}
              onSkipTimer={() => onSkipTimer?.()}
            />
          )}
        </div>

        {/* Local History List */}
        {sets.length > 0 && (
          <div className="mt-8 space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest flex items-center justify-between">
              Exercise History
              <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md text-[10px]">{sets.length} SETS</span>
            </h3>
            {/* Reverse the sets array so the first set played is at the top */}
            {[...sets].reverse().map((set, index) => {
              const isEditing = editingSetId === set.id;

              if (isEditing) {
                return (
                  <div key={set.id} className="flex flex-col gap-3 bg-white p-3 rounded-xl border border-blue-200 shadow-sm">
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={editWeightStr} 
                        onChange={(e) => setEditWeightStr(e.target.value)} 
                        className="w-16 bg-gray-100 rounded-lg p-2 text-center text-sm font-bold text-gray-900 border-none" 
                        placeholder="kg"
                      />
                      <span className="text-gray-400 font-bold">×</span>
                      <input 
                        type="number" 
                        value={editRepsStr} 
                        onChange={(e) => setEditRepsStr(e.target.value)} 
                        className="w-16 bg-gray-100 rounded-lg p-2 text-center text-sm font-bold text-gray-900 border-none" 
                        placeholder="reps"
                      />
                      <select 
                        value={editType} 
                        onChange={(e) => setEditType(e.target.value as SetType)} 
                        className="bg-gray-100 rounded-lg p-2 text-xs font-bold text-gray-700 border-none ml-auto focus:outline-none"
                      >
                        <option value="warmup">Warmup</option>
                        <option value="working">Working</option>
                        <option value="drop">Drop</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                      <button onClick={() => setEditingSetId(null)} className="text-xs font-bold bg-gray-100 px-4 py-2 rounded-xl text-gray-600 transition hover:bg-gray-200">Cancel</button>
                      <button onClick={() => saveEdit(set.id)} className="text-xs font-bold bg-blue-500 text-white px-4 py-2 rounded-xl transition hover:bg-blue-600">Save</button>
                    </div>
                  </div>
                );
              }

              return (
                <div key={set.id} className="flex flex-col gap-2 bg-white p-3 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 font-bold text-xs bg-gray-50 w-6 h-6 flex items-center justify-center rounded-md">
                        {index + 1}
                      </span>
                      <span className="font-bold text-gray-900 text-lg">
                        {set.weight} <span className="text-gray-400 text-xs font-medium uppercase">kg</span>
                      </span>
                      <span className="text-gray-300 font-bold text-sm">×</span>
                      <span className="font-bold text-gray-900 text-lg">
                        {set.reps} <span className="text-gray-400 text-xs font-medium uppercase">reps</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {set.isPR && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-md border border-yellow-200">
                          <Trophy size={12} />
                          PR
                        </div>
                      )}
                      <div className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-md border uppercase ${getSetTypeColor(set.type)}`}>
                        {set.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => startEdit(set)} className="text-gray-400 hover:text-blue-500 p-1.5 hover:bg-blue-50 rounded-md transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => onDelete(set.id)} className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-md transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
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
