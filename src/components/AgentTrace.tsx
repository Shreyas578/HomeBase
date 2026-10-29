"use client";

import React, { useState } from "react";
import { AgentTraceStep } from "@/types";
import { ChevronDown, ChevronUp, Terminal, CheckCircle2, Clock, Cpu } from "lucide-react";

interface AgentTraceProps {
  trace: AgentTraceStep[];
}

export const AgentTrace: React.FC<AgentTraceProps> = ({ trace }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!trace || trace.length === 0) return null;

  return (
    <div className="w-full glass-panel rounded-2xl overflow-hidden border border-indigo-500/30 my-6 shadow-2xl">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-indigo-950/60 hover:from-indigo-900/60 hover:to-indigo-900/60 transition"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Terminal className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm sm:text-base">Autonomous Agent Trace</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {trace.length} Steps Completed
              </span>
            </div>
            <p className="text-xs text-slate-400">Plan ➔ Act ➔ Observe ➔ Revise (Live Tool Execution)</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-xs hidden sm:inline">{isOpen ? "Hide Trace" : "Show Trace"}</span>
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 sm:p-5 space-y-3 bg-slate-950/80 font-mono text-xs max-h-96 overflow-y-auto">
          {trace.map((step, idx) => (
            <div
              key={step.id || idx}
              className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span
                    className={`uppercase font-bold px-2 py-0.5 rounded text-[10px] ${
                      step.phase === "plan"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                        : step.phase === "act"
                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                        : step.phase === "observe"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    }`}
                  >
                    {step.phase}
                  </span>
                  <span className="text-indigo-400 font-semibold flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5" /> {step.tool}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <Clock className="w-3 h-3" />
                  <span>{step.timestamp}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>

              <div className="space-y-1.5 text-slate-300">
                <div className="text-slate-400">
                  <span className="text-slate-500 font-semibold">Input:</span>{" "}
                  <code className="text-slate-300 bg-slate-800/60 px-1 py-0.5 rounded">
                    {JSON.stringify(step.input)}
                  </code>
                </div>
                <div className="text-emerald-300">
                  <span className="text-slate-500 font-semibold">Observation:</span> {step.outputSummary}
                </div>
                <div className="text-slate-300 italic pt-1 text-[11px] border-t border-slate-800/40">
                  <span className="text-indigo-400 not-italic font-semibold">Reasoning:</span> {step.reasoning}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
