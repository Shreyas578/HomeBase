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
  Building2,
  ArrowUpRight
} from "lucide-react";

interface SettleModuleProps {
  settleData: SettleModuleResult;
}

export const SettleModule: React.FC<SettleModuleProps> = ({ settleData }) => {
  const [selectedPlace, setSelectedPlace] = useState<VerifiedPlace>(settleData.places[0] || ({} as any));
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
        return <UtensilsCrossed className="w-4 h-4 text-crimson-400" />;
      case "grocery":
        return <ShoppingBag className="w-4 h-4 text-emerald-400" />;
      default:
        return <Building2 className="w-4 h-4 text-[#a89f91]" />;
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Editorial Header */}
      <div className="editorial-card rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-crimson-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2">
          <div className="text-xs font-mono tracking-widest text-crimson-500 uppercase">
            // MODULE 02 : SETTLE & GEOGRAPHY
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#f2efe9] tracking-tight">
            Taste Twins in {settleData.city}
          </h2>
          <p className="text-sm text-[#a89f91] max-w-2xl font-light">
            Live OpenStreetMap coordinates verified and weighted against your Qloo cultural signals,
            eliminating tourist traps and calculating exact walking times from your campus.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyPlan}
            className="px-5 py-3 rounded-full bg-[#141d19] border border-[#2e3e38] hover:border-crimson-500 text-xs font-mono uppercase tracking-wider text-[#f2efe9] transition flex items-center gap-2"
          >
            {copiedPlan ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            {copiedPlan ? "Copied" : "Export Blueprint"}
          </button>
          <button
            onClick={() => window.print()}
            className="p-3 rounded-full bg-[#141d19] border border-[#2e3e38] hover:border-crimson-500 text-[#a89f91] hover:text-[#f2efe9] transition"
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Map View */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#f2efe9] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-crimson-500" /> Geographic Node Network
            </span>
            <span className="text-xs font-mono text-[#a89f91]">OSM OVERPASS TILES</span>
          </div>

          <MapView
            centerLat={settleData.places[0]?.lat || 52.5119}
            centerLng={settleData.places[0]?.lng || 13.3265}
            places={settleData.places}
            selectedPlaceId={selectedPlace?.id}
            onSelectPlace={(p) => setSelectedPlace(p)}
          />

          {/* Neighborhood Fit Signature Feature */}
          <div className="editorial-card rounded-3xl p-6 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-crimson-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> Neighborhood Taste Alignment Index
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {settleData.neighborhoods.map((n) => (
                <div key={n.name} className="p-5 rounded-2xl bg-[#141d19] border border-[#2e3e38] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#f2efe9] text-sm">{n.name}</span>
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-forest-950/80 text-emerald-400 border border-emerald-500/40">
                      {n.score}% Fit
                    </span>
                  </div>
                  <p className="text-xs text-[#a89f91] line-clamp-2 leading-relaxed">{n.vibe}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Places List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#f2efe9]">
              Verified Taste Places ({settleData.places.length})
            </span>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% LOCATED
            </span>
          </div>

          <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {settleData.places.map((place) => (
              <div
                key={place.id}
                onClick={() => setSelectedPlace(place)}
                className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
                  selectedPlace?.id === place.id
                    ? "bg-[#18231e] border-crimson-500 shadow-xl shadow-crimson-950/20"
                    : "bg-[#141d19] border-[#2e3e38] hover:border-[#3d524a]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="p-3 rounded-xl bg-[#0d1311] border border-[#2e3e38]">
                      {getCategoryIcon(place.category)}
                    </span>
                    <div>
                      <h4 className="font-bold text-[#f2efe9] text-sm tracking-wide">{place.name}</h4>
                      <p className="text-xs text-[#a89f91] font-mono">{place.cuisine || place.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-crimson-400 bg-crimson-950/60 border border-crimson-500/30 px-2 py-0.5 rounded-full">
                      {place.qloo_affinity_score}%
                    </span>
                    <div className="text-[10px] text-[#a89f91] font-mono flex items-center justify-end gap-1 mt-1.5">
                      <Clock className="w-3 h-3" /> {place.walking_time_mins} min walk
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 text-xs text-[#a89f91] leading-relaxed bg-[#0d1311]/60 p-3 rounded-xl border border-[#2e3e38]">
                  <span className="text-crimson-400 font-semibold">Taste Rationale: </span>
                  {place.why_it_fits}
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#a89f91]">
                  <span>{place.address}</span>
                  {place.website && (
                    <a
                      href={place.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-crimson-400 hover:text-crimson-300 flex items-center gap-1"
                    >
                      Website <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Week-by-Week Action Plan */}
      <div className="editorial-card rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-crimson-500" />
          <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#f2efe9]">
            The First-30-Days Actionable Landing Blueprint
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settleData.first30DaysPlan.map((week) => (
            <div key={week.weekNumber} className="p-6 rounded-3xl bg-[#141d19] border border-[#2e3e38] space-y-4">
              <div className="pb-4 border-b border-[#2e3e38] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-crimson-400 font-bold">
                    Week 0{week.weekNumber}
                  </span>
                  <h4 className="font-display font-bold text-lg text-[#f2efe9]">{week.theme}</h4>
                </div>
                <span className="text-xs text-[#a89f91] italic max-w-[200px] text-right line-clamp-1">
                  {week.focus}
                </span>
              </div>

              <div className="space-y-4">
                {week.days.map((day) => (
                  <div key={day.dayName} className="space-y-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                      {day.dayName}
                    </span>
                    {day.items.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-[#0d1311] border border-[#2e3e38] space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#f2efe9]">{item.title}</span>
                          <span className="text-[10px] font-mono text-crimson-400 uppercase">{item.timeOfDay}</span>
                        </div>
                        <p className="text-xs text-[#a89f91] leading-relaxed">{item.activity}</p>
                        <p className="text-[11px] text-[#a89f91]/70 italic pt-1 border-t border-[#2e3e38]">
                          <span className="text-crimson-400 not-italic font-semibold font-mono">Taste Link:</span>{" "}
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
