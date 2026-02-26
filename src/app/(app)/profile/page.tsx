// app/profile/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import type React from "react";
import { createClient } from "../../../lib/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) redirect("/login");

  // If you have a profiles table, this will work. If not, it will just be null.
  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, display_name, bio, avatar_url, website, instagram, spotify, apple_music"
    )
    .eq("id", user.id)
    .maybeSingle();

  const displayName = profile?.display_name ?? "Artist";
  const bio = profile?.bio ?? "";
  const avatarUrl = profile?.avatar_url ?? "";

  // Simple “completion” logic (easy to evolve later)
  const checklist = [
    { key: "display_name", label: "Set display name", done: !!profile?.display_name },
    { key: "bio", label: "Add bio", done: !!profile?.bio },
    { key: "avatar", label: "Upload avatar", done: !!profile?.avatar_url },
    { key: "links", label: "Add artist links", done: !!(profile?.spotify || profile?.instagram || profile?.website) },
  ];

  const completed = checklist.filter((c) => c.done).length;
  const percent = Math.round((completed / checklist.length) * 100);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8 md:px-8 md:py-10 space-y-8 md:space-y-10 text-white">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Your profile,{" "}
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-200 bg-clip-text text-transparent">
              {displayName}
            </span>
          </h1>
          <p className="text-white/60 mt-2">
            Make your artist page feel legit before you upload your next release.
          </p>
        </div>

        
      </div>

      {/* Top row: completion + quick actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard
          title="Profile completeness"
          subtitle="Helps your page look professional"
          right={
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-500/20">
              {percent}%
            </span>
          }
        >
          <div className="space-y-3">
            <div className="h-3 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="grid gap-2">
              {checklist.map((item) => (
                <ChecklistRow key={item.key} label={item.label} done={item.done} />
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="#edit"
                className="inline-flex items-center justify-center rounded-xl bg-white/5 px-3 py-2 text-sm text-white/75 ring-1 ring-white/10 hover:bg-white/10"
              >
                Edit details →
              </Link>
            </div>
          </div>
        </GlassCard>

        <GlassCard
          title="Public preview"
          subtitle="How fans will see you"
        >
          <div className="rounded-2xl bg-black/30 ring-1 ring-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white/5 ring-1 ring-white/10 overflow-hidden">
                {/* If you later wire real image, use next/image */}
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div>
                <div className="font-semibold">{displayName}</div>
                <div className="text-xs text-white/55">Artist • 150+ platforms</div>
              </div>
            </div>

            <div className="mt-3 text-sm text-white/70">
              {bio ? bio : "Add a bio so your page feels real to fans and employers."}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Pill label={profile?.spotify ? "Spotify" : "Spotify (add)"} active={!!profile?.spotify} />
              <Pill label={profile?.apple_music ? "Apple Music" : "Apple Music (add)"} active={!!profile?.apple_music} />
              <Pill label={profile?.instagram ? "Instagram" : "Instagram (add)"} active={!!profile?.instagram} />
              <Pill label={profile?.website ? "Website" : "Website (add)"} active={!!profile?.website} />
            </div>
          </div>
        </GlassCard>

        <GlassCard title="Quick actions" subtitle="Common next steps">
          <div className="grid gap-3">
            <Link
              href="/upload"
              className="rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(124,58,237,0.25)] transition hover:brightness-110 text-center"
            >
              Upload a release
            </Link>

            <button className="rounded-2xl bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/10">
              Invite team member (soon)
            </button>

            <button className="rounded-2xl bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/10">
              Download press kit (soon)
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Main: details */}
      <div id="edit" className="grid gap-4 lg:grid-cols-2">
        <GlassCard title="Profile details" subtitle="What shows on your artist page">
          <div className="grid gap-3">
            <ReadOnlyField label="Display name" value={displayName} hint="Make this your primary artist name." />
            <ReadOnlyField label="Bio" value={bio || "—"} hint="Short, punchy, 1–2 sentences is perfect." />
          </div>

          <div className="mt-4 flex gap-2">
            <button className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/75 ring-1 ring-white/10 hover:bg-white/10">
              Edit (next)
            </button>
            <button className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/75 ring-1 ring-white/10 hover:bg-white/10">
              Save changes (next)
            </button>
          </div>
        </GlassCard>

        <GlassCard title="Links" subtitle="Connect your presence everywhere">
          <div className="grid gap-3">
            <ReadOnlyField label="Spotify" value={profile?.spotify || "—"} />
            <ReadOnlyField label="Apple Music" value={profile?.apple_music || "—"} />
            <ReadOnlyField label="Instagram" value={profile?.instagram || "—"} />
            <ReadOnlyField label="Website" value={profile?.website || "—"} />
          </div>

          <div className="mt-4 flex gap-2">
            <button className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/75 ring-1 ring-white/10 hover:bg-white/10">
              Add links (next)
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Activity */}
      <GlassCard title="Recent activity" subtitle="A real product vibe">
        <div className="rounded-2xl bg-black/30 ring-1 ring-white/10">
          <ActivityRow title="Signed in" meta="Just now" />
          <Divider />
          <ActivityRow title="Viewed profile" meta="Today" />
          <Divider />
          <ActivityRow title="Next: Complete your profile" meta={`${completed}/${checklist.length} tasks`} />
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

function ChecklistRow({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2 ring-1 ring-white/10">
      <div className="text-sm text-white/80">{label}</div>
      <span
        className={[
          "rounded-full px-3 py-1 text-xs font-semibold ring-1",
          done
            ? "bg-emerald-500/15 text-emerald-300 ring-emerald-500/20"
            : "bg-amber-500/15 text-amber-300 ring-amber-500/20",
        ].join(" ")}
      >
        {done ? "Done" : "To do"}
      </span>
    </div>
  );
}

function Pill({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={[
        "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ring-1",
        active
          ? "bg-emerald-500/15 text-emerald-300 ring-emerald-500/20"
          : "bg-white/5 text-white/60 ring-white/10",
      ].join(" ")}
    >
      {label}
    </span>
  );
}

function ReadOnlyField({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl bg-black/30 ring-1 ring-white/10 p-4">
      <div className="text-xs font-semibold text-white/60">{label}</div>
      <div className="mt-1 text-sm text-white/85 break-words">{value}</div>
      {hint && <div className="mt-2 text-xs text-white/45">{hint}</div>}
    </div>
  );
}

function ActivityRow({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <div className="font-semibold">{title}</div>
      <div className="text-xs text-white/55">{meta}</div>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-white/10" />;
}