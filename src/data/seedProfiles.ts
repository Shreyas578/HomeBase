import { StudentProfile } from "@/types";

export const DEMO_PRIMARY_STUDENT: StudentProfile = {
  id: "student-aarav-pune",
  display_name: "Aarav Sharma",
  home_city: "Pune",
  home_country: "India",
  target_city: "Berlin",
  target_university: "TU Berlin (Technical University of Berlin)",
  target_lat: 52.5119,
  target_lng: 13.3265,
  major: "Computer Science & Machine Learning",
  languages: ["English", "Hindi", "Marathi", "German (A1 Beginner)"],
  goals: [
    "I miss authentic home food & comforting chai spots to study",
    "I feel overwhelmed navigating German student life and feeling isolated",
    "I'm struggling with CS Algorithms (Dynamic Programming & Graph Theory)"
  ],
  is_public: true,
  taste_entities: [
    // Music
    {
      id: "ent-1",
      domain: "artist",
      qloo_entity_id: "urn:entity:artist:radiohead",
      name: "Radiohead",
      source: "user",
      weight: 0.95,
      tags: ["alt-rock", "experimental", "art-rock", "melancholic"],
      description: "Atmospheric electronic and experimental rock with intricate soundscapes"
    },
    {
      id: "ent-2",
      domain: "artist",
      qloo_entity_id: "urn:entity:artist:prateek_kuhad",
      name: "Prateek Kuhad",
      source: "user",
      weight: 0.88,
      tags: ["indie-folk", "acoustic", "singer-songwriter"],
      description: "Intimate indie acoustic and bilingual folk melodies"
    },
    {
      id: "ent-3",
      domain: "artist",
      qloo_entity_id: "urn:entity:artist:bonobo",
      name: "Bonobo",
      source: "inferred",
      weight: 0.82,
      tags: ["downtempo", "ambient-electronic", "lofi-beats"],
      description: "Sophisticated ambient downtempo ideal for deep focus work"
    },
    // Film / TV / Anime
    {
      id: "ent-4",
      domain: "tv_show",
      qloo_entity_id: "urn:entity:tv_show:steins_gate",
      name: "Steins;Gate",
      source: "user",
      weight: 0.92,
      tags: ["sci-fi", "time-travel", "psychological", "anime"],
      description: "Causality loops, world-lines, and hard-science cognitive puzzles"
    },
    {
      id: "ent-5",
      domain: "movie",
      qloo_entity_id: "urn:entity:movie:interstellar",
      name: "Interstellar",
      source: "user",
      weight: 0.90,
      tags: ["physics", "space-exploration", "relativity", "emotional"],
      description: "General relativity, dimensional topology, and human perseverance"
    },
    // Games
    {
      id: "ent-6",
      domain: "video_game",
      qloo_entity_id: "urn:entity:video_game:portal_2",
      name: "Portal 2",
      source: "user",
      weight: 0.91,
      tags: ["physics-puzzle", "spatial-reasoning", "valve"],
      description: "Spatial mechanics, momentum conservation, and algorithmic problem solving"
    },
    {
      id: "ent-7",
      domain: "video_game",
      qloo_entity_id: "urn:entity:video_game:elden_ring",
      name: "Elden Ring",
      source: "user",
      weight: 0.85,
      tags: ["action-rpg", "lore", "graph-traversal", "strategic"],
      description: "Branching state machines, spatial world topology, and stamina management"
    },
    // Dining / Cafe / Lifestyle
    {
      id: "ent-8",
      domain: "place",
      qloo_entity_id: "urn:entity:place:v60_pourover_specialty",
      name: "Specialty Pour-Over & Third-Wave Coffee",
      source: "user",
      weight: 0.94,
      tags: ["quiet-vibe", "wifi", "study-friendly", "single-origin"],
      description: "Minimalist third-wave coffee spaces with focus-friendly acoustics"
    },
    {
      id: "ent-9",
      domain: "place",
      qloo_entity_id: "urn:entity:place:maharashtrian_street_food",
      name: "Comforting Indian Street Food & Masala Chai",
      source: "user",
      weight: 0.96,
      tags: ["authentic-spices", "chai", "comfort-food", "vegetarian-friendly"],
      description: "Home-style comforting regional Indian dishes, warm chai, and spices"
    }
  ],
  created_at: "2026-10-29T08:00:00Z"
};

export const SEEDED_PEER_STUDENTS: StudentProfile[] = [
  {
    id: "peer-elena-berlin",
    display_name: "Elena Rostova",
    home_city: "Tbilisi",
    home_country: "Georgia",
    target_city: "Berlin",
    target_university: "TU Berlin",
    target_lat: 52.5125,
    target_lng: 13.3280,
    major: "Computer Science & Robotics",
    languages: ["English", "Georgian", "Russian", "German (B2)"],
    goals: [
      "Find coding partners who like ambient study sessions",
      "Discover hidden electronic live performance spaces in Kreuzberg & Neukölln"
    ],
    is_public: true,
    taste_entities: [
      {
        id: "pe1-1",
        domain: "artist",
        qloo_entity_id: "urn:entity:artist:radiohead",
        name: "Radiohead",
        source: "user",
        weight: 0.93,
        tags: ["alt-rock", "experimental"]
      },
      {
        id: "pe1-2",
        domain: "artist",
        qloo_entity_id: "urn:entity:artist:nils_frahm",
        name: "Nils Frahm",
        source: "user",
        weight: 0.90,
        tags: ["neoclassical", "ambient-piano", "modular-synth"]
      },
      {
        id: "pe1-3",
        domain: "video_game",
        qloo_entity_id: "urn:entity:video_game:portal_2",
        name: "Portal 2",
        source: "user",
        weight: 0.89,
        tags: ["physics-puzzle", "valve"]
      },
      {
        id: "pe1-4",
        domain: "place",
        qloo_entity_id: "urn:entity:place:v60_pourover_specialty",
        name: "Third Wave Coffee & Botanical Cafes",
        source: "user",
        weight: 0.92,
        tags: ["quiet-vibe", "wifi", "study-friendly"]
      }
    ],
    created_at: "2026-10-28T14:00:00Z"
  },
  {
    id: "peer-kenji-tokyo",
    display_name: "Kenji Sato",
    home_city: "Osaka",
    home_country: "Japan",
    target_city: "Berlin",
    target_university: "TU Berlin",
    target_lat: 52.5110,
    target_lng: 13.3250,
    major: "Electrical Engineering",
    languages: ["Japanese", "English", "German (A2)"],
    goals: [
      "Find people who love anime, sci-fi philosophy, and tabletop games",
      "Explore international food markets and tea houses"
    ],
    is_public: true,
    taste_entities: [
      {
        id: "pe2-1",
        domain: "tv_show",
        qloo_entity_id: "urn:entity:tv_show:steins_gate",
        name: "Steins;Gate",
        source: "user",
        weight: 0.97,
        tags: ["sci-fi", "time-travel", "anime"]
      },
      {
        id: "pe2-2",
        domain: "video_game",
        qloo_entity_id: "urn:entity:video_game:elden_ring",
        name: "Elden Ring",
        source: "user",
        weight: 0.94,
        tags: ["action-rpg", "strategic"]
      },
      {
        id: "pe2-3",
        domain: "artist",
        qloo_entity_id: "urn:entity:artist:nujabes",
        name: "Nujabes",
        source: "user",
        weight: 0.91,
        tags: ["lofi-hiphop", "jazz-hop", "chill"]
      },
      {
        id: "pe2-4",
        domain: "place",
        qloo_entity_id: "urn:entity:place:specialty_tea_house",
        name: "Matcha & Herbal Tea Lounges",
        source: "user",
        weight: 0.88,
        tags: ["calm", "zen-aesthetic", "tea"]
      }
    ],
    created_at: "2026-10-27T11:00:00Z"
  },
  {
    id: "peer-mateo-bogota",
    display_name: "Mateo Silva",
    home_city: "Bogotá",
    home_country: "Colombia",
    target_city: "Berlin",
    target_university: "TU Berlin",
    target_lat: 52.5050,
    target_lng: 13.3350,
    major: "Renewable Energy Systems",
    languages: ["Spanish", "English", "German (B1)"],
    goals: [
      "Find weekend running and cycling groups around Tiergarten",
      "Listen to vinyl and discover local indie music records"
    ],
    is_public: true,
    taste_entities: [
      {
        id: "pe3-1",
        domain: "artist",
        qloo_entity_id: "urn:entity:artist:bonobo",
        name: "Bonobo",
        source: "user",
        weight: 0.89,
        tags: ["downtempo", "ambient-electronic"]
      },
      {
        id: "pe3-2",
        domain: "artist",
        qloo_entity_id: "urn:entity:artist:khruangbin",
        name: "Khruangbin",
        source: "user",
        weight: 0.92,
        tags: ["psychedelic-funk", "world-groove", "instrumental"]
      },
      {
        id: "pe3-3",
        domain: "movie",
        qloo_entity_id: "urn:entity:movie:interstellar",
        name: "Interstellar",
        source: "user",
        weight: 0.87,
        tags: ["physics", "space"]
      }
    ],
    created_at: "2026-10-26T16:30:00Z"
  },
  {
    id: "peer-fatima-cairo",
    display_name: "Fatima Al-Mansoor",
    home_city: "Alexandria",
    home_country: "Egypt",
    target_city: "Berlin",
    target_university: "TU Berlin",
    target_lat: 52.5180,
    target_lng: 13.3200,
    major: "Applied Mathematics",
    languages: ["Arabic", "English", "French", "German (A2)"],
    goals: [
      "Form rigorous problem-solving study groups for calculus & graph theory",
      "Find spice markets, Middle Eastern grocers, and quiet libraries"
    ],
    is_public: true,
    taste_entities: [
      {
        id: "pe4-1",
        domain: "movie",
        qloo_entity_id: "urn:entity:movie:interstellar",
        name: "Interstellar",
        source: "user",
        weight: 0.95,
        tags: ["astronomy", "mathematics"]
      },
      {
        id: "pe4-2",
        domain: "artist",
        qloo_entity_id: "urn:entity:artist:ludovico_einaudi",
        name: "Ludovico Einaudi",
        source: "user",
        weight: 0.91,
        tags: ["neoclassical", "minimalist-piano", "focus"]
      },
      {
        id: "pe4-3",
        domain: "place",
        qloo_entity_id: "urn:entity:place:spice_bazaar_grocer",
        name: "International Spice & Specialty Grocers",
        source: "user",
        weight: 0.93,
        tags: ["spices", "specialty-grocery", "authentic-produce"]
      }
    ],
    created_at: "2026-10-25T09:15:00Z"
  },
  {
    id: "peer-lucas-lyon",
    display_name: "Lucas Dupont",
    home_city: "Lyon",
    home_country: "France",
    target_city: "Berlin",
    target_university: "TU Berlin",
    target_lat: 52.5130,
    target_lng: 13.3310,
    major: "Software Engineering & Game Development",
    languages: ["French", "English", "German (B1)"],
    goals: [
      "Collaborate on game engine architecture and indie game jams",
      "Explore indie cinema screenings and micro-roasteries"
    ],
    is_public: true,
    taste_entities: [
      {
        id: "pe5-1",
        domain: "video_game",
        qloo_entity_id: "urn:entity:video_game:portal_2",
        name: "Portal 2",
        source: "user",
        weight: 0.96,
        tags: ["physics-puzzle", "game-design"]
      },
      {
        id: "pe5-2",
        domain: "video_game",
        qloo_entity_id: "urn:entity:video_game:elden_ring",
        name: "Elden Ring",
        source: "user",
        weight: 0.90,
        tags: ["action-rpg", "level-design"]
      },
      {
        id: "pe5-3",
        domain: "artist",
        qloo_entity_id: "urn:entity:artist:radiohead",
        name: "Radiohead",
        source: "user",
        weight: 0.88,
        tags: ["experimental-rock", "synthesizer"]
      }
    ],
    created_at: "2026-10-24T18:45:00Z"
  }
];
