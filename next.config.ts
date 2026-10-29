import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking by disallowing the site to be framed by external domains
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Prevent MIME-sniffing exploits
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Control referrer information sent in HTTP requests
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Enforce HTTPS
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Limit browser features and APIs (e.g., microphone, camera, geolocation)
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
  // Content Security Policy: Protect against Cross-Site Scripting (XSS)
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://unpkg.com",
      "img-src 'self' data: https://*.openstreetmap.org https://unpkg.com",
      "connect-src 'self' https://*.openstreetmap.org https://overpass-api.de https://overpass.kumi.systems https://hackathon.api.qloo.com https://api.groq.com https://openrouter.ai",
      "font-src 'self' data:",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Hide 'X-Powered-By: Next.js' to prevent technology fingerprinting
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
