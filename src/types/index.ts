import { z } from "zod";

export type DomainType =
  | "artist"
  | "movie"
  | "tv_show"
  | "place"
  | "brand"
  | "video_game"
  | "book"
  | "podcast";

export interface TasteEntity {
  id: string;
  domain: DomainType;
  qloo_entity_id: string;
  name: string;
  source: "user" | "inferred";
  weight: number; // 0.0 to 1.0
  tags?: string[];
  imageUrl?: string;
  description?: string;
}

export interface StudentProfile {
  id: string;
  email?: string;
  display_name: string;
  home_city: string;
  home_country: string;
  target_country?: string;
  target_city: string;
  target_university: string;
  target_lat: number;
  target_lng: number;
  major: string;
  languages: string[];
  goals: string[]; // e.g. "I feel lonely", "I'm struggling with CS algorithms", "I miss home food"
  is_public: boolean;
  is_online?: boolean;
  last_seen?: string;
  taste_entities: TasteEntity[];
  created_at: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  recipientId: string;
  text: string;
  timestamp: string;
}

export interface AgentTraceStep {
  id: string;
  timestamp: string;
  phase: "plan" | "act" | "observe" | "revise";
  tool: string;
  input: Record<string, any>;
  outputSummary: string;
  status: "running" | "success" | "revised" | "error";
  reasoning: string;
}

export interface VerifiedPlace {
  id: string;
  name: string;
  category: "cafe" | "restaurant" | "grocery" | "venue" | "cultural" | "nightlife" | "cinema" | "library" | "gaming";
  lat: number;
  lng: number;
  address?: string;
  cuisine?: string;
  opening_hours?: string;
  website?: string;
  wheelchair?: string;
  distance_meters: number;
  walking_time_mins: number;
  qloo_affinity_score: number; // 0 - 100
  matched_taste_entities: string[];
  why_it_fits: string;
  osm_id?: number | string;
  osm_type?: string;
  verified: boolean;
}

export interface NeighborhoodScore {
  name: string;
  lat: number;
  lng: number;
  score: number; // 0 - 100
  vibe: string;
  top_places: string[];
  taste_alignment_reasons: string[];
}

export interface DayPlanItem {
  timeOfDay: "Morning" | "Afternoon" | "Evening";
  title: string;
  place?: VerifiedPlace;
  activity: string;
  whyThisFits: string;
  tasteEntityCitations: string[];
  estimatedCost?: string;
  practicalTip?: string;
}

export interface WeekPlan {
  weekNumber: number;
  theme: string;
  focus: string;
  days: {
    dayName: string;
    items: DayPlanItem[];
  }[];
}

export interface SettleModuleResult {
  city: string;
  university: string;
  places: VerifiedPlace[];
  neighborhoods: NeighborhoodScore[];
  first30DaysPlan: WeekPlan[];
  agentTrace: AgentTraceStep[];
}

export interface ConnectMatch {
  peer: StudentProfile;
  matchScore: number; // 0 - 100
  scoreFormulaBreakdown: {
    directOverlapScore: number;
    tasteBridgeScore: number;
    academicSynergyScore: number;
    neighborhoodProximityScore: number;
  };
  sharedEntities: TasteEntity[];
  bridgeEntities: {
    userEntity: string;
    peerEntity: string;
    bridgeCategory: string;
    explanation: string;
  }[];
  whyYouClick: string;
  suggestedMeetupSpot: VerifiedPlace;
  suggestedPlaces?: VerifiedPlace[];
  sharedPlaylist: {
    title: string;
    description: string;
    tracks: {
      artist: string;
      songOrStyle: string;
      source: "shared" | "discovery_for_a" | "discovery_for_b";
    }[];
  };
  conversationStarters: string[];
}

export interface QlooOnOffComparison {
  module: "SETTLE" | "CONNECT";
  plainLLM: {
    title: string;
    output: any;
    verifiedPlacesCount: number;
    tasteGraphCitationsCount: number;
    hallucinationRisk: "High" | "Medium" | "Low";
    critique: string;
  };
  qlooHomebase: {
    title: string;
    output: any;
    verifiedPlacesCount: number;
    tasteGraphCitationsCount: number;
    hallucinationRisk: "None (OSM-verified)" | "Low";
    superpower: string;
  };
}
