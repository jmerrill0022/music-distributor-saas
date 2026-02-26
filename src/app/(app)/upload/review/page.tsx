"use client";

import React from "react";
import { useRouter } from "next/navigation";

type Draft = {
  fileName?: string;
  title?: string;
  artist?: string;
  releaseDate?: string;
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

export default function ReviewPage() {
  const router = useRouter();
  const [draft, setDraft] = useUploadDraft<Draft>("uploadDraft", {});
  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit() {
    // Placeholder — later we’ll upload file + create release record
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);

    // clear draft for now
    setDraft({});
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="text-3xl font-extrabold tracking-tight">Review</h1>
      <p className="mt-2 text-white/60">Confirm everything looks right before submitting.</p>

      <div className="mt-8 space-y-3">
        <Row label="File" value={draft.fileName ?? "—"} />
        <Row label="Title" value={draft.title ?? "—"} />
        <Row label="Artist" value={draft.artist ?? "—"} />
        <Row label="Release date" value={draft.releaseDate ?? "—"} />
        <Row
          label="Platforms"
          value={(draft.platforms?.length ? draft.platforms.join(", ") : "All major platforms")}
        />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/upload/platforms")}
          className="rounded-2xl bg-white/5 px-5 py-3 text-sm text-white/80 ring-1 ring-white/10 hover:bg-white/10"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-8 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(124,58,237,0.25)] transition hover:brightness-110 disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Release"}
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
      <div className="text-sm text-white/60">{label}</div>
      <div className="text-sm font-semibold text-white/85 text-right">{value}</div>
    </div>
  );
}