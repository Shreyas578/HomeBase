"use client";

import React, { useState } from "react";
import { StudentProfile, TasteEntity, DomainType } from "@/types";
import { sanitizeString } from "@/lib/sanitize";
import {
  X,
  Sparkles,
  Link2,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Music,
  Film,
  Gamepad2,
  Coffee,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  User,
  Compass
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (student: StudentProfile) => void;
  initialMode?: "register" | "login";
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = "register"
}) => {
  const [mode, setMode] = useState<"register" | "login">(initialMode);
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Identity, Step 2: Cultural Taste Coordinates

  // Form State
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [homeCity, setHomeCity] = useState("");
  const [homeCountry, setHomeCountry] = useState("");
  const [targetCity, setTargetCity] = useState("Berlin");
  const [targetUniversity, setTargetUniversity] = useState("TU Berlin");
  const [major, setMajor] = useState("Computer Science");

  // Taste Calibration State
  const [tasteEntities, setTasteEntities] = useState<TasteEntity[]>([
    {
      id: "ent-seed-1",
      domain: "artist",
      qloo_entity_id: "urn:entity:artist:radiohead",
      name: "Radiohead",
      source: "user",
      weight: 0.95,
      tags: ["artist", "alt-rock"]
    },
    {
      id: "ent-seed-2",
      domain: "video_game",
      qloo_entity_id: "urn:entity:video_game:portal_2",
      name: "Portal 2",
      source: "user",
      weight: 0.90,
      tags: ["video_game", "puzzle"]
    }
  ]);

  // URL Importer State
  const [profileUrl, setProfileUrl] = useState("");
  const [isImportingUrl, setIsImportingUrl] = useState(false);
  const [importNotice, setImportNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Manual Add State
  const [newEntityName, setNewEntityName] = useState("");
  const [newEntityDomain, setNewEntityDomain] = useState<DomainType>("artist");
  const [isResolving, setIsResolving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isOpen) return null;

  // URL Importer (Supports Spotify, Steam, Letterboxd, IMDb, Google Maps, Goodreads)
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

      if (!res.ok) throw new Error(`Status ${res.status}`);

      const data = await res.json();
      if (data.entities && data.entities.length > 0) {
        setTasteEntities((prev) => [...prev, ...data.entities]);
        setImportNotice({
          type: "success",
          message: `Successfully resolved ${data.extractedCount} taste anchors from ${data.source.toUpperCase()}!`
        });
        setProfileUrl("");
      } else {
        setImportNotice({
          type: "error",
          message: "Could not resolve entities from this link. Try another link or manual search."
        });
      }
    } catch (err: any) {
      setImportNotice({
        type: "error",
        message: err.message || "Failed to extract taste from URL."
      });
    } finally {
      setIsImportingUrl(false);
    }
  };

  // Manual Entity Resolver via Qloo
  const handleAddManualEntity = async () => {
    const clean = sanitizeString(newEntityName, 80);
    if (!clean) return;
    setIsResolving(true);

    try {
      const res = await fetch(`/api/qloo/search?query=${encodeURIComponent(clean)}&domain=${newEntityDomain}`);
      const data = await res.json();
      const resolved = data.results && data.results.length > 0 ? data.results[0] : null;

      const newEnt: TasteEntity = resolved || {
        id: `entity-${Date.now()}`,
        domain: newEntityDomain,
        qloo_entity_id: `urn:entity:${newEntityDomain}:${encodeURIComponent(clean.toLowerCase())}`,
        name: clean,
        source: "user",
        weight: 0.9,
        tags: [newEntityDomain]
      };

      setTasteEntities((prev) => [...prev, newEnt]);
      setNewEntityName("");
    } catch {
      setTasteEntities((prev) => [
        ...prev,
        {
          id: `entity-${Date.now()}`,
          domain: newEntityDomain,
          qloo_entity_id: `urn:entity:${newEntityDomain}:${encodeURIComponent(clean.toLowerCase())}`,
          name: clean,
          source: "user",
          weight: 0.9,
          tags: [newEntityDomain]
        }
      ]);
      setNewEntityName("");
    } finally {
      setIsResolving(false);
    }
  };

  const handleCompleteRegister = async () => {
    setIsSubmitting(true);
    setAuthError(null);

    const studentPayload: StudentProfile = {
      id: `student-${Date.now()}`,
      display_name: displayName.trim() || "Maya Chen",
      home_city: homeCity.trim() || "Pune",
      home_country: homeCountry.trim() || "India",
      target_city: targetCity.trim() || "Berlin",
      target_university: targetUniversity.trim() || "TU Berlin",
      target_lat: 52.5119,
      target_lng: 13.3265,
      major: major.trim() || "Computer Science",
      languages: ["English"],
      goals: ["Discover acoustic study spaces", "Connect with kindred peers", "Master hard concepts"],
      is_public: true,
      taste_entities: tasteEntities,
      created_at: new Date().toISOString()
    };

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", profile: studentPayload })
      });

      const data = await res.json();
      if (data.student) {
        onAuthSuccess(data.student);
        onClose();
      } else {
        throw new Error(data.error || "Failed to register profile");
      }
    } catch (err: any) {
      setAuthError(err.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSubmit = async () => {
    setIsSubmitting(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email: email.trim(), displayName: displayName.trim() })
      });

      const data = await res.json();
      if (data.student) {
        onAuthSuccess(data.student);
        onClose();
      } else {
        throw new Error(data.error || "Login failed");
      }
    } catch (err: any) {
      setAuthError(err.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDomainIcon = (d: DomainType) => {
    switch (d) {
      case "artist":
        return <Music className="w-3.5 h-3.5 text-crimson-400" />;
      case "movie":
      case "tv_show":
        return <Film className="w-3.5 h-3.5 text-amber-300" />;
      case "video_game":
        return <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />;
      case "place":
        return <Coffee className="w-3.5 h-3.5 text-amber-400" />;
      case "book":
        return <BookOpen className="w-3.5 h-3.5 text-sky-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-[#dedacb]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0d1311] border border-[#2e3e38] shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-crimson-600/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-[#25332e] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display font-black text-xl tracking-tighter text-[#dedacb] uppercase">
              HOME<span className="text-[#e11d48]">BASE</span>
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#a89f91] uppercase px-2.5 py-1 rounded-full border border-[#2e3e38] bg-[#141d19]">
              STUDENT AUTH
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#a89f91] hover:text-[#dedacb] hover:bg-[#1a2621] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex border-b border-[#25332e] text-xs font-mono uppercase tracking-wider">
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-3 text-center transition font-bold ${
              mode === "register" ? "bg-[#141d19] text-[#dedacb] border-b-2 border-crimson-500" : "text-[#a89f91] hover:text-[#dedacb]"
            }`}
          >
            Create Student Profile
          </button>
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-3 text-center transition font-bold ${
              mode === "login" ? "bg-[#141d19] text-[#dedacb] border-b-2 border-crimson-500" : "text-[#a89f91] hover:text-[#dedacb]"
            }`}
          >
            Student Sign In
          </button>
        </div>

        {/* Error Notice */}
        {authError && (
          <div className="m-6 p-3 rounded-xl bg-crimson-950/80 border border-crimson-500/50 text-crimson-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
          {mode === "login" ? (
            /* --- LOGIN FORM --- */
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="font-editorial-serif font-black text-2xl text-[#dedacb]">
                  Welcome Back to HomeBase
                </h3>
                <p className="text-xs text-[#a89f91] font-light">
                  Sign in with your student identity to restore your Qloo taste graph, settlement blueprint, and peer matches.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#141d19] border border-[#2e3e38] focus-within:border-crimson-500">
                  <label className="text-[10px] font-mono uppercase text-[#a89f91] block mb-1">
                    Student Name or Email
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. Maya Chen or maya@tu-berlin.de"
                    className="w-full bg-transparent text-[#dedacb] text-sm font-bold focus:outline-none placeholder-[#3d4f47]"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#141d19] border border-[#2e3e38] focus-within:border-crimson-500">
                  <label className="text-[10px] font-mono uppercase text-[#a89f91] block mb-1">
                    Password / Student PIN
                  </label>
                  <input
                    type="password"
                    defaultValue="demo1234"
                    className="w-full bg-transparent text-[#dedacb] text-sm font-bold focus:outline-none placeholder-[#3d4f47]"
                  />
                </div>
              </div>

              <div className="pt-3 flex flex-col gap-3">
                <button
                  onClick={handleLoginSubmit}
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full crimson-pill hover:brightness-110 text-white font-mono text-xs uppercase tracking-widest font-bold transition flex items-center justify-center gap-2 shadow-lg"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <User className="w-4 h-4" />}
                  Sign In to Dashboard
                </button>

                <button
                  onClick={() => {
                    setEmail("maya@tu-berlin.de");
                    setDisplayName("Maya Chen");
                    handleLoginSubmit();
                  }}
                  className="w-full py-2.5 rounded-full bg-[#18231e] hover:bg-[#202f28] border border-[#2e3e38] text-[#dedacb] font-mono text-xs transition"
                >
                  1-Click Demo Login (Maya Chen • Berlin)
                </button>
              </div>
            </div>
          ) : step === 1 ? (
            /* --- REGISTRATION STEP 1: IDENTITY & CAMPUS --- */
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-crimson-400 uppercase tracking-widest font-bold">
                  Step 01 / 02 • University Coordinates
                </div>
                <h3 className="font-editorial-serif font-black text-2xl text-[#dedacb]">
                  Where is Your Academic Journey Heading?
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#141d19] border border-[#2e3e38] focus-within:border-crimson-500">
                  <label className="text-[10px] font-mono uppercase text-[#a89f91] block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Maya Chen"
                    className="w-full bg-transparent text-[#dedacb] text-sm font-bold focus:outline-none placeholder-[#3d4f47]"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#141d19] border border-[#2e3e38] focus-within:border-crimson-500">
                  <label className="text-[10px] font-mono uppercase text-[#a89f91] block mb-1">
                    Academic Major
                  </label>
                  <input
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full bg-transparent text-[#dedacb] text-sm font-bold focus:outline-none placeholder-[#3d4f47]"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#141d19] border border-[#2e3e38] focus-within:border-crimson-500">
                  <label className="text-[10px] font-mono uppercase text-[#a89f91] block mb-1">
                    Hometown Origin
                  </label>
                  <input
                    type="text"
                    value={homeCity}
                    onChange={(e) => setHomeCity(e.target.value)}
                    placeholder="e.g. Pune, India"
                    className="w-full bg-transparent text-[#dedacb] text-sm font-bold focus:outline-none placeholder-[#3d4f47]"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#141d19] border border-crimson-500/60 focus-within:border-crimson-500">
                  <label className="text-[10px] font-mono uppercase text-crimson-400 font-bold block mb-1">
                    Destination City *
                  </label>
                  <input
                    type="text"
                    value={targetCity}
                    onChange={(e) => setTargetCity(e.target.value)}
                    placeholder="e.g. Berlin or London"
                    className="w-full bg-transparent text-crimson-400 text-sm font-black focus:outline-none placeholder-crimson-900/40"
                  />
                </div>

                <div className="sm:col-span-2 p-4 rounded-2xl bg-[#141d19] border border-[#2e3e38] focus-within:border-crimson-500">
                  <label className="text-[10px] font-mono uppercase text-[#a89f91] block mb-1">
                    Destination University
                  </label>
                  <input
                    type="text"
                    value={targetUniversity}
                    onChange={(e) => setTargetUniversity(e.target.value)}
                    placeholder="e.g. Technical University of Berlin (TU Berlin)"
                    className="w-full bg-transparent text-[#dedacb] text-sm font-bold focus:outline-none placeholder-[#3d4f47]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!targetCity.trim()}
                  className="px-8 py-3.5 rounded-full crimson-pill hover:brightness-110 disabled:opacity-40 text-white font-mono text-xs uppercase tracking-widest font-bold transition flex items-center gap-2 shadow-lg"
                >
                  <span>Continue to Cultural Taste</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* --- REGISTRATION STEP 2: TASTE PROFILE CALIBRATION --- */
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                  Step 02 / 02 • Cultural Frequency Calibration
                </div>
                <h3 className="font-editorial-serif font-black text-2xl text-[#dedacb]">
                  Share Your Tastes (Spotify, Steam, Letterboxd, Google Maps)
                </h3>
                <p className="text-xs text-[#a89f91] font-light">
                  Paste links to your music, movie, gaming, dining, or reading profiles, or add items manually.
                </p>
              </div>

              {/* URL Import Bar */}
              <div className="p-3.5 rounded-2xl bg-[#141d19] border border-[#e11d48]/40 space-y-2">
                <div className="text-[10px] font-mono uppercase text-crimson-400 font-bold flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5" /> Instant Profile Link Importer
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="url"
                    value={profileUrl}
                    onChange={(e) => setProfileUrl(e.target.value)}
                    placeholder="Paste Spotify playlist, Steam game, Letterboxd, Google Maps, or Goodreads URL..."
                    onKeyDown={(e) => e.key === "Enter" && handleImportUrl()}
                    className="w-full flex-1 px-4 py-2.5 rounded-xl bg-[#1c2822] border border-[#2e3e38] text-xs font-mono text-[#dedacb] placeholder-[#a89f91]/40 focus:outline-none focus:border-crimson-500"
                  />
                  <button
                    onClick={handleImportUrl}
                    disabled={isImportingUrl || !profileUrl.trim()}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl crimson-pill hover:brightness-110 disabled:opacity-40 text-white font-mono text-xs uppercase tracking-wider font-bold transition flex items-center justify-center gap-1.5"
                  >
                    {isImportingUrl ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    Extract
                  </button>
                </div>
              </div>

              {importNotice && (
                <div
                  className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
                    importNotice.type === "success"
                      ? "bg-emerald-950/70 border border-emerald-500/40 text-emerald-300"
                      : "bg-crimson-950/70 border border-crimson-500/40 text-crimson-300"
                  }`}
                >
                  {importNotice.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{importNotice.message}</span>
                </div>
              )}

              {/* Manual Add Item */}
              <div className="p-3.5 rounded-2xl bg-[#141d19] border border-[#2e3e38] flex flex-col sm:flex-row items-center gap-2">
                <select
                  value={newEntityDomain}
                  onChange={(e) => setNewEntityDomain(e.target.value as DomainType)}
                  className="w-full sm:w-auto px-3 py-2 rounded-xl bg-[#1c2822] border border-[#2e3e38] text-xs font-mono uppercase text-[#dedacb] focus:outline-none focus:border-crimson-500 cursor-pointer"
                >
                  <option value="artist">Music / Artist</option>
                  <option value="video_game">Video Game</option>
                  <option value="movie">Movie / Anime</option>
                  <option value="place">Cafe / Dining</option>
                  <option value="book">Book / Literature</option>
                </select>

                <input
                  type="text"
                  value={newEntityName}
                  onChange={(e) => setNewEntityName(e.target.value)}
                  placeholder="Or search favorite artist, game, or cafe..."
                  onKeyDown={(e) => e.key === "Enter" && handleAddManualEntity()}
                  className="w-full flex-1 px-4 py-2 rounded-xl bg-[#1c2822] border border-[#2e3e38] text-xs font-mono text-[#dedacb] placeholder-[#a89f91]/40 focus:outline-none focus:border-crimson-500"
                />

                <button
                  onClick={handleAddManualEntity}
                  disabled={isResolving || !newEntityName.trim()}
                  className="w-full sm:w-auto px-5 py-2 rounded-xl forest-pill hover:brightness-110 disabled:opacity-40 text-white font-mono text-xs uppercase tracking-wider font-bold transition flex items-center justify-center gap-1.5"
                >
                  {isResolving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  Add
                </button>
              </div>

              {/* Cultural Coordinates Badges */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#a89f91]">
                  <span>Active Taste Anchors ({tasteEntities.length})</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    QLOO READY
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
                  {tasteEntities.map((ent) => (
                    <div
                      key={ent.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141d19] border border-[#2e3e38] text-xs text-[#dedacb]"
                    >
                      {getDomainIcon(ent.domain)}
                      <span className="font-semibold">{ent.name}</span>
                      <span className="text-[9px] font-mono uppercase text-crimson-400 px-1.5 py-0.2 rounded bg-crimson-950/60 border border-crimson-500/20">
                        {ent.domain}
                      </span>
                      <button
                        onClick={() => setTasteEntities((prev) => prev.filter((e) => e.id !== ent.id))}
                        className="text-[#a89f91] hover:text-crimson-400 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation CTAs */}
              <div className="pt-4 flex items-center justify-between border-t border-[#25332e]">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-mono text-[#a89f91] hover:text-[#dedacb] transition"
                >
                  ← Back to Coordinates
                </button>

                <button
                  onClick={handleCompleteRegister}
                  disabled={isSubmitting || tasteEntities.length === 0}
                  className="px-8 py-3.5 rounded-full crimson-pill hover:brightness-110 disabled:opacity-40 text-white font-mono text-xs uppercase tracking-widest font-bold transition flex items-center gap-2 shadow-xl"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Compass className="w-4 h-4" />}
                  <span>Launch My HomeBase</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
