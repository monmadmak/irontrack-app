import React, { useState, useEffect } from "react";

type Props = {
  targetTime: number | null;
  defaultRestTime: number;
  onAddTime: (amount: number) => void;
  onSkipTimer: () => void;
};

export default function RestTimerDisplay({ targetTime, defaultRestTime, onAddTime, onSkipTimer }: Props) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!targetTime) {
      setTimeLeft(0);
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        onSkipTimer(); // Auto-skip when timer reaches 0
      }
    };

    updateTimer(); // initial call
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetTime, onSkipTimer]);

  if (!targetTime || timeLeft <= 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between animate-in fade-in zoom-in-95 shadow-sm mt-6">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10">
          <svg className="w-10 h-10 transform -rotate-90">
            <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="4" />
            <circle 
              cx="20" 
              cy="20" 
              r="18" 
              fill="none" 
              stroke="#3b82f6" 
              strokeWidth="4" 
              strokeDasharray="113" 
              strokeDashoffset={113 - (timeLeft / (defaultRestTime || 60)) * 113} 
              className="transition-all duration-1000 ease-linear" 
            />
          </svg>
          <span className="absolute text-xs font-bold text-blue-600">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </span>
        </div>
        <div className="text-sm font-bold text-blue-600">Resting</div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onAddTime(30)} className="text-xs bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-2 rounded-lg font-bold transition">+30s</button>
        <button onClick={onSkipTimer} className="text-xs bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-2 rounded-lg font-bold transition">Skip</button>
      </div>
    </div>
  );
}
