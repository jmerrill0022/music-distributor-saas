import type { ReactNode } from "react";
import Link from "next/link";

export default function UploadLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8 md:px-8 md:py-10">
      {/* Stepper */}
      <div className="mb-10 flex items-center justify-between gap-4">
        <Step href="/upload" step={1} label="Upload" />
        <Step href="/upload/details" step={2} label="Details" />
        <Step href="/upload/platforms" step={3} label="Platforms" />
        <Step href="/upload/review" step={4} label="Review" />
      </div>

      {children}

      {/* subtle bottom spacing */}
      <div className="h-8" />
    </div>
  );
}

function Step({ href, step, label }: { href: string; step: number; label: string }) {
  return (
    <Link href={href} className="group flex flex-1 flex-col items-center gap-2">
      <div className="relative">
        <div className="h-14 w-14 rounded-full bg-white/5 ring-1 ring-white/10 group-hover:bg-white/10 grid place-items-center">
          <span className="text-white/70 font-semibold">{step}</span>
        </div>
        {/* glow ring */}
        <div className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-violet-400/0 group-hover:ring-violet-400/30" />
      </div>
      <div className="text-sm text-white/60 group-hover:text-white/80">{label}</div>
    </Link>
  );
}