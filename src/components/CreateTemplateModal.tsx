import React, { useState } from "react";
import { X, Check, Trash2 } from "lucide-react";
import { Exercise, WorkoutTemplate } from "../types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  exercises: Exercise[];
  initialTemplate?: WorkoutTemplate;
  onSave: (template: WorkoutTemplate) => void;
  onDelete?: (id: string) => void;
};

export default function CreateTemplateModal({ isOpen, onClose, exercises, initialTemplate, onSave, onDelete }: Props) {
  const [name, setName] = useState(initialTemplate?.name || "");
  const [selectedIds, setSelectedIds] = useState<string[]>(initialTemplate?.exerciseIds || []);
  const [level, setLevel] = useState<WorkoutTemplate["level"]>(initialTemplate?.level);
  const [goal, setGoal] = useState<WorkoutTemplate["goal"]>(initialTemplate?.goal);
  const [equipment, setEquipment] = useState<WorkoutTemplate["equipment"]>(initialTemplate?.equipment);

  // Update local state when modal opens or initialTemplate changes
  React.useEffect(() => {
    if (isOpen) {
      if (initialTemplate) {
        setName(initialTemplate.name);
        setSelectedIds(initialTemplate.exerciseIds);
        setLevel(initialTemplate.level);
        setGoal(initialTemplate.goal);
        setEquipment(initialTemplate.equipment);
      } else {
        setName("");
        setSelectedIds([]);
        setLevel(undefined);
        setGoal(undefined);
        setEquipment(undefined);
      }
    }
  }, [isOpen, initialTemplate]);

  if (!isOpen) return null;

  const toggleExercise = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(eId => eId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSave = () => {
    if (!name.trim() || selectedIds.length === 0) return;
    onSave({
      id: initialTemplate?.id || crypto.randomUUID(),
      name: name.trim(),
      exerciseIds: selectedIds,
      level,
      goal,
      equipment
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md max-h-[90vh] flex flex-col bg-[#1a1a1a] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-900/50 flex-shrink-0">
          <h2 className="text-lg font-bold text-white">{initialTemplate ? "Edit Routine" : "Create Routine"}</h2>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-full transition">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Routine Name</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Push Day"
              className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl p-3 focus:outline-none focus:border-[#deff9a]"
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

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Select Exercises ({selectedIds.length})</label>
            <div className="space-y-2">
              {exercises.map((ex) => (
                <div 
                  key={ex.id}
                  onClick={() => toggleExercise(ex.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                    selectedIds.includes(ex.id) 
                      ? "bg-[#deff9a]/10 border-[#deff9a] text-white" 
                      : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600"
                  }`}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                    selectedIds.includes(ex.id) ? "bg-[#deff9a] border-[#deff9a] text-black" : "border-neutral-600"
                  }`}>
                    {selectedIds.includes(ex.id) && <Check size={14} strokeWidth={3} />}
                  </div>
                  <div>
                    <div className="font-medium">{ex.name}</div>
                    <div className="text-xs opacity-60">{ex.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-neutral-800 bg-neutral-900/50 flex flex-col gap-2 flex-shrink-0">
          <button 
            onClick={handleSave}
            disabled={!name.trim() || selectedIds.length === 0}
            className="w-full bg-[#deff9a] disabled:opacity-50 text-black font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#cbf078] transition-all"
          >
            <Check size={20} strokeWidth={3} />
            SAVE TEMPLATE
          </button>
          {initialTemplate && onDelete && (
            <button
              onClick={() => onDelete(initialTemplate.id)}
              className="w-full bg-red-500/10 text-red-500 font-bold py-3 rounded-xl hover:bg-red-500/20 transition flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              DELETE ROUTINE
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
