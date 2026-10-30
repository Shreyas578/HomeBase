"use client";

import React, { useState, useEffect, useMemo } from "react";
import { StudentProfile, TasteEntity, DomainType } from "@/types";
import { sanitizeString } from "@/lib/sanitize";
import { ModernSelect, DropdownOption } from "@/components/ModernSelect";
import { Country, City } from "country-state-city";
import { ACADEMIC_MAJORS } from "@/data/majorsData";
import { TASTE_DIMENSIONS, TasteCategoryDimension } from "@/data/tasteDimensions";
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
  Compass,
  Lock,
  Mail,
  GraduationCap,
  MapPin,
  Globe2,
  Search
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onAuthSuccess: (student: StudentProfile) => void;
  initialMode?: "register" | "login" | "edit";
  initialProfile?: StudentProfile | null;
  canClose?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = "login",
  initialProfile = null,
  canClose = true
}) => {
  const [mode, setMode] = useState<"register" | "login" | "edit">(initialMode);
  const [step, setStep] = useState<1 | 2>(1);

  // Form Credentials
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [major, setMajor] = useState("");

  // Hometown (Origin) State
  const [homeCountryCode, setHomeCountryCode] = useState("");
  const [homeCountry, setHomeCountry] = useState("");
  const [homeCity, setHomeCity] = useState("");

  // Destination (Campus) State
  const [targetCountryCode, setTargetCountryCode] = useState("");
  const [targetCountry, setTargetCountry] = useState("");
  const [targetCity, setTargetCity] = useState("");
  const [targetUniversity, setTargetUniversity] = useState("");

  // Live University Directory State (loaded dynamically per country from global academic database)
  const [universitiesList, setUniversitiesList] = useState<DropdownOption[]>([]);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(false);

  // Taste Entities State (starts empty - user adds or imports their real tastes)
  const [tasteEntities, setTasteEntities] = useState<TasteEntity[]>([]);

  // Taste Importer & Manual State
  const [profileUrl, setProfileUrl] = useState("");
  const [isImportingUrl, setIsImportingUrl] = useState(false);
  const [importNotice, setImportNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [selectedDimensionId, setSelectedDimensionId] = useState<string>(TASTE_DIMENSIONS[0].id);
  const [newEntityName, setNewEntityName] = useState("");
  const [isResolving, setIsResolving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sync form fields if initialProfile is provided (e.g. Editing Coordinates from Dashboard)
  useEffect(() => {
    if (initialProfile) {
      setDisplayName(initialProfile.display_name || "");
      setEmail(initialProfile.email || "");
      setMajor(initialProfile.major || "");
      setHomeCountry(initialProfile.home_country || "");
      setHomeCity(initialProfile.home_city || "");
      setTargetCountry(initialProfile.target_country || "");
      setTargetCity(initialProfile.target_city || "");
      setTargetUniversity(initialProfile.target_university || "");
      setTasteEntities(initialProfile.taste_entities || []);

      if (initialProfile.home_country) {
        const foundHome = Country.getAllCountries().find(
          (c) => c.name.toLowerCase() === initialProfile.home_country.toLowerCase()
        );
        if (foundHome) setHomeCountryCode(foundHome.isoCode);
      }
      if (initialProfile.target_country) {
        const foundTarget = Country.getAllCountries().find(
          (c) => c.name.toLowerCase() === initialProfile.target_country!.toLowerCase()
        );
        if (foundTarget) setTargetCountryCode(foundTarget.isoCode);
      }
    }
    if (initialMode) setMode(initialMode);
  }, [initialProfile, initialMode, isOpen]);

  // 1. ALL 250+ COUNTRIES IN THE WORLD (INSTANT)
  const allCountriesOptions: DropdownOption[] = useMemo(() => {
    return Country.getAllCountries().map((c) => ({
      label: c.name,
      value: c.name,
      subtext: c.isoCode,
      flag: c.flag
    }));
  }, []);

  // ACADEMIC MAJORS & PROGRAMS
  const academicMajorOptions: DropdownOption[] = useMemo(() => {
    return ACADEMIC_MAJORS.map((m) => ({
      label: m.name,
      value: m.name,
      subtext: m.category
    }));
  }, []);

  // 2. ALL CITIES FOR HOMETOWN COUNTRY
  const homeCityOptions: DropdownOption[] = useMemo(() => {
    if (!homeCountryCode) return [];
    const raw = City.getCitiesOfCountry(homeCountryCode) || [];
    const seen = new Set<string>();
    const list: DropdownOption[] = [];
    for (const c of raw) {
      if (!seen.has(c.name.toLowerCase())) {
        seen.add(c.name.toLowerCase());
        list.push({
          label: c.name,
          value: c.name,
          subtext: `${c.stateCode ? c.stateCode + ", " : ""}${homeCountry}`
        });
      }
    }
    return list;
  }, [homeCountryCode, homeCountry]);

  // 3. ALL CITIES FOR TARGET DESTINATION COUNTRY
  const targetCityOptions: DropdownOption[] = useMemo(() => {
    if (!targetCountryCode) return [];
    const raw = City.getCitiesOfCountry(targetCountryCode) || [];
    const seen = new Set<string>();
    const list: DropdownOption[] = [];
    for (const c of raw) {
      if (!seen.has(c.name.toLowerCase())) {
        seen.add(c.name.toLowerCase());
        list.push({
          label: c.name,
          value: c.name,
          subtext: `${c.stateCode ? c.stateCode + ", " : ""}${targetCountry}`
        });
      }
    }
    return list;
  }, [targetCountryCode, targetCountry]);

  // 4. FETCH ALL UNIVERSITIES FOR TARGET COUNTRY FROM GLOBAL DB
  useEffect(() => {
    let isCancelled = false;
    async function loadUniversities() {
      if (!targetCountry) return;
      setIsLoadingUniversities(true);
      try {
        const res = await fetch(`/api/geo?type=universities&countryName=${encodeURIComponent(targetCountry)}`);
        if (res.ok) {
          const json = await res.json();
          if (!isCancelled && json.universities) {
            setUniversitiesList(
              json.universities.map((u: any) => ({
                label: u.label,
                value: u.value,
                subtext: u.stateProvince ? `${u.stateProvince}, ${targetCountry}` : targetCountry
              }))
            );
          }
        }
      } catch (err) {
        console.warn("Failed to load universities:", err);
      } finally {
        if (!isCancelled) setIsLoadingUniversities(false);
      }
    }
    loadUniversities();
    return () => {
      isCancelled = true;
    };
  }, [targetCountry]);

  // Cascading Handlers
  const handleHomeCountrySelect = (name: string, opt?: DropdownOption) => {
    setHomeCountry(name);
    const found = Country.getAllCountries().find((c) => c.name.toLowerCase() === name.toLowerCase());
    const code = found ? found.isoCode : opt?.subtext || "";
    setHomeCountryCode(code);
    setHomeCity("");
  };

  const handleTargetCountrySelect = (name: string, opt?: DropdownOption) => {
    setTargetCountry(name);
    const found = Country.getAllCountries().find((c) => c.name.toLowerCase() === name.toLowerCase());
    const code = found ? found.isoCode : opt?.subtext || "";
    setTargetCountryCode(code);
    setTargetCity("");
    setTargetUniversity("");
  };

  if (!isOpen) return null;

  // Step 1 Validation
  const handleValidateStep1 = () => {
    setAuthError(null);
    if (!displayName.trim()) {
      setAuthError("Please provide your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setAuthError("Please enter a valid email address.");
      return;
    }
    if (mode === "register") {
      if (!password || password.length < 6) {
        setAuthError("Password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setAuthError("Passwords do not match.");
        return;
      }
    } else if (mode === "edit" && password) {
      if (password.length < 6) {
        setAuthError("New password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setAuthError("Passwords do not match.");
        return;
      }
    }
    if (!homeCountry.trim() || !homeCity.trim()) {
      setAuthError("Please select your hometown country and city.");
      return;
    }
    if (!targetCountry.trim() || !targetCity.trim() || !targetUniversity.trim()) {
      setAuthError("Please select your destination country, city, and university / college.");
      return;
    }
    setStep(2);
  };

  // URL Importer
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
      if (data.entities && Array.isArray(data.entities) && data.entities.length > 0) {
        setTasteEntities((prev) => {
          const existingIds = new Set(prev.map((e) => e.name.toLowerCase()));
          const novel = data.entities.filter((e: TasteEntity) => !existingIds.has(e.name.toLowerCase()));
          return [...prev, ...novel];
        });
        setImportNotice({
          type: "success",
          message: `Successfully imported ${data.entities.length} taste items from ${data.detectedPlatform || "profile"}!`
        });
        setProfileUrl("");
      } else {
        setImportNotice({
          type: "error",
          message: data.message || "No public taste items found at that URL. Add items manually below."
        });
      }
    } catch (err: any) {
      setImportNotice({
        type: "error",
        message: err.message || "Failed to contact importer service"
      });
    } finally {
      setIsImportingUrl(false);
    }
  };

  const handleAddManualEntity = async () => {
    if (!newEntityName.trim()) return;
    setIsResolving(true);
    const clean = sanitizeString(newEntityName.trim(), 80);
    const currentDim = TASTE_DIMENSIONS.find((d) => d.id === selectedDimensionId) || TASTE_DIMENSIONS[0];

    try {
      const res = await fetch(
        `/api/qloo/search?query=${encodeURIComponent(clean)}&domain=${currentDim.domain}`
      );
      if (res.ok) {
        const json = await res.json();
        const results = json.results || [];
        if (results.length > 0) {
          const top = results[0];
          setTasteEntities((prev) => [
            ...prev,
            {
              id: `entity-${Date.now()}`,
              domain: currentDim.domain,
              qloo_entity_id: top.qloo_entity_id || top.id || `urn:entity:${currentDim.domain}:${encodeURIComponent(clean.toLowerCase())}`,
              name: top.name || clean,
              source: "user",
              weight: 0.95,
              tags: Array.from(new Set([...(top.tags || []), currentDim.tagType, currentDim.categoryLabel.toLowerCase()]))
            }
          ]);
          setNewEntityName("");
          return;
        }
      }

      setTasteEntities((prev) => [
        ...prev,
        {
          id: `entity-${Date.now()}`,
          domain: currentDim.domain,
          qloo_entity_id: `urn:entity:${currentDim.domain}:${encodeURIComponent(clean.toLowerCase())}`,
          name: clean,
          source: "user",
          weight: 0.9,
          tags: [currentDim.tagType, currentDim.categoryLabel.toLowerCase()]
        }
      ]);
      setNewEntityName("");
    } finally {
      setIsResolving(false);
    }
  };

  // Registration Execution
  const handleCompleteRegister = async () => {
    setIsSubmitting(true);
    setAuthError(null);

    const studentId = initialProfile?.id || `student-${Date.now()}`;
    const studentPayload: StudentProfile = {
      id: studentId,
      email: email.trim().toLowerCase(),
      display_name: displayName.trim(),
      home_city: homeCity.trim() || "Pune",
      home_country: homeCountry.trim() || "India",
      target_country: targetCountry.trim() || "Germany",
      target_city: targetCity.trim() || "Berlin",
      target_university: targetUniversity.trim() || "Technical University of Berlin (TU Berlin)",
      target_lat: initialProfile?.target_lat || 52.5119,
      target_lng: initialProfile?.target_lng || 13.3265,
      major: major.trim() || "Computer Science",
      languages: initialProfile?.languages || ["English"],
      goals: initialProfile?.goals || ["Discover acoustic study spaces", "Connect with kindred peers", "Master hard concepts"],
      is_public: true,
      taste_entities: tasteEntities,
      created_at: initialProfile?.created_at || new Date().toISOString()
    };

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: mode === "edit" ? "update" : "register",
          email: email.trim().toLowerCase(),
          password: password || undefined,
          profile: studentPayload
        })
      });

      const data = await res.json();
      if (res.ok && data.student) {
        onAuthSuccess(data.student);
        if (onClose) onClose();
      } else {
        throw new Error(data.error || "Failed to register profile");
      }
    } catch (err: any) {
      setAuthError(err.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sign In Execution
  const handleLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);

    if (!email.trim() || !password) {
      setAuthError("Email and password are required to sign in.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          email: email.trim().toLowerCase(),
          password
        })
      });

      const data = await res.json();
      if (res.ok && data.student) {
        onAuthSuccess(data.student);
        if (onClose) onClose();
      } else {
        throw new Error(data.error || "Invalid credentials. Please verify email and password.");
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#070b09] text-[#f2efe9] animate-fadeIn selection:bg-crimson-600 selection:text-white">
      {/* Ambient Atmospheric Lighting */}
      <div className="fixed top-0 right-1/4 w-[700px] h-[700px] bg-crimson-600/12 rounded-full blur-[200px] pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Top Fixed / Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#070b09]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 h-18 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display font-black text-2xl tracking-tighter text-[#dedacb] uppercase">
              HOME<span className="text-[#e11d48]">BASE</span>
            </span>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-widest text-[#a89f91] uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>GLOBAL STUDENT ACCESS</span>
            </div>
          </div>

          {canClose && onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider text-[#a89f91] hover:text-white hover:bg-white/10 transition border border-white/10 flex items-center gap-2"
            >
              <span>Back to Campus</span>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Main Dedicated Content Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        <div className="rounded-[32px] bg-[#0c120f] border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.8)] overflow-visible">
          {/* Segmented Mode Selector */}
          <div className="p-2 border-b border-white/10 bg-[#121915]/60 flex gap-2 rounded-t-[32px]">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setAuthError(null);
            }}
            className={`flex-1 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 font-bold ${
              mode === "login"
                ? "bg-[#1f2d26] text-white shadow-md border border-white/15"
                : "text-[#a89f91] hover:text-[#dedacb]"
            }`}
          >
            <User className="w-3.5 h-3.5" /> Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setAuthError(null);
              setStep(1);
            }}
            className={`flex-1 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 font-bold ${
              mode === "register"
                ? "crimson-pill text-white shadow-lg"
                : "text-[#a89f91] hover:text-[#dedacb]"
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Register Profile
          </button>
        </div>

        {/* Error Notification */}
        {authError && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-crimson-950/80 border border-crimson-500/50 text-crimson-200 text-xs font-mono flex items-center gap-2.5 shrink-0">
            <AlertCircle className="w-4 h-4 text-crimson-400 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Dedicated Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {mode === "login" ? (
            /* ================= LOGIN FORM ================= */
            <form onSubmit={handleLoginSubmit} className="space-y-6 max-w-lg mx-auto py-4">
              <div className="text-center space-y-2">
                <h3 className="font-editorial-serif font-black text-3xl text-[#f2efe9]">
                  Welcome Back
                </h3>
                <p className="text-xs text-[#a89f91] font-light">
                  Sign in with your verified credentials to access your personalized campus map, taste affinity bridges, and verified local places.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#121916] border border-white/10 focus-within:border-crimson-500 transition">
                  <label className="text-[10px] font-mono uppercase text-[#a89f91] flex items-center gap-1.5 mb-1">
                    <Mail className="w-3 h-3 text-crimson-400" /> Student Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. maya@tu-berlin.de"
                    className="w-full bg-transparent text-[#f2efe9] text-sm font-bold focus:outline-none placeholder-[#4a5f56]"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#121916] border border-white/10 focus-within:border-crimson-500 transition">
                  <label className="text-[10px] font-mono uppercase text-[#a89f91] flex items-center gap-1.5 mb-1">
                    <Lock className="w-3 h-3 text-crimson-400" /> Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full bg-transparent text-[#f2efe9] text-sm font-bold focus:outline-none placeholder-[#4a5f56]"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full crimson-pill hover:brightness-110 text-white font-mono text-xs uppercase tracking-widest font-black transition flex items-center justify-center gap-2 shadow-[0_15px_35px_rgba(225,29,72,0.4)] disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  Verify & Enter Dashboard
                </button>

                <div className="text-center pt-2">
                  <span className="text-xs text-[#a89f91]">Don't have an account? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setAuthError(null);
                    }}
                    className="text-xs font-bold text-crimson-400 hover:underline"
                  >
                    Register here
                  </button>
                </div>
              </div>
            </form>
          ) : step === 1 ? (
            /* ================= REGISTRATION STEP 1: CREDENTIALS & WORLD GEOGRAPHY ================= */
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-crimson-400 uppercase tracking-widest font-bold">
                  Step 01 / 02 • Global Identity & Academic Path
                </div>
                <h3 className="font-editorial-serif font-black text-2xl sm:text-3xl text-[#f2efe9]">
                  Where is Your Academic Journey Heading?
                </h3>
                <p className="text-xs text-[#a89f91] font-light">
                  Search & select from all 250+ countries, every global city, and world university directories.
                </p>
              </div>

              {/* 1. Account Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-2xl bg-[#121916] border border-white/10 focus-within:border-crimson-500 transition">
                  <label className="text-[10px] font-mono uppercase text-[#a89f91] block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Maya Chen"
                    className="w-full bg-transparent text-[#f2efe9] text-sm font-bold focus:outline-none placeholder-[#4a5f56]"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-[#121916] border border-white/10 focus-within:border-crimson-500 transition">
                  <label className="text-[10px] font-mono uppercase text-[#a89f91] flex items-center gap-1.5 mb-1">
                    <Mail className="w-3 h-3 text-crimson-400" /> Student Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. maya@tu-berlin.de"
                    className="w-full bg-transparent text-[#f2efe9] text-sm font-bold focus:outline-none placeholder-[#4a5f56]"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-[#121916] border border-white/10 focus-within:border-crimson-500 transition">
                  <label className="text-[10px] font-mono uppercase text-[#a89f91] flex items-center gap-1.5 mb-1">
                    <Lock className="w-3 h-3 text-crimson-400" /> Password *
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full bg-transparent text-[#f2efe9] text-sm font-bold focus:outline-none placeholder-[#4a5f56]"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-[#121916] border border-white/10 focus-within:border-crimson-500 transition">
                  <label className="text-[10px] font-mono uppercase text-[#a89f91] flex items-center gap-1.5 mb-1">
                    <Lock className="w-3 h-3 text-crimson-400" /> Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full bg-transparent text-[#f2efe9] text-sm font-bold focus:outline-none placeholder-[#4a5f56]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <ModernSelect
                    label="Academic Major / Program of Study"
                    placeholder="Select or search your major..."
                    searchPlaceholder="Search 50+ majors (e.g. Computer Science, Architecture, Neuroscience)..."
                    options={academicMajorOptions}
                    value={major}
                    onChange={(val) => setMajor(val)}
                    allowCustomInput={true}
                    accent="default"
                  />
                </div>
              </div>

              {/* 2. Hometown (Origin) Directory */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-[#dedacb] uppercase font-bold">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>01. Hometown Origin Coordinates</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <ModernSelect
                    label="Hometown Country"
                    placeholder="Select country of origin..."
                    searchPlaceholder="Search 250+ countries..."
                    options={allCountriesOptions}
                    value={homeCountry}
                    onChange={handleHomeCountrySelect}
                    required
                    accent="emerald"
                  />

                  <ModernSelect
                    label="Hometown City"
                    placeholder={homeCountry ? `Select or type city in ${homeCountry}...` : "Select country first"}
                    searchPlaceholder={`Search all cities in ${homeCountry || "country"}...`}
                    options={homeCityOptions}
                    value={homeCity}
                    onChange={(val) => setHomeCity(val)}
                    disabled={!homeCountry}
                    required
                    allowCustomInput={true}
                    accent="emerald"
                  />
                </div>
              </div>

              {/* 3. Destination (Campus) Directory */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-crimson-400 uppercase font-bold">
                  <Globe2 className="w-4 h-4 text-crimson-400" />
                  <span>02. Destination Campus Coordinates</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <ModernSelect
                    label="Destination Country"
                    placeholder="Select destination country..."
                    searchPlaceholder="Search 250+ countries..."
                    options={allCountriesOptions}
                    value={targetCountry}
                    onChange={handleTargetCountrySelect}
                    required
                    accent="crimson"
                  />

                  <ModernSelect
                    label="Destination City"
                    placeholder={targetCountry ? `Select city in ${targetCountry}...` : "Select country first"}
                    searchPlaceholder={`Search all cities in ${targetCountry || "country"}...`}
                    options={targetCityOptions}
                    value={targetCity}
                    onChange={(val) => setTargetCity(val)}
                    disabled={!targetCountry}
                    required
                    allowCustomInput={true}
                    accent="crimson"
                  />

                  <div className="sm:col-span-2">
                    <ModernSelect
                      label="Destination University / College"
                      placeholder={
                        targetCountry
                          ? `Select or search university / college in ${targetCountry}...`
                          : "Select destination country first"
                      }
                      searchPlaceholder="Search university name or type custom college..."
                      options={universitiesList}
                      value={targetUniversity}
                      onChange={(val) => setTargetUniversity(val)}
                      disabled={!targetCountry}
                      required
                      allowCustomInput={true}
                      accent="crimson"
                      isLoading={isLoadingUniversities}
                    />
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 flex items-center justify-between border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-xs font-mono text-[#a89f91] hover:text-[#dedacb] transition"
                >
                  Already have an account? Sign in
                </button>

                <button
                  type="button"
                  onClick={handleValidateStep1}
                  className="px-8 py-3.5 rounded-full crimson-pill hover:brightness-110 text-white font-mono text-xs uppercase tracking-widest font-black transition flex items-center gap-2 shadow-[0_15px_35px_rgba(225,29,72,0.4)] cursor-pointer"
                >
                  <span>Continue to Cultural Taste</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* ================= REGISTRATION STEP 2: TASTE PROFILE INTAKE ================= */
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                  Step 02 / 02 • Cultural Frequency Calibration
                </div>
                <h3 className="font-editorial-serif font-black text-2xl sm:text-3xl text-[#f2efe9]">
                  Calibrate Your Cultural Coordinates
                </h3>
                <p className="text-xs text-[#a89f91] font-light">
                  Paste links to your music, movie, gaming, dining, or reading profiles, or add items manually.
                </p>
              </div>

              {/* Instant URL Importer */}
              <div className="p-4 rounded-3xl bg-[#141d19] border border-crimson-500/30 space-y-2.5">
                <div className="text-[10px] font-mono uppercase text-crimson-400 font-bold flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5" /> Instant Profile Link Importer
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="url"
                    value={profileUrl}
                    onChange={(e) => setProfileUrl(e.target.value)}
                    placeholder="Spotify track/artist, Steam game, Letterboxd, IMDb, or Goodreads link..."
                    className="w-full flex-1 px-4 py-3 rounded-2xl bg-[#0c120f] border border-white/10 text-xs font-mono text-[#dedacb] placeholder-[#4a5f56] focus:outline-none focus:border-crimson-500"
                  />
                  <button
                    type="button"
                    onClick={handleImportUrl}
                    disabled={isImportingUrl || !profileUrl.trim()}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl crimson-pill hover:brightness-110 disabled:opacity-40 text-white font-mono text-xs uppercase tracking-wider font-bold transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {isImportingUrl ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    Import Taste
                  </button>
                </div>

                <div className="text-[11px] font-mono text-[#a89f91]/70 flex flex-wrap items-center gap-x-2 gap-y-1 pt-1">
                  <span className="text-[#dedacb] font-bold">Supported links:</span>
                  <span>Spotify Song/Artist (<code className="text-emerald-400">/track/...</code>, <code className="text-emerald-400">/artist/...</code>)</span>
                  <span>• IMDb / Letterboxd Films</span>
                  <span>• Steam Games</span>
                  <span>• Goodreads Books</span>
                </div>
              </div>

              {importNotice && (
                <div
                  className={`p-3.5 rounded-2xl text-xs font-mono flex items-center gap-2 ${
                    importNotice.type === "success"
                      ? "bg-emerald-950/70 border border-emerald-500/40 text-emerald-300"
                      : "bg-crimson-950/70 border border-crimson-500/40 text-crimson-300"
                  }`}
                >
                  {importNotice.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{importNotice.message}</span>
                </div>
              )}

              {/* Comprehensive Cultural Dimension Selector & Input */}
              {(() => {
                const activeDim = TASTE_DIMENSIONS.find((d) => d.id === selectedDimensionId) || TASTE_DIMENSIONS[0];
                const categories = Array.from(new Set(TASTE_DIMENSIONS.map((d) => d.categoryLabel)));

                return (
                  <div className="space-y-3 p-4 rounded-3xl bg-[#141d19] border border-white/10 shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#a89f91] font-bold">
                        Target Cultural Dimension
                      </span>
                      <span className="text-[10px] font-mono text-crimson-400 font-bold uppercase">
                        {activeDim.categoryLabel} • {activeDim.dimensionLabel}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-2.5">
                      <select
                        value={selectedDimensionId}
                        onChange={(e) => {
                          setSelectedDimensionId(e.target.value);
                          setNewEntityName("");
                        }}
                        className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-[#0c120f] border border-white/15 text-xs font-mono text-[#dedacb] focus:outline-none focus:border-crimson-500 cursor-pointer font-bold shadow-inner"
                      >
                        {categories.map((cat) => (
                          <optgroup key={cat} label={`── ${cat.toUpperCase()} ──`} className="bg-[#121915] text-[#dedacb] font-bold">
                            {TASTE_DIMENSIONS.filter((d) => d.categoryLabel === cat).map((dim) => (
                              <option key={dim.id} value={dim.id} className="bg-[#0c120f] text-[#f2efe9]">
                                {dim.dimensionLabel}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>

                      <div className="relative w-full flex-1">
                        <input
                          type="text"
                          list="dimension-suggestions-list"
                          value={newEntityName}
                          onChange={(e) => setNewEntityName(e.target.value)}
                          placeholder={activeDim.placeholder}
                          onKeyDown={(e) => e.key === "Enter" && handleAddManualEntity()}
                          className="w-full px-4 py-3 rounded-2xl bg-[#0c120f] border border-white/15 text-xs font-mono text-[#dedacb] placeholder-[#576b62] focus:outline-none focus:border-crimson-500 shadow-inner"
                        />
                        <datalist id="dimension-suggestions-list">
                          {activeDim.popularSuggestions.map((s) => (
                            <option key={s} value={s} />
                          ))}
                        </datalist>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddManualEntity}
                        disabled={isResolving || !newEntityName.trim()}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl crimson-pill hover:brightness-110 disabled:opacity-40 text-white font-mono text-xs uppercase tracking-wider font-bold transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-md"
                      >
                        {isResolving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                        Add Anchor
                      </button>
                    </div>

                    {/* Popular / Quick-Click Suggestions for Active Dimension */}
                    <div className="pt-1">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#a89f91] mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>Popular {activeDim.dimensionLabel} suggestions (click to auto-add):</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto scrollbar-thin">
                        {activeDim.popularSuggestions.map((item) => {
                          const isAlreadyAdded = tasteEntities.some(
                            (e) => e.name.toLowerCase() === item.toLowerCase()
                          );
                          return (
                            <button
                              key={item}
                              type="button"
                              disabled={isAlreadyAdded || isResolving}
                              onClick={async () => {
                                setNewEntityName(item);
                                // Automatically trigger add
                                setIsResolving(true);
                                try {
                                  const res = await fetch(
                                    `/api/qloo/search?query=${encodeURIComponent(item)}&domain=${activeDim.domain}`
                                  );
                                  const json = res.ok ? await res.json() : { results: [] };
                                  const top = json.results?.[0];
                                  setTasteEntities((prev) => [
                                    ...prev,
                                    {
                                      id: `entity-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                                      domain: activeDim.domain,
                                      qloo_entity_id: top?.qloo_entity_id || top?.id || `urn:entity:${activeDim.domain}:${encodeURIComponent(item.toLowerCase())}`,
                                      name: top?.name || item,
                                      source: "user",
                                      weight: 0.95,
                                      tags: Array.from(new Set([...(top?.tags || []), activeDim.tagType, activeDim.categoryLabel.toLowerCase()]))
                                    }
                                  ]);
                                  setNewEntityName("");
                                } finally {
                                  setIsResolving(false);
                                }
                              }}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-mono border transition flex items-center gap-1 ${
                                isAlreadyAdded
                                  ? "bg-[#18231e] border-emerald-500/40 text-emerald-300 opacity-60 cursor-default"
                                  : "bg-[#0c120f] border-white/10 text-[#dedacb] hover:border-crimson-500 hover:text-white cursor-pointer"
                              }`}
                            >
                              <span>{item}</span>
                              {isAlreadyAdded ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Plus className="w-3 h-3 text-crimson-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Badges List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#a89f91]">
                  <span>Active Taste Anchors ({tasteEntities.length})</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    QLOO READY
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
                  {tasteEntities.length === 0 ? (
                    <div className="w-full py-4 px-4 rounded-2xl bg-[#0e1512] border border-dashed border-white/10 text-center">
                      <p className="text-xs font-mono text-[#a89f91]/60">
                        No taste anchors added yet. Search or paste a profile link above to calibrate your cultural frequency.
                      </p>
                    </div>
                  ) : (
                    tasteEntities.map((ent) => (
                      <div
                        key={ent.id}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141d19] border border-white/10 text-xs text-[#dedacb]"
                      >
                        {getDomainIcon(ent.domain)}
                        <span className="font-semibold">{ent.name}</span>
                        <span className="text-[9px] font-mono uppercase text-crimson-400 px-1.5 py-0.2 rounded bg-crimson-950/60 border border-crimson-500/20">
                          {ent.domain}
                        </span>
                        <button
                          type="button"
                          onClick={() => setTasteEntities((prev) => prev.filter((e) => e.id !== ent.id))}
                          className="text-[#a89f91] hover:text-crimson-400 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-between border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-mono text-[#a89f91] hover:text-[#dedacb] transition"
                >
                  ← Back to Credentials
                </button>

                <button
                  type="button"
                  onClick={handleCompleteRegister}
                  disabled={isSubmitting || tasteEntities.length === 0}
                  className="px-8 py-3.5 rounded-full crimson-pill hover:brightness-110 disabled:opacity-40 text-white font-mono text-xs uppercase tracking-widest font-black transition flex items-center gap-2 shadow-[0_20px_45px_rgba(225,29,72,0.45)] cursor-pointer"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Compass className="w-4 h-4" />}
                  <span>Register & Launch HomeBase</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};
