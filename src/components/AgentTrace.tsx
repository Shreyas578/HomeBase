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
    <div className="w-full glass-panel rounded-3xl overflow-hidden border border-[#e5dacd] my-6 shadow-md transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-[#faf6f0] border-b border-[#e5dacd] transition duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-crimson-50 text-crimson-700 border border-crimson-200">
            <Terminal className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#1c1815] text-sm sm:text-base">Autonomous Agent Trace</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-forest-50 text-forest-800 border border-forest-200 font-mono font-bold">
                {trace.length} Steps Completed
              </span>
            </div>
            <p className="text-xs text-[#786a5d] font-mono">Plan ➔ Act ➔ Observe ➔ Revise (Live Tool Execution)</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[#786a5d]">
          <span className="text-xs font-bold hidden sm:inline">{isOpen ? "Hide Trace" : "Show Trace"}</span>
          {isOpen ? <ChevronUp className="w-5 h-5 text-crimson-700" /> : <ChevronDown className="w-5 h-5 text-crimson-700" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 sm:p-5 space-y-3 bg-[#faf7f2] font-mono text-xs max-h-96 overflow-y-auto">
          {trace.map((step, idx) => (
            <div
              key={step.id || idx}
              className="p-3.5 rounded-2xl bg-white border border-[#e5dacd] shadow-sm space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#e5dacd]">
                <div className="flex items-center gap-2">
                  <span
                    className={`uppercase font-bold px-2 py-0.5 rounded text-[10px] ${
                      step.phase === "plan"
                        ? "bg-purple-100 text-purple-800 border border-purple-200"
                        : step.phase === "act"
                        ? "bg-crimson-50 text-crimson-800 border border-crimson-200"
                        : step.phase === "observe"
                        ? "bg-amber-100 text-amber-900 border border-amber-200"
                        : "bg-forest-100 text-forest-900 border border-forest-200"
                    }`}
                  >
                    {step.phase}
                  </span>
                  <span className="text-crimson-700 font-bold flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5" /> {step.tool}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#786a5d] text-[11px]">
                  <Clock className="w-3 h-3" />
                  <span>{step.timestamp}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
                </div>
              </div>

              <div className="space-y-1.5 text-[#382f27]">
                <div>
                  <span className="text-[#786a5d] font-semibold">Input:</span>{" "}
                  <code className="text-[#1c1815] bg-[#f7f3ec] px-1.5 py-0.5 rounded border border-[#e5dacd]">
                    {JSON.stringify(step.input)}
                  </code>
                </div>
                <div className="text-forest-900">
                  <span className="text-[#786a5d] font-semibold">Observation:</span> {step.outputSummary}
                </div>
                <div className="text-[#52463b] italic pt-1 text-[11px] border-t border-[#e5dacd]">
                  <span className="text-crimson-700 not-italic font-bold">Reasoning:</span> {step.reasoning}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
