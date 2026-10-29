import { NextResponse } from "next/server";
import { initDbSchema } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbStatus = await initDbSchema();

  return NextResponse.json({
    status: "ok",
    app: "Homebase",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    services: {
      qloo_configured: !!process.env.QLOO_API_KEY && process.env.QLOO_API_KEY !== "your_qloo_hackathon_api_key_here",
      llm_provider: process.env.LLM_PROVIDER || "groq",
      mysql_configured: !!process.env.DATABASE_URL,
      database: dbStatus
    }
  });
}
