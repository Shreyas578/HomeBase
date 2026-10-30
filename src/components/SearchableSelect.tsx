"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";

interface SearchableSelectOption {
  label: string;
  value: string;
  subtext?: string;
  flag?: string;
}

interface SearchableSelectProps {
  label: string;
  placeholder?: string;
  searchPlaceholder?: string;
  options: SearchableSelectOption[];
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  required?: boolean;
  allowCustomInput?: boolean;
  highlightBorder?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  placeholder = "Select an option...",
  searchPlaceholder = "Type to search...",
  options,
  value,
  onChange,
  disabled = false,
  required = false,
  allowCustomInput = true,
  highlightBorder = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search box when dropdown opens
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

  return (
    <div
      ref={containerRef}
      className={`relative p-3.5 rounded-2xl bg-[#141d19] border transition ${
        disabled
          ? "opacity-50 cursor-not-allowed border-[#25332e]"
          : highlightBorder
          ? "border-crimson-500/60 focus-within:border-crimson-500"
          : "border-[#2e3e38] focus-within:border-crimson-500 hover:border-[#3e534b]"
      }`}
    >
      <label className="text-[10px] font-mono uppercase text-[#a89f91] flex items-center justify-between mb-1 select-none">
        <span className={highlightBorder ? "text-crimson-400 font-bold" : ""}>
          {label} {required && "*"}
        </span>
        {value && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="text-[#a89f91] hover:text-crimson-400 transition"
            title="Clear selection"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-center justify-between gap-2 py-0.5 focus:outline-none cursor-pointer"
      >
        <span
          className={`truncate text-sm font-bold ${
            value ? (highlightBorder ? "text-crimson-400 font-black" : "text-[#dedacb]") : "text-[#4a5f56]"
          }`}
        >
          {selectedOption ? (
            <span className="flex items-center gap-1.5">
              {selectedOption.flag && <span>{selectedOption.flag}</span>}
              <span>{selectedOption.label}</span>
            </span>
          ) : value ? (
            value
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-[#a89f91] transition-transform duration-200 ${
            isOpen ? "rotate-180 text-crimson-400" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-[#0f1714] border border-[#2e3e38] shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden backdrop-blur-xl animate-fadeIn">
          {/* Search Input Box */}
          <div className="p-2.5 border-b border-[#25332e] bg-[#141d19] flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#a89f91] shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-xs text-[#dedacb] placeholder-[#4a5f56] font-mono focus:outline-none"
            />
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 scrollbar-thin">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition flex items-center justify-between group ${
                      isSelected
                        ? "bg-crimson-950/70 text-crimson-300 font-bold border border-crimson-500/30"
                        : "text-[#dedacb] hover:bg-[#1a2621] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      {opt.flag && <span className="text-base leading-none">{opt.flag}</span>}
                      <span className="truncate">{opt.label}</span>
                      {opt.subtext && (
                        <span className="text-[10px] text-[#71827a] font-normal truncate">
                          ({opt.subtext})
                        </span>
                      )}
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-crimson-400 shrink-0" />}
                  </button>
                );
              })
            ) : allowCustomInput && searchTerm.trim() ? (
              <div className="p-2 space-y-1">
                <div className="text-[11px] text-[#a89f91] font-mono">No predefined match found.</div>
                <button
                  type="button"
                  onClick={() => {
                    onChange(searchTerm.trim());
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl bg-crimson-950/60 hover:bg-crimson-900/60 border border-crimson-500/40 text-xs font-mono text-crimson-300 font-bold flex items-center justify-between"
                >
                  <span>Use custom: "{searchTerm.trim()}"</span>
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="p-4 text-center text-xs font-mono text-[#a89f91]">
                No options found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
