"use client";

import React, { useState } from "react";
import { StudentProfile, SettleModuleResult } from "@/types";
import { DEMO_PRIMARY_STUDENT } from "@/data/seedProfiles";
import { TasteOnboarding } from "@/components/TasteOnboarding";
import { SettleModule } from "@/components/SettleModule";
import { ConnectModule } from "@/components/ConnectModule";
import { LearnModule } from "@/components/LearnModule";
import { runSettleAgent } from "@/lib/agent";
import {
  Compass,
  Users,
  GraduationCap,
  Sparkles,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Zap,
  Globe2,
  Terminal,
  HeartHandshake
} from "lucide-react";

export default function Home() {
  const [currentProfile, setCurrentProfile] = useState<StudentProfile>(DEMO_PRIMARY_STUDENT);
  const [activeTab, setActiveTab] = useState<"onboarding" | "settle" | "connect" | "learn">("settle");
  const [settleData, setSettleData] = useState<SettleModuleResult>(() => {
    return {
      city: DEMO_PRIMARY_STUDENT.target_city,
      university: DEMO_PRIMARY_STUDENT.target_university,
      places: [],
      neighborhoods: [],
      first30DaysPlan: [],
      agentTrace: []
    };
  });
  const [isLoadingSettle, setIsLoadingSettle] = useState(false);

  // Initialize Settle Agent on first mount or on profile change
  React.useEffect(() => {
    async function initSettle() {
      setIsLoadingSettle(true);
      const res = await runSettleAgent(currentProfile);
      setSettleData(res);
      setIsLoadingSettle(false);
    }
    initSettle();
  }, [currentProfile]);

  return (
    <main className="min-h-screen bg-[#090d16] text-slate-100 pb-20 selection:bg-indigo-500 selection:text-white relative">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white font-extrabold text-lg">
              H
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                Homebase <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">QLOO AGENT</span>
              </span>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Making a new university city feel like home through taste intelligence
              </p>
            </div>
          </div>

          {/* Quick Active Student Indicator */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">{currentProfile.display_name}</span>
              <span className="text-slate-500">•</span>
              <span className="text-indigo-400">{currentProfile.home_city} ➔ {currentProfile.target_city}</span>
            </div>

            <button
              onClick={() => {
                setCurrentProfile(DEMO_PRIMARY_STUDENT);
                setActiveTab("settle");
              }}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Demo Student
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* 20-Second Relocation Story Header */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-purple-950/40 border border-indigo-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
              <Globe2 className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong className="text-white">A student from Pune lands in Berlin.</strong> Far from home, they don't need tourist top-10 lists.{" "}
              Homebase uses <span className="text-indigo-400 font-semibold">Qloo's taste graph</span> to find their authentic chai and acoustic study twins, match kindred peers through taste bridges, and explain hard CS concepts via their favorite anime & games.
            </p>
          </div>
          <span className="text-[11px] text-slate-400 font-mono shrink-0 hidden lg:block">
            Powered by Qloo v2 Insights + OpenStreetMap
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto pb-2 sm:pb-0 gap-2 border-b border-slate-800 text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab("onboarding")}
            className={`px-4 py-2.5 rounded-xl font-semibold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "onboarding"
                ? "bg-indigo-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Sparkles className="w-4 h-4" /> 1. Taste Profile
          </button>
          <button
            onClick={() => setActiveTab("settle")}
            className={`px-4 py-2.5 rounded-xl font-semibold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "settle"
                ? "bg-indigo-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Compass className="w-4 h-4" /> 2. Settle (Places & Map)
          </button>
          <button
            onClick={() => setActiveTab("connect")}
            className={`px-4 py-2.5 rounded-xl font-semibold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "connect"
                ? "bg-indigo-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Users className="w-4 h-4" /> 3. Connect (Peer Matches)
          </button>
          <button
            onClick={() => setActiveTab("learn")}
            className={`px-4 py-2.5 rounded-xl font-semibold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "learn"
                ? "bg-indigo-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <GraduationCap className="w-4 h-4" /> 4. Learn (Taste Study)
          </button>
        </div>

        {/* Tab Views */}
        {activeTab === "onboarding" && (
          <TasteOnboarding
            currentProfile={currentProfile}
            onUpdateProfile={(p) => setCurrentProfile(p)}
            onContinue={() => setActiveTab("settle")}
          />
        )}

        {activeTab === "settle" && <SettleModule settleData={settleData} />}

        {activeTab === "connect" && <ConnectModule currentProfile={currentProfile} />}

        {activeTab === "learn" && <LearnModule currentProfile={currentProfile} />}
      </div>
    </main>
  );
}
