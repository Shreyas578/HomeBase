import { NextResponse } from "next/server";
import { initDbSchema } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbStatus = await initDbSchema();

  // Return clean, non-leaking status without exposing raw database connection errors
  return NextResponse.json({
    status: "ok",
    app: "Homebase",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    services: {
      qloo_active: !!process.env.QLOO_API_KEY && process.env.QLOO_API_KEY !== "your_qloo_hackathon_api_key_here",
      llm_active: !!process.env.GROQ_API_KEY || !!process.env.OPENROUTER_API_KEY || !!process.env.GEMINI_API_KEY,
      database_connected: dbStatus.success
    }
  });
}
