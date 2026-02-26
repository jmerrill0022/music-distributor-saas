"use client";

import React from "react";
import { useRouter } from "next/navigation";

type Draft = {
  fileName?: string;
  title?: string;
  artist?: string;
  releaseDate?: string;
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

export default function DetailsPage() {
  const router = useRouter();
  const [draft, setDraft] = useUploadDraft<Draft>("uploadDraft", {});

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="text-3xl font-extrabold tracking-tight">Track Details</h1>
      <p className="mt-2 text-white/60">Add the essentials. You can refine later.</p>

      <div className="mt-8 space-y-4">
        <Field label="Track title">
          <Input
            value={draft.title ?? ""}
            onChange={(v) => setDraft({ ...draft, title: v })}
            placeholder="e.g. Midnight Dreams"
          />
        </Field>

        <Field label="Artist name">
          <Input
            value={draft.artist ?? ""}
            onChange={(v) => setDraft({ ...draft, artist: v })}
            placeholder="e.g. Jacob"
          />
        </Field>

        <Field label="Release date">
          <Input
            value={draft.releaseDate ?? ""}
            onChange={(v) => setDraft({ ...draft, releaseDate: v })}
            placeholder="YYYY-MM-DD"
          />
        </Field>

        <div className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
          <div className="text-sm text-white/60">Uploaded file</div>
          <div className="mt-1 font-semibold">{draft.fileName ?? "No file selected"}</div>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/upload")}
          className="rounded-2xl bg-white/5 px-5 py-3 text-sm text-white/80 ring-1 ring-white/10 hover:bg-white/10"
        >
          Back
        </button>

        <button
          type="button"
          onClick={() => router.push("/upload/platforms")}
          className="rounded-2xl bg-indigo-500 px-8 py-3 text-sm font-semibold text-white hover:bg-indigo-400"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-sm text-white/70">{label}</div>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/35 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-violet-400/60"
    />
  );
}