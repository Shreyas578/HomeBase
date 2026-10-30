"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { StudentProfile, SettleModuleResult } from "@/types";
import { SettleModule } from "@/components/SettleModule";
import { ConnectModule } from "@/components/ConnectModule";
import { AuthModal } from "@/components/AuthModal";
import { TasteOnboarding } from "@/components/TasteOnboarding";
import {
  Compass,
  Users,
  Sparkles,
  ArrowUpRight,
  RotateCcw,
  Loader2,
  AlertCircle,
  Search,
  Globe2,
  User,
  LogOut,
  Sliders,
  ShieldCheck,
  Lock,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const [currentProfile, setCurrentProfile] = useState<StudentProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<"register" | "login" | "edit">("login");

  // Tab: settle | connect | profile
  const [activeTab, setActiveTab] = useState<"settle" | "connect" | "profile">("settle");
  const [settleData, setSettleData] = useState<SettleModuleResult | null>(null);
  const [isLoadingSettle, setIsLoadingSettle] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check existing session on load
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.student) {
            setCurrentProfile(data.student);
            setIsLoggedIn(true);
            triggerLiveSettle(data.student);
            return;
          }
        }
      } catch {
        // Not authenticated
      } finally {
        setIsCheckingAuth(false);
      }
    }
    checkSession();
  }, []);

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
    setAuthModalOpen(false);
    triggerLiveSettle(student);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" })
      });
    } catch {
      // Ignore
    }
    setIsLoggedIn(false);
    setCurrentProfile(null);
    setSettleData(null);
  };

  // Loading state while verifying token
  if (isCheckingAuth) {
    return (
      <main className="min-h-screen bg-[#070b09] text-[#f2efe9] flex flex-col items-center justify-center space-y-4">
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-2xl border border-white/10 p-1 bg-black/40">
          <img src="/logo.jpg" alt="HomeBase" className="w-full h-full object-contain" />
        </div>
        <Loader2 className="w-6 h-6 animate-spin text-[#e11d48]" />
        <span className="font-mono text-xs tracking-widest text-[#a89f91] uppercase">
          Verifying Student Session...
        </span>
      </main>
    );
  }

  // =========================================================================
  // GATEWAY: LUXURY AUTHENTICATION & LANDING PORTAL
  // =========================================================================
  if (!isLoggedIn || !currentProfile) {
    return (
      <main className="min-h-screen bg-[#080d0a] text-[#f2efe9] relative overflow-hidden flex flex-col justify-between selection:bg-crimson-600 selection:text-white">
        {/* Subtle Ambient Red and Emerald Glow Rims */}
        <div className="absolute top-0 right-1/4 w-[750px] h-[750px] bg-crimson-600/12 rounded-full blur-[200px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[180px] pointer-events-none" />

        {/* Auth Modal Modal Form */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
          initialMode={authModalInitialMode}
          canClose={true}
        />

        {/* Luxury Top Navigation with Generated Logo */}
        <header className="sticky top-0 z-40 bg-[#080d0a]/85 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Left: Generated Brand Logo & Title */}
            <div className="flex items-center gap-3.5">
              <div className="relative w-11 h-11 rounded-2xl overflow-hidden border border-white/15 bg-black/50 shadow-md p-0.5 shrink-0 flex items-center justify-center">
                <img
                  src="/logo.jpg"
                  alt="HomeBase Logo"
                  className="w-full h-full object-cover scale-110 rounded-xl"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-xl tracking-tight text-[#f2efe9] uppercase leading-none">
                    HOME<span className="text-[#e11d48]">BASE</span>
                  </span>
                  <span className="text-[9px] font-mono tracking-widest text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30">
                    LIVE
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-wider text-[#a89f91] uppercase">
                  Cultural Taste Graph & Relocation
                </span>
              </div>
            </div>

            {/* Right: Auth Action CTA Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleOpenAuth("login")}
                className="px-5 py-2.5 rounded-full text-xs font-mono uppercase text-[#dedacb] hover:text-white hover:bg-white/5 border border-white/10 transition font-bold"
              >
                Sign In
              </button>
              <button
                onClick={() => handleOpenAuth("register")}
                className="px-6 py-2.5 rounded-full crimson-pill hover:brightness-110 text-white font-mono text-xs uppercase font-black tracking-wider transition shadow-[0_10px_25px_rgba(225,29,72,0.35)] flex items-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20 flex-1 flex flex-col justify-center items-center text-center space-y-10 z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#dedacb] text-xs font-mono shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>GLOBAL STUDENT COHORT • 250+ COUNTRIES & UNIVERSITIES</span>
          </div>

          {/* Editorial Display Hero */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="font-editorial-serif font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight text-[#f2efe9] leading-[0.88]">
              SAME ROADS. <br />
              <span className="text-[#e11d48] drop-shadow-[0_15px_40px_rgba(225,29,72,0.5)]">
                NEW PERSPECTIVES.
              </span>
            </h1>
            <p className="text-base sm:text-xl text-[#a89f91] font-light max-w-2xl mx-auto leading-relaxed pt-2">
              Settle into your new campus city, discover kindred peers, and master difficult coursework translated through your music, gaming, and literary tastes.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full max-w-md">
            <button
              onClick={() => handleOpenAuth("register")}
              className="w-full py-4 rounded-full crimson-pill hover:brightness-110 text-white font-mono text-xs uppercase tracking-widest font-black transition shadow-[0_15px_40px_rgba(225,29,72,0.45)] flex items-center justify-center gap-2.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Student Account</span>
            </button>

            <button
              onClick={() => handleOpenAuth("login")}
              className="w-full py-4 rounded-full bg-[#121915] hover:bg-[#1a2520] border border-white/10 hover:border-crimson-500/50 text-[#dedacb] font-mono text-xs uppercase tracking-widest font-bold transition flex items-center justify-center gap-2.5"
            >
              <Lock className="w-4 h-4 text-crimson-400" />
              <span>Sign In with Password</span>
            </button>
          </div>

          {/* Value Proposition Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 text-left w-full">
            <div className="p-7 rounded-[28px] bg-[#0f1713]/80 border border-white/10 backdrop-blur-md space-y-3 shadow-lg hover:border-crimson-500/40 transition">
              <div className="w-10 h-10 rounded-2xl bg-crimson-950/80 border border-crimson-500/30 flex items-center justify-center text-crimson-400">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#f2efe9]">01. Settle with OSM</h3>
              <p className="text-xs text-[#a89f91] font-light leading-relaxed">
                Zero hallucinated venues. Real OpenStreetMap POIs mapped around your campus with live walking times and Qloo affinities.
              </p>
            </div>

            <div className="p-7 rounded-[28px] bg-[#0f1713]/80 border border-white/10 backdrop-blur-md space-y-3 shadow-lg hover:border-amber-500/40 transition">
              <div className="w-10 h-10 rounded-2xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#f2efe9]">02. Peer Affinity Bridges</h3>
              <p className="text-xs text-[#a89f91] font-light leading-relaxed">
                Connect with classmates through genuine affinity bridges across Spotify playlists, favorite films, and literature.
              </p>
            </div>

            <div className="p-7 rounded-[28px] bg-[#0f1713]/80 border border-white/10 backdrop-blur-md space-y-3 shadow-lg hover:border-emerald-500/40 transition">
              <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#f2efe9]">03. Cultural Taste Intelligence</h3>
              <p className="text-xs text-[#a89f91] font-light leading-relaxed">
                Autonomous cross-domain mapping: translates music, cinema, books, and games directly into grounded neighborhood spaces.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 py-6 px-6 text-center text-xs font-mono text-[#a89f91] flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#f2efe9]">HomeBase</span>
            <span>• Built for International Student Relocation</span>
          </div>
          <div className="text-[11px] text-[#71827a] pt-2 sm:pt-0">
            Powered by OpenStreetMap • Qloo Taste Intelligence
          </div>
        </footer>
      </main>
    );
  }

  // =========================================================================
  // AUTHENTICATED DASHBOARD (Logged-In User)
  // =========================================================================
  return (
    <main className="min-h-screen bg-[#080d0a] text-[#f2efe9] pb-28 relative overflow-hidden">
      {/* Red & Emerald Ambient Rim Lighting */}
      <div className="absolute top-0 right-1/4 w-[650px] h-[650px] bg-crimson-600/15 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-emerald-900/15 rounded-full blur-[160px] pointer-events-none" />

      {/* Auth Modal for re-authenticating or editing profile coordinates */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalInitialMode}
        initialProfile={currentProfile}
        canClose={true}
      />

      {/* Top Editorial Navbar */}
      <header className="sticky top-0 z-50 bg-[#080d0a]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Left: Brand Logo & Navigation Links */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl overflow-hidden border border-white/15 bg-black/50 p-0.5 shrink-0 flex items-center justify-center">
                <img
                  src="/logo.jpg"
                  alt="HomeBase Logo"
                  className="w-full h-full object-cover scale-110 rounded-xl"
                />
              </div>
              <span className="font-display font-black text-xl tracking-tight text-[#dedacb] uppercase">
                HOME<span className="text-[#e11d48]">BASE</span>
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-7 text-[11px] font-mono tracking-[0.2em] text-[#a89f91] uppercase">
              <button
                onClick={() => setActiveTab("settle")}
                className={`hover:text-white transition py-1 ${
                  activeTab === "settle" ? "text-white font-bold border-b-2 border-crimson-500" : ""
                }`}
              >
                01. SETTLE
              </button>
              <button
                onClick={() => setActiveTab("connect")}
                className={`hover:text-white transition py-1 ${
                  activeTab === "connect" ? "text-white font-bold border-b-2 border-crimson-500" : ""
                }`}
              >
                02. CONNECT
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`hover:text-white transition py-1 ${
                  activeTab === "profile" ? "text-white font-bold border-b-2 border-crimson-500" : ""
                }`}
              >
                03. TASTE GRAPH
              </button>
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121915] border border-white/10 text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48] animate-pulse" />
              <span className="text-[#dedacb] font-bold">{currentProfile.display_name}</span>
              <span className="text-[#a89f91]">({currentProfile.target_city})</span>
            </div>

            <button
              onClick={() => {
                setAuthModalInitialMode("edit");
                setAuthModalOpen(true);
              }}
              title="Edit Profile, Destination Coordinates & Cultural Tastes"
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-crimson-500/40 text-[#dedacb] transition flex items-center gap-1.5 text-xs font-mono font-bold"
            >
              <Sliders className="w-3.5 h-3.5 text-crimson-400" />
              <span className="hidden md:inline">Edit Coordinates</span>
            </button>

            <button
              onClick={handleLogout}
              title="Sign out of account"
              className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-crimson-950/60 border border-white/10 hover:border-crimson-500/40 text-[#a89f91] hover:text-crimson-300 transition flex items-center gap-1.5 text-xs font-mono"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <section className="max-w-7xl mx-auto px-6 pt-6 pb-12 space-y-8">
        {/* Editorial Top Headline Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#121915] shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
          <div className="absolute inset-0 z-0">
            <img
              src="/hero-student.jpg"
              alt="International Student Culture & Campus Relocation"
              className="w-full h-full object-cover object-center filter contrast-105 brightness-75 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080d0a] via-[#080d0a]/85 to-[#080d0a]/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080d0a] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 p-8 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono tracking-[0.28em] text-[#dedacb] uppercase block font-semibold">
                  AUTHENTICATED • {currentProfile.email || "CAMPUS IDENTITY"}
                </span>
              </div>

              <div className="space-y-0 select-none">
                <h1 className="font-editorial-serif font-black text-5xl sm:text-6xl lg:text-7xl tracking-tight text-[#e11d48] leading-[0.88] drop-shadow-[0_10px_35px_rgba(225,29,72,0.45)]">
                  {currentProfile.target_city.toUpperCase()}
                </h1>
                <h2 className="font-editorial-serif italic font-normal text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#dedacb] leading-[0.9] -mt-1.5">
                  {currentProfile.target_university}
                </h2>
              </div>

              <p className="text-sm sm:text-base text-[#a89f91] max-w-xl font-light leading-relaxed">
                Relocating from <strong className="text-[#dedacb]">{currentProfile.home_city || "Origin"}</strong>. 
                Your Qloo taste coordinates are actively shaping walking radius maps and classmate affinity rankings.
              </p>
            </div>

            {/* Right: Quick Coordinate Badges */}
            <div className="lg:col-span-5 flex flex-col justify-end space-y-3">
              <div className="p-4 rounded-2xl bg-[#080d0a]/85 backdrop-blur-md border border-white/10 space-y-2">
                <div className="text-[10px] font-mono uppercase text-[#a89f91] flex items-center justify-between">
                  <span>Student Profile</span>
                  <span className="text-emerald-400 font-bold">VERIFIED</span>
                </div>
                <div className="text-sm font-bold text-[#dedacb]">{currentProfile.display_name}</div>
                <div className="text-xs text-[#a89f91]">{currentProfile.major} • {currentProfile.languages?.join(", ")}</div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => triggerLiveSettle(currentProfile)}
                  disabled={isLoadingSettle}
                  className="flex-1 py-3 px-4 rounded-xl crimson-pill hover:brightness-110 text-white font-mono text-xs uppercase font-bold transition flex items-center justify-center gap-2"
                >
                  {isLoadingSettle ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                  Refresh Settle Map
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab("settle")}
            className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "settle"
                ? "crimson-pill text-white scale-[1.02] shadow-lg"
                : "bg-[#121915] text-[#a89f91] hover:text-[#dedacb] border border-white/10"
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
                : "bg-[#121915] text-[#a89f91] hover:text-[#dedacb] border border-white/10"
            }`}
          >
            <Users className="w-4 h-4" /> 02. Connect (Taste Bridges)
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "profile"
                ? "crimson-pill text-white scale-[1.02] shadow-lg"
                : "bg-[#121915] text-[#a89f91] hover:text-[#dedacb] border border-white/10"
            }`}
          >
            <Sparkles className="w-4 h-4" /> 03. My Taste Graph ({currentProfile.taste_entities?.length || 0})
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
            <SettleModule settleData={settleData} currentProfile={currentProfile} />
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

        {/* TAB 03: MY TASTE PROFILE / ONBOARDING */}
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
