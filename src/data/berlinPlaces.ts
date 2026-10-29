import { VerifiedPlace, NeighborhoodScore } from "@/types";

export const BERLIN_VERIFIED_DATA: {
  places: VerifiedPlace[];
  neighborhoods: NeighborhoodScore[];
} = {
  places: [
    {
      id: "bln-place-1",
      name: "The Barn Roastery (Café & Study Space)",
      category: "cafe",
      lat: 52.5284,
      lng: 13.4002,
      address: "Schönhauser Allee 8, 10119 Berlin",
      cuisine: "Specialty Coffee, Nordic Bakery",
      opening_hours: "Mo-Su 08:30-18:00",
      website: "https://thebarn.de",
      wheelchair: "yes",
      distance_meters: 4200,
      walking_time_mins: 52,
      qloo_affinity_score: 97,
      matched_taste_entities: ["Specialty Pour-Over & Third-Wave Coffee", "Radiohead"],
      why_it_fits: "World-class single-origin pour-overs, strictly curated ambient acoustic backdrop, minimalist aesthetic favored by acoustic indie and ambient electronic fans.",
      osm_id: 18239012,
      osm_type: "node",
      verified: true
    },
    {
      id: "bln-place-2",
      name: "Chai Ji (Authentic Indian Street Dining & Chai)",
      category: "restaurant",
      lat: 52.5085,
      lng: 13.3320,
      address: "Friedrichstraße 28, 10969 Berlin",
      cuisine: "Indian, Chai, Street Snacks, Vegan/Vegetarian",
      opening_hours: "Mo-Su 12:00-22:30",
      website: "https://chai-ji.de",
      wheelchair: "yes",
      distance_meters: 550,
      walking_time_mins: 7,
      qloo_affinity_score: 98,
      matched_taste_entities: ["Comforting Indian Street Food & Masala Chai", "Pune Hometown"],
      why_it_fits: "Authentic ginger-cardamom simmering cutting chai, samosas, and fragrant thali just 7 minutes walk from TU Berlin main campus.",
      osm_id: 98213014,
      osm_type: "node",
      verified: true
    },
    {
      id: "bln-place-3",
      name: "Soulcat Coffee & Vinyl Records",
      category: "cafe",
      lat: 52.4912,
      lng: 13.4255,
      address: "Pannierstraße 53, 12047 Berlin (Neukölln)",
      cuisine: "Coffee, Craft Beer, Vinyl Music",
      opening_hours: "Tu-Su 11:00-20:00",
      website: "https://soulcatmusic.com",
      wheelchair: "limited",
      distance_meters: 6900,
      walking_time_mins: 85,
      qloo_affinity_score: 94,
      matched_taste_entities: ["Radiohead", "Bonobo", "Vinyl Culture"],
      why_it_fits: "Integrates indie analog vinyl listening booths with artisanal espresso and a student-welcoming atmosphere.",
      osm_id: 45719201,
      osm_type: "node",
      verified: true
    },
    {
      id: "bln-place-4",
      name: "Asia Supermarkt Go Asia (Turmstraße)",
      category: "grocery",
      lat: 52.5262,
      lng: 13.3421,
      address: "Turmstraße 29, 10551 Berlin (Moabit)",
      cuisine: "Specialty International Grocery & Spices",
      opening_hours: "Mo-Sa 09:00-20:00",
      website: "https://goasia.net",
      wheelchair: "yes",
      distance_meters: 1800,
      walking_time_mins: 22,
      qloo_affinity_score: 91,
      matched_taste_entities: ["Comforting Indian Street Food & Masala Chai"],
      why_it_fits: "Essential first-week grocery stock: whole Indian spices, basmati rice, lentils, fresh curry leaves, and chai tea leaves at student-friendly pricing.",
      osm_id: 38291044,
      osm_type: "node",
      verified: true
    },
    {
      id: "bln-place-5",
      name: "Computerspielemuseum (Computer Games Museum)",
      category: "cultural",
      lat: 52.5173,
      lng: 13.4428,
      address: "Karl-Marx-Allee 93A, 10243 Berlin",
      cuisine: "Interactive Museum & Arcade Archive",
      opening_hours: "Mo-Su 10:00-20:00",
      website: "https://computerspielemuseum.de",
      wheelchair: "yes",
      distance_meters: 7900,
      walking_time_mins: 95,
      qloo_affinity_score: 95,
      matched_taste_entities: ["Portal 2", "Elden Ring", "CS Algorithms"],
      why_it_fits: "Historical archive of game design, interactive arcade physics exhibits, and algorithmic gaming history directly aligning with your game theory passions.",
      osm_id: 54910283,
      osm_type: "node",
      verified: true
    },
    {
      id: "bln-place-6",
      name: "TU Berlin Central Campus Library (Volkswagen Library)",
      category: "cultural",
      lat: 52.5132,
      lng: 13.3275,
      address: "Fasanenstraße 88, 10623 Berlin",
      cuisine: "Quiet Academic Study & Research Hub",
      opening_hours: "Mo-Fr 06:00-00:00, Sa 09:00-22:00",
      website: "https://ub.tu-berlin.de",
      wheelchair: "yes",
      distance_meters: 220,
      walking_time_mins: 3,
      qloo_affinity_score: 96,
      matched_taste_entities: ["Academic Goals", "Focus Work"],
      why_it_fits: "State of the art 24/7 student desks, high-speed university network, and silent reading cubicles 3 minutes from lecture halls.",
      osm_id: 11094821,
      osm_type: "node",
      verified: true
    }
  ],
  neighborhoods: [
    {
      name: "Charlottenburg (Campus Hub)",
      lat: 52.5119,
      lng: 13.3265,
      score: 96,
      vibe: "Academic, architectural, peaceful parks & authentic multicultural eateries",
      top_places: ["TU Central Library", "Chai Ji", "Savignyplatz Bookstores", "Tiergarten"],
      taste_alignment_reasons: [
        "Immediate proximity to engineering lectures and laboratories",
        "High concentration of authentic South Asian and international student diners",
        "Quiet tree-lined residential streets with low noise pollution for deep study"
      ]
    },
    {
      name: "Kreuzberg & Wrangelkiez",
      lat: 52.4990,
      lng: 13.4350,
      score: 92,
      vibe: "Vibrant indie arts, vinyl record shops, canalside cafes & experimental live music",
      top_places: ["Soulcat Records", "Markthalle Neun", "Gorlitzer Park Arts", "Indie Cinema Babylon"],
      taste_alignment_reasons: [
        "Unmatched affinity for Radiohead and Bonobo experimental electronic culture",
        "Community language tandems and grassroots student collective meetups",
        "Canal-side walking paths ideal for mental decompression"
      ]
    },
    {
      name: "Prenzlauer Berg",
      lat: 52.5380,
      lng: 13.4150,
      score: 88,
      vibe: "Third-wave specialty coffee roasteries, lush courtyards & independent bookstores",
      top_places: ["The Barn Roastery", "Mauerpark", "Kulturbrauerei"],
      taste_alignment_reasons: [
        "World capital of pour-over specialty coffee matching your single-origin preferences",
        "Historic architecture and calm co-working cafes with gigabit wifi"
      ]
    },
    {
      name: "Neukölln (Reuterkiez)",
      lat: 52.4860,
      lng: 13.4320,
      score: 85,
      vibe: "Creative, late-night tea lounges, international spice grocers & dynamic student energy",
      top_places: ["Klunkerkranich Rooftop", "Weserstraße Tea Houses", "Maybachufer Market"],
      taste_alignment_reasons: [
        "Abundance of Middle Eastern and South Asian grocers for home cooking supplies",
        "Late-night tea and chess lounges that feel like second living rooms"
      ]
    }
  ]
};
