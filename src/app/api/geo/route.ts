import { NextRequest, NextResponse } from "next/server";
import { Country, City } from "country-state-city";

export const dynamic = "force-dynamic";

// In-memory cache for universities per country to keep searches ultra fast
const universityCache = new Map<string, any[]>();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // 'countries' | 'cities' | 'universities'
  const countryCode = searchParams.get("countryCode") || "";
  const countryName = searchParams.get("countryName") || "";
  const query = (searchParams.get("query") || "").toLowerCase().trim();

  try {
    // 1. ALL COUNTRIES IN THE WORLD
    if (type === "countries") {
      const allCountries = Country.getAllCountries().map((c) => ({
        label: c.name,
        value: c.name,
        code: c.isoCode,
        flag: c.flag
      }));

      if (!query) {
        return NextResponse.json({ countries: allCountries });
      }

      const filtered = allCountries.filter((c) =>
        c.label.toLowerCase().includes(query)
      );
      return NextResponse.json({ countries: filtered });
    }

    // 2. ALL CITIES IN A SELECTED COUNTRY
    if (type === "cities") {
      if (!countryCode) {
        return NextResponse.json({ cities: [] });
      }

      const rawCities = City.getCitiesOfCountry(countryCode.toUpperCase()) || [];
      // Deduplicate city names
      const seen = new Set<string>();
      const cities: { label: string; value: string; state?: string }[] = [];

      for (const city of rawCities) {
        if (!seen.has(city.name.toLowerCase())) {
          seen.add(city.name.toLowerCase());
          cities.push({
            label: city.name,
            value: city.name,
            state: city.stateCode
          });
        }
      }

      if (query) {
        const filtered = cities.filter((c) => c.label.toLowerCase().includes(query)).slice(0, 100);
        return NextResponse.json({ cities: filtered });
      }

      // Return top 200 cities if no search query to keep payload fast
      return NextResponse.json({ cities: cities.slice(0, 250), total: cities.length });
    }

    // 3. ALL UNIVERSITIES IN A COUNTRY / CITY (Hipolabs Global Academic DB)
    if (type === "universities") {
      const searchCountry = countryName || countryCode;
      if (!searchCountry) {
        return NextResponse.json({ universities: [] });
      }

      let cached = universityCache.get(searchCountry.toLowerCase());

      if (!cached) {
        try {
          const hipoRes = await fetch(
            `http://universities.hipolabs.com/search?country=${encodeURIComponent(searchCountry)}`,
            { next: { revalidate: 86400 } }
          );
          if (hipoRes.ok) {
            const data = await hipoRes.json();
            cached = data.map((u: any) => ({
              label: u.name,
              value: u.name,
              webPage: u.web_pages?.[0] || "",
              stateProvince: u["state-province"] || ""
            }));
            universityCache.set(searchCountry.toLowerCase(), cached || []);
          }
        } catch (fetchErr) {
          console.warn("Hipolabs API fetch error, using local fallback:", fetchErr);
        }
      }

      let results = cached || [];

      if (query) {
        results = results.filter((u: any) =>
          u.label.toLowerCase().includes(query) ||
          (u.stateProvince && u.stateProvince.toLowerCase().includes(query))
        );
      }

      return NextResponse.json({ universities: results.slice(0, 150), total: results.length });
    }

    return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
