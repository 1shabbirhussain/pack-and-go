"use client";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { useAuth } from "./AuthProvider";

export function LoginForm() {
  const { signIn, resetPassword, user, admin, error: authError } = useAuth();
  const router = useRouter();
  const next = useSearchParams().get("next");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "error" | "info"; text: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      await signIn(email.trim(), password);
      router.replace(next && next.startsWith("/admin") ? next : "/admin");
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
      setMsg({ kind: "error", text: code.includes("too-many-requests") ? "Too many attempts. Please wait a few minutes and try again." : code.includes("network") ? "Couldn't reach the sign-in service. Check your connection and try again." : code.includes("api-key") || code.includes("configuration") ? "Firebase configuration is invalid. Check the NEXT_PUBLIC_FIREBASE_* settings." : "Incorrect email or password." });
    } finally { setBusy(false); }
  };
  const reset = async () => {
    if (!email) { setMsg({ kind: "error", text: "Enter your email address first." }); return; }
    try { await resetPassword(email.trim()); } catch { /* do not reveal whether the account exists */ }
    setMsg({ kind: "info", text: "If an account exists for that email, a password-reset link has been sent." });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lift" noValidate>
        <div className="mb-6 flex justify-center rounded-xl bg-navy p-4"><Image src="/images/brand/logo-light.png" alt="Pack & Go Tourism" width={540} height={353} className="h-14 w-auto" priority /></div>
        <h1 className="flex items-center gap-2 text-xl font-bold text-navy"><Lock className="size-5" aria-hidden /> Admin sign in</h1>
        <p className="mt-1 text-sm text-stone">Authorised Pack & Go staff only. Accounts are created by the owner.</p>
        <label className="mt-6 block"><span className="field-label">Email</span><input type="email" autoComplete="username" required className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="mt-4 block"><span className="field-label">Password</span><input type="password" autoComplete="current-password" required className="field-input" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        <div aria-live="assertive">
          {msg && <p className={`mt-4 rounded-lg p-3 text-sm ${msg.kind === "error" ? "bg-[#fef3f2] text-[#7a271a]" : "bg-glacier-100 text-glacier-700"}`}>{msg.text}</p>}
          {user && !admin && authError && <p className="mt-4 rounded-lg bg-[#fef3f2] p-3 text-sm text-[#7a271a]">{authError}</p>}
        </div>
        <button type="submit" disabled={busy || !email || !password} className="btn btn-dark mt-6 w-full">{busy && <Loader2 className="size-4 animate-spin" aria-hidden />} Sign in</button>
        <button type="button" onClick={reset} className="mt-3 w-full text-center text-sm font-semibold text-glacier-700 hover:underline">Forgot password?</button>
      </form>
    </div>
  );
}
