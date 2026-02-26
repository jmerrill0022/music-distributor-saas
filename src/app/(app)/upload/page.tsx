"use client";

import React from "react";
import { useRouter } from "next/navigation";

type Draft = {
  fileName?: string;
  fileSize?: number;
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

export default function UploadStepPage() {
  const router = useRouter();
  const [draft, setDraft] = useUploadDraft<Draft>("uploadDraft", {});

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = React.useState(false);

  function onPickFile(file: File) {
    setDraft({
      ...draft,
      fileName: file.name,
      fileSize: file.size,
    });
  }

  return (
    <div className="text-center">
      <h1 className="text-5xl font-extrabold tracking-tight">Upload Your Track</h1>
      <p className="mt-4 text-white/60">
        Drop your audio file here or click to browse. We accept MP3, WAV, and FLAC.
      </p>

      <div className="mt-10 flex justify-center">
        <div className="relative w-full max-w-3xl">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-violet-500/20 via-fuchsia-500/10 to-violet-500/20 blur-xl" />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files?.[0];
              if (file) onPickFile(file);
            }}
            className={[
              "relative w-full rounded-3xl bg-white/[0.06] ring-1 ring-white/10 backdrop-blur-xl",
              "px-6 py-16 md:py-20",
              "border border-dashed border-white/15",
              "transition",
              dragOver ? "bg-white/[0.10] ring-violet-400/30" : "hover:bg-white/[0.08]",
            ].join(" ")}
          >
            <div className="mx-auto flex max-w-md flex-col items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-violet-500/15 ring-1 ring-violet-400/20">
                <UploadIcon />
              </div>

              <div className="text-xl font-semibold">Drag &amp; drop your track</div>
              <div className="text-sm text-white/55">or click to browse files</div>

              {draft.fileName && (
                <div className="mt-4 rounded-2xl bg-black/30 px-4 py-3 text-sm ring-1 ring-white/10">
                  <div className="font-semibold text-white/85">{draft.fileName}</div>
                  {typeof draft.fileSize === "number" && (
                    <div className="text-white/55">{formatBytes(draft.fileSize)}</div>
                  )}
                </div>
              )}
            </div>

            <input
              ref={inputRef}
              type="file"
              accept=".mp3,.wav,.flac,audio/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onPickFile(file);
              }}
            />
          </button>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          onClick={() => router.push("/upload/details")}
          disabled={!draft.fileName}
          className="rounded-2xl bg-indigo-500 px-10 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(99,102,241,0.25)] transition hover:bg-indigo-400 disabled:opacity-50 disabled:hover:bg-indigo-500"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-violet-200">
      <path d="M12 16V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M7 9l5-5 5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function formatBytes(bytes: number) {
  const units = ["B", "KB", "MB", "GB"];
  let b = bytes;
  let i = 0;
  while (b >= 1024 && i < units.length - 1) {
    b /= 1024;
    i++;
  }
  return `${b.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}