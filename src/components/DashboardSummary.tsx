import React from "react";
import { Activity, TrendingUp } from "lucide-react";
import { SetRecord } from "../types";

type Props = {
  sets: SetRecord[];
};

export default function DashboardSummary({ sets }: Props) {
  // Only calculate volume for working sets, or maybe all sets? Usually warmup isn't counted in total volume, 
  // but let's count only working and drop sets.
  const validSets = sets.filter(s => s.type !== "warmup");
  const totalVolume = validSets.reduce((total, s) => total + s.weight * s.reps, 0);

  return (
    <section className="grid grid-cols-2 gap-4">
      <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-2 text-gray-400 mb-2">
          <Activity size={18} />
          <h2 className="text-sm font-bold">Work Volume</h2>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-black text-gray-900 tracking-tighter">{totalVolume}</span>
          <span className="text-gray-400 font-medium mb-1">kg</span>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-2 text-gray-400 mb-2">
          <TrendingUp size={18} />
          <h2 className="text-sm font-bold">Sets Completed</h2>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-black text-blue-600 tracking-tighter">{validSets.length}</span>
          <span className="text-gray-400 font-medium mb-1">sets</span>
        </div>
      </div>
    </section>
  );
}
