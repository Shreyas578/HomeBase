"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check, X, Loader2 } from "lucide-react";

export interface DropdownOption {
  label: string;
  value: string;
  subtext?: string;
  flag?: string;
}

interface ModernSelectProps {
  label: string;
  placeholder?: string;
  searchPlaceholder?: string;
  options: DropdownOption[];
  value: string;
  onChange: (val: string, option?: DropdownOption) => void;
  disabled?: boolean;
  required?: boolean;
  allowCustomInput?: boolean;
  accent?: "crimson" | "emerald" | "default";
  isLoading?: boolean;
}

export const ModernSelect: React.FC<ModernSelectProps> = ({
  label,
  placeholder = "Select an option...",
  searchPlaceholder = "Search or type to filter...",
  options,
  value,
  onChange,
  disabled = false,
  required = false,
  allowCustomInput = true,
  accent = "default",
  isLoading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto focus search field when opening
  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (opt.subtext && opt.subtext.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedOption = options.find((opt) => opt.value === value);

  const getBorderColor = () => {
    if (disabled) return "border-white/5 opacity-40 cursor-not-allowed";
    if (isOpen) {
      if (accent === "crimson") return "border-crimson-500 ring-2 ring-crimson-500/20";
      if (accent === "emerald") return "border-emerald-500 ring-2 ring-emerald-500/20";
      return "border-[#dedacb]/60 ring-2 ring-white/10";
    }
    return "border-white/10 hover:border-white/25";
  };

  return (
    <div ref={containerRef} className="relative group">
      <div
        className={`p-3.5 rounded-2xl bg-[#121916]/90 backdrop-blur-md border transition-all duration-200 ${getBorderColor()}`}
      >
        <div className="flex items-center justify-between mb-1 select-none">
          <label className="text-[10px] font-mono tracking-wider uppercase text-[#a89f91] flex items-center gap-1">
            <span>{label}</span>
            {required && <span className="text-crimson-400">*</span>}
          </label>
          {value && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="text-[#a89f91] hover:text-crimson-400 p-0.5 rounded transition"
              title="Clear"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Trigger Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left flex items-center justify-between gap-2 focus:outline-none cursor-pointer py-0.5"
        >
          <span
            className={`truncate text-sm font-semibold tracking-tight ${
              value ? "text-[#f2efe9]" : "text-[#4a5f56]"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2 text-xs font-mono text-[#a89f91]">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading directory...
              </span>
            ) : selectedOption ? (
              <span className="flex items-center gap-2">
                {selectedOption.flag && <span className="text-base">{selectedOption.flag}</span>}
                <span className="truncate">{selectedOption.label}</span>
              </span>
            ) : value ? (
              value
            ) : (
              placeholder
            )}
          </span>
          <ChevronDown
            className={`w-4 h-4 shrink-0 text-[#a89f91] transition-transform duration-200 ${
              isOpen ? "rotate-180 text-crimson-400" : "group-hover:text-[#dedacb]"
            }`}
          />
        </button>
      </div>

      {/* Floating Glass Dropdown Panel */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-[#0d1311]/98 border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden backdrop-blur-2xl animate-fadeIn">
          {/* Search Header */}
          <div className="p-3 border-b border-white/10 bg-[#16201c] flex items-center gap-2.5">
            <Search className="w-4 h-4 text-[#a89f91] shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-xs text-[#f2efe9] placeholder-[#576b62] font-mono focus:outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="text-[#a89f91] hover:text-[#f2efe9]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Options Counter Header */}
          <div className="px-3.5 py-1.5 bg-[#0d1311] border-b border-white/5 flex items-center justify-between text-[10px] font-mono text-[#71827a]">
            <span>{filteredOptions.length} matching entries</span>
            <span>Type to filter</span>
          </div>

          {/* Options List */}
          <div className="max-h-64 overflow-y-auto p-1.5 space-y-0.5 scrollbar-thin">
            {filteredOptions.length > 0 ? (
              filteredOptions.slice(0, 150).map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value, opt);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-mono transition flex items-center justify-between group ${
                      isSelected
                        ? "bg-crimson-950/80 text-crimson-200 font-bold border border-crimson-500/40"
                        : "text-[#dedacb] hover:bg-[#1a2621] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate pr-2">
                      {opt.flag && <span className="text-base leading-none">{opt.flag}</span>}
                      <span className="truncate">{opt.label}</span>
                      {opt.subtext && (
                        <span className="text-[10px] text-[#71827a] font-normal truncate">
                          ({opt.subtext})
                        </span>
                      )}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-crimson-400 shrink-0" />}
                  </button>
                );
              })
            ) : allowCustomInput && searchTerm.trim() ? (
              <div className="p-3 space-y-2">
                <div className="text-[11px] text-[#a89f91] font-mono">
                  Not found in global index? You can write custom:
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onChange(searchTerm.trim(), { label: searchTerm.trim(), value: searchTerm.trim() });
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl bg-crimson-950/70 hover:bg-crimson-900/80 border border-crimson-500/50 text-xs font-mono text-crimson-200 font-bold flex items-center justify-between transition"
                >
                  <span className="truncate">Use: "{searchTerm.trim()}"</span>
                  <Check className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>
            ) : (
              <div className="p-6 text-center text-xs font-mono text-[#a89f91]">
                No entries match your search.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
