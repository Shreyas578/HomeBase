"use client";

import React, { useState } from "react";
import { StudentProfile, TasteEntity, DomainType } from "@/types";
import { DEMO_PRIMARY_STUDENT } from "@/data/seedProfiles";
import { Plus, X, Sparkles, MapPin, GraduationCap, Compass, BookOpen, Music, Film, Coffee, Gamepad2 } from "lucide-react";

interface TasteOnboardingProps {
  currentProfile: StudentProfile;
  onUpdateProfile: (updated: StudentProfile) => void;
  onContinue: () => void;
}

export const TasteOnboarding: React.FC<TasteOnboardingProps> = ({
  currentProfile,
  onUpdateProfile,
  onContinue
}) => {
  const [newEntityName, setNewEntityName] = useState("");
  const [newEntityDomain, setNewEntityDomain] = useState<DomainType>("artist");
  const [isResolving, setIsResolving] = useState(false);

  const handleAddEntity = () => {
    if (!newEntityName.trim()) return;
    setIsResolving(true);

    setTimeout(() => {
      const newEntity: TasteEntity = {
        id: `custom-${Date.now()}`,
        domain: newEntityDomain,
        qloo_entity_id: `urn:entity:${newEntityDomain}:${encodeURIComponent(newEntityName.toLowerCase())}`,
        name: newEntityName.trim(),
        source: "user",
        weight: 0.9,
        tags: [newEntityDomain, "user-added"],
        description: `Resolved through Qloo taste graph as ${newEntityDomain}`
      };

      onUpdateProfile({
        ...currentProfile,
        taste_entities: [...currentProfile.taste_entities, newEntity]
      });

      setNewEntityName("");
      setIsResolving(false);
    }, 400);
  };

  const handleRemoveEntity = (id: string) => {
    onUpdateProfile({
      ...currentProfile,
      taste_entities: currentProfile.taste_entities.filter((e) => e.id !== id)
    });
  };

  const loadDemoPersona = () => {
    onUpdateProfile(DEMO_PRIMARY_STUDENT);
  };

  const getDomainIcon = (domain: DomainType) => {
    switch (domain) {
      case "artist":
        return <Music className="w-3.5 h-3.5 text-indigo-400" />;
      case "movie":
      case "tv_show":
        return <Film className="w-3.5 h-3.5 text-purple-400" />;
      case "place":
        return <Coffee className="w-3.5 h-3.5 text-amber-400" />;
      case "video_game":
        return <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Compass className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Student Taste Onboarding</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Resolve your cultural, music, dining, gaming, and literary affinities into Qloo's multidimensional taste graph.
          </p>
        </div>

        <button
          onClick={loadDemoPersona}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition flex items-center gap-2 self-stretch sm:self-auto justify-center"
        >
          <Sparkles className="w-4 h-4" /> Try Demo: Aarav (Pune ➔ Berlin)
        </button>
      </div>

      {/* Relocation Coordinates */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Hometown Origin</div>
            <div className="text-sm font-semibold text-white">
              {currentProfile.home_city}, {currentProfile.home_country}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Destination University</div>
            <div className="text-sm font-semibold text-white">{currentProfile.target_university}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Academic Major</div>
            <div className="text-sm font-semibold text-white">{currentProfile.major}</div>
          </div>
        </div>
      </div>

      {/* Taste Entities Tag Cloud */}
      <div className="my-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Active Taste Graph Signals ({currentProfile.taste_entities.length})
          </span>
          <span className="text-xs text-indigo-400 font-mono">Qloo Resolved & Weighted</span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {currentProfile.taste_entities.map((entity) => (
            <div
              key={entity.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-indigo-500/50 transition text-xs text-slate-200 group"
            >
              {getDomainIcon(entity.domain)}
              <span className="font-medium">{entity.name}</span>
              <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-1.5 py-0.5 rounded">
                {(entity.weight * 100).toFixed(0)}%
              </span>
              <button
                onClick={() => handleRemoveEntity(entity.id)}
                className="text-slate-500 hover:text-rose-400 transition ml-1"
                title="Remove taste entity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Taste Entity Form */}
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row items-center gap-3">
        <select
          value={newEntityDomain}
          onChange={(e) => setNewEntityDomain(e.target.value as DomainType)}
          className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="artist">Music / Artist</option>
          <option value="movie">Movie</option>
          <option value="tv_show">Anime / TV Show</option>
          <option value="video_game">Video Game</option>
          <option value="place">Dining / Cafe Vibe</option>
          <option value="brand">Brand / Lifestyle</option>
          <option value="book">Book / Literature</option>
        </select>

        <input
          type="text"
          value={newEntityName}
          onChange={(e) => setNewEntityName(e.target.value)}
          placeholder="Type an artist, show, game, or cafe preference..."
          onKeyDown={(e) => e.key === "Enter" && handleAddEntity()}
          className="w-full flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />

        <button
          onClick={handleAddEntity}
          disabled={isResolving || !newEntityName.trim()}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs transition flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
          {isResolving ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
          Resolve Entity
        </button>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onContinue}
          className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition flex items-center justify-center gap-2"
        >
          Launch Taste Intelligence Dashboard ➔
        </button>
      </div>
    </div>
  );
};
