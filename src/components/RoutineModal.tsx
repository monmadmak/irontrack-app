import React, { useState, useEffect } from "react";
import { X, Check, Trash2, Edit2, Play, Search, Plus, Minus } from "lucide-react";
import { Exercise, WorkoutTemplate } from "../types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  exercises: Exercise[];
  routine?: WorkoutTemplate;
  initialMode?: "view" | "edit" | "create";
  onSave: (template: WorkoutTemplate) => void;
  onDelete: (id: string) => void;
  onStartWorkout: (template: WorkoutTemplate) => void;
};

export default function RoutineModal({ isOpen, onClose, exercises, routine, initialMode, onSave, onDelete, onStartWorkout }: Props) {
  const [mode, setMode] = useState<"view" | "edit" | "create">("create");
  
  // Edit states
  const [name, setName] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [level, setLevel] = useState<WorkoutTemplate["level"]>();
  const [goal, setGoal] = useState<WorkoutTemplate["goal"]>();
  const [equipment, setEquipment] = useState<WorkoutTemplate["equipment"]>();
  
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode || (routine ? "view" : "create"));
      if (routine) {
        setName(routine.name);
        setSelectedIds(routine.exerciseIds);
        setLevel(routine.level);
        setGoal(routine.goal);
        setEquipment(routine.equipment);
      } else {
        setName("");
        setSelectedIds([]);
        setLevel(undefined);
        setGoal(undefined);
        setEquipment(undefined);
      }
      setSearchQuery("");
    }
  }, [isOpen, routine, initialMode]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim() || selectedIds.length === 0) return;
    onSave({
      id: routine?.id || crypto.randomUUID(),
      name: name.trim(),
      exerciseIds: selectedIds,
      level,
      goal,
      equipment
    });
  };

  const handleDelete = () => {
    if (routine) onDelete(routine.id);
  };

  const handleStart = () => {
    if (routine) onStartWorkout(routine);
  };

  const availableExercises = exercises.filter(
    ex => !selectedIds.includes(ex.id) && ex.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const selectedExercises = selectedIds.map(id => exercises.find(e => e.id === id)).filter(Boolean) as Exercise[];

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-0">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md max-h-[90vh] flex flex-col bg-[#1a1a1a] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-900/50 flex-shrink-0">
          <h2 className="text-lg font-bold text-white">
            {mode === "view" ? "Routine Details" : mode === "edit" ? "Edit Routine" : "Create Routine"}
          </h2>
          <div className="flex items-center gap-2">
            {mode === "view" && (
              <button onClick={() => setMode("edit")} className="p-2 text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-full transition">
                <Edit2 size={18} />
              </button>
            )}
            <button onClick={onClose} className="p-2 text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-full transition">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {mode === "view" && routine ? (
            // VIEW MODE
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-black text-white leading-tight mb-3">{routine.name}</h1>
                <div className="flex flex-wrap gap-2">
                  {routine.level && <span className="text-xs font-medium px-2 py-1 bg-blue-500/10 text-blue-400 rounded capitalize">{routine.level}</span>}
                  {routine.goal && <span className="text-xs font-medium px-2 py-1 bg-green-500/10 text-green-400 rounded capitalize">{routine.goal}</span>}
                  {routine.equipment && <span className="text-xs font-medium px-2 py-1 bg-purple-500/10 text-purple-400 rounded capitalize">{routine.equipment}</span>}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">Exercises ({selectedExercises.length})</h3>
                <div className="space-y-2">
                  {selectedExercises.map((ex, i) => (
                    <div key={ex.id} className="bg-neutral-900 border border-neutral-800 p-3 rounded-xl flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-400">{i + 1}</div>
                      <div>
                        <div className="text-white font-medium">{ex.name}</div>
                        <div className="text-xs text-neutral-500">{ex.category}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // EDIT / CREATE MODE
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Routine Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Leg Day, Push Workout"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#deff9a] transition"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Level</label>
                  <select value={level || ""} onChange={(e) => setLevel(e.target.value as any || undefined)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-[#deff9a]">
                    <option value="">Any Level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Goal</label>
                  <select value={goal || ""} onChange={(e) => setGoal(e.target.value as any || undefined)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-[#deff9a]">
                    <option value="">Any Goal</option>
                    <option value="gain muscle">Gain Muscle</option>
                    <option value="strength">Strength</option>
                    <option value="lose weight">Lose Weight</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Equipment</label>
                  <select value={equipment || ""} onChange={(e) => setEquipment(e.target.value as any || undefined)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-[#deff9a]">
                    <option value="">Any</option>
                    <option value="gym">Gym</option>
                    <option value="dumbbells">Dumbbells</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>

              {/* Selected Exercises List */}
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Exercises</label>
                <div className="space-y-2 mb-4">
                  {selectedExercises.map((ex, i) => (
                    <div key={ex.id} className="bg-neutral-900 border border-neutral-800 p-3 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-400">{i + 1}</div>
                        <div className="text-white text-sm font-medium">{ex.name}</div>
                      </div>
                      <button onClick={() => setSelectedIds(selectedIds.filter(id => id !== ex.id))} className="text-neutral-500 hover:text-red-400 transition">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {selectedIds.length === 0 && (
                    <div className="text-center p-4 border border-dashed border-neutral-800 rounded-xl text-neutral-500 text-sm">
                      No exercises added yet.
                    </div>
                  )}
                </div>

                {/* Add Exercise Search */}
                <div className="relative mb-2">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-neutral-500" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search exercises to add..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#deff9a] transition"
                  />
                </div>
                
                {/* Search Results */}
                {searchQuery && (
                  <div className="max-h-40 overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-xl p-1">
                    {availableExercises.length === 0 ? (
                      <div className="p-3 text-sm text-neutral-500 text-center">No exercises found.</div>
                    ) : (
                      availableExercises.map(ex => (
                        <button
                          key={ex.id}
                          onClick={() => {
                            setSelectedIds([...selectedIds, ex.id]);
                            setSearchQuery("");
                          }}
                          className="w-full text-left p-3 hover:bg-neutral-800 rounded-lg transition flex items-center justify-between group"
                        >
                          <span className="text-sm font-medium text-white group-hover:text-[#deff9a]">{ex.name}</span>
                          <Plus size={16} className="text-neutral-500 group-hover:text-[#deff9a]" />
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/50 flex flex-col gap-2 flex-shrink-0">
          {mode === "view" ? (
            <>
              <button 
                onClick={handleStart}
                className="w-full bg-[#deff9a] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#cbf078] active:scale-95 transition"
              >
                <Play size={20} fill="currentColor" />
                START WORKOUT
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleSave}
                disabled={!name.trim() || selectedIds.length === 0}
                className="w-full bg-[#deff9a] text-black font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#cbf078] active:scale-95 transition flex items-center justify-center gap-2"
              >
                <Check size={20} strokeWidth={3} />
                {mode === "edit" ? "SAVE CHANGES" : "CREATE ROUTINE"}
              </button>
              {mode === "edit" && routine && (
                <button
                  onClick={handleDelete}
                  className="w-full bg-red-500/10 text-red-500 font-bold py-3 rounded-xl hover:bg-red-500/20 active:scale-95 transition flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  DELETE ROUTINE
                </button>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
