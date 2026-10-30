"use client";

import React, { useState } from "react";
import { StudentProfile, TasteEntity, DomainType } from "@/types";
import { sanitizeString } from "@/lib/sanitize";
import { Plus, X, Sparkles, Music, Film, Coffee, Gamepad2, Loader2, ArrowRight, Link2, CheckCircle2, AlertCircle } from "lucide-react";

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
  const [activeInputMode, setActiveInputMode] = useState<"search" | "url_import">("search");
  const [profileUrl, setProfileUrl] = useState("");
  const [isImportingUrl, setIsImportingUrl] = useState(false);
  const [importNotice, setImportNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [newEntityName, setNewEntityName] = useState("");
  const [newEntityDomain, setNewEntityDomain] = useState<DomainType>("artist");
  const [isResolving, setIsResolving] = useState(false);

  const handleFieldChange = (field: keyof StudentProfile, value: string) => {
    onUpdateProfile({
      ...currentProfile,
      [field]: value
    });
  };

  const handleAddEntity = async () => {
    const cleanName = sanitizeString(newEntityName, 80);
    if (!cleanName) return;
    setIsResolving(true);

    try {
      const res = await fetch(`/api/qloo/search?query=${encodeURIComponent(cleanName)}&domain=${newEntityDomain}`);
      const data = await res.json();
      const resolved = data.results && data.results.length > 0 ? data.results[0] : null;

      const newEntity: TasteEntity = resolved || {
        id: `entity-${Date.now()}`,
        domain: newEntityDomain,
        qloo_entity_id: `urn:entity:${newEntityDomain}:${encodeURIComponent(cleanName.toLowerCase())}`,
        name: cleanName,
        source: "user",
        weight: 0.9,
        tags: [newEntityDomain],
        description: `Resolved preference for ${cleanName}`
      };

      onUpdateProfile({
        ...currentProfile,
        taste_entities: [...currentProfile.taste_entities, newEntity]
      });

      setNewEntityName("");
    } catch (e) {
      console.warn("Live resolve fallback:", e);
      onUpdateProfile({
        ...currentProfile,
        taste_entities: [
          ...currentProfile.taste_entities,
          {
            id: `entity-${Date.now()}`,
            domain: newEntityDomain,
            qloo_entity_id: `urn:entity:${newEntityDomain}:${encodeURIComponent(cleanName.toLowerCase())}`,
            name: cleanName,
            source: "user",
            weight: 0.9,
            tags: [newEntityDomain]
          }
        ]
      });
      setNewEntityName("");
    } finally {
      setIsResolving(false);
    }
  };

  const handleImportUrl = async () => {
    if (!profileUrl.trim()) return;
    setIsImportingUrl(true);
    setImportNotice(null);

    try {
      const res = await fetch("/api/import-taste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: profileUrl.trim() })
      });

      if (!res.ok) {
        throw new Error(`Profile importer returned status ${res.status}`);
      }

      const data = await res.json();
      if (data.entities && data.entities.length > 0) {
        onUpdateProfile({
          ...currentProfile,
          taste_entities: [...currentProfile.taste_entities, ...data.entities]
        });
        setImportNotice({
          type: "success",
          message: `Successfully resolved ${data.extractedCount} taste entities from ${data.source.toUpperCase()}!`
        });
        setProfileUrl("");
      } else {
        setImportNotice({
          type: "error",
          message: "Could not extract entities from this link. Try another link or manual search."
        });
      }
    } catch (err: any) {
      setImportNotice({
        type: "error",
        message: err.message || "Failed to import profile link."
      });
    } finally {
      setIsImportingUrl(false);
    }
  };

  const handleRemoveEntity = (id: string) => {
    onUpdateProfile({
      ...currentProfile,
      taste_entities: currentProfile.taste_entities.filter((e) => e.id !== id)
    });
  };

  const getDomainIcon = (domain: DomainType) => {
    switch (domain) {
      case "artist":
        return <Music className="w-3.5 h-3.5 text-crimson-400" />;
      case "movie":
      case "tv_show":
        return <Film className="w-3.5 h-3.5 text-beige-300" />;
      case "place":
        return <Coffee className="w-3.5 h-3.5 text-emerald-400" />;
      case "video_game":
        return <Gamepad2 className="w-3.5 h-3.5 text-crimson-300" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-beige-200" />;
    }
  };

  return (
    <div className="w-full editorial-card rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-[#2e3e38] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      {/* Editorial Header */}
      <div className="pb-8 border-b border-[#25332e] flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#e11d48] uppercase mb-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#e11d48] animate-ping" />
            01 / TASTE RESOLUTION ENGINE
          </div>
          <h2 className="font-editorial-serif font-black text-3xl sm:text-5xl text-[#dedacb] tracking-tight">
            Configure Your Cultural Coordinates
          </h2>
          <p className="text-sm text-[#a89f91] mt-1.5 font-light max-w-xl">
            Input your destination city and personal cultural affinities. Our Qloo taste graph agent maps your unique frequency directly onto your new campus.
          </p>
        </div>
        <div className="text-right hidden md:block">
          <span className="text-[10px] font-mono tracking-widest text-[#a89f91] uppercase px-3.5 py-1.5 rounded-full border border-[#2e3e38] bg-[#141d19]">
            POWERED BY QLOO V2 API
          </span>
        </div>
      </div>

      {/* Editorial Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
        <div className="group p-5 rounded-2xl bg-[#141d19]/90 border border-[#2e3e38] focus-within:border-[#e11d48] focus-within:shadow-[0_0_20px_rgba(225,29,72,0.2)] transition-all duration-300">
          <label className="text-[10px] font-mono tracking-wider text-[#a89f91] uppercase block mb-1.5 font-semibold group-focus-within:text-[#dedacb]">
            Student Name
          </label>
          <input
            type="text"
            value={currentProfile.display_name}
            onChange={(e) => handleFieldChange("display_name", e.target.value)}
            placeholder="e.g. Maya Chen"
            className="w-full bg-transparent text-[#dedacb] font-bold text-base focus:outline-none placeholder-[#3d4f47]"
          />
        </div>

        <div className="group p-5 rounded-2xl bg-[#141d19]/90 border border-[#2e3e38] focus-within:border-[#e11d48] focus-within:shadow-[0_0_20px_rgba(225,29,72,0.2)] transition-all duration-300">
          <label className="text-[10px] font-mono tracking-wider text-[#a89f91] uppercase block mb-1.5 font-semibold group-focus-within:text-[#dedacb]">
            Hometown Origin
          </label>
          <input
            type="text"
            value={currentProfile.home_city}
            onChange={(e) => handleFieldChange("home_city", e.target.value)}
            placeholder="e.g. Pune, India"
            className="w-full bg-transparent text-[#dedacb] font-bold text-base focus:outline-none placeholder-[#3d4f47]"
          />
        </div>

        <div className="group p-5 rounded-2xl bg-[#141d19]/90 border border-[#e11d48]/50 focus-within:border-[#e11d48] focus-within:shadow-[0_0_25px_rgba(225,29,72,0.3)] transition-all duration-300">
          <label className="text-[10px] font-mono tracking-wider text-[#e11d48] font-bold uppercase block mb-1.5">
            Target University City *
          </label>
          <input
            type="text"
            value={currentProfile.target_city}
            onChange={(e) => handleFieldChange("target_city", e.target.value)}
            placeholder="e.g. London or Berlin"
            className="w-full bg-transparent text-[#e11d48] font-black text-base focus:outline-none placeholder-[#e11d48]/40"
          />
        </div>

        <div className="group p-5 rounded-2xl bg-[#141d19]/90 border border-[#2e3e38] focus-within:border-[#e11d48] focus-within:shadow-[0_0_20px_rgba(225,29,72,0.2)] transition-all duration-300">
          <label className="text-[10px] font-mono tracking-wider text-[#a89f91] uppercase block mb-1.5 font-semibold group-focus-within:text-[#dedacb]">
            Target University
          </label>
          <input
            type="text"
            value={currentProfile.target_university}
            onChange={(e) => handleFieldChange("target_university", e.target.value)}
            placeholder="e.g. UCL or TU Berlin"
            className="w-full bg-transparent text-[#dedacb] font-bold text-base focus:outline-none placeholder-[#3d4f47]"
          />
        </div>
      </div>

      {/* Taste Signals Tags */}
      <div className="my-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono tracking-widest text-[#a89f91] uppercase">
            Active Cultural Taste Anchors ({currentProfile.taste_entities.length})
          </span>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            LIVE GRAPH READY
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          {currentProfile.taste_entities.map((entity) => (
            <div
              key={entity.id}
              className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#18231e] border border-[#2e3e38] hover:border-[#e11d48] transition-all duration-300 text-xs text-[#dedacb] group hover:shadow-[0_0_15px_rgba(225,29,72,0.2)]"
            >
              {getDomainIcon(entity.domain)}
              <span className="font-semibold tracking-wide">{entity.name}</span>
              <span className="text-[10px] text-[#e11d48] font-mono uppercase px-2 py-0.5 rounded-full bg-[#e11d48]/15 border border-[#e11d48]/30">
                {entity.domain}
              </span>
              <button
                onClick={() => handleRemoveEntity(entity.id)}
                className="text-[#a89f91] hover:text-[#e11d48] transition"
                title="Remove taste entity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Import Mode Selector */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setActiveInputMode("search")}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition ${
            activeInputMode === "search"
              ? "bg-[#1c2822] text-[#dedacb] border border-[#dedacb]/40 font-bold"
              : "text-[#a89f91] hover:text-[#dedacb]"
          }`}
        >
          Manual Search
        </button>
        <button
          onClick={() => setActiveInputMode("url_import")}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition flex items-center gap-2 ${
            activeInputMode === "url_import"
              ? "crimson-pill text-white font-bold shadow-lg"
              : "text-[#a89f91] hover:text-[#dedacb]"
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>Import Profile (Spotify / Letterboxd / IMDb)</span>
        </button>
      </div>

      {/* Notice Banner */}
      {importNotice && (
        <div
          className={`p-3.5 rounded-xl text-xs font-mono mb-4 flex items-center gap-2.5 ${
            importNotice.type === "success"
              ? "bg-emerald-950/70 border border-emerald-500/50 text-emerald-300"
              : "bg-crimson-950/70 border border-crimson-500/50 text-crimson-300"
          }`}
        >
          {importNotice.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-crimson-400 shrink-0" />
          )}
          <span>{importNotice.message}</span>
        </div>
      )}

      {/* Input Bar: Mode A (Manual Search) or Mode B (URL Importer) */}
      {activeInputMode === "search" ? (
        <div className="p-3 sm:p-4 rounded-2xl bg-[#141d19] border border-[#2e3e38] flex flex-col sm:flex-row items-center gap-3">
          <select
            value={newEntityDomain}
            onChange={(e) => setNewEntityDomain(e.target.value as DomainType)}
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-[#1c2822] border border-[#2e3e38] text-xs font-mono uppercase text-[#dedacb] focus:outline-none focus:border-[#e11d48] cursor-pointer"
          >
            <option value="artist">Music / Artist</option>
            <option value="movie">Movie</option>
            <option value="tv_show">Anime / Series</option>
            <option value="video_game">Video Game</option>
            <option value="place">Dining / Cafe Vibe</option>
            <option value="book">Book / Literature</option>
          </select>

          <input
            type="text"
            value={newEntityName}
            onChange={(e) => setNewEntityName(e.target.value)}
            placeholder="Add an artist, film, game, or cafe preference..."
            onKeyDown={(e) => e.key === "Enter" && handleAddEntity()}
            className="w-full flex-1 px-5 py-3 rounded-xl bg-[#1c2822] border border-[#2e3e38] text-xs font-medium text-[#dedacb] placeholder-[#a89f91]/50 focus:outline-none focus:border-[#e11d48]"
          />

          <button
            onClick={handleAddEntity}
            disabled={isResolving || !newEntityName.trim()}
            className="w-full sm:w-auto px-7 py-3 rounded-xl forest-pill hover:brightness-110 disabled:opacity-40 text-white font-mono text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 whitespace-nowrap shadow-lg"
          >
            {isResolving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Resolve via Qloo
          </button>
        </div>
      ) : (
        <div className="p-3 sm:p-4 rounded-2xl bg-[#141d19] border border-[#e11d48]/40 flex flex-col sm:flex-row items-center gap-3 shadow-[0_0_20px_rgba(225,29,72,0.15)]">
          <input
            type="url"
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
            placeholder="Paste Spotify playlist/artist link, Letterboxd user/film link, or IMDb profile..."
            onKeyDown={(e) => e.key === "Enter" && handleImportUrl()}
            className="w-full flex-1 px-5 py-3 rounded-xl bg-[#1c2822] border border-[#2e3e38] text-xs font-mono text-[#dedacb] placeholder-[#a89f91]/40 focus:outline-none focus:border-[#e11d48]"
          />

          <button
            onClick={handleImportUrl}
            disabled={isImportingUrl || !profileUrl.trim()}
            className="w-full sm:w-auto px-7 py-3 rounded-xl crimson-pill hover:brightness-110 disabled:opacity-40 text-white font-mono text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 whitespace-nowrap shadow-lg"
          >
            {isImportingUrl ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
            Extract & Resolve Taste
          </button>
        </div>
      )}

      {/* Action CTA */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#25332e]">
        <div className="text-xs font-mono text-[#a89f91]">
          Step 01 of 04 • Ready to initialize autonomous relocation agents
        </div>

        <button
          onClick={onContinue}
          disabled={!currentProfile.target_city.trim() || currentProfile.taste_entities.length === 0}
          className="w-full sm:w-auto px-9 py-4 rounded-full crimson-pill hover:brightness-110 disabled:opacity-40 text-white font-mono font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(225,29,72,0.4)]"
        >
          <span>Generate Settle Pipeline for {currentProfile.target_city || "Selected City"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
