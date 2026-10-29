# Qloo API Notes & Technical Reference

Documented from official Qloo LLM Hackathon Developer Guide: `https://docs.qloo.com/reference/qloo-llm-hackathon-developer-guide`.

## 1. Base URL & Authentication
- **Base URL**: `https://hackathon.api.qloo.com` (DO NOT use `api.qloo.com` or `staging.api.qloo.com` with hackathon key, it returns 401).
- **Auth Header**: `X-Api-Key: <QLOO_API_KEY>` (Do NOT use `Authorization: Bearer` or query parameters).
- **HTTP Method**: GET only for `/v2/insights` and `/search` (Parameters go in the query string, not request body).

## 2. Core Endpoints
### A. Entity Search / Resolution
- **Endpoint**: `GET /search`
- **Parameters**:
  - `query`: Text string (e.g. `Radiohead`, `Inception`, `Dishoom`)
  - `types`: Filter entity types (e.g. `urn:entity:artist`, `urn:entity:movie`, `urn:entity:place`, `urn:entity:brand`, `urn:entity:tv_show`, `urn:entity:video_game`, `urn:entity:book`)
- **Returns**: Array of resolved entities with their unique IDs, canonical names, domains, tags, and metadata.

### B. Insights & Recommendation Engine
- **Endpoint**: `GET /v2/insights`
- **Mandatory Parameter**:
  - `filter.type`: Category of entities to recommend.
- **Supported `filter.type` values**:
  - `urn:entity:artist` (Music - DO NOT use `urn:entity:music`)
  - `urn:entity:place` (Restaurants, cafes, venues - DO NOT use `urn:entity:food_and_drink`)
  - `urn:entity:brand` (Retail, apparel, grocery brands)
  - `urn:entity:movie`
  - `urn:entity:tv_show`
  - `urn:entity:video_game`
  - `urn:entity:book`
  - `urn:entity:podcast`
  - `urn:entity:destination`
  - `urn:entity:person`
- **Signal Parameters**:
  - `signal.interests.entities`: Comma-separated or repeated entity IDs from `/search`.
  - `signal.interests.tags`: Valid tag IDs (retrieved from `/v2/tags`).
  - `signal.demographics.audiences`: Audience URNs (e.g. university students, Gen Z demographics).
  - `location`: Coordinate or location bounding when querying `urn:entity:place` near the target city.
- **Crucial Rule**: Unsupported endpoints like `/recommendations` or `/recs` are deprecated and blocked.

## 3. Fallback & Offline Mode
In cases where network access to Qloo is rate-limited or before the key is inserted into `.env.local`, Homebase features high-fidelity seed datasets and intelligent fallback heuristics so UI and full agent reasoning loop run smoothly during review.
