import { NextRequest, NextResponse } from "next/server";
import { searchEntity } from "@/lib/qloo";
import { TasteEntity, DomainType } from "@/types";
import { sanitizeString } from "@/lib/sanitize";

interface ImportResult {
  source: "spotify" | "letterboxd" | "imdb" | "steam" | "backloggd" | "goodreads" | "storygraph" | "google_maps" | "beli" | "generic";
  domain: DomainType;
  extractedCount: number;
  entities: TasteEntity[];
  errors?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawUrl = body.url ? String(body.url).trim() : "";

    if (!rawUrl) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    let urlObj: URL;
    try {
      urlObj = new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    const host = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname;
    const extractedItems: { name: string; domain: DomainType }[] = [];
    let detectedSource: ImportResult["source"] = "generic";
    let defaultDomain: DomainType = "artist";

    // 1. SPOTIFY (Music / Artist / Playlist)
    if (host.includes("spotify.com")) {
      detectedSource = "spotify";
      defaultDomain = "artist";
      try {
        const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(urlObj.toString())}`;
        const spotifyRes = await fetch(oembedUrl, {
          headers: { "User-Agent": "HomeBase-Taste-Agent/1.0" },
          next: { revalidate: 3600 }
        });

        if (spotifyRes.ok) {
          const oembedData = await spotifyRes.json();
          const title = oembedData.title || "";
          if (pathname.includes("/artist/")) {
            extractedItems.push({ name: sanitizeString(title, 80), domain: "artist" });
          } else if (pathname.includes("/track/")) {
            const parts = title.split(" by ");
            extractedItems.push({ name: sanitizeString(parts[1] || title, 80), domain: "artist" });
          } else {
            const cleanTitle = title.replace(/\s+by\s+.+$/i, "");
            extractedItems.push({ name: sanitizeString(cleanTitle, 80), domain: "artist" });
          }
        }
      } catch (err) {
        console.warn("Spotify oEmbed error:", err);
      }
    }
    // 2. STEAM (Video Games)
    else if (host.includes("steampowered.com") || host.includes("steamcommunity.com")) {
      detectedSource = "steam";
      defaultDomain = "video_game";
      try {
        // e.g. store.steampowered.com/app/620/Portal_2/
        if (pathname.includes("/app/")) {
          const parts = pathname.split("/").filter(Boolean);
          const appIndex = parts.indexOf("app");
          if (appIndex !== -1 && parts[appIndex + 2]) {
            const rawTitle = decodeURIComponent(parts[appIndex + 2]).replace(/_/g, " ");
            extractedItems.push({ name: sanitizeString(rawTitle, 80), domain: "video_game" });
          }
        }

        if (extractedItems.length === 0) {
          const steamRes = await fetch(urlObj.toString(), {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
          });
          if (steamRes.ok) {
            const html = await steamRes.text();
            const ogTitleMatch = html.match(/<meta property="og:title" content="([^"]+)"/i);
            const appNameMatch = html.match(/<div class="apphub_AppName">([^<]+)<\/div>/i);
            const title = appNameMatch?.[1] || ogTitleMatch?.[1] || "";
            if (title) {
              const cleaned = title.replace(/\s*on Steam.*$/i, "").trim();
              extractedItems.push({ name: sanitizeString(cleaned, 80), domain: "video_game" });
            }
          }
        }
      } catch (err) {
        console.warn("Steam fetch error:", err);
      }
    }
    // 3. BACKLOGGD (Video Games Community)
    else if (host.includes("backloggd.com")) {
      detectedSource = "backloggd";
      defaultDomain = "video_game";
      try {
        const blRes = await fetch(urlObj.toString(), {
          headers: { "User-Agent": "Mozilla/5.0" }
        });
        if (blRes.ok) {
          const html = await blRes.text();
          const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
          if (titleMatch && titleMatch[1]) {
            const cleanTitle = titleMatch[1].replace(/· Backloggd.*$/i, "").replace(/reviews.*$/i, "").trim();
            extractedItems.push({ name: sanitizeString(cleanTitle, 80), domain: "video_game" });
          }
        }
      } catch (err) {
        console.warn("Backloggd fetch error:", err);
      }
    }
    // 4. GOOGLE MAPS & BELI (Dining / Cafes / Places)
    else if (host.includes("google.com") && pathname.includes("/maps") || host.includes("goo.gl") || host.includes("beliapp.com")) {
      detectedSource = host.includes("beliapp") ? "beli" : "google_maps";
      defaultDomain = "place";
      try {
        // For Google maps place: e.g. /maps/place/Cafe+Name/@lat,lng
        if (pathname.includes("/place/")) {
          const parts = pathname.split("/place/")[1]?.split("/")[0] || "";
          const decoded = decodeURIComponent(parts).replace(/\+/g, " ");
          if (decoded) {
            extractedItems.push({ name: sanitizeString(decoded, 80), domain: "place" });
          }
        } else {
          // Fetch redirect/meta tags
          const mapsRes = await fetch(urlObj.toString(), {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
          });
          const finalUrl = mapsRes.url;
          if (finalUrl.includes("/place/")) {
            const parts = finalUrl.split("/place/")[1]?.split("/")[0] || "";
            const decoded = decodeURIComponent(parts).replace(/\+/g, " ");
            if (decoded) extractedItems.push({ name: sanitizeString(decoded, 80), domain: "place" });
          } else {
            const html = await mapsRes.text();
            const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/i)?.[1] || "";
            const titleMatch = html.match(/<title>([^<]+)<\/title>/i)?.[1] || "";
            const candidate = ogTitle || titleMatch;
            const cleaned = candidate.replace(/\s*-\s*Google Maps.*$/i, "").trim();
            if (cleaned) extractedItems.push({ name: sanitizeString(cleaned, 80), domain: "place" });
          }
        }
      } catch (err) {
        console.warn("Maps fetch error:", err);
      }
    }
    // 5. GOODREADS & STORYGRAPH (Books / Literature)
    else if (host.includes("goodreads.com") || host.includes("thestorygraph.com")) {
      detectedSource = host.includes("storygraph") ? "storygraph" : "goodreads";
      defaultDomain = "book";
      try {
        const grRes = await fetch(urlObj.toString(), {
          headers: { "User-Agent": "Mozilla/5.0" }
        });
        if (grRes.ok) {
          const html = await grRes.text();
          const ogTitleMatch = html.match(/<meta property="og:title" content="([^"]+)"/i);
          if (ogTitleMatch && ogTitleMatch[1]) {
            const clean = ogTitleMatch[1].replace(/\s*by\s+.+$/i, "").trim();
            extractedItems.push({ name: sanitizeString(clean, 80), domain: "book" });
          }
        }
      } catch (err) {
        console.warn("Goodreads error:", err);
      }
    }
    // 6. LETTERBOXD & IMDB (Movies)
    else if (host.includes("letterboxd.com") || host.includes("imdb.com")) {
      detectedSource = host.includes("imdb") ? "imdb" : "letterboxd";
      defaultDomain = "movie";
      try {
        const res = await fetch(urlObj.toString(), {
          headers: { "User-Agent": "Mozilla/5.0" }
        });
        if (res.ok) {
          const html = await res.text();
          const filmMatches = html.match(/data-film-name="([^"]+)"/g) || [];
          if (filmMatches.length > 0) {
            filmMatches.slice(0, 5).forEach((m) => {
              const nameMatch = m.match(/data-film-name="([^"]+)"/i);
              if (nameMatch && nameMatch[1]) {
                extractedItems.push({ name: sanitizeString(nameMatch[1], 80), domain: "movie" });
              }
            });
          } else {
            const ogTitleMatch = html.match(/<meta property="og:title" content="([^"]+)"/i);
            if (ogTitleMatch && ogTitleMatch[1]) {
              const clean = ogTitleMatch[1].replace(/‘|’|'|"/g, "").split("•")[0].replace(/\s*\([^)]*\)/g, "").replace(/\s*-\s*IMDb.*$/i, "").trim();
              extractedItems.push({ name: sanitizeString(clean, 80), domain: "movie" });
            }
          }
        }
      } catch (err) {
        console.warn("Film fetch error:", err);
      }
    }

    // Fallback: parse pathname token
    if (extractedItems.length === 0) {
      const segments = pathname.split("/").filter(Boolean);
      const candidate = segments[segments.length - 1] || segments[0] || "Cultural Taste";
      const cleaned = decodeURIComponent(candidate).replace(/[-_+]/g, " ").replace(/\.(html|php)$/i, "").trim();
      extractedItems.push({ name: sanitizeString(cleaned, 80), domain: defaultDomain });
    }

    // Resolve entities with Qloo API
    const resolvedEntities: TasteEntity[] = [];

    for (const item of extractedItems) {
      if (!item.name || item.name.length < 2) continue;

      try {
        const qlooResults = await searchEntity(item.name, item.domain);
        if (qlooResults && qlooResults.length > 0) {
          resolvedEntities.push(qlooResults[0]);
        } else {
          resolvedEntities.push({
            id: `entity-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            domain: item.domain,
            qloo_entity_id: `urn:entity:${item.domain}:${encodeURIComponent(item.name.toLowerCase().replace(/\s+/g, "_"))}`,
            name: item.name,
            source: "user",
            weight: 0.95,
            tags: [item.domain, detectedSource],
            description: `Imported from ${detectedSource} profile link`
          });
        }
      } catch (e) {
        resolvedEntities.push({
          id: `entity-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          domain: item.domain,
          qloo_entity_id: `urn:entity:${item.domain}:${encodeURIComponent(item.name.toLowerCase().replace(/\s+/g, "_"))}`,
          name: item.name,
          source: "user",
          weight: 0.9,
          tags: [item.domain, detectedSource]
        });
      }
    }

    const resultPayload: ImportResult = {
      source: detectedSource,
      domain: defaultDomain,
      extractedCount: resolvedEntities.length,
      entities: resolvedEntities
    };

    return NextResponse.json(resultPayload);
  } catch (err: any) {
    console.error("Taste import error:", err);
    return NextResponse.json({ error: err.message || "Failed to process taste profile link" }, { status: 500 });
  }
}
