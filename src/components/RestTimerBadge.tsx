import React from "react";
import { Timer, Plus, Minus, X } from "lucide-react";

type Props = {
  restTime: number;
  formatTime: (seconds: number) => string;
  addTime: (amount: number) => void;
  skipTimer: () => void;
};

export default function RestTimerBadge({ restTime, formatTime, addTime, skipTimer }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200 shadow-sm">
        <Timer size={18} className="text-blue-600 animate-pulse" />
        <span className="font-mono font-bold text-blue-700 tracking-tight">{formatTime(restTime)}</span>
      </div>
      
      {/* Timer Controls */}
      <div className="flex items-center gap-1 bg-white rounded-full border border-gray-200 p-1 shadow-sm">
        <button 
          onClick={() => addTime(-10)}
          className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-1 rounded-full transition"
          title="-10s"
        >
          <Minus size={14} />
        </button>
        <button 
          onClick={() => addTime(30)}
          className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-1 rounded-full transition"
          title="+30s"
        >
          <Plus size={14} />
        </button>
        <button 
          onClick={skipTimer}
          className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded-full transition"
          title="Skip Rest"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
