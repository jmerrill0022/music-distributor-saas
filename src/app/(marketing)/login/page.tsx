"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";

type SignUpStage = "form" | "success";
type ResetStage = "form" | "success";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  // ===== Sign in fields =====
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ===== Global messages =====
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ===== Sign up modal =====
  const [showSignUp, setShowSignUp] = useState(false);
  const [signUpStage, setSignUpStage] = useState<SignUpStage>("form");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suConfirm, setSuConfirm] = useState("");

  // ===== Reset password modal =====
  const [showReset, setShowReset] = useState(false);
  const [resetStage, setResetStage] = useState<ResetStage>("form");
  const [rpEmail, setRpEmail] = useState("");

  // ===== Hard locks to prevent spam =====
  const signUpLockRef = useRef(false);
  const resetLockRef = useRef(false);

  async function onSignIn(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setErr(error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  function openSignUpModal() {
    setErr(null);
    setMsg(null);
    setSuEmail("");
    setSuPassword("");
    setSuConfirm("");
    setSignUpStage("form");
    setShowSignUp(true);
  }

  async function onCreateAccount() {
    if (signUpLockRef.current) return;
    signUpLockRef.current = true;

    try {
      setErr(null);
      setMsg(null);

      const cleanEmail = suEmail.trim();

      if (!cleanEmail || !suPassword) {
        setErr("Please enter an email and password.");
        return;
      }
      if (suPassword.length < 6) {
        setErr("Password must be at least 6 characters.");
        return;
      }
      if (suPassword !== suConfirm) {
        setErr("Passwords do not match.");
        return;
      }

      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: suPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        } as any,
      });

      setLoading(false);

      if (error) {
        const m = String(error.message).toLowerCase();
        if (m.includes("rate limit")) {
          setErr("Too many requests. Please wait a minute and try again.");
        } else {
          setErr(error.message);
        }
        return;
      }

      if (data?.session) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      setSignUpStage("success");
      setMsg("Verification email sent! Check your inbox (and spam/promotions).");
    } finally {
      setLoading(false);
      setTimeout(() => {
        signUpLockRef.current = false;
      }, 30_000);
    }
  }

  async function onResendVerification() {
    if (signUpLockRef.current) return;
    signUpLockRef.current = true;

    try {
      setErr(null);
      setMsg(null);
      setLoading(true);

      const cleanEmail = suEmail.trim();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: cleanEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      setLoading(false);

      if (error) {
        const m = String(error.message).toLowerCase();
        if (m.includes("rate limit")) {
          setErr("Too many requests. Please wait a minute and try again.");
        } else {
          setErr(error.message);
        }
        return;
      }

      setMsg("Resent! Check your inbox (and spam/promotions).");
    } finally {
      setLoading(false);
      setTimeout(() => {
        signUpLockRef.current = false;
      }, 30_000);
    }
  }

  function openResetModal() {
    setErr(null);
    setMsg(null);
    setRpEmail("");
    setResetStage("form");
    setShowReset(true);
  }

  async function onSendReset() {
    if (resetLockRef.current) return;
    resetLockRef.current = true;

    try {
      setErr(null);
      setMsg(null);

      const cleanEmail = rpEmail.trim();
      if (!cleanEmail) {
        setErr("Please enter your email.");
        return;
      }

      setLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/auth/reset`,
      });

      setLoading(false);

      if (error) {
        const m = String(error.message).toLowerCase();
        if (m.includes("rate limit")) {
          setErr("Too many requests. Please wait a few minutes and try again.");
        } else {
          setErr(error.message);
        }
        return;
      }

      setResetStage("success");
      setMsg("Reset email sent! Check your inbox (and spam/promotions).");
    } finally {
      setLoading(false);
      setTimeout(() => {
        resetLockRef.current = false;
      }, 30_000);
    }
  }

  return (
    <AuthShell>
      <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 pb-16 pt-6 md:grid-cols-2 md:pt-12">
        {/* Left marketing copy */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-white/70 ring-1 ring-white/10">
            <span className="inline-flex h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_18px_rgba(167,139,250,0.9)]" />
            The platform built by musicians, for musicians
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            Your Music.
            <br />
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-200 bg-clip-text text-transparent">
              Everywhere.
            </span>
          </h1>

          <p className="max-w-lg text-base leading-relaxed text-white/65">
            Upload your tracks and get them on Spotify, Apple Music, TikTok, and 150+ platforms
            worldwide. Keep 100% of your rights.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
            <div className="rounded-2xl bg-white/5 px-4 py-2 ring-1 ring-white/10">150+ platforms</div>
            <div className="rounded-2xl bg-white/5 px-4 py-2 ring-1 ring-white/10">2M+ artists</div>
            <div className="rounded-2xl bg-white/5 px-4 py-2 ring-1 ring-white/10">Fast payouts</div>
          </div>
        </div>

        {/* Right login card */}
        <LoginCard
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          err={err}
          msg={msg}
          loading={loading}
          onSignIn={onSignIn}
          openResetModal={openResetModal}
          openSignUpModal={openSignUpModal}
        />

        {/* Sign Up Modal */}
        {showSignUp && (
          <ModalShell onClose={() => setShowSignUp(false)}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {signUpStage === "form" ? "Create account" : "Congrats 🎉"}
              </h2>
              <button className="text-sm text-white/70 hover:text-white" onClick={() => setShowSignUp(false)}>
                Close
              </button>
            </div>

            <Notice err={err} msg={msg} />

            {signUpStage === "form" ? (
              <div className="mt-5 space-y-3">
                <Input value={suEmail} onChange={setSuEmail} placeholder="Email" autoComplete="email" />
                <Input value={suPassword} onChange={setSuPassword} placeholder="Password" type="password" autoComplete="new-password" />
                <Input value={suConfirm} onChange={setSuConfirm} placeholder="Confirm password" type="password" autoComplete="new-password" />

                <PrimaryButton disabled={loading} onClick={onCreateAccount}>
                  {loading ? "Creating..." : "Create account"}
                </PrimaryButton>

                <p className="text-xs text-white/45">
                  Demo note: one email per account. Resends can be rate-limited.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                <p className="text-sm text-white/70">
                  We sent a verification link to <span className="font-semibold text-white">{suEmail}</span>.
                </p>

                <SecondaryButton disabled={loading} onClick={onResendVerification}>
                  {loading ? "Resending..." : "Resend verification email"}
                </SecondaryButton>

                <SecondaryButton
                  onClick={() => {
                    setErr(null);
                    setMsg(null);
                    setSignUpStage("form");
                    setSuPassword("");
                    setSuConfirm("");
                  }}
                >
                  Use a different email
                </SecondaryButton>

                <p className="text-xs text-white/45">
                  Check spam/promotions folders too.
                </p>
              </div>
            )}
          </ModalShell>
        )}

        {/* Reset Modal */}
        {showReset && (
          <ModalShell onClose={() => setShowReset(false)}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {resetStage === "form" ? "Reset password" : "Check your email ✅"}
              </h2>
              <button className="text-sm text-white/70 hover:text-white" onClick={() => setShowReset(false)}>
                Close
              </button>
            </div>

            <Notice err={err} msg={msg} />

            {resetStage === "form" ? (
              <div className="mt-5 space-y-3">
                <Input value={rpEmail} onChange={setRpEmail} placeholder="Email" autoComplete="email" />

                <PrimaryButton disabled={loading} onClick={onSendReset}>
                  {loading ? "Sending..." : "Send reset link"}
                </PrimaryButton>

                <p className="text-xs text-white/45">
                  We’ll email you a link. After you click it, you’ll be able to set a new password.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                <p className="text-sm text-white/70">
                  We sent a reset link to <span className="font-semibold text-white">{rpEmail}</span>.
                </p>

                <SecondaryButton disabled={loading} onClick={onSendReset}>
                  {loading ? "Please wait..." : "Resend reset link"}
                </SecondaryButton>

                <SecondaryButton
                  onClick={() => {
                    setErr(null);
                    setMsg(null);
                    setResetStage("form");
                  }}
                >
                  Use a different email
                </SecondaryButton>

                <p className="text-xs text-white/45">Demo note: resends can be rate-limited.</p>
              </div>
            )}
          </ModalShell>
        )}
      </div>
    </AuthShell>
  );
}

/* ----------------------------- UI components ----------------------------- */

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07070c] text-white">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.20),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(236,72,153,0.12),transparent_55%)]" />

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black 55%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 55%, transparent 78%)",
        }}
      />

      {/* Glow blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-violet-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />

      {/* Top nav */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
            <span className="text-lg">♪</span>
          </span>
          <span className="text-lg font-extrabold tracking-tight text-white/90">Jacob’s Distributor</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-xl px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 ring-1 ring-transparent hover:ring-white/10"
          >
            Home
          </Link>
          <Link
            href="/#pricing"
            className="rounded-xl px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 ring-1 ring-transparent hover:ring-white/10"
          >
            Pricing
          </Link>
        </nav>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col">{children}</main>
    </div>
  );
}

function LoginCard(props: {
  email: string;
  password: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  err: string | null;
  msg: string | null;
  loading: boolean;
  onSignIn: (e: React.FormEvent) => void;
  openResetModal: () => void;
  openSignUpModal: () => void;
}) {
  const { email, password, setEmail, setPassword, err, msg, loading, onSignIn, openResetModal, openSignUpModal } = props;

  return (
    <section className="relative">
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-violet-500/40 via-fuchsia-500/25 to-violet-500/40 blur-xl" />
      <div className="relative rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10 backdrop-blur-xl md:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Sign in</h2>
          <p className="mt-1 text-sm text-white/60">Use your email and password to continue.</p>
        </div>

        <form onSubmit={onSignIn} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-white/70">Email</label>
            <input
              className="w-full rounded-2xl bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/35 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-violet-400/60"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Password</label>
            <input
              className="w-full rounded-2xl bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/35 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-violet-400/60"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <Notice err={err} msg={msg} />

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(124,58,237,0.25)] transition hover:brightness-110 disabled:opacity-60"
          >
            <span className="absolute inset-0 rounded-2xl opacity-0 ring-2 ring-violet-300/50 transition group-hover:opacity-100" />
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="flex items-center justify-between">
            <button
              type="button"
              className="text-sm text-white/65 hover:text-white hover:underline disabled:opacity-60"
              onClick={openResetModal}
              disabled={loading}
            >
              Forgot password?
            </button>

            <button
              type="button"
              className="text-sm text-white/65 hover:text-white hover:underline disabled:opacity-60"
              onClick={openSignUpModal}
              disabled={loading}
            >
              Create account
            </button>
          </div>

          <p className="text-xs text-white/45 pt-2">
            Demo note: please use one email per account. Repeated resends may be rate-limited by Supabase.
          </p>
        </form>
      </div>
    </section>
  );
}

function ModalShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-violet-500/40 via-fuchsia-500/25 to-violet-500/40 blur-xl" />
        <div className="relative rounded-3xl bg-white/[0.07] p-6 ring-1 ring-white/10 backdrop-blur-xl">
          {children}
        </div>
      </div>
    </div>
  );
}

function Notice({ err, msg }: { err: string | null; msg: string | null }) {
  if (!err && !msg) return null;

  if (err) {
    return (
      <div className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-200 ring-1 ring-red-500/25">
        {err}
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 ring-1 ring-emerald-500/25">
      {msg}
    </div>
  );
}

function Input(props: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <input
      className="w-full rounded-2xl bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/35 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-violet-400/60"
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      placeholder={props.placeholder}
      type={props.type ?? "text"}
      autoComplete={props.autoComplete}
    />
  );
}

function PrimaryButton(props: { children: React.ReactNode; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      disabled={props.disabled}
      onClick={props.onClick}
      className="group relative w-full rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(124,58,237,0.25)] transition hover:brightness-110 disabled:opacity-60"
      type="button"
    >
      <span className="absolute inset-0 rounded-2xl opacity-0 ring-2 ring-violet-300/50 transition group-hover:opacity-100" />
      {props.children}
    </button>
  );
}

function SecondaryButton(props: { children: React.ReactNode; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      disabled={props.disabled}
      onClick={props.onClick}
      className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 disabled:opacity-60"
      type="button"
    >
      {props.children}
    </button>
  );
}