"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/client";

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handle = async () => {
    await supabase.auth.signOut();
    router.refresh(); // clears any cached auth state
    router.push("/login");
  };

  return (
    <button
      onClick={handle}
      className="w-full rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 ring-1 ring-red-500/20 hover:bg-red-500/15 transition"
    >
      Sign out
    </button>
  );
}