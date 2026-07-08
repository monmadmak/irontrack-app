import React from "react";
import { User, Settings, Medal } from "lucide-react";

export default function ProfileDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-gray-100 p-2 rounded-xl text-gray-500">
            <User size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Profile & Settings</h2>
        </div>
      </section>

      <section className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 border border-gray-100">
          <User size={28} className="text-gray-400" />
        </div>
        <h3 className="text-gray-900 font-bold text-lg mb-2">Your Profile</h3>
        <p className="text-gray-500 text-sm max-w-[250px] mx-auto leading-relaxed mb-6">
          Manage your account settings, goals, and app preferences.
        </p>
        <button className="bg-gray-50 border border-gray-200 text-gray-700 font-bold text-sm px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 mx-auto hover:bg-gray-100 transition-colors">
          <Settings size={18} /> Settings
        </button>
      </section>
    </div>
  );
}
