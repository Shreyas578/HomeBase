"use client";

import React, { useState } from "react";
import { StudentProfile, SettleModuleResult } from "@/types";
import { SettleModule } from "@/components/SettleModule";
import { ConnectModule } from "@/components/ConnectModule";
import { LearnModule } from "@/components/LearnModule";
import { AuthModal } from "@/components/AuthModal";
import { TasteOnboarding } from "@/components/TasteOnboarding";
import {
  Compass,
  Users,
  GraduationCap,
  Sparkles,
  ArrowUpRight,
  RotateCcw,
  Loader2,
  AlertCircle,
  Search,
  Globe2,
  User,
  LogOut,
  Sliders
} from "lucide-react";

const INITIAL_CLEAN_PROFILE: StudentProfile = {
  id: `student-${Date.now()}`,
  display_name: "Maya Chen",
  home_city: "Pune",
  home_country: "India",
  target_city: "Berlin",
  target_university: "TU Berlin",
  target_lat: 52.5119,
  target_lng: 13.3265,
  major: "Computer Science",
  languages: ["English", "Hindi"],
  goals: ["Discover acoustic study spaces", "Connect with kindred peers", "Master thermodynamics through taste"],
  is_public: true,
  taste_entities: [
    {
      id: "ent-1",
      domain: "artist",
      qloo_entity_id: "urn:entity:artist:radiohead",
      name: "Radiohead",
      source: "user",
      weight: 0.95,
      tags: ["alt-rock", "experimental"]
    },
    {
      id: "ent-2",
      domain: "video_game",
      qloo_entity_id: "urn:entity:video_game:portal_2",
      name: "Portal 2",
      source: "user",
      weight: 0.90,
      tags: ["puzzle", "physics"]
    },
    {
      id: "ent-3",
      domain: "place",
      qloo_entity_id: "urn:entity:place:specialty_coffee",
      name: "Third-Wave Pour-Over Coffee",
      source: "user",
      weight: 0.92,
      tags: ["quiet", "wifi", "study"]
    }
  ],
  created_at: new Date().toISOString()
};

export default function Home() {
  const [currentProfile, setCurrentProfile] = useState<StudentProfile>(INITIAL_CLEAN_PROFILE);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<"register" | "login">("register");

  // Tab: settle | connect | learn | profile
  const [activeTab, setActiveTab] = useState<"settle" | "connect" | "learn" | "profile">("settle");
  const [settleData, setSettleData] = useState<SettleModuleResult | null>(null);
  const [isLoadingSettle, setIsLoadingSettle] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const triggerLiveSettle = async (profileToUse: StudentProfile) => {
    setIsLoadingSettle(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/settle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: profileToUse })
      });

      if (!res.ok) {
        throw new Error(`Settle Agent returned status ${res.status}`);
      }

      const data: SettleModuleResult = await res.json();
      setSettleData(data);
      setActiveTab("settle");
    } catch (err: any) {
      console.error("Failed to run live Settle Agent:", err);
      setErrorMessage(err.message || "Failed to reach live agent. Check network connection.");
    } finally {
      setIsLoadingSettle(false);
    }
  };

  const handleOpenAuth = (mode: "register" | "login") => {
    setAuthModalInitialMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (student: StudentProfile) => {
    setCurrentProfile(student);
    setIsLoggedIn(true);
    triggerLiveSettle(student);
  };

  return (
    <main className="min-h-screen bg-[#0d1311] text-[#f2efe9] pb-28 relative overflow-hidden">
      {/* Cinematic Red Rim & Volumetric Glows */}
      <div className="absolute top-0 right-1/4 w-[650px] h-[650px] bg-crimson-600/15 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-emerald-900/15 rounded-full blur-[160px] pointer-events-none" />

      {/* Auth Modal Component */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalInitialMode}
      />

      {/* Top Editorial Navbar matching luxury reference navigation */}
      <header className="sticky top-0 z-50 bg-[#0d1311]/90 backdrop-blur-md border-b border-[#25332e]/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left navigation links */}
          <div className="flex items-center gap-8">
            <span className="font-display font-black text-xl tracking-tighter text-[#dedacb] uppercase mr-2">
              HOME<span className="text-[#e11d48]">BASE</span>
            </span>
            <nav className="hidden md:flex items-center gap-7 text-[11px] font-mono tracking-[0.2em] text-[#a89f91] uppercase">
              <button
                onClick={() => setActiveTab("settle")}
                className={`hover:text-[#dedacb] transition ${activeTab === "settle" ? "text-[#dedacb] font-bold" : ""}`}
              >
                01. SETTLE
              </button>
              <button
                onClick={() => setActiveTab("connect")}
                className={`hover:text-[#dedacb] transition ${activeTab === "connect" ? "text-[#dedacb] font-bold" : ""}`}
              >
                02. CONNECT
              </button>
              <button
                onClick={() => setActiveTab("learn")}
                className={`hover:text-[#dedacb] transition ${activeTab === "learn" ? "text-[#dedacb] font-bold" : ""}`}
              >
                03. LEARN
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`hover:text-[#dedacb] transition ${activeTab === "profile" ? "text-[#dedacb] font-bold" : ""}`}
              >
                04. TASTE GRAPH
              </button>
            </nav>
          </div>

          {/* Right action controls */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141d19] border border-[#2e3e38] text-[11px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48] animate-pulse" />
                  <span className="text-[#dedacb] font-bold">{currentProfile.display_name}</span>
                  <span className="text-[#a89f91]">({currentProfile.target_city || "BERLIN"})</span>
                </div>

                <button
                  onClick={() => setActiveTab("profile")}
                  title="Configure Taste & Coordinates"
                  className="p-2 rounded-full text-[#a89f91] hover:text-[#dedacb] hover:bg-[#1a2621] transition"
                >
                  <Sliders className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    handleOpenAuth("login");
                  }}
                  title="Sign out or Switch Profile"
                  className="p-2 rounded-full text-[#a89f91] hover:text-crimson-400 hover:bg-[#1a2621] transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAuth("login")}
                  className="px-4 py-2 rounded-full text-xs font-mono uppercase text-[#dedacb] hover:bg-[#141d19] transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleOpenAuth("register")}
                  className="px-5 py-2 rounded-full crimson-pill hover:brightness-110 text-white font-mono text-xs uppercase font-bold transition shadow-md"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Unified Luxury Editorial Workspace - Top Viewport */}
      <section className="max-w-7xl mx-auto px-6 pt-6 pb-12 space-y-8">
        {/* Editorial Top Headline Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-[#2e3e38] bg-[#141d19] shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
          {/* Background image & gradient lighting */}
          <div className="absolute inset-0 z-0">
            <img
              src="/hero-student.jpg"
              alt="International Student Culture & Campus Relocation"
              className="w-full h-full object-cover object-center filter contrast-105 brightness-75 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d1311] via-[#0d1311]/85 to-[#0d1311]/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1311] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 p-8 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Signature Editorial Headline matching your reference design */}
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono tracking-[0.28em] text-[#dedacb] uppercase block font-semibold">
                  SAME ROADS • NEW PERSPECTIVES
                </span>
              </div>

              <div className="space-y-0 select-none">
                <h1 className="font-editorial-serif font-black text-5xl sm:text-6xl lg:text-7xl tracking-tight text-[#e11d48] leading-[0.88] drop-shadow-[0_10px_35px_rgba(225,29,72,0.45)]">
                  BUILT
                </h1>
                <h2 className="font-editorial-serif italic font-normal text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#dedacb] leading-[0.9] -mt-1.5">
                  DIFFERENTLY
                </h2>
              </div>

              <div className="w-16 h-[2px] bg-[#dedacb]/60" />

              <p className="text-xs sm:text-sm text-[#c9c3b4] font-light max-w-lg leading-relaxed">
                A fresh take on international relocation — where your personal music, film, cafe, and cultural taste resolves through <strong className="text-[#dedacb] font-medium underline decoration-[#e11d48] decoration-2 underline-offset-4">Qloo&apos;s taste graph</strong> to make an unfamiliar university city feel instantly like home.
              </p>
            </div>

            {/* Right: Quick Launch Status Pill & Target Coordinates Card */}
            <div className="lg:col-span-5 flex flex-col justify-end items-start lg:items-end space-y-4">
              <div className="w-full sm:w-auto p-5 rounded-2xl bg-[#0d1311]/80 backdrop-blur-xl border border-[#2e3e38] space-y-3">
                <div className="flex items-center justify-between gap-6">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#a89f91]">ACTIVE CAMPUS ANCHOR</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-lg font-bold text-[#dedacb] flex items-center gap-2 font-mono">
                  <span>{currentProfile.home_city || "GLOBAL"}</span>
                  <span className="text-[#e11d48]">➔</span>
                  <span className="text-[#dedacb]">{currentProfile.target_city || "BERLIN"}</span>
                </div>
                <div className="text-xs text-[#a89f91] font-mono">
                  {currentProfile.target_university || "Selected University Campus"}
                </div>
                <button
                  onClick={() => triggerLiveSettle(currentProfile)}
                  disabled={isLoadingSettle}
                  className="w-full py-2.5 px-5 rounded-xl crimson-pill hover:brightness-110 text-white font-mono text-xs uppercase tracking-wider font-bold transition flex items-center justify-center gap-2 shadow-lg"
                >
                  {isLoadingSettle ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Compass className="w-3.5 h-3.5" />}
                  <span>RUN AGENT FOR {currentProfile.target_city || "CITY"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Dedicated Per-Feature Tabs) */}
        <div className="flex overflow-x-auto pb-1 gap-2.5 border-b border-[#25332e] text-xs font-mono uppercase tracking-wider">
          <button
            onClick={() => {
              if (!settleData) {
                triggerLiveSettle(currentProfile);
              } else {
                setActiveTab("settle");
              }
            }}
            className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "settle"
                ? "forest-pill text-white scale-[1.02] shadow-lg"
                : "bg-[#141d19] text-[#a89f91] hover:text-[#dedacb] border border-[#25332e]"
            }`}
          >
            {isLoadingSettle ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Compass className="w-4 h-4" />}
            01. Settle (OSM & Qloo Map)
          </button>

          <button
            onClick={() => setActiveTab("connect")}
            className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "connect"
                ? "crimson-pill text-white scale-[1.02] shadow-lg"
                : "bg-[#141d19] text-[#a89f91] hover:text-[#dedacb] border border-[#25332e]"
            }`}
          >
            <Users className="w-4 h-4" /> 02. Connect (Taste Bridges)
          </button>

          <button
            onClick={() => setActiveTab("learn")}
            className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "learn"
                ? "forest-pill text-white scale-[1.02] shadow-lg"
                : "bg-[#141d19] text-[#a89f91] hover:text-[#dedacb] border border-[#25332e]"
            }`}
          >
            <GraduationCap className="w-4 h-4" /> 03. Learn (Analogous Pedagogy)
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "profile"
                ? "crimson-pill text-white scale-[1.02] shadow-lg"
                : "bg-[#141d19] text-[#a89f91] hover:text-[#dedacb] border border-[#25332e]"
            }`}
          >
            <Sparkles className="w-4 h-4" /> 04. My Taste Graph ({currentProfile.taste_entities.length})
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-crimson-950/60 border border-crimson-500/40 text-crimson-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-crimson-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* TAB 01: SETTLE */}
        {activeTab === "settle" && (
          isLoadingSettle ? (
            <div className="p-20 rounded-3xl editorial-card text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-crimson-500 mx-auto" />
              <h3 className="font-display font-bold text-2xl text-[#f2efe9]">
                Orchestrating Taste Intelligence for {currentProfile.target_city}...
              </h3>
              <p className="text-xs font-mono text-[#a89f91] max-w-md mx-auto">
                Geocoding university anchor via Nominatim, running cross-domain Qloo affinity queries, and validating geographic nodes via Overpass API.
              </p>
            </div>
          ) : settleData ? (
            <SettleModule settleData={settleData} />
          ) : (
            <div className="p-16 rounded-3xl editorial-card text-center space-y-4">
              <p className="text-sm text-[#a89f91]">No active Settle data yet for this city.</p>
              <button
                onClick={() => triggerLiveSettle(currentProfile)}
                className="px-8 py-3 rounded-full crimson-pill hover:brightness-110 text-white font-bold text-xs"
              >
                Run Settle Agent
              </button>
            </div>
          )
        )}

        {/* TAB 02: CONNECT */}
        {activeTab === "connect" && <ConnectModule currentProfile={currentProfile} />}

        {/* TAB 03: LEARN */}
        {activeTab === "learn" && <LearnModule currentProfile={currentProfile} />}

        {/* TAB 04: MY TASTE PROFILE / ONBOARDING */}
        {activeTab === "profile" && (
          <TasteOnboarding
            currentProfile={currentProfile}
            onUpdateProfile={(p) => setCurrentProfile(p)}
            onContinue={() => triggerLiveSettle(currentProfile)}
          />
        )}
      </section>
    </main>
  );
}
