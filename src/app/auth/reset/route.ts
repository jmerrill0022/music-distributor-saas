import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const origin = url.origin;

  // Exchange the code from the email for a session
  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Now that the user has a session, send them to a real page where they set a new password
  return NextResponse.redirect(`${origin}/reset-password`);
}