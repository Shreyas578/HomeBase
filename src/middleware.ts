import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory sliding-window rate limiter for serverless edge & API routes
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect all /api/ endpoints with IP rate limiting
  if (path.startsWith("/api/")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const windowMs = 60 * 1000; // 1 minute window
    const maxRequests = 60; // Max 60 requests per minute per IP

    const now = Date.now();
    const clientRecord = rateLimitMap.get(ip);

    if (!clientRecord || now > clientRecord.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    } else {
      clientRecord.count += 1;
      if (clientRecord.count > maxRequests) {
        return new NextResponse(
          JSON.stringify({
            error: "Too Many Requests",
            message: "Rate limit exceeded. Please try again in a minute.",
            retryAfterSeconds: Math.ceil((clientRecord.resetTime - now) / 1000),
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": Math.ceil((clientRecord.resetTime - now) / 1000).toString(),
            },
          }
        );
      }
    }
  }

  // Prevent HTTP request method tampering on GET-only routes
  if (path.startsWith("/api/health") && request.method !== "GET") {
    return new NextResponse(
      JSON.stringify({ error: "Method Not Allowed" }),
      { status: 455, headers: { "Content-Type": "application/json" } }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
