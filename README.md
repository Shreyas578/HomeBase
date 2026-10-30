# HomeBase 🏛️
### Qloo-Powered Autonomous Relocation & Taste Intelligence Agent

> Built for the **Qloo LLM Hackathon 2025/2026** — Bridging cultural taste, university orientation, kindred peer matching, and analogous academic pedagogy through Qloo's taste graph.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.2.0-black.svg)](https://nextjs.org/)
[![Powered by Qloo](https://img.shields.io/badge/Powered%20By-Qloo%20Taste%20Graph-e11d48.svg)](https://qloo.com/)
[![100% Free Tier](https://img.shields.io/badge/Infrastructure-100%25%20Free%20Tier-forest.svg)](https://vercel.com/)

---

## 🌟 Executive Summary & Problem Statement

Every year, over **6 million international and out-of-state students** relocate to unfamiliar university cities. They encounter three acute, unresolved friction points:

1. **The Relocation Void**: Standard search engines return tourist traps and sponsored listings. Students lack grounded, culturally aligned third places (specialty coffee, indie bookstores, intimate jazz bars, quiet acoustic libraries) that reflect their personal aesthetic.
2. **Social Disconnection & Loneliness**: Over 64% of first-year international students report severe isolation during their first 90 days. Campus matchmakers rely on superficial surveys that fail to capture nuanced cross-domain affinities.
3. **Cognitive Overload**: Hard academic concepts (thermodynamics, graph theory, algorithmic complexity) are taught in dry abstractions disconnected from cultural intuitions.

**HomeBase** solves this through an autonomous agentic pipeline combining **Qloo's cultural taste graph**, **OpenStreetMap geospatial validation**, and **Groq Llama-3.3-70B**.

---

## 🏛️ System Architecture

```mermaid
graph TD
    A[Student Input / Profile Link] -->|Spotify, Letterboxd, IMDb| B[Taste Importer / Search Engine]
    B -->|X-Api-Key GET| C[Qloo Taste Intelligence API v2]
    C -->|Taste Vectors & Entities| D[HomeBase Agent Core]
    
    subgraph "Three Core Modules"
        D -->|Geospatial Nominatim & Overpass OSM| E[Module 1: SETTLE]
        D -->|Cross-Domain Affinity Bridges| F[Module 2: CONNECT]
        D -->|Pedagogical Analogy Engine| G[Module 3: LEARN]
    end

    E -->|OSM Verified Nodes & Walking Times| H[4-Week Settlement Plan & Leaflet Map]
    F -->|Transparent Score & Midpoint Venue| I[Kindred Peer Match & Shared Playlist]
    G -->|Breakdown Limits & Quizzes| J[Analogy Lesson & Pair Study Mode]
    
    D -->|TTL Cache & Schemas| K[(Aiven MySQL Database)]
```

---

## 🚀 The Three Signature Modules

### 1. SETTLE (Taste Twins & 30-Day Orientation)
- **Live Geocoding**: Accepts any university city worldwide, resolving coordinates via Nominatim.
- **Overpass OSM Verification**: Queries live physical nodes (cafes, bookstores, libraries) and calculates verified walking times from campus anchors.
- **Neighborhood Alignment**: Scores district cultural density based on Qloo taste weights.
- **Actionable 4-Week Blueprint**: Daily curated itineraries exportable to clipboard or print.

### 2. CONNECT (Discovery Bridges & Peer Resonance)
- **Beyond Identical Tastes**: Discovers adjacent "Taste Bridges" using Qloo's cross-domain graph (e.g. User A loves *Radiohead* $\rightarrow$ Qloo bridge $\rightarrow$ User B loves *Nils Frahm*).
- **Transparent Formula**: 
  $$\text{Match} = 0.35 \times \text{Overlap} + 0.35 \times \text{Bridges} + 0.15 \times \text{Academic} + 0.15 \times \text{Proximity}$$
- **Equidistant Third-Place Meetup**: Nominatim/OSM-verified midpoint meetup spot.
- **Shared Taste Playlist**: 5-track collaborative playlist blending shared favorites and discovery tracks.

### 3. LEARN (Taste-Anchored Pedagogy)
- **Rigorous Academic Explanations**: Teaches complex university topics (Entropy, Dynamic Programming, Linear Algebra) using beloved cultural anchors (e.g., *Portal 2*, *Steins;Gate*, *Radiohead*).
- **Scientific Boundary Conditions**: Crucially explains *where the analogy breaks down* so students learn accurate physical/mathematical mechanics without false intuition.
- **Themed Mini-Quiz & Pair Study Session**: Interactive concept checks and collaborative problem-solving exercises.

---

## ⚡ Qloo ON vs. Plain LLM Benchmark

| Capability | Plain LLM (No Qloo) | HomeBase + Qloo Taste Graph |
| :--- | :--- | :--- |
| **Location Verification** | Hallucinates closed venues or commercial chains (Starbucks, TripAdvisor top 5) | **100% Grounded** in verified OpenStreetMap coordinates and actual walking distances |
| **Taste Proximity** | Basic lexical matching ("You both like rock music") | **Cross-domain latent vectors** linking music, gaming, literature, and dining vibes |
| **Friendship Discovery** | Requires exact keyword matches | **Latent bridges** identifying adjacent aesthetic frequencies |
| **Pedagogical Anchors** | Generic analogies ("Think of a car engine") | **Personalized cultural touchpoints** with explicit mathematical breakdown limits |

---

## 🔗 Taste Profile Importers

Students can configure their taste coordinates via:
- **Spotify**: Public playlist or artist URLs parsed via official oEmbed and resolved to Qloo artist URNs.
- **Letterboxd**: Profile and favorite film lists mapped to Qloo movie entities.
- **IMDb & Goodreads**: Media slugs resolved to verified cultural coordinates.
- **Live Search**: Instant resolution against Qloo's `/search` endpoint.

---

## 💼 Business Model & Go-To-Market

### Target Audience: International Student Offices & Relocation Providers
HomeBase operates as a **B2B2C Institutional SaaS**:

1. **University License (Annual SaaS)**:
   - Sold to University International Student Centers & Study Abroad Offices ($8,000 – $25,000 / year).
   - Reduces first-semester dropout rates, loneliness reports, and mental health escalations.
2. **Relocation & Student Housing Partnerships**:
   - Integrated into student housing onboarding packages (e.g., AmberStudent, Student.com) to increase lease satisfaction.
3. **Freemium Student Tier**:
   - Free baseline features for students with optional university-verified peer badges.

---

## 🛠️ Tech Stack & Zero-Cost Architecture

- **Framework**: Next.js 15 (App Router, TypeScript, Server Components)
- **Styling**: Tailwind CSS + Luxury Editorial Design System (Playfair Display, Syne, Dark Forest Obsidian, Crimson, Warm Beige)
- **Taste Intelligence**: Qloo API v2 (`hackathon.api.qloo.com`)
- **LLM Reasoning**: Groq (`llama-3.3-70b-versatile`) / OpenRouter Free Tier
- **Geocoding & Maps**: OpenStreetMap Nominatim + Overpass API + Leaflet
- **Database & Cache**: Aiven Cloud MySQL / Local MySQL with automatic TLS detection
- **Security**: Strict Content Security Policy (CSP), sliding-window edge rate limiting (60 req/min), XSS sanitizer

---

## 🚀 Local Setup & Installation

### 1. Clone & Install
```bash
git clone https://github.com/Shreyas578/HomeBase.git
cd HomeBase
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```env
# Qloo Hackathon Key
QLOO_API_KEY=your_qloo_key_here

# LLM Providers (100% Free Globally)
GROQ_API_KEY=your_groq_key_here
# Optional fallback:
OPENROUTER_API_KEY=your_openrouter_key_here

# Database (Aiven or Local MySQL)
DATABASE_URL=mysql://user:password@localhost:3306/homebase
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License
Released under the [MIT License](LICENSE). Built for the Qloo LLM Hackathon.
