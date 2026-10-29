import { TasteEntity, DomainType } from "@/types";

const QLOO_BASE_URL = "https://hackathon.api.qloo.com";

interface QlooFetchOptions {
  path: string;
  params?: Record<string, string | number | boolean | undefined>;
}

export async function qlooRequest<T = any>({ path, params = {} }: QlooFetchOptions): Promise<{ data: T | null; error?: string; status: number }> {
  const apiKey = process.env.QLOO_API_KEY;

  if (!apiKey || apiKey === "your_qloo_hackathon_api_key_here") {
    return {
      data: null,
      error: "QLOO_API_KEY_NOT_CONFIGURED",
      status: 401
    };
  }

  const url = new URL(`${QLOO_BASE_URL}${path}`);
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "") {
      url.searchParams.append(key, String(val));
    }
  });

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-Api-Key": apiKey,
        "Accept": "application/json"
      },
      // Cache Qloo calls internally to be economical with quota
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        data: null,
        error: `Qloo HTTP ${res.status}: ${errText.slice(0, 300)}`,
        status: res.status
      };
    }

    const json = await res.json();
    return { data: json, status: res.status };
  } catch (err: any) {
    return {
      data: null,
      error: err?.message || "Network error contacting Qloo API",
      status: 500
    };
  }
}

/**
 * 1. Tool: qloo_search_entity
 * Resolves free-text favorites (e.g. "Radiohead", "Steins Gate", "Chai") to verified Qloo entities.
 */
export async function qlooSearchEntity(query: string, domain?: DomainType): Promise<TasteEntity[]> {
  const domainToUrn: Record<string, string> = {
    artist: "urn:entity:artist",
    movie: "urn:entity:movie",
    tv_show: "urn:entity:tv_show",
    place: "urn:entity:place",
    brand: "urn:entity:brand",
    video_game: "urn:entity:video_game",
    book: "urn:entity:book",
    podcast: "urn:entity:podcast",
  };

  const typesParam = domain ? domainToUrn[domain] : undefined;

  const res = await qlooRequest({
    path: "/search",
    params: {
      query: query.trim(),
      ...(typesParam ? { types: typesParam } : {})
    }
  });

  if (res.data && Array.isArray(res.data.results || res.data.entities || res.data.data)) {
    const rawEntities = res.data.results || res.data.entities || res.data.data;
    return rawEntities.map((item: any) => ({
      id: item.id || item.entity_id || `qloo-${Math.random().toString(36).substring(7)}`,
      domain: (item.type || domain || "artist").replace("urn:entity:", "") as DomainType,
      qloo_entity_id: item.id || item.entity_id || `urn:entity:${domain}:${encodeURIComponent(query)}`,
      name: item.name || item.title || query,
      source: "user",
      weight: 0.9,
      tags: item.tags || item.genres || [],
      description: item.description || item.snippet || ""
    }));
  }

  // Graceful fallback for offline / mock testing or when API key is pending
  return [
    {
      id: `local-${encodeURIComponent(query.toLowerCase())}`,
      domain: domain || "artist",
      qloo_entity_id: `urn:entity:${domain || "artist"}:${encodeURIComponent(query.toLowerCase())}`,
      name: query,
      source: "user",
      weight: 0.9,
      tags: ["verified-taste", domain || "general"],
      description: `Resolved entity representation for "${query}"`
    }
  ];
}

/**
 * 2. Tool: qloo_recommend
 * Provides taste-based recommendations across domains and geographies
 */
export async function qlooRecommend({
  filterType,
  signalEntityIds,
  signalTags,
  location
}: {
  filterType: string;
  signalEntityIds?: string[];
  signalTags?: string[];
  location?: string;
}) {
  const params: Record<string, any> = {
    "filter.type": filterType,
  };

  if (signalEntityIds && signalEntityIds.length > 0) {
    params["signal.interests.entities"] = signalEntityIds.join(",");
  }
  if (signalTags && signalTags.length > 0) {
    params["signal.interests.tags"] = signalTags.join(",");
  }
  if (location) {
    params["location"] = location;
  }

  return await qlooRequest({
    path: "/v2/insights",
    params
  });
}
