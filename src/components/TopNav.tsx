"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";

/* ============================ CONFIG ============================ */

const items = [
  { href: "/dashboard", label: "Dashboard", icon: <GridIcon /> },
  { href: "/profile", label: "Profile", icon: <UserIcon /> },
  { href: "/settings", label: "Settings", icon: <SettingsIcon /> },
];

/* ============================ COMPONENT ============================ */

export default function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50">
      {/* Glass + glow background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="h-full w-full bg-[#07070c]/70 backdrop-blur-xl" />

        {/* Soft radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.28),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(236,72,153,0.14),transparent_60%)]" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.18] [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_80%)]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <div className="border-b border-white/10 shadow-[0_10px_30px_rgba(124,58,237,0.10)]">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-6 py-4 md:px-8">
          {/* Brand */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
              <span className="text-lg">♪</span>
            </span>
            <span className="text-lg font-extrabold tracking-tight text-white/90">
              Jacob’s Distributor
            </span>
          </Link>

          <div className="flex-1" />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-2 md:flex">
            {items.map((it) => (
              <NavItem
                key={it.href}
                href={it.href}
                icon={it.icon}
                active={isActive(pathname, it.href)}
              >
                {it.label}
              </NavItem>
            ))}

            {/* Upload CTA */}
            <Link
              href="/upload"
              className="ml-2 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(124,58,237,0.25)] transition hover:brightness-110"
            >
              Upload
            </Link>
          </nav>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            {items.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className={[
                  "relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 transition",
                  "hover:bg-white/10 hover:text-fuchsia-200 hover:[filter:drop-shadow(0_0_10px_rgba(236,72,153,0.45))]",
                  isActive(pathname, it.href)
                    ? "text-violet-200 ring-violet-400/25"
                    : "text-white/80",
                ].join(" ")}
                aria-label={it.label}
              >
                {it.icon}

                {isActive(pathname, it.href) && (
                  <span className="absolute bottom-1 left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 shadow-[0_0_12px_rgba(236,72,153,0.55)]" />
                )}
              </Link>
            ))}

            <Link
              href="/upload"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 py-2 text-sm font-semibold text-white"
            >
              Upload
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ============================ NAV ITEM ============================ */

function NavItem({
  href,
  icon,
  children,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "relative inline-flex items-center gap-2 rounded-2xl px-4 pt-2 pb-3 text-sm ring-1 transition",
        "hover:bg-white/5 hover:ring-white/10",
        "hover:text-fuchsia-200 hover:[filter:drop-shadow(0_0_10px_rgba(236,72,153,0.45))]",
        active ? "text-white ring-white/10" : "text-white/70 ring-transparent",
      ].join(" ")}
    >
      <span className={active ? "text-violet-200" : ""}>{icon}</span>
      <span className={active ? "text-white" : ""}>{children}</span>

      {/* Active glowing underline */}
      {active && (
        <span className="pointer-events-none absolute inset-x-3 bottom-1 h-[3px] rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 shadow-[0_0_14px_rgba(236,72,153,0.55)]" />
      )}
    </Link>
  );
}

/* ============================ ACTIVE LOGIC ============================ */

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

/* ============================ ICONS ============================ */

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 3h8v8H3V3Z" stroke="currentColor" strokeWidth="2" />
      <path d="M13 3h8v8h-8V3Z" stroke="currentColor" strokeWidth="2" />
      <path d="M3 13h8v8H3v-8Z" stroke="currentColor" strokeWidth="2" />
      <path d="M13 13h8v8h-8v-8Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M20 21a8 8 0 1 0-16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2" />
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.33 1V21a2 2 0 1 1-4 0v-.1a1.65 1.65 0 0 0-.33-1 1.65 1.65 0 0 0-1-.6 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1-.33H3a2 2 0 1 1 0-4h.1a1.65 1.65 0 0 0 1-.33 1.65 1.65 0 0 0 .6-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.14 3.6l.06.06A1.65 1.65 0 0 0 9 4.6c.38 0 .74-.13 1-.33.26-.2.46-.48.6-.8V3a2 2 0 1 1 4 0v.1c.14.32.34.6.6.8.26.2.62.33 1 .33.38 0 .74-.13 1-.33l.06-.06A2 2 0 1 1 21 7.14l-.06.06c-.2.26-.33.62-.33 1 0 .38.13.74.33 1 .2.26.48.46.8.6H21a2 2 0 1 1 0 4h-.1c-.32.14-.6.34-.8.6-.2.26-.33.62-.33 1Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}