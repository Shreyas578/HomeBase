"use client";

import React, { useState } from "react";
import { StudentProfile, ConnectMatch } from "@/types";
import { SEEDED_PEER_STUDENTS } from "@/data/seedProfiles";
import { qlooCompareProfiles } from "@/lib/agent";
import { QlooComparisonCard } from "./QlooComparisonCard";
import {
  Users,
  Sparkles,
  Music,
  MapPin,
  MessageSquare,
  Lock,
  Globe,
  Check,
  Disc3,
  Flame,
  ArrowRight
} from "lucide-react";

interface ConnectModuleProps {
  currentProfile: StudentProfile;
}

export const ConnectModule: React.FC<ConnectModuleProps> = ({ currentProfile }) => {
  const [selectedPeer, setSelectedPeer] = useState<StudentProfile>(SEEDED_PEER_STUDENTS[0]);
  const [isPublic, setIsPublic] = useState(currentProfile.is_public);
  const [matchData, setMatchData] = useState<ConnectMatch>(
    qlooCompareProfiles(currentProfile, SEEDED_PEER_STUDENTS[0])
  );

  const handleSelectPeer = (peer: StudentProfile) => {
    setSelectedPeer(peer);
    setMatchData(qlooCompareProfiles(currentProfile, peer));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4" /> Module 2: Connect
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Taste Graph Peer Matching & Discovery Bridges
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Matches students not just on identical tastes, but on non-identical yet adjacent "bridges" (e.g. Radiohead ➔ Nils Frahm).
            Calculates a transparent formula score, verified midpoint meetup, and shared playlist.
          </p>
        </div>

        {/* Privacy Consent Toggle */}
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3 self-stretch sm:self-auto">
          {isPublic ? <Globe className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-slate-400" />}
          <div className="text-xs">
            <div className="font-semibold text-white">Peer Visibility</div>
            <div className="text-slate-400 text-[10px]">{isPublic ? "Visible to students" : "Private / Hidden"}</div>
          </div>
          <button
            onClick={() => setIsPublic(!isPublic)}
            className={`w-10 h-5 rounded-full transition-colors relative ml-2 ${
              isPublic ? "bg-indigo-600" : "bg-slate-700"
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                isPublic ? "right-1" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Signature Qloo ON / OFF Toggle */}
      <QlooComparisonCard module="CONNECT" />

      {/* Peer Selector Tabs */}
      <div className="space-y-3">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Potential Student Matches in {currentProfile.target_city}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {SEEDED_PEER_STUDENTS.map((peer) => {
            const isSelected = selectedPeer.id === peer.id;
            return (
              <div
                key={peer.id}
                onClick={() => handleSelectPeer(peer)}
                className={`p-3.5 rounded-2xl cursor-pointer transition border text-left ${
                  isSelected
                    ? "bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-500/20"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{peer.display_name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    {peer.home_country}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{peer.major}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Match Insight Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Score & Why you click */}
        <div className="lg:col-span-7 space-y-6">
          {/* Match Score Card */}
          <div className="glass-panel rounded-3xl p-6 border border-indigo-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-indigo-400 font-mono font-bold uppercase">Compatibility Index</span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  Aarav & {selectedPeer.display_name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  {matchData.matchScore}%
                </span>
                <div className="text-[10px] text-slate-400 font-mono">Qloo Resonance</div>
              </div>
            </div>

            {/* Formula Breakdown */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Transparent Score Formula
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-900">
                  <div className="text-[10px] text-slate-400">Direct Overlap</div>
                  <div className="font-bold text-indigo-300 font-mono">
                    +{matchData.scoreFormulaBreakdown.directOverlapScore} pts
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900">
                  <div className="text-[10px] text-slate-400">Taste Bridges</div>
                  <div className="font-bold text-purple-300 font-mono">
                    +{matchData.scoreFormulaBreakdown.tasteBridgeScore} pts
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900">
                  <div className="text-[10px] text-slate-400">Academic</div>
                  <div className="font-bold text-emerald-300 font-mono">
                    +{matchData.scoreFormulaBreakdown.academicSynergyScore} pts
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900">
                  <div className="text-[10px] text-slate-400">Proximity</div>
                  <div className="font-bold text-amber-300 font-mono">
                    +{matchData.scoreFormulaBreakdown.neighborhoodProximityScore} pts
                  </div>
                </div>
              </div>
            </div>

            {/* Why You'd Click (Grounded LLM synthesis) */}
            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-2">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Grounded Friendship Prediction
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{matchData.whyYouClick}</p>
            </div>

            {/* Taste Bridges Showcase */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-purple-400" /> Adjacent "Taste Bridges"
              </span>
              <div className="space-y-2.5">
                {matchData.bridgeEntities.map((bridge, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-white">
                      <span className="text-indigo-400">{bridge.userEntity}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                      <span className="text-purple-400">{bridge.peerEntity}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">{bridge.bridgeCategory}</div>
                    <p className="text-xs text-slate-300 leading-relaxed">{bridge.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Verified Meetup Spot & Shared Playlist */}
        <div className="lg:col-span-5 space-y-6">
          {/* Settle-Fed Meetup Spot */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <MapPin className="w-4 h-4" /> First Meetup Spot (OSM Verified)
            </span>
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-white text-base">{matchData.suggestedMeetupSpot.name}</h4>
                  <p className="text-xs text-slate-400">{matchData.suggestedMeetupSpot.address}</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  OSM Verified
                </span>
              </div>
              <p className="text-xs text-slate-300 pt-1 border-t border-slate-800/80">
                {matchData.suggestedMeetupSpot.why_it_fits}
              </p>
            </div>
          </div>

          {/* Shared Playlist Concept */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Disc3 className="w-4 h-4 text-purple-400 animate-spin" style={{ animationDuration: "12s" }} /> Shared Taste Playlist
              </span>
              <span className="text-[10px] text-slate-400">5 Tracks</span>
            </div>

            <div>
              <h4 className="font-bold text-white text-sm">{matchData.sharedPlaylist.title}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{matchData.sharedPlaylist.description}</p>
            </div>

            <div className="space-y-2 pt-2">
              {matchData.sharedPlaylist.tracks.map((track, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Music className="w-3.5 h-3.5 text-indigo-400" />
                    <div>
                      <span className="font-bold text-white">{track.artist}</span>
                      <span className="text-slate-400 text-[11px] ml-1.5">• {track.songOrStyle}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                      track.source === "shared"
                        ? "bg-indigo-500/20 text-indigo-300"
                        : "bg-purple-500/20 text-purple-300"
                    }`}
                  >
                    {track.source === "shared" ? "Overlap" : "Discovery"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Conversation Starters */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <MessageSquare className="w-4 h-4" /> 3 High-Resonance Conversation Starters
            </span>
            <div className="space-y-2">
              {matchData.conversationStarters.map((starter, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                  <span className="text-amber-400 font-bold mr-1">#{idx + 1}</span> {starter}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
