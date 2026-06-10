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
      <div className="flex items-center gap-2 bg-neutral-800 px-4 py-2 rounded-full border border-neutral-700">
        <Timer size={18} className="text-[#deff9a] animate-pulse" />
        <span className="font-mono font-medium text-[#deff9a]">{formatTime(restTime)}</span>
      </div>
      
      {/* Timer Controls */}
      <div className="flex items-center gap-1 bg-neutral-800 rounded-full border border-neutral-700 p-1">
        <button 
          onClick={() => addTime(-10)}
          className="text-neutral-400 hover:text-white hover:bg-neutral-700 p-1 rounded-full transition"
          title="-10s"
        >
          <Minus size={14} />
        </button>
        <button 
          onClick={() => addTime(30)}
          className="text-neutral-400 hover:text-white hover:bg-neutral-700 p-1 rounded-full transition"
          title="+30s"
        >
          <Plus size={14} />
        </button>
        <button 
          onClick={skipTimer}
          className="text-red-400 hover:text-red-300 hover:bg-neutral-700 p-1 rounded-full transition"
          title="Skip Rest"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
