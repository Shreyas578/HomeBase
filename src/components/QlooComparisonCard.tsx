"use client";

import React, { useState } from "react";
import { getQlooOnOffComparison } from "@/lib/agent";
import { Zap, AlertTriangle, ShieldCheck, Sparkles, Check, X } from "lucide-react";

interface QlooToggleProps {
  module: "SETTLE" | "CONNECT" | "LEARN";
}

export const QlooComparisonCard: React.FC<QlooToggleProps> = ({ module }) => {
  const [activeTab, setActiveTab] = useState<"side-by-side" | "qloo-only">("side-by-side");
  const comparison = getQlooOnOffComparison(module);

  return (
    <div className="w-full glass-panel rounded-2xl p-5 sm:p-6 my-6 border border-indigo-500/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Zap className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-white tracking-wide">
              The "Qloo ON vs. Plain LLM" Benchmark
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              {module} MODULE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Visual proof: why a plain LLM without Qloo's taste graph hallucinates tourist traps and misses real affinities.
          </p>
        </div>

        <div className="flex rounded-lg bg-slate-900/90 p-1 border border-slate-800 text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("side-by-side")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "side-by-side" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setActiveTab("qloo-only")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "qloo-only" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            Qloo Advantage Only
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className={`grid gap-5 ${activeTab === "side-by-side" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
        {/* Left: Plain LLM */}
        {activeTab === "side-by-side" && (
          <div className="rounded-xl bg-rose-950/20 border border-rose-500/20 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-rose-500/20">
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-rose-400" />
                  <span className="font-semibold text-rose-300 text-sm">Plain LLM (No Qloo)</span>
                </div>
                <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
                  <AlertTriangle className="w-3 h-3 text-rose-400" /> High Hallucination Risk
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-lg bg-slate-950/60 font-mono text-slate-300 space-y-1">
                  <div className="text-slate-400">// Raw LLM output preview:</div>
                  <pre className="text-[11px] text-slate-300 whitespace-pre-wrap">
                    {JSON.stringify(comparison.plainLLM.output, null, 2)}
                  </pre>
                </div>

                <div className="p-3 rounded-lg bg-rose-900/20 text-rose-200 border border-rose-500/30 text-xs">
                  <span className="font-semibold">Critique:</span> {comparison.plainLLM.critique}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-rose-500/20 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-slate-900/60">
                <div className="text-slate-400 text-[10px]">OSM Verified Places</div>
                <div className="font-bold text-rose-400 text-base">0</div>
              </div>
              <div className="p-2 rounded bg-slate-900/60">
                <div className="text-slate-400 text-[10px]">Taste Graph Citations</div>
                <div className="font-bold text-rose-400 text-base">0</div>
              </div>
            </div>
          </div>
        )}

        {/* Right: Homebase + Qloo */}
        <div className="rounded-xl bg-indigo-950/30 border border-indigo-500/40 p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-indigo-500/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-white text-sm">Homebase + Qloo Taste Graph</span>
              </div>
              <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> 100% OSM Grounded
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-200">
              <div className="p-3 rounded-lg bg-slate-950/70 font-mono text-indigo-200 space-y-1">
                <div className="text-slate-400">// Qloo taste-affinity verified structure:</div>
                <pre className="text-[11px] text-indigo-100 whitespace-pre-wrap">
                  {JSON.stringify(comparison.qlooHomebase.output, null, 2)}
                </pre>
              </div>

              <div className="p-3 rounded-lg bg-indigo-900/30 text-indigo-200 border border-indigo-500/40 text-xs">
                <span className="font-semibold text-white">Qloo Superpower:</span> {comparison.qlooHomebase.superpower}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-indigo-500/30 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2 rounded bg-slate-900/60 border border-emerald-500/20">
              <div className="text-slate-400 text-[10px]">OSM Verified Places</div>
              <div className="font-bold text-emerald-400 text-base">
                {comparison.qlooHomebase.verifiedPlacesCount > 0 ? `${comparison.qlooHomebase.verifiedPlacesCount} Verified` : "N/A"}
              </div>
            </div>
            <div className="p-2 rounded bg-slate-900/60 border border-indigo-500/20">
              <div className="text-slate-400 text-[10px]">Taste Graph Citations</div>
              <div className="font-bold text-indigo-300 text-base">
                {comparison.qlooHomebase.tasteGraphCitationsCount} Citations
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
