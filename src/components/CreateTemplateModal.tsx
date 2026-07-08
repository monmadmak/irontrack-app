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
      
      <div className="relative w-full max-w-md max-h-[90vh] flex flex-col bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900">{initialTemplate ? "Edit Routine" : "Create Routine"}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full transition">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1">Routine Name</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Push Day"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 focus:outline-none focus:border-blue-500 shadow-sm"
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

          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2">Select Exercises ({selectedIds.length})</label>
            <div className="space-y-2">
              {exercises.map((ex) => (
                <div 
                  key={ex.id}
                  onClick={() => toggleExercise(ex.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                    selectedIds.includes(ex.id) 
                      ? "bg-blue-50 border-blue-500 text-blue-900 shadow-sm" 
                      : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center ${
                    selectedIds.includes(ex.id) ? "bg-blue-500 text-white" : "border-2 border-gray-300"
                  }`}>
                    {selectedIds.includes(ex.id) && <Check size={14} strokeWidth={3} />}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{ex.name}</div>
                    <div className="text-xs text-gray-500 font-medium uppercase">{ex.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-2 flex-shrink-0">
          <button 
            onClick={handleSave}
            disabled={!name.trim() || selectedIds.length === 0}
            className="w-full bg-blue-500 disabled:opacity-50 text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-md shadow-blue-500/20 active:scale-95"
          >
            <Check size={20} strokeWidth={3} />
            SAVE TEMPLATE
          </button>
          {initialTemplate && onDelete && (
            <button
              onClick={() => onDelete(initialTemplate.id)}
              className="w-full bg-red-50 text-red-500 font-bold py-3 rounded-xl hover:bg-red-100 transition flex items-center justify-center gap-2"
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
