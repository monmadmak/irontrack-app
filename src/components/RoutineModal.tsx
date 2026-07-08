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
      
      <div className="relative w-full max-w-md max-h-[90vh] flex flex-col bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900">
            {mode === "view" ? "Routine Details" : mode === "edit" ? "Edit Routine" : "Create Routine"}
          </h2>
          <div className="flex items-center gap-2">
            {mode === "view" && (
              <button onClick={() => setMode("edit")} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full transition">
                <Edit2 size={18} />
              </button>
            )}
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full transition">
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
                <h1 className="text-3xl font-black text-gray-900 leading-tight mb-3">{routine.name}</h1>
                <div className="flex flex-wrap gap-2">
                  {routine.level && <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded capitalize">{routine.level}</span>}
                  {routine.goal && <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded capitalize">{routine.goal}</span>}
                  {routine.equipment && <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded capitalize">{routine.equipment}</span>}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Exercises ({selectedExercises.length})</h3>
                <div className="space-y-2">
                  {selectedExercises.map((ex, i) => (
                    <div key={ex.id} className="bg-gray-50 border border-gray-100 p-3 rounded-xl flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 shadow-sm">{i + 1}</div>
                      <div>
                        <div className="text-gray-900 font-bold text-sm">{ex.name}</div>
                        <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{ex.category}</div>
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
                <label className="block text-sm font-bold text-gray-500 mb-2">Routine Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Leg Day, Push Workout"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Level</label>
                  <select value={level || ""} onChange={(e) => setLevel(e.target.value as any || undefined)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-xs text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm">
                    <option value="">Any Level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Goal</label>
                  <select value={goal || ""} onChange={(e) => setGoal(e.target.value as any || undefined)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-xs text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm">
                    <option value="">Any Goal</option>
                    <option value="gain muscle">Gain Muscle</option>
                    <option value="strength">Strength</option>
                    <option value="lose weight">Lose Weight</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Equipment</label>
                  <select value={equipment || ""} onChange={(e) => setEquipment(e.target.value as any || undefined)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-xs text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm">
                    <option value="">Any</option>
                    <option value="gym">Gym</option>
                    <option value="dumbbells">Dumbbells</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>

              {/* Selected Exercises List */}
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Exercises</label>
                <div className="space-y-2 mb-4">
                  {selectedExercises.map((ex, i) => (
                    <div key={ex.id} className="bg-gray-50 border border-gray-100 p-3 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">{i + 1}</div>
                        <div className="text-gray-900 text-sm font-bold">{ex.name}</div>
                      </div>
                      <button onClick={() => setSelectedIds(selectedIds.filter(id => id !== ex.id))} className="text-gray-400 hover:text-red-500 transition">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {selectedIds.length === 0 && (
                    <div className="text-center p-4 border border-dashed border-gray-200 rounded-xl text-gray-400 text-sm bg-gray-50">
                      No exercises added yet.
                    </div>
                  )}
                </div>

                {/* Add Exercise Search */}
                <div className="relative mb-2">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search exercises to add..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm"
                  />
                </div>
                
                {/* Search Results */}
                {searchQuery && (
                  <div className="max-h-40 overflow-y-auto bg-white border border-gray-200 shadow-lg rounded-xl p-1">
                    {availableExercises.length === 0 ? (
                      <div className="p-3 text-sm text-gray-500 text-center">No exercises found.</div>
                    ) : (
                      availableExercises.map(ex => (
                        <button
                          key={ex.id}
                          onClick={() => {
                            setSelectedIds([...selectedIds, ex.id]);
                            setSearchQuery("");
                          }}
                          className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition flex items-center justify-between group"
                        >
                          <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600">{ex.name}</span>
                          <Plus size={16} className="text-gray-400 group-hover:text-blue-500" />
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-2 flex-shrink-0">
          {mode === "view" ? (
            <>
              <button 
                onClick={handleStart}
                className="w-full bg-blue-500 text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 active:scale-95 transition shadow-md shadow-blue-500/20"
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
                className="w-full bg-blue-500 text-white font-bold text-lg py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 active:scale-95 transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
              >
                <Check size={20} strokeWidth={3} />
                {mode === "edit" ? "SAVE CHANGES" : "CREATE ROUTINE"}
              </button>
              {mode === "edit" && routine && (
                <button
                  onClick={handleDelete}
                  className="w-full bg-red-50 text-red-500 font-bold py-3 rounded-xl hover:bg-red-100 active:scale-95 transition flex items-center justify-center gap-2"
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
