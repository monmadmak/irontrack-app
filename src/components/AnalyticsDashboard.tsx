import React from "react";
import { BarChart2 } from "lucide-react";
import ProgressChart from "./ProgressChart";
import VolumeChart from "./VolumeChart";
import { SetRecord, Exercise } from "../types";

type Props = {
  sets: SetRecord[];
  exercises: Exercise[];
};

export default function AnalyticsDashboard({ sets, exercises }: Props) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-gray-100 p-2 rounded-xl text-gray-500">
            <BarChart2 size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Analytics</h2>
        </div>
        <p className="text-gray-500 text-sm mb-6">Track your volume and progress over time.</p>
      </section>

      {/* Volume Chart */}
      <VolumeChart sets={sets} exercises={exercises} />

      {/* Progress Chart */}
      <ProgressChart sets={sets} />
    </div>
  );
}
