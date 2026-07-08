import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import InfoTooltip from "./InfoTooltip";
import { SetRecord } from "../types";

type Props = {
  sets: SetRecord[];
};

export default function ProgressChart({ sets }: Props) {
  const chartData = useMemo(() => {
    // We want to calculate Total Volume per session (or per date)
    // Filter out warmup sets
    const validSets = sets.filter((s) => s.type !== "warmup");

    // Group by date
    const groupedByDate = validSets.reduce((acc, set) => {
      const dateKey = set.time.split("T")[0]; // YYYY-MM-DD
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(set);
      return acc;
    }, {} as Record<string, SetRecord[]>);

    const sortedDates = Object.keys(groupedByDate).sort();

    return sortedDates.map((date) => {
      const daySets = groupedByDate[date];
      const totalVolume = daySets.reduce((total, s) => total + s.weight * s.reps, 0);

      return {
        date,
        volume: Math.round(totalVolume * 10) / 10,
      };
    });
  }, [sets]);

  return (
    <section className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center">
          Workout Volume Progress
          <InfoTooltip text="Volume = Sets × Reps × Weight. It shows your total workload. An increasing trend means you are getting stronger!" />
        </h2>
        <p className="text-sm font-medium text-gray-500">Total volume lifted per day</p>
      </div>

      {chartData.length === 0 ? (
        <div className="text-center py-10 text-gray-400 font-medium">
          Not enough data to display progress yet.
        </div>
      ) : (
        <div style={{ width: '100%', height: 256 }}>
          <ResponsiveContainer width="100%" height={256} minWidth={1} minHeight={1}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af" 
                fontSize={12} 
                tickFormatter={(val) => val.substring(5)} // Show MM-DD
              />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                itemStyle={{ color: '#2563eb', fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="volume" 
                name="Total Volume (kg)"
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#ffffff', stroke: '#2563eb', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
