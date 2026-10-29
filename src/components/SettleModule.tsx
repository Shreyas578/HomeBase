"use client";

import React, { useState } from "react";
import { SettleModuleResult, VerifiedPlace } from "@/types";
import { MapView } from "./MapView";
import { QlooComparisonCard } from "./QlooComparisonCard";
import { AgentTrace } from "./AgentTrace";
import {
  Compass,
  MapPin,
  Clock,
  ExternalLink,
  Sparkles,
  Calendar,
  Share2,
  Printer,
  ShieldCheck,
  Check,
  Coffee,
  UtensilsCrossed,
  ShoppingBag,
  Building2
} from "lucide-react";

interface SettleModuleProps {
  settleData: SettleModuleResult;
}

export const SettleModule: React.FC<SettleModuleProps> = ({ settleData }) => {
  const [selectedPlace, setSelectedPlace] = useState<VerifiedPlace>(settleData.places[0]);
  const [copiedPlan, setCopiedPlan] = useState(false);

  const handleCopyPlan = () => {
    const planText = settleData.first30DaysPlan
      .map(
        (w) =>
          `Week ${w.weekNumber}: ${w.theme}\n${w.days
            .map(
              (d) =>
                `  ${d.dayName}:\n${d.items
                  .map((i) => `    - [${i.timeOfDay}] ${i.title}: ${i.whyThisFits}`)
                  .join("\n")}`
            )
            .join("\n")}`
      )
      .join("\n\n");

    navigator.clipboard.writeText(planText);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2500);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "cafe":
        return <Coffee className="w-4 h-4 text-amber-400" />;
      case "restaurant":
        return <UtensilsCrossed className="w-4 h-4 text-rose-400" />;
      case "grocery":
        return <ShoppingBag className="w-4 h-4 text-emerald-400" />;
      default:
        return <Building2 className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Module Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4" /> Module 1: Settle
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Taste Twin Discovery & First-30-Days Blueprint
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Qloo maps your music, film, and dining taste signals to real OSM-verified venues in {settleData.city},
            scoring neighborhoods by affinity and engineering your landing week-by-week.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={handleCopyPlan}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-indigo-500 text-xs font-semibold text-white transition flex items-center justify-center gap-2"
          >
            {copiedPlan ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            {copiedPlan ? "Plan Copied!" : "Export Plan"}
          </button>
          <button
            onClick={() => window.print()}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-indigo-500 text-xs font-semibold text-slate-300 hover:text-white transition"
            title="Print View"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Autonomous Agent Trace */}
      <AgentTrace trace={settleData.agentTrace} />

      {/* Signature Qloo ON / OFF Toggle */}
      <QlooComparisonCard module="SETTLE" />

      {/* Map & Places Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map View */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400" /> Interactive OSM Campus & Taste Map
            </span>
            <span className="text-xs text-slate-400">OpenStreetMap Tiles • Verified Nodes</span>
          </div>

          <MapView
            centerLat={52.5119}
            centerLng={13.3265}
            places={settleData.places}
            selectedPlaceId={selectedPlace?.id}
            onSelectPlace={(p) => setSelectedPlace(p)}
          />

          {/* Neighborhood Taste Fit Signature Feature */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Neighborhood Taste Fit Scores (Signature Feature)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {settleData.neighborhoods.map((n) => (
                <div key={n.name} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-xs">{n.name}</span>
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {n.score}% Fit
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{n.vibe}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Places List & Detail View */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">Qloo Taste-Matched Places</span>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Located
            </span>
          </div>

          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {settleData.places.map((place) => (
              <div
                key={place.id}
                onClick={() => setSelectedPlace(place)}
                className={`p-4 rounded-2xl cursor-pointer transition glass-panel-hover border ${
                  selectedPlace?.id === place.id
                    ? "bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-500/10"
                    : "bg-slate-900/60 border-slate-800"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                      {getCategoryIcon(place.category)}
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-sm">{place.name}</h4>
                      <p className="text-xs text-slate-400">{place.cuisine || place.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                      {place.qloo_affinity_score}% Match
                    </span>
                    <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1 mt-1">
                      <Clock className="w-3 h-3" /> {place.walking_time_mins} min walk
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                  <span className="text-indigo-400 font-semibold">Why this fits: </span>
                  {place.why_it_fits}
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{place.address}</span>
                  {place.website && (
                    <a
                      href={place.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5"
                    >
                      Website <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Week-by-Week First 30 Days Plan */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <h3 className="text-xl font-bold text-white">Your First-30-Days Actionable Landing Plan</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settleData.first30DaysPlan.map((week) => (
            <div key={week.weekNumber} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider font-mono">
                    Week 0{week.weekNumber}
                  </span>
                  <h4 className="font-bold text-white text-base">{week.theme}</h4>
                </div>
                <span className="text-xs text-slate-400 italic max-w-[180px] text-right line-clamp-1">
                  {week.focus}
                </span>
              </div>

              <div className="space-y-3">
                {week.days.map((day) => (
                  <div key={day.dayName} className="space-y-2">
                    <span className="text-xs font-semibold text-indigo-300">{day.dayName}</span>
                    {day.items.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">{item.title}</span>
                          <span className="text-[10px] text-indigo-400 font-mono">{item.timeOfDay}</span>
                        </div>
                        <p className="text-xs text-slate-300">{item.activity}</p>
                        <p className="text-[11px] text-slate-400 italic">
                          <span className="text-indigo-400 not-italic font-medium">Taste citation:</span>{" "}
                          {item.whyThisFits}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
