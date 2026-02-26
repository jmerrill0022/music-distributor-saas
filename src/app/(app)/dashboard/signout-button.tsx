"use client";

import { createClient } from "../../../lib/client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const supabase = createClient();
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await supabase.auth.signOut();
        router.push("/login");
      }}
      style={{ marginTop: 16 }}
    >
      Sign Out
    </button>
  );
}