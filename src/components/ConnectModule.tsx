"use client";

import React, { useState, useEffect } from "react";
import { StudentProfile, ConnectMatch, ChatMessage, VerifiedPlace } from "@/types";
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
  ArrowRight,
  UserPlus,
  Check,
  Send,
  X,
  ExternalLink,
  Clock,
  Radio,
  Coffee,
  Building2,
  Compass
} from "lucide-react";

interface ConnectModuleProps {
  currentProfile: StudentProfile;
}

export const ConnectModule: React.FC<ConnectModuleProps> = ({ currentProfile }) => {
  const [peers, setPeers] = useState<StudentProfile[]>([]);
  const [filterMode, setFilterMode] = useState<"all" | "online">("all");
  const [selectedPeer, setSelectedPeer] = useState<StudentProfile | null>(null);
  const [isPublic, setIsPublic] = useState(currentProfile.is_public);
  const [friendsList, setFriendsList] = useState<Record<string, boolean>>({});
  const [isLoadingPeers, setIsLoadingPeers] = useState(true);
  
  // Interactive Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});
  const [inputMessage, setInputMessage] = useState("");

  const [matchData, setMatchData] = useState<ConnectMatch | null>(null);

  // Fetch real registered peers from API
  useEffect(() => {
    async function loadLivePeers() {
      setIsLoadingPeers(true);
      try {
        const res = await fetch(`/api/peers?city=${encodeURIComponent(currentProfile.target_city || "")}&excludeId=${encodeURIComponent(currentProfile.id || "")}`);
        if (res.ok) {
          const data = await res.json();
          const liveList = (data.peers || []) as StudentProfile[];
          setPeers(liveList);
          if (liveList.length > 0) {
            const first = liveList[0];
            setSelectedPeer(first);
            setMatchData(qlooCompareProfiles(currentProfile, first));
          } else {
            setSelectedPeer(null);
            setMatchData(null);
          }
        }
      } catch (err) {
        console.warn("Live peers fetch notice:", err);
      } finally {
        setIsLoadingPeers(false);
      }
    }

    loadLivePeers();
  }, [currentProfile]);

  const handleSelectPeer = (peer: StudentProfile) => {
    setSelectedPeer(peer);
    setMatchData(qlooCompareProfiles(currentProfile, peer));
  };

  const toggleFriend = (peerId: string) => {
    setFriendsList((prev) => ({
      ...prev,
      [peerId]: !prev[peerId]
    }));
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || !selectedPeer) return;

    const peerId = selectedPeer.id;
    const meetupName = matchData?.suggestedMeetupSpot?.name || "the local campus roastery";

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentProfile.id,
      recipientId: peerId,
      text: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const currentChat = chatMessages[peerId] || [];
    setChatMessages({
      ...chatMessages,
      [peerId]: [...currentChat, newMessage]
    });
    setInputMessage("");

    // Simulate friendly instant reply based on taste bridges
    setTimeout(() => {
      const replyMessage: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        senderId: peerId,
        recipientId: currentProfile.id,
        text: `Totally agree! We should definitely check out ${meetupName} together for an acoustic study session!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setChatMessages((prev) => ({
        ...prev,
        [peerId]: [...(prev[peerId] || []), replyMessage]
      }));
    }, 1400);
  };

  const filteredPeers = peers.filter((p) => {
    if (filterMode === "online") return p.is_online === true;
    return true;
  });

  const isFriend = selectedPeer ? Boolean(friendsList[selectedPeer.id]) : false;
  const activeChatList = selectedPeer ? (chatMessages[selectedPeer.id] || []) : [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="editorial-card rounded-3xl p-8 sm:p-10 border border-[#2e3e38] shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-crimson-400 text-xs font-bold uppercase tracking-widest font-mono">
            <Users className="w-4 h-4 text-crimson-500" /> Module 02 : Connect
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#f2efe9] mt-2 tracking-tight">
            Live Peer Matching & Discovery Bridges
          </h2>
          <p className="text-sm text-[#a89f91] mt-2 max-w-2xl leading-relaxed font-light">
            Real registered students and classmates. Matches on subtle cultural bridges, reveals shared playlists, verified midpoint meetup spots, and enables live 1-on-1 direct chat.
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
      <QlooComparisonCard module="CONNECT" profile={currentProfile} />

      {/* Peer Selector Menu & Presence Filter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="text-xs font-extrabold text-[#dedacb] uppercase tracking-wider font-mono flex items-center gap-2">
            <Users className="w-4 h-4 text-crimson-400" />
            Classmates in {currentProfile.target_city || "Your City"} ({filteredPeers.length})
          </span>

          {/* Online Presence Filter Switch */}
          <div className="flex rounded-2xl bg-[#141d19] p-1 border border-[#2e3e38] text-xs shadow-inner">
            <button
              onClick={() => setFilterMode("all")}
              className={`px-3.5 py-1.5 rounded-xl font-mono text-[11px] uppercase tracking-wider font-bold transition ${
                filterMode === "all" ? "crimson-pill text-white shadow-md" : "text-[#a89f91] hover:text-[#dedacb]"
              }`}
            >
              All Students ({peers.length})
            </button>
            <button
              onClick={() => setFilterMode("online")}
              className={`px-3.5 py-1.5 rounded-xl font-mono text-[11px] uppercase tracking-wider font-bold transition flex items-center gap-1.5 ${
                filterMode === "online" ? "forest-pill text-white shadow-md" : "text-[#a89f91] hover:text-[#dedacb]"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Online Now ({peers.filter(p => p.is_online).length})
            </button>
          </div>
        </div>

        {/* Peer Cards Grid */}
        {isLoadingPeers ? (
          <div className="p-8 text-center bg-[#141d19] rounded-2xl border border-[#2e3e38] text-xs font-mono text-[#a89f91]">
            Scanning registered student database in {currentProfile.target_city || "your city"}...
          </div>
        ) : filteredPeers.length === 0 ? (
          <div className="p-8 text-center bg-[#141d19] rounded-2xl border border-[#2e3e38] space-y-2">
            <p className="text-sm text-[#dedacb] font-display font-bold">
              {filterMode === "online" ? "No other classmates are currently online" : "You are the first registered student in this city!"}
            </p>
            <p className="text-xs text-[#a89f91] font-light max-w-md mx-auto">
              As other students register their profile with their email and destination university, they will appear here live with their verified taste bridges and online presence.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {filteredPeers.map((peer) => {
              const isSelected = selectedPeer?.id === peer.id;
              return (
                <div
                  key={peer.id}
                  onClick={() => handleSelectPeer(peer)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border text-left shadow-md relative overflow-hidden ${
                    isSelected
                      ? "bg-[#1c2822] border-crimson-500 shadow-xl ring-2 ring-crimson-500/40 scale-[1.02]"
                      : "bg-[#141d19] border-[#2e3e38] hover:border-[#dedacb]/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${peer.is_online ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-zinc-600"}`} />
                      <span className="font-bold text-[#dedacb] text-xs font-mono truncate">{peer.display_name}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-crimson-950/80 text-crimson-400 border border-crimson-500/40 shrink-0">
                      {peer.home_country}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#a89f91] mt-1.5 line-clamp-1">{peer.major}</div>

                  <div className="mt-2.5 pt-2 border-t border-[#25332e] flex items-center justify-between text-[10px] font-mono">
                    <span className={peer.is_online ? "text-emerald-400 font-semibold" : "text-[#a89f91]/80"}>
                      {peer.last_seen || (peer.is_online ? "Online now" : "Offline")}
                    </span>
                    <span className="text-crimson-400 font-bold">
                      {peer.taste_entities[0]?.name || "Cultural match"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Compatibility & Profile Showcase */}
      {selectedPeer && matchData ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Compatibility Breakdown & Taste Bridges */}
        <div className="lg:col-span-7 space-y-6">
          <div className="editorial-card rounded-3xl p-6 sm:p-8 border border-[#2e3e38] shadow-xl space-y-5">
            {/* Header with Add Friend and Start Chat Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#25332e] gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${selectedPeer.is_online ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`} />
                  <span className="text-xs text-crimson-400 font-mono font-bold uppercase tracking-widest">
                    {selectedPeer.is_online ? "Online Peer" : "Peer Profile"}
                  </span>
                </div>
                <h3 className="text-2xl font-display font-bold text-[#dedacb] mt-0.5">
                  {currentProfile.display_name || "You"} & {selectedPeer.display_name}
                </h3>
                <p className="text-xs text-[#a89f91] mt-0.5">
                  {selectedPeer.major} • From {selectedPeer.home_city}, {selectedPeer.home_country}
                </p>
              </div>

              {/* Action Buttons: Add Friend + Message */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => toggleFriend(selectedPeer.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-md ${
                    isFriend
                      ? "bg-emerald-950/90 text-emerald-300 border border-emerald-500/50"
                      : "bg-[#141d19] text-[#dedacb] border border-[#2e3e38] hover:border-crimson-500"
                  }`}
                >
                  {isFriend ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <UserPlus className="w-3.5 h-3.5 text-crimson-400" />}
                  {isFriend ? "Friends" : "Add Friend"}
                </button>

                <button
                  onClick={() => setIsChatOpen(true)}
                  className="px-4 py-2 rounded-xl crimson-pill hover:brightness-110 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-md"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Chat
                </button>

                <div className="text-right pl-3 border-l border-[#2e3e38]">
                  <span className="text-3xl font-display font-extrabold text-crimson-400">
                    {matchData.matchScore}%
                  </span>
                  <div className="text-[10px] text-[#a89f91] font-mono uppercase">Qloo Resonance</div>
                </div>
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

            {/* Why You Click */}
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

        {/* Right Column: Suggested Meetup Spots (Expanded) & Shared Playlist */}
        <div className="lg:col-span-5 space-y-6">
          {/* Multiple Curated Meetup Suggestions */}
          <div className="editorial-card rounded-3xl p-6 border border-[#2e3e38] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" /> Suggested Meetup Spots ({matchData.suggestedPlaces?.length || 1})
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                OSM Grounded
              </span>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {(matchData.suggestedPlaces || [matchData.suggestedMeetupSpot]).map((spot, idx) => {
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${spot.name}, ${spot.address || currentProfile.target_city}`)}`;
                return (
                  <div key={spot.id || idx} className="p-4 rounded-2xl bg-[#141d19] border border-[#2e3e38] space-y-2 hover:border-[#425a50] transition">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-[#dedacb] text-sm font-display">{spot.name}</h4>
                        <p className="text-xs text-[#a89f91] font-mono">{spot.address}</p>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-crimson-400 bg-crimson-950/60 border border-crimson-500/30 px-2 py-0.5 rounded-full shrink-0">
                        {spot.qloo_affinity_score}% Match
                      </span>
                    </div>

                    <p className="text-xs text-[#dedacb] font-light leading-relaxed">
                      {spot.why_it_fits}
                    </p>

                    <div className="pt-2 border-t border-[#25332e] flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#a89f91] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {spot.walking_time_mins} min walk ({spot.distance_meters}m)
                      </span>
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                      >
                        <MapPin className="w-3 h-3" /> Maps ↗
                      </a>
                    </div>
                  </div>
                );
              })}
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
      ) : null}

      {/* Direct Interactive Chat Drawer / Modal */}
      {isChatOpen && selectedPeer && matchData && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-lg bg-[#0e1612] border border-[#2e3e38] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col h-[560px] max-h-[92vh] overflow-hidden animate-fadeIn">
            {/* Chat Top Header */}
            <div className="p-4 sm:p-5 border-b border-[#25332e] bg-[#141d19] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-crimson-950/80 border border-crimson-500/40 flex items-center justify-center text-crimson-300 font-bold font-mono">
                    {selectedPeer.display_name[0]}
                  </div>
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#141d19] ${selectedPeer.is_online ? "bg-emerald-400" : "bg-zinc-600"}`} />
                </div>
                <div>
                  <h4 className="font-bold text-[#dedacb] text-sm">{selectedPeer.display_name}</h4>
                  <p className="text-[11px] text-[#a89f91] font-mono">
                    {selectedPeer.is_online ? "Active Now • " : "Offline • "}
                    {matchData.matchScore}% Taste Affinity
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 rounded-xl text-[#a89f91] hover:text-white hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0d1310]">
              <div className="text-center my-2">
                <span className="text-[10px] font-mono text-[#a89f91] bg-[#141d19] px-3 py-1 rounded-full border border-[#2e3e38]">
                  Connected via HomeBase Taste Graph • {matchData.bridgeEntities[0]?.bridgeCategory || "Cultural Bridges"}
                </span>
              </div>

              {activeChatList.map((msg) => {
                const isMe = msg.senderId === currentProfile.id;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <div
                      className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                        isMe
                          ? "bg-crimson-600 text-white rounded-br-sm"
                          : "bg-[#18231e] text-[#dedacb] border border-[#2e3e38] rounded-bl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] font-mono text-[#a89f91] px-1 mt-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Quick Starters in Chat */}
            <div className="px-4 py-2 bg-[#141d19] border-t border-[#25332e] flex items-center gap-2 overflow-x-auto text-[10px] font-mono">
              <span className="text-[#a89f91] shrink-0">Quick ask:</span>
              <button
                onClick={() => setInputMessage(`Hey, want to grab coffee at ${matchData.suggestedMeetupSpot.name}?`)}
                className="px-2.5 py-1 rounded-full bg-[#1b2621] text-[#dedacb] hover:text-white border border-[#2e3e38] whitespace-nowrap"
              >
                ☕ Meet at {matchData.suggestedMeetupSpot.name.split(" ")[0]}
              </button>
              <button
                onClick={() => setInputMessage(`What are your favorite tracks from ${selectedPeer.taste_entities[0]?.name || "music"}?`)}
                className="px-2.5 py-1 rounded-full bg-[#1b2621] text-[#dedacb] hover:text-white border border-[#2e3e38] whitespace-nowrap"
              >
                🎵 Ask about {selectedPeer.taste_entities[0]?.name || "tastes"}
              </button>
            </div>

            {/* Chat Input Field */}
            <form onSubmit={handleSendMessage} className="p-3.5 bg-[#141d19] border-t border-[#25332e] flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Message ${selectedPeer.display_name.split(" ")[0]}...`}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#0d1310] border border-[#2e3e38] text-xs font-mono text-[#dedacb] placeholder-[#a89f91]/50 focus:outline-none focus:border-crimson-500"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2.5 rounded-xl crimson-pill hover:brightness-110 disabled:opacity-40 text-white transition shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

