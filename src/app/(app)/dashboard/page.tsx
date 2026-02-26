import Link from "next/link";
import SignOutButton from "./signout-button";

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8 md:px-8 md:py-10 space-y-8 md:space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-200 bg-clip-text text-transparent">
              Artist
            </span>
          </h1>
          <p className="text-white/60 mt-2">
            Here&apos;s how your music is performing across all platforms
          </p>
        </div>
      </div>

      

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon="note"
          label="Total Streams"
          value="158.2K"
          delta="+23.5%"
        />
        <StatCard
          icon="trend"
          label="Monthly Growth"
          value="12.4K"
          delta="+18.2%"
          accent="pink"
        />
        <StatCard
          icon="users"
          label="Active Listeners"
          value="8.9K"
          delta="+31.7%"
          accent="violet"
        />
        <StatCard
          icon="cash"
          label="Total Earnings"
          value="$1,156"
          delta="+25.3%"
          accent="green"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard
          title="Streams Over Time"
          subtitle="Your growth trajectory this year"
        >
          <div className="h-72 rounded-2xl bg-black/30 ring-1 ring-white/10 flex items-center justify-center text-white/45">
            chart goes here
          </div>
        </GlassCard>

        <GlassCard
          title="Earnings Breakdown"
          subtitle="Monthly revenue from all platforms"
        >
          <div className="h-72 rounded-2xl bg-black/30 ring-1 ring-white/10 flex items-center justify-center text-white/45">
            chart goes here
          </div>
        </GlassCard>
      </div>

      {/* Your Songs (list) */}
      <GlassCard
        title="Your Songs"
        subtitle="All released tracks"
        right={
          <div className="flex items-center gap-2">
            {/* Filter placeholder (future) */}
            <button className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/75 ring-1 ring-white/10 hover:bg-white/10">
              Filters
            </button>
            <Link
              className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/75 ring-1 ring-white/10 hover:bg-white/10"
              href="/upload"
            >
              Upload new →
            </Link>
          </div>
        }
      >
        <SongTable />
      </GlassCard>

      {/* Releases (cards) */}
      <GlassCard title="Top Releases" subtitle="Quick snapshot of recent releases">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ReleaseCard title="Midnight Dreams" streams="51.2K" trend="+24%" />
          <ReleaseCard title="Electric Souls" streams="42.3K" trend="+18%" />
          <ReleaseCard title="Summer Vibes" streams="35.6K" trend="+32%" />
          <ReleaseCard title="Urban Nights" streams="29.1K" trend="+15%" />
        </div>
      </GlassCard>
    </div>
  );
  
}

/* ----------------------------- Components ----------------------------- */

function GlassCard({
  title,
  subtitle,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="relative">
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-violet-500/15 via-fuchsia-500/10 to-violet-500/15 blur-xl" />
      <div className="relative rounded-3xl bg-white/[0.06] p-5 ring-1 ring-white/10 backdrop-blur-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="text-xl font-semibold">{title}</div>
            {subtitle && <div className="mt-1 text-sm text-white/55">{subtitle}</div>}
          </div>
          {right}
        </div>
        {children}
      </div>
    </section>
  );
}

type StatIcon = "note" | "trend" | "users" | "cash";
type Accent = "blue" | "pink" | "violet" | "green";

function StatCard({
  icon,
  label,
  value,
  delta,
  accent = "blue",
}: {
  icon: StatIcon;
  label: string;
  value: string;
  delta: string;
  accent?: Accent;
}) {
  const accentStyles: Record<Accent, string> = {
    blue: "bg-blue-500/20 text-blue-200 ring-blue-500/30",
    pink: "bg-fuchsia-500/20 text-fuchsia-200 ring-fuchsia-500/30",
    violet: "bg-violet-500/20 text-violet-200 ring-violet-500/30",
    green: "bg-emerald-500/20 text-emerald-200 ring-emerald-500/30",
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white/[0.06] p-5 ring-1 ring-white/10 backdrop-blur-xl">
      <div className="flex items-start justify-between">
        <div
          className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${accentStyles[accent]}`}
        >
          <Icon kind={icon} />
        </div>

        <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-500/20">
          {delta}
        </div>
      </div>

      <div className="mt-4 text-sm text-white/60">{label}</div>
      <div className="mt-2 text-3xl font-extrabold tracking-tight">{value}</div>
    </div>
  );
}

function Icon({ kind }: { kind: StatIcon }) {
  // tiny inline icons (no deps)
  if (kind === "note") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="opacity-90">
        <path
          d="M10 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm0 0V6l11-2v12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 16a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );
  }
  if (kind === "trend") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="opacity-90">
        <path
          d="M3 17l6-6 4 4 7-7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 8h6v6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (kind === "users") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="opacity-90">
        <path
          d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M11.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M22 21v-2a4 4 0 0 0-3-3.87"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M16 3.13a4 4 0 0 1 0 7.75"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  // cash
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="opacity-90">
      <path
        d="M12 1v22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SongTable() {
  // placeholder data for now — later we’ll map real releases from DB
  const songs = [
    { title: "Midnight Dreams", status: "Live", streams: "51.2K", earnings: "$402", date: "2026-02-10" },
    { title: "Electric Souls", status: "Live", streams: "42.3K", earnings: "$351", date: "2026-01-28" },
    { title: "Summer Vibes", status: "Live", streams: "35.6K", earnings: "$289", date: "2026-01-09" },
    { title: "Urban Nights", status: "Processing", streams: "—", earnings: "—", date: "2026-02-21" },
  ];

  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
      <div className="grid grid-cols-12 gap-3 bg-white/5 px-4 py-3 text-xs font-semibold text-white/60">
        <div className="col-span-5">Song</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Streams</div>
        <div className="col-span-2">Earnings</div>
        <div className="col-span-1 text-right">Date</div>
      </div>

      <div className="divide-y divide-white/10">
        {songs.map((s) => (
          <div
            key={s.title}
            className="grid grid-cols-12 items-center gap-3 px-4 py-4 hover:bg-white/[0.04]"
          >
            <div className="col-span-5">
              <div className="font-semibold">{s.title}</div>
              <div className="text-xs text-white/50">Spotify • Apple Music • TikTok • 150+</div>
            </div>

            <div className="col-span-2">
              <StatusPill status={s.status} />
            </div>

            <div className="col-span-2 text-white/80">{s.streams}</div>
            <div className="col-span-2 text-white/80">{s.earnings}</div>

            <div className="col-span-1 text-right text-xs text-white/55">
              {formatShortDate(s.date)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const live = status.toLowerCase() === "live";
  return (
    <span
      className={[
        "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ring-1",
        live
          ? "bg-emerald-500/15 text-emerald-300 ring-emerald-500/20"
          : "bg-amber-500/15 text-amber-300 ring-amber-500/20",
      ].join(" ")}
    >
      {status}
    </span>
  );
}

function formatShortDate(dateStr: string) {
  // expects YYYY-MM-DD
  const [y, m, d] = dateStr.split("-").map((x) => Number(x));
  if (!y || !m || !d) return dateStr;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[m - 1]} ${d}`;
}

function ReleaseCard({ title, streams, trend }: { title: string; streams: string; trend: string }) {
  return (
    <div className="rounded-3xl bg-black/30 p-4 ring-1 ring-white/10 hover:bg-black/40 transition">
      <div className="font-semibold">{title}</div>
      <div className="mt-2 text-sm text-white/60">{streams} streams</div>
      <div className="mt-1 text-sm text-emerald-300">{trend}</div>
    </div>
  );
}