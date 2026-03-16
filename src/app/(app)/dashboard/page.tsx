"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const streamsData = [
  { month: "Jan", streams: 12000 },
  { month: "Feb", streams: 18000 },
  { month: "Mar", streams: 22000 },
  { month: "Apr", streams: 28000 },
  { month: "May", streams: 35000 },
  { month: "Jun", streams: 42000 },
  { month: "Jul", streams: 51000 },
];

const earningsData = [
  { month: "Jan", earnings: 180 },
  { month: "Feb", earnings: 240 },
  { month: "Mar", earnings: 310 },
  { month: "Apr", earnings: 460 },
  { month: "May", earnings: 620 },
  { month: "Jun", earnings: 810 },
  { month: "Jul", earnings: 1156 },
];

const songsData = [
  {
    id: 1,
    title: "Midnight Dreams",
    status: "Live",
    platforms: "Spotify • Apple Music • TikTok • 150+",
    streams: 51200,
    earnings: 402,
    date: "2026-02-10",
  },
  {
    id: 2,
    title: "Electric Souls",
    status: "Live",
    platforms: "Spotify • Apple Music • TikTok • 150+",
    streams: 42300,
    earnings: 351,
    date: "2026-01-28",
  },
  {
    id: 3,
    title: "Summer Vibes",
    status: "Live",
    platforms: "Spotify • Apple Music • TikTok • 150+",
    streams: 35600,
    earnings: 289,
    date: "2026-01-09",
  },
  {
    id: 4,
    title: "Urban Nights",
    status: "Processing",
    platforms: "Spotify • Apple Music • TikTok • 150+",
    streams: 0,
    earnings: 0,
    date: "2026-02-21",
  },
  {
    id: 5,
    title: "Golden Hour",
    status: "Live",
    platforms: "Spotify • Apple Music • TikTok • 150+",
    streams: 28700,
    earnings: 233,
    date: "2025-12-17",
  },
  {
    id: 6,
    title: "Neon Hearts",
    status: "Draft",
    platforms: "Spotify • Apple Music • TikTok • 150+",
    streams: 0,
    earnings: 0,
    date: "2026-03-01",
  },
];

type Song = (typeof songsData)[number];

type ChartTooltipProps = {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey?: string;
  }>;
  label?: string;
};

type SortOption =
  | "streams_desc"
  | "streams_asc"
  | "earnings_desc"
  | "earnings_asc"
  | "date_desc"
  | "date_asc"
  | "title_asc"
  | "title_desc";

type StatIcon = "note" | "trend" | "users" | "cash";
type Accent = "blue" | "pink" | "violet" | "green";

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
          <p className="mt-2 text-white/60">
            Here&apos;s how your music is performing across all platforms
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="relative">
        <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-r from-violet-600/30 via-fuchsia-500/25 to-indigo-600/30 blur-3xl opacity-70" />

        <div className="relative grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
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
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard
          title="Streams Over Time"
          subtitle="Your growth trajectory this year"
        >
          <StreamsChart />
        </GlassCard>

        <GlassCard
          title="Earnings Breakdown"
          subtitle="Monthly revenue from all platforms"
        >
          <EarningsChart />
        </GlassCard>
      </div>

      {/* Songs / compare / filters */}
      <GlassCard
        title="Your Songs"
        subtitle="Filter, sort, and compare performance across your catalog"
        right={
          <Link
            className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/75 ring-1 ring-white/10 transition hover:bg-white/10"
            href="/upload"
          >
            Upload new →
          </Link>
        }
      >
        <SongAnalytics />
      </GlassCard>

      {/* Releases */}
      <GlassCard
        title="Top Releases"
        subtitle="Quick snapshot of recent releases"
      >
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

/* ----------------------------- Song Analytics ----------------------------- */

function SongAnalytics() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("streams_desc");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const filteredSongs = useMemo(() => {
    const base = songsData.filter((song) => {
      const matchesSearch = song.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all"
          ? true
          : song.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    const sorted = [...base].sort((a, b) => {
      switch (sortBy) {
        case "streams_desc":
          return b.streams - a.streams;
        case "streams_asc":
          return a.streams - b.streams;
        case "earnings_desc":
          return b.earnings - a.earnings;
        case "earnings_asc":
          return a.earnings - b.earnings;
        case "date_desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date_asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "title_desc":
          return b.title.localeCompare(a.title);
        case "title_asc":
        default:
          return a.title.localeCompare(b.title);
      }
    });

    return sorted;
  }, [search, statusFilter, sortBy]);

  const selectedSongs = useMemo(
    () => songsData.filter((song) => selectedIds.includes(song.id)),
    [selectedIds]
  );

  function toggleCompare(id: number) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((songId) => songId !== id);
      }

      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setSortBy("streams_desc");
  }

  function clearCompare() {
    setSelectedIds([]);
  }

  return (
    <div className="space-y-5">
      {/* Top controls */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-md">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search songs..."
              className="w-full rounded-2xl bg-black/30 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 placeholder:text-white/35 focus:ring-fuchsia-400/40"
            />
          </div>

          <button
            type="button"
            onClick={() => setFiltersOpen((prev) => !prev)}
            className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/80 ring-1 ring-white/10 transition hover:bg-white/10"
          >
            {filtersOpen ? "Hide Filters" : "Filters"}
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-white/55">
          <span>{filteredSongs.length} songs</span>
          <span className="text-white/20">•</span>
          <span>{selectedIds.length}/2 selected for compare</span>
        </div>
      </div>

      {/* Filter panel */}
      {filtersOpen && (
        <div className="rounded-3xl bg-black/30 p-4 ring-1 ring-white/10">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-fuchsia-400/40"
              >
                <option value="all" className="bg-[#0b0712]">
                  All statuses
                </option>
                <option value="live" className="bg-[#0b0712]">
                  Live
                </option>
                <option value="processing" className="bg-[#0b0712]">
                  Processing
                </option>
                <option value="draft" className="bg-[#0b0712]">
                  Draft
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-fuchsia-400/40"
              >
                <option value="streams_desc" className="bg-[#0b0712]">
                  Most streams → least
                </option>
                <option value="streams_asc" className="bg-[#0b0712]">
                  Least streams → most
                </option>
                <option value="earnings_desc" className="bg-[#0b0712]">
                  Most revenue → least
                </option>
                <option value="earnings_asc" className="bg-[#0b0712]">
                  Least revenue → most
                </option>
                <option value="date_desc" className="bg-[#0b0712]">
                  Newest first
                </option>
                <option value="date_asc" className="bg-[#0b0712]">
                  Oldest first
                </option>
                <option value="title_asc" className="bg-[#0b0712]">
                  Title A → Z
                </option>
                <option value="title_desc" className="bg-[#0b0712]">
                  Title Z → A
                </option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={clearFilters}
                className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/75 ring-1 ring-white/10 transition hover:bg-white/10"
              >
                Reset filters
              </button>
              <button
                type="button"
                onClick={clearCompare}
                className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/75 ring-1 ring-white/10 transition hover:bg-white/10"
              >
                Clear compare
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compare cards */}
      {selectedSongs.length > 0 && (
        <div className="rounded-3xl bg-white/[0.04] p-4 ring-1 ring-white/10">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-lg font-semibold">Compare Songs</div>
              <div className="mt-1 text-sm text-white/55">
                Select up to 2 songs from the table below to compare side by
                side.
              </div>
            </div>
            <button
              type="button"
              onClick={clearCompare}
              className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/75 ring-1 ring-white/10 hover:bg-white/10"
            >
              Clear
            </button>
          </div>

          <div
            className={`grid gap-4 ${
              selectedSongs.length === 1 ? "md:grid-cols-1" : "md:grid-cols-2"
            }`}
          >
            {selectedSongs.map((song) => (
              <CompareCard key={song.id} song={song} />
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <SongTable
        songs={filteredSongs}
        selectedIds={selectedIds}
        onToggleCompare={toggleCompare}
      />
    </div>
  );
}

/* ----------------------------- Shared UI ----------------------------- */

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
            {subtitle && (
              <div className="mt-1 text-sm text-white/55">{subtitle}</div>
            )}
          </div>
          {right}
        </div>
        {children}
      </div>
    </section>
  );
}

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
          className={`group inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-1 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg ${accentStyles[accent]}`}
        >
          <div className="transition-transform duration-1000 ease-out group-hover:scale-110">
            <Icon kind={icon} />
          </div>
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
  const iconClass =
    "opacity-90 transition-transform duration-[1800ms] ease-in-out group-hover:rotate-[1080deg]";

  if (kind === "note") {
    return (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        className={iconClass}
      >
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
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        className={iconClass}
      >
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
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        className={iconClass}
      >
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

  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      className={iconClass}
    >
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

/* ----------------------------- Charts ----------------------------- */

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0];
  const isMoney = item.dataKey === "earnings";

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f0b18]/95 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="text-xs text-white/50">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white">
        {isMoney
          ? `$${Number(item.value).toLocaleString()}`
          : Number(item.value).toLocaleString()}
      </div>
    </div>
  );
}

function StreamsChart() {
  return (
    <div className="h-72 w-full rounded-2xl bg-black/30 p-4 ring-1 ring-white/10">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={streamsData}
          margin={{ top: 10, right: 8, left: -18, bottom: 0 }}
        >
          <defs>
            <linearGradient id="streamsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C5CFF" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#7C5CFF" stopOpacity={0.03} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="4 4"
          />
          <XAxis
            dataKey="month"
            stroke="rgba(255,255,255,0.45)"
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />
          <YAxis
            stroke="rgba(255,255,255,0.45)"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            tickFormatter={(value) => `${value / 1000}K`}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: "rgba(255,255,255,0.15)", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="streams"
            stroke="#7C5CFF"
            strokeWidth={3}
            fill="url(#streamsFill)"
            dot={false}
            activeDot={{
              r: 5,
              stroke: "#ffffff",
              strokeWidth: 2,
              fill: "#7C5CFF",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function EarningsChart() {
  return (
    <div className="h-72 w-full rounded-2xl bg-black/30 p-4 ring-1 ring-white/10">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={earningsData}
          margin={{ top: 10, right: 8, left: -8, bottom: 0 }}
        >
          <defs>
            <linearGradient id="earningsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EC4899" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#A855F7" stopOpacity={0.85} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="4 4"
          />
          <XAxis
            dataKey="month"
            stroke="rgba(255,255,255,0.45)"
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />
          <YAxis
            stroke="rgba(255,255,255,0.45)"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
          />
          <Bar
            dataKey="earnings"
            fill="url(#earningsFill)"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ----------------------------- Songs ----------------------------- */

function SongTable({
  songs,
  selectedIds,
  onToggleCompare,
}: {
  songs: Song[];
  selectedIds: number[];
  onToggleCompare: (id: number) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
      <div className="grid grid-cols-12 gap-3 bg-white/5 px-4 py-3 text-xs font-semibold text-white/60">
        <div className="col-span-4">Song</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Streams</div>
        <div className="col-span-2">Revenue</div>
        <div className="col-span-1 text-right">Date</div>
        <div className="col-span-1 text-right">Compare</div>
      </div>

      <div className="divide-y divide-white/10">
        {songs.map((s) => {
          const selected = selectedIds.includes(s.id);

          return (
            <div
              key={s.id}
              className={`grid grid-cols-12 items-center gap-3 px-4 py-4 transition ${
                selected ? "bg-fuchsia-500/[0.08]" : "hover:bg-white/[0.04]"
              }`}
            >
              <div className="col-span-4">
                <div className="font-semibold">{s.title}</div>
                <div className="text-xs text-white/50">{s.platforms}</div>
              </div>

              <div className="col-span-2">
                <StatusPill status={s.status} />
              </div>

              <div className="col-span-2 text-white/80">
                {s.streams > 0 ? formatCompactNumber(s.streams) : "—"}
              </div>

              <div className="col-span-2 text-white/80">
                {s.earnings > 0 ? `$${s.earnings.toLocaleString()}` : "—"}
              </div>

              <div className="col-span-1 text-right text-xs text-white/55">
                {formatShortDate(s.date)}
              </div>

              <div className="col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => onToggleCompare(s.id)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold ring-1 transition ${
                    selected
                      ? "bg-fuchsia-500/20 text-fuchsia-200 ring-fuchsia-500/30"
                      : "bg-white/5 text-white/70 ring-white/10 hover:bg-white/10"
                  }`}
                >
                  {selected ? "Selected" : "Compare"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CompareCard({ song }: { song: Song }) {
  return (
    <div className="rounded-3xl bg-black/30 p-5 ring-1 ring-white/10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">{song.title}</div>
          <div className="mt-1 text-sm text-white/55">{song.platforms}</div>
        </div>
        <StatusPill status={song.status} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <MetricMiniCard
          label="Streams"
          value={song.streams > 0 ? formatCompactNumber(song.streams) : "—"}
        />
        <MetricMiniCard
          label="Revenue"
          value={song.earnings > 0 ? `$${song.earnings.toLocaleString()}` : "—"}
        />
        <MetricMiniCard label="Release Date" value={formatShortDate(song.date)} />
        <MetricMiniCard
          label="Revenue / 1K Streams"
          value={
            song.streams > 0
              ? `$${((song.earnings / song.streams) * 1000).toFixed(2)}`
              : "—"
          }
        />
      </div>
    </div>
  );
}

function MetricMiniCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="text-xs uppercase tracking-[0.16em] text-white/40">
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold">{value}</div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const normalized = status.toLowerCase();

  const styles =
    normalized === "live"
      ? "bg-emerald-500/15 text-emerald-300 ring-emerald-500/20"
      : normalized === "processing"
      ? "bg-amber-500/15 text-amber-300 ring-amber-500/20"
      : "bg-white/10 text-white/70 ring-white/15";

  return (
    <span
      className={[
        "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ring-1",
        styles,
      ].join(" ")}
    >
      {status}
    </span>
  );
}

/* ----------------------------- Helpers ----------------------------- */

function formatShortDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map((x) => Number(x));
  if (!y || !m || !d) return dateStr;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${months[m - 1]} ${d}`;
}

function formatCompactNumber(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
}

function ReleaseCard({
  title,
  streams,
  trend,
}: {
  title: string;
  streams: string;
  trend: string;
}) {
  return (
    <div className="rounded-3xl bg-black/30 p-4 ring-1 ring-white/10 transition hover:bg-black/40">
      <div className="font-semibold">{title}</div>
      <div className="mt-2 text-sm text-white/60">{streams} streams</div>
      <div className="mt-1 text-sm text-emerald-300">{trend}</div>
    </div>
  );
}