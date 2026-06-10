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
      <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 text-neutral-400 mb-2">
          <Activity size={18} />
          <h2 className="text-sm font-medium">Work Volume</h2>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-white">{totalVolume}</span>
          <span className="text-neutral-500 mb-1">kg</span>
        </div>
      </div>
      <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 text-neutral-400 mb-2">
          <TrendingUp size={18} />
          <h2 className="text-sm font-medium">Sets Completed</h2>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-[#deff9a]">{validSets.length}</span>
          <span className="text-neutral-500 mb-1">sets</span>
        </div>
      </div>
    </section>
  );
}
