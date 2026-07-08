import React, { useState } from "react";
import { CheckCircle, X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onFinish: (bodyweight: number | undefined, notes: string, templateName?: string) => void;
};

export default function FinishSessionModal({ isOpen, onClose, onFinish }: Props) {
  const [bodyweight, setBodyweight] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");

  if (!isOpen) return null;

  const handleFinish = () => {
    onFinish(bodyweight ? Number(bodyweight) : undefined, notes.trim(), saveAsTemplate ? templateName.trim() : undefined);
    setBodyweight("");
    setNotes("");
    setSaveAsTemplate(false);
    setTemplateName("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Finish Workout</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full transition">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1">Bodyweight (kg) <span className="text-gray-400 font-normal">- Optional</span></label>
            <input 
              type="number"
              value={bodyweight}
              onChange={(e) => setBodyweight(e.target.value)}
              placeholder="e.g. 75"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 focus:outline-none focus:border-blue-500 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1">Session Notes <span className="text-gray-400 font-normal">- Optional</span></label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did you feel today?"
              rows={3}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 focus:outline-none focus:border-blue-500 resize-none shadow-sm"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={saveAsTemplate} 
                onChange={(e) => setSaveAsTemplate(e.target.checked)}
                className="w-5 h-5 accent-blue-500 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-bold text-gray-700">Save this workout as a Routine</span>
            </label>
            {saveAsTemplate && (
              <input 
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Routine Name (e.g. My Push Day)"
                className="w-full mt-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 focus:outline-none focus:border-blue-500 shadow-sm"
              />
            )}
          </div>

          <button 
            onClick={handleFinish}
            disabled={saveAsTemplate && !templateName.trim()}
            className="w-full bg-blue-500 disabled:opacity-50 text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 active:scale-95 transition-all mt-4 shadow-md shadow-blue-500/20"
          >
            <CheckCircle size={20} strokeWidth={3} />
            SAVE & FINISH
          </button>
        </div>
      </div>
    </div>
  );
}
