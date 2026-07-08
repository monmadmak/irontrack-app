import React, { useState } from "react";
import { X, Check } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, category: string, defaultRestTime: number) => void;
};

export default function CreateExerciseModal({ isOpen, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Other");
  const [restTime, setRestTime] = useState(90);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim(), category, restTime);
    setName("");
    setCategory("Other");
    setRestTime(90);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Create Custom Exercise</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full transition">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1">Exercise Name</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Incline Dumbbell Press"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 focus:outline-none focus:border-blue-500 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 focus:outline-none focus:border-blue-500 shadow-sm"
            >
              <option value="Chest">Chest</option>
              <option value="Back">Back</option>
              <option value="Legs">Legs</option>
              <option value="Shoulders">Shoulders</option>
              <option value="Arms">Arms</option>
              <option value="Core">Core</option>
              <option value="Cardio">Cardio</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1">Default Rest Time (Seconds)</label>
            <input 
              type="number"
              value={restTime}
              onChange={(e) => setRestTime(Number(e.target.value))}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 focus:outline-none focus:border-blue-500 shadow-sm"
            />
          </div>

          <button 
            onClick={handleSave}
            disabled={!name.trim()}
            className="w-full bg-blue-500 disabled:opacity-50 text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 active:scale-95 transition-all mt-4 shadow-md shadow-blue-500/20"
          >
            <Check size={20} strokeWidth={3} />
            SAVE EXERCISE
          </button>
        </div>
      </div>
    </div>
  );
}
