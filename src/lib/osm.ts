import { VerifiedPlace } from "@/types";

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const OVERPASS_BASE = "https://overpass-api.de/api/interpreter";
const OVERPASS_FALLBACK = "https://overpass.kumi.systems/api/interpreter";

// In-memory geocoding and POI cache
const geocodeCache = new Map<string, { lat: number; lng: number; displayName: string }>();
const overpassCache = new Map<string, any[]>();
let lastNominatimCallTime = 0;

/**
 * Calculates Haversine distance in meters between two coordinates.
 */
export function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Computes estimated walking time in minutes based on average 4.8 km/h pace (80 m/min).
 */
export function estimateWalkingMinutes(meters: number): number {
  return Math.max(1, Math.round(meters / 80));
}

/**
 * 4. Tool: osm_geocode
 * Respects Nominatim policy: max 1 req/sec, caches result, passes User-Agent.
 */
export async function osmGeocode(query: string): Promise<{ lat: number; lng: number; displayName: string } | null> {
  const cacheKey = query.trim().toLowerCase();
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!;
  }

  // Pre-cached known targets for instant demo
  if (cacheKey.includes("berlin") || cacheKey.includes("tu berlin")) {
    const defaultBerlin = { lat: 52.5119, lng: 13.3265, displayName: "TU Berlin, Straße des 17. Juni 135, 10623 Berlin" };
    geocodeCache.set(cacheKey, defaultBerlin);
    return defaultBerlin;
  }

  // Rate limiting (1 second)
  const now = Date.now();
  const timeSinceLast = now - lastNominatimCallTime;
  if (timeSinceLast < 1050) {
    await new Promise((res) => setTimeout(res, 1050 - timeSinceLast));
  }
  lastNominatimCallTime = Date.now();

  try {
    const url = new URL(`${NOMINATIM_BASE}/search`);
    url.searchParams.append("q", query);
    url.searchParams.append("format", "json");
    url.searchParams.append("limit", "1");

    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": process.env.NOMINATIM_USER_AGENT || "Homebase-Student-Agent-App/1.0 (info@homebase-app.dev)"
      }
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.length > 0) {
      const result = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name
      };
      geocodeCache.set(cacheKey, result);
      return result;
    }
  } catch (err) {
    console.warn("Nominatim Geocoding error:", err);
  }

  return null;
}

/**
 * 5. Tool: osm_places_nearby
 * Queries Overpass API with bounding radius and tag filters.
 */
export async function osmPlacesNearby({
  lat,
  lng,
  radius = 2500,
  tags = ["amenity=cafe", "amenity=restaurant", "shop=supermarket"]
}: {
  lat: number;
  lng: number;
  radius?: number;
  tags?: string[];
}): Promise<any[]> {
  const cacheKey = `${lat.toFixed(3)}_${lng.toFixed(3)}_${radius}_${tags.join(";")}`;
  if (overpassCache.has(cacheKey)) {
    return overpassCache.get(cacheKey)!;
  }

  // Build Overpass QL query
  const tagQueries = tags
    .map((tag) => {
      const [key, val] = tag.split("=");
      return val ? `node["${key}"="${val}"](around:${radius},${lat},${lng});` : `node["${key}"](around:${radius},${lat},${lng});`;
    })
    .join("\n");

  const query = `
    [out:json][timeout:15];
    (
      ${tagQueries}
    );
    out body 40;
    >;
    out skel qt;
  `;

  try {
    const res = await fetch(OVERPASS_BASE, {
      method: "POST",
      body: query,
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    if (res.ok) {
      const json = await res.json();
      const elements = json.elements || [];
      overpassCache.set(cacheKey, elements);
      return elements;
    }
  } catch (e) {
    console.warn("Primary Overpass failed, trying fallback...", e);
  }

  // Fallback to secondary instance
  try {
    const fallbackRes = await fetch(OVERPASS_FALLBACK, {
      method: "POST",
      body: query,
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
    if (fallbackRes.ok) {
      const json = await fallbackRes.json();
      const elements = json.elements || [];
      overpassCache.set(cacheKey, elements);
      return elements;
    }
  } catch (fallbackErr) {
    console.warn("Secondary Overpass failed:", fallbackErr);
  }

  return [];
}
