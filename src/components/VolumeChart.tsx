import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { SetRecord, Exercise } from "../types";
import InfoTooltip from "./InfoTooltip";

type Props = {
  sets: SetRecord[];
  exercises: Exercise[];
};

const COLORS = [
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#06b6d4", // cyan-500
  "#f97316", // orange-500
];

export default function VolumeChart({ sets, exercises }: Props) {
  const chartData = useMemo(() => {
    // Filter valid working and drop sets
    const validSets = sets.filter(s => s.type !== "warmup");
    
    const categoryVolume = validSets.reduce((acc: Record<string, number>, set) => {
      const exercise = exercises.find(e => e.id === set.exerciseId);
      if (exercise) {
        const category = exercise.category.toUpperCase();
        const volume = set.weight * set.reps;
        acc[category] = (acc[category] || 0) + volume;
      }
      return acc;
    }, {});

    const data = Object.keys(categoryVolume).map((key, index) => ({
      name: key,
      value: categoryVolume[key],
      color: COLORS[index % COLORS.length]
    })).sort((a, b) => b.value - a.value);

    return data;
  }, [sets, exercises]);

  if (chartData.length === 0) {
    return (
      <section className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-gray-900 flex items-center">
            Volume Breakdown
            <InfoTooltip text="Percentage of total volume lifted by muscle group." />
          </h2>
        </div>
        <div className="text-center py-8 text-gray-400 font-medium text-sm bg-gray-50 rounded-2xl border border-gray-100">
          No workout volume recorded yet.
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
      <div className="mb-2">
        <h2 className="text-sm font-bold text-gray-900 flex items-center tracking-tight">
          Volume Breakdown
          <InfoTooltip text="Percentage of total volume lifted by muscle group." />
        </h2>
      </div>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height={220} minWidth={1} minHeight={1}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => [`${value} kg`, 'Volume']}
              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
              itemStyle={{ color: '#1f2937' }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#4b5563' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
