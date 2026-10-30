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
      <div className="editorial-card rounded-3xl p-8 sm:p-10 border border-[#2e3e38] shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-crimson-400 text-xs font-bold uppercase tracking-widest font-mono">
            <Users className="w-4 h-4 text-crimson-500" /> Module 02 : Connect
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#f2efe9] mt-2 tracking-tight">
            Taste Graph Peer Matching & Discovery Bridges
          </h2>
          <p className="text-sm text-[#a89f91] mt-2 max-w-2xl leading-relaxed font-light">
            Matches students not just on identical tastes, but on non-identical yet adjacent &quot;bridges&quot; (e.g. Radiohead ➔ Nils Frahm).
            Calculates a transparent formula score, verified midpoint meetup, and shared playlist.
          </p>
        </div>

        {/* Privacy Consent Toggle */}
        <div className="p-4 rounded-2xl bg-[#141d19] border border-[#2e3e38] flex items-center gap-4 self-stretch sm:self-auto shadow-md">
          {isPublic ? <Globe className="w-5 h-5 text-emerald-400" /> : <Lock className="w-5 h-5 text-[#a89f91]" />}
          <div className="text-xs">
            <div className="font-bold text-[#f2efe9] uppercase tracking-wider font-mono">Peer Visibility</div>
            <div className="text-[#a89f91] text-[11px] font-mono">{isPublic ? "Visible to students" : "Private / Hidden"}</div>
          </div>
          <button
            onClick={() => setIsPublic(!isPublic)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold transition ${
              isPublic ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/40" : "bg-[#1c2822] text-[#a89f91] border border-[#2e3e38]"
            }`}
          >
            {isPublic ? "Active" : "Hidden"}
          </button>
        </div>
      </div>

      {/* Signature Qloo ON / OFF Toggle */}
      <QlooComparisonCard module="CONNECT" />

      {/* Peer Selector Tabs */}
      <div className="space-y-3">
        <span className="text-xs font-extrabold text-[#1c1815] uppercase tracking-wider">
          Potential Student Matches in {currentProfile.target_city || "Your City"}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {SEEDED_PEER_STUDENTS.map((peer) => {
            const isSelected = selectedPeer.id === peer.id;
            return (
              <div
                key={peer.id}
                onClick={() => handleSelectPeer(peer)}
                className={`p-4 rounded-2xl cursor-pointer transition border text-left shadow-md ${
                  isSelected
                    ? "bg-[#1c2822] border-crimson-500 shadow-xl ring-2 ring-crimson-500/30 scale-[1.02]"
                    : "bg-[#141d19] border-[#2e3e38] hover:border-[#dedacb]/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#dedacb] text-xs font-mono">{peer.display_name}</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-crimson-950/80 text-crimson-400 border border-crimson-500/40">
                    {peer.home_country}
                  </span>
                </div>
                <div className="text-[11px] text-[#a89f91] mt-1 line-clamp-1">{peer.major}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Match Insight Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Score & Why you click */}
        <div className="lg:col-span-7 space-y-6">
          <div className="editorial-card rounded-3xl p-6 sm:p-8 border border-[#2e3e38] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#25332e]">
              <div>
                <span className="text-xs text-crimson-400 font-mono font-bold uppercase tracking-widest">Compatibility Index</span>
                <h3 className="text-2xl font-display font-bold text-[#dedacb] mt-0.5">
                  {currentProfile.display_name || "You"} & {selectedPeer.display_name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-3xl font-display font-extrabold text-crimson-400">
                  {matchData.matchScore}%
                </span>
                <div className="text-[10px] text-[#a89f91] font-mono uppercase">Qloo Resonance</div>
              </div>
            </div>

            {/* Formula Breakdown */}
            <div className="p-4 rounded-2xl bg-[#141d19] border border-[#2e3e38] space-y-2">
              <span className="text-[10px] font-mono tracking-wider font-bold text-[#a89f91] uppercase">
                Transparent Score Formula
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-[#18231e] border border-[#2e3e38]">
                  <div className="text-[10px] text-[#a89f91] font-mono">Direct Overlap</div>
                  <div className="font-extrabold text-crimson-400 font-mono">
                    +{matchData.scoreFormulaBreakdown.directOverlapScore} pts
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#18231e] border border-[#2e3e38]">
                  <div className="text-[10px] text-[#a89f91] font-mono">Taste Bridges</div>
                  <div className="font-extrabold text-emerald-400 font-mono">
                    +{matchData.scoreFormulaBreakdown.tasteBridgeScore} pts
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#18231e] border border-[#2e3e38]">
                  <div className="text-[10px] text-[#a89f91] font-mono">Academic</div>
                  <div className="font-extrabold text-[#dedacb] font-mono">
                    +{matchData.scoreFormulaBreakdown.academicSynergyScore} pts
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#18231e] border border-[#2e3e38]">
                  <div className="text-[10px] text-[#a89f91] font-mono">Proximity</div>
                  <div className="font-extrabold text-amber-400 font-mono">
                    +{matchData.scoreFormulaBreakdown.neighborhoodProximityScore} pts
                  </div>
                </div>
              </div>
            </div>

            {/* Why You'd Click */}
            <div className="p-4 rounded-2xl bg-crimson-950/40 border border-crimson-500/30 space-y-2">
              <span className="text-xs font-mono font-bold text-crimson-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-crimson-400" /> Grounded Friendship Prediction
              </span>
              <p className="text-xs sm:text-sm text-[#dedacb] leading-relaxed font-light">{matchData.whyYouClick}</p>
            </div>

            {/* Taste Bridges Showcase */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-[#dedacb] uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-emerald-400" /> Adjacent &quot;Taste Bridges&quot;
              </span>
              <div className="space-y-2.5">
                {matchData.bridgeEntities.map((bridge, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#141d19] border border-[#2e3e38] space-y-1.5 shadow-md">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold">
                      <span className="text-crimson-400">{bridge.userEntity}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#a89f91]" />
                      <span className="text-emerald-400">{bridge.peerEntity}</span>
                    </div>
                    <div className="text-[11px] text-[#a89f91] font-mono">{bridge.bridgeCategory}</div>
                    <p className="text-xs text-[#dedacb] leading-relaxed font-light">{bridge.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Verified Meetup Spot & Shared Playlist */}
        <div className="lg:col-span-5 space-y-6">
          <div className="editorial-card rounded-3xl p-6 border border-[#2e3e38] shadow-xl space-y-4">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" /> First Meetup Spot (OSM Verified)
            </span>
            <div className="p-4 rounded-2xl bg-[#141d19] border border-[#2e3e38] space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-[#dedacb] text-base font-display">{matchData.suggestedMeetupSpot.name}</h4>
                  <p className="text-xs text-[#a89f91] font-mono">{matchData.suggestedMeetupSpot.address}</p>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                  OSM Verified
                </span>
              </div>
              <p className="text-xs text-[#dedacb] pt-2 border-t border-[#25332e] font-light">
                {matchData.suggestedMeetupSpot.why_it_fits}
              </p>
            </div>
          </div>

          {/* Shared Playlist */}
          <div className="editorial-card rounded-3xl p-6 border border-[#2e3e38] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-crimson-400 uppercase tracking-wider flex items-center gap-2">
                <Disc3 className="w-4 h-4 text-crimson-500 animate-spin" style={{ animationDuration: "12s" }} /> Shared Taste Playlist
              </span>
              <span className="text-[10px] font-mono text-[#a89f91]">5 Tracks</span>
            </div>

            <div>
              <h4 className="font-bold text-[#dedacb] text-sm font-display">{matchData.sharedPlaylist.title}</h4>
              <p className="text-xs text-[#a89f91] mt-0.5 font-light">{matchData.sharedPlaylist.description}</p>
            </div>

            <div className="space-y-2 pt-2">
              {matchData.sharedPlaylist.tracks.map((track, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#141d19] border border-[#2e3e38] text-xs shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <Music className="w-3.5 h-3.5 text-emerald-400" />
                    <div>
                      <span className="font-bold text-[#dedacb] font-mono">{track.artist}</span>
                      <span className="text-[#a89f91] text-[11px] ml-1.5">• {track.songOrStyle}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold uppercase ${
                      track.source === "shared"
                        ? "bg-crimson-950/80 text-crimson-400 border border-crimson-500/40"
                        : "bg-emerald-950/80 text-emerald-400 border border-emerald-500/40"
                    }`}
                  >
                    {track.source === "shared" ? "Overlap" : "Discovery"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Conversation Starters */}
          <div className="editorial-card rounded-3xl p-6 border border-[#2e3e38] shadow-xl space-y-3">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" /> 3 High-Resonance Starters
            </span>
            <div className="space-y-2">
              {matchData.conversationStarters.map((starter, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#141d19] border border-[#2e3e38] text-xs text-[#dedacb] shadow-sm font-light">
                  <span className="text-amber-400 font-bold font-mono mr-1.5">#{idx + 1}</span> {starter}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
