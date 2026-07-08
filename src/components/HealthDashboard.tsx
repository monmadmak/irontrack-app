import React from "react";
import { Activity, Apple } from "lucide-react";

export default function HealthDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-gray-100 p-2 rounded-xl text-gray-500">
            <Activity size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Health & Body</h2>
        </div>
        <p className="text-gray-500 text-sm mb-6">Track your bodyweight and sync with other health apps.</p>
      </section>

      <section className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
        <div className="bg-gray-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5 border border-gray-100">
          <Activity size={28} className="text-gray-400" />
        </div>
        <h3 className="text-gray-900 font-bold text-lg mb-2">Coming Soon</h3>
        <p className="text-gray-500 text-sm max-w-[250px] mx-auto leading-relaxed">
          We're working on Apple Health / Google Fit integrations and body measurement tracking.
        </p>
      </section>
    </div>
  );
}
