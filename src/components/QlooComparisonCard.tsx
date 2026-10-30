"use client";

import React, { useState } from "react";
import { getQlooOnOffComparison } from "@/lib/agent";
import { Zap, AlertTriangle, ShieldCheck, Sparkles, X } from "lucide-react";

interface QlooToggleProps {
  module: "SETTLE" | "CONNECT" | "LEARN";
}

export const QlooComparisonCard: React.FC<QlooToggleProps> = ({ module }) => {
  const [activeTab, setActiveTab] = useState<"side-by-side" | "qloo-only">("side-by-side");
  const comparison = getQlooOnOffComparison(module);

  return (
    <div className="w-full editorial-card rounded-3xl p-6 sm:p-8 my-6 border border-[#2e3e38] relative overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-crimson-950/80 text-crimson-400 border border-crimson-500/40">
              <Zap className="w-4 h-4 animate-bounce" />
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-[#dedacb] tracking-wide">
              The &quot;Qloo ON vs. Plain LLM&quot; Benchmark
            </h3>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
              {module} MODULE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#a89f91] mt-1 font-light">
            Visual proof: why a plain LLM without Qloo&apos;s taste graph hallucinates tourist traps and misses real cultural affinities.
          </p>
        </div>

        <div className="flex rounded-2xl bg-[#141d19] p-1 border border-[#2e3e38] text-xs self-start sm:self-auto shadow-inner">
          <button
            onClick={() => setActiveTab("side-by-side")}
            className={`px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all duration-300 ${
              activeTab === "side-by-side" ? "crimson-pill text-white shadow-md" : "text-[#a89f91] hover:text-[#dedacb]"
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setActiveTab("qloo-only")}
            className={`px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all duration-300 ${
              activeTab === "qloo-only" ? "forest-pill text-white shadow-md" : "text-[#a89f91] hover:text-[#dedacb]"
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
          <div className="rounded-2xl bg-[#141d19] border border-rose-900/60 p-5 flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#25332e]">
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-rose-500" />
                  <span className="font-bold text-rose-300 text-sm font-mono">Plain LLM (No Qloo)</span>
                </div>
                <span className="flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full bg-rose-950/80 text-rose-300 font-mono font-bold border border-rose-800/40">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> High Hallucination Risk
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#0d1311] font-mono text-[#a89f91] border border-rose-950 space-y-1 shadow-inner overflow-x-auto">
                  <div className="text-rose-400 font-bold">// Raw LLM output preview:</div>
                  <pre className="text-[11px] whitespace-pre-wrap">
                    {JSON.stringify(comparison.plainLLM.output, null, 2)}
                  </pre>
                </div>

                <div className="p-3 rounded-xl bg-rose-950/40 text-rose-200 border border-rose-900/60 text-xs font-light">
                  <span className="font-bold text-rose-300 font-mono uppercase mr-1">Critique:</span> {comparison.plainLLM.critique}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#25332e] grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-[#0d1311] border border-[#2e3e38]">
                <div className="text-[#a89f91] text-[10px] font-mono">OSM Verified Places</div>
                <div className="font-extrabold text-rose-400 font-mono text-base">0</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0d1311] border border-[#2e3e38]">
                <div className="text-[#a89f91] text-[10px] font-mono">Taste Graph Citations</div>
                <div className="font-extrabold text-rose-400 font-mono text-base">0</div>
              </div>
            </div>
          </div>
        )}

        {/* Right: Homebase + Qloo */}
        <div className="rounded-2xl bg-[#141d19] border border-emerald-900/60 p-5 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#25332e]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-emerald-300 text-sm font-mono">Homebase + Qloo Taste Graph</span>
              </div>
              <span className="flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 font-mono font-bold border border-emerald-800/40">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Grounded
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#0d1311] font-mono text-[#dedacb] border border-emerald-950 space-y-1 shadow-inner overflow-x-auto">
                <div className="text-emerald-400 font-bold">// Qloo taste-affinity verified structure:</div>
                <pre className="text-[11px] whitespace-pre-wrap">
                  {JSON.stringify(comparison.qlooHomebase.output, null, 2)}
                </pre>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 text-emerald-200 border border-emerald-900/60 text-xs font-light">
                <span className="font-bold text-emerald-300 font-mono uppercase mr-1">Qloo Superpower:</span> {comparison.qlooHomebase.superpower}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#25332e] grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-[#0d1311] border border-[#2e3e38]">
              <div className="text-[#a89f91] text-[10px] font-mono">OSM Verified Places</div>
              <div className="font-extrabold text-emerald-400 font-mono text-base">
                {comparison.qlooHomebase.verifiedPlacesCount > 0 ? `${comparison.qlooHomebase.verifiedPlacesCount} Verified` : "N/A"}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0d1311] border border-[#2e3e38]">
              <div className="text-[#a89f91] text-[10px] font-mono">Taste Graph Citations</div>
              <div className="font-extrabold text-emerald-400 font-mono text-base">
                {comparison.qlooHomebase.tasteGraphCitationsCount} Citations
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
