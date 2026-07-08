import React from "react";
import { X } from "lucide-react";
import { Exercise } from "../types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  exercises: Exercise[];
  onSelect: (id: string) => void;
};

export default function ExerciseSelectorModal({ isOpen, onClose, exercises, onSelect }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-0">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Select Exercise</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {exercises.map((ex) => (
            <button
              key={ex.id}
              onClick={() => {
                onSelect(ex.id);
                onClose();
              }}
              className="w-full text-left p-4 hover:bg-gray-50 rounded-2xl transition flex flex-col gap-1 group border border-transparent hover:border-gray-100"
            >
              <span className="text-gray-900 font-bold group-hover:text-blue-600 transition">
                {ex.name}
              </span>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                {ex.category} • Default Rest: {ex.defaultRestTime}s
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
