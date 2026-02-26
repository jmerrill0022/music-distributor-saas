"use client";

import React from "react";
import { useRouter } from "next/navigation";

type Draft = {
  platforms?: string[];
};

function useUploadDraft<T>(key: string, initial: T) {
  const [value, setValue] = React.useState<T>(initial);
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue] as const;
}

const ALL = ["Spotify", "Apple Music", "TikTok", "YouTube Music", "Amazon Music", "Deezer"];

export default function PlatformsPage() {
  const router = useRouter();
  const [draft, setDraft] = useUploadDraft<Draft>("uploadDraft", {});
  const selected = new Set(draft.platforms ?? []);

  function toggle(name: string) {
    const next = new Set(selected);
    next.has(name) ? next.delete(name) : next.add(name);
    setDraft({ ...draft, platforms: Array.from(next) });
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="text-3xl font-extrabold tracking-tight">Platforms</h1>
      <p className="mt-2 text-white/60">Choose where your track will be distributed.</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {ALL.map((p) => {
          const on = selected.has(p);
          return (
            <button
              key={p}
              type="button"
              onClick={() => toggle(p)}
              className={[
                "flex items-center justify-between rounded-2xl px-4 py-4 ring-1 transition",
                on
                  ? "bg-violet-500/15 ring-violet-400/25"
                  : "bg-white/[0.06] ring-white/10 hover:bg-white/[0.09]",
              ].join(" ")}
            >
              <span className="font-semibold">{p}</span>
              <span
                className={[
                  "text-xs rounded-full px-3 py-1 ring-1",
                  on
                    ? "bg-emerald-500/15 text-emerald-300 ring-emerald-500/20"
                    : "bg-white/5 text-white/55 ring-white/10",
                ].join(" ")}
              >
                {on ? "Selected" : "Off"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/upload/details")}
          className="rounded-2xl bg-white/5 px-5 py-3 text-sm text-white/80 ring-1 ring-white/10 hover:bg-white/10"
        >
          Back
        </button>

        <button
          type="button"
          onClick={() => router.push("/upload/review")}
          className="rounded-2xl bg-indigo-500 px-8 py-3 text-sm font-semibold text-white hover:bg-indigo-400"
        >
          Continue
        </button>
      </div>
    </div>
  );
}