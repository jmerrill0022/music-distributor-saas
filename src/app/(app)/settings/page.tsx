import { redirect } from "next/navigation";
import type React from "react";
import { createClient } from "../../../lib/server";
import SignOutButton from "./signout-button";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) redirect("/login");

  // Read settings (create defaults if missing)
  const { data: settings } = await supabase
    .from("user_settings")
    .select("notify_release_updates, notify_payout_alerts, notify_product_updates")
    .eq("id", user.id)
    .maybeSingle();

  if (!settings) {
    // create default row once
    await supabase.from("user_settings").insert({
      id: user.id,
      notify_release_updates: true,
      notify_payout_alerts: true,
      notify_product_updates: false,
    });
  }

  const effective = settings ?? {
    notify_release_updates: true,
    notify_payout_alerts: true,
    notify_product_updates: false,
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8 md:px-8 md:py-10 space-y-8 md:space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Settings{" "}
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-200 bg-clip-text text-transparent">
              & Preferences
            </span>
          </h1>
          <p className="text-white/60 mt-2">
            Account security, notifications, and payouts.
          </p>
        </div>

        {/* Save Settings (UI only for now) */}
        <button
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(124,58,237,0.25)] transition hover:brightness-110"
          type="button"
        >
          Save settings
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard title="Account" subtitle="Your login & account info">
          <div className="grid gap-3">
            <ReadOnlyField
              label="Email"
              value={user.email ?? "—"}
              hint="Used for login (not public)."
            />
            <ReadOnlyField label="User ID" value={user.id} hint="Internal identifier." />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/75 ring-1 ring-white/10 hover:bg-white/10">
              Change email (next)
            </button>
            <button className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/75 ring-1 ring-white/10 hover:bg-white/10">
              Reset password (next)
            </button>
          </div>
        </GlassCard>

        <GlassCard title="Security" subtitle="Protect your account">
          <div className="grid gap-3">
            <SettingRow label="Two-factor authentication" value="Not enabled" />
            <SettingRow label="Sessions" value="Manage devices (soon)" />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(124,58,237,0.25)] hover:brightness-110">
              Enable 2FA (soon)
            </button>
          </div>
        </GlassCard>

        <GlassCard title="Notifications" subtitle="Stored once in user_settings">
          <div className="grid gap-3">
            <StatusToggleRow
              label="Release status updates"
              desc="Processing, live, rejected, etc."
              enabled={effective.notify_release_updates}
            />
            <StatusToggleRow
              label="Payout alerts"
              desc="When payouts are sent or fail"
              enabled={effective.notify_payout_alerts}
            />
            <StatusToggleRow
              label="Product updates"
              desc="New features & improvements"
              enabled={effective.notify_product_updates}
            />
          </div>

          <div className="mt-4 text-xs text-white/45">
            (Next step: wire these toggles to update the table.)
          </div>
        </GlassCard>

        <GlassCard title="Payouts" subtitle="Connect where earnings go">
          <div className="rounded-2xl bg-black/30 ring-1 ring-white/10 p-4">
            <div className="font-semibold">Add payout method</div>
            <div className="mt-1 text-sm text-white/60">
              Connect Stripe or a bank account to receive earnings.
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button className="rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(124,58,237,0.25)] hover:brightness-110">
                Connect Stripe (soon)
              </button>
              <button className="rounded-2xl bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/10">
                Add bank account (soon)
              </button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Sign out (Danger zone) */}
      <div className="pt-2">
        <div className="text-xs text-white/45 mb-2">Danger zone</div>
        <div className="rounded-3xl bg-white/[0.06] p-5 ring-1 ring-white/10 backdrop-blur-xl">
          <div className="mb-3">
            <div className="font-semibold">Sign out</div>
            <div className="mt-1 text-sm text-white/55">
              You’ll be returned to the login screen.
            </div>
          </div>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}

/* ---------------- UI bits (same vibe) ---------------- */

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

function ReadOnlyField({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl bg-black/30 ring-1 ring-white/10 p-4">
      <div className="text-xs font-semibold text-white/60">{label}</div>
      <div className="mt-1 text-sm text-white/85 break-words">{value}</div>
      {hint && <div className="mt-2 text-xs text-white/45">{hint}</div>}
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl bg-black/30 ring-1 ring-white/10 p-4">
      <div className="font-semibold">{label}</div>
      <div className="text-sm text-white/60">{value}</div>
    </div>
  );
}

function StatusToggleRow({
  label,
  desc,
  enabled,
}: {
  label: string;
  desc: string;
  enabled: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl bg-black/30 ring-1 ring-white/10 p-4">
      <div>
        <div className="font-semibold">{label}</div>
        <div className="mt-1 text-sm text-white/55">{desc}</div>
      </div>

      <span
        className={[
          "rounded-full px-3 py-1 text-xs font-semibold ring-1",
          enabled
            ? "bg-emerald-500/15 text-emerald-300 ring-emerald-500/20"
            : "bg-white/5 text-white/60 ring-white/10",
        ].join(" ")}
      >
        {enabled ? "On" : "Off"}
      </span>
    </div>
  );
}