import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const type = url.searchParams.get("type");
  const origin = url.origin;

  // Supabase email links usually include code + type (signup/recovery/etc).
  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // After verification, send them to dashboard
  return NextResponse.redirect(`${origin}/dashboard`);
}