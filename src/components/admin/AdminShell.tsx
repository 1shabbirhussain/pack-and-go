"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { FileText, HelpCircle, Images, Inbox, LayoutDashboard, LayoutTemplate, LogOut, MapPinned, Menu, MessageSquareQuote, Package, Phone, ScrollText, Settings, X, ExternalLink } from "lucide-react";
import { AuthProvider, useAuth } from "./AuthProvider";
import { ConfirmProvider, Spinner, ToastProvider } from "./ui";
import { cx } from "@/lib/format";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/packages", label: "Tour packages", icon: Package },
  { href: "/admin/destinations", label: "Destinations", icon: MapPinned },
  { href: "/admin/pdfs", label: "Brochures (PDF)", icon: FileText },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquareQuote },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/sections", label: "Homepage", icon: LayoutTemplate },
  { href: "/admin/settings/contact", label: "Contact & business", icon: Phone },
  { href: "/admin/settings/policies", label: "Policies & terms", icon: ScrollText },
  { href: "/admin/settings/site", label: "Site settings", icon: Settings },
];

export function AdminRoot({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <ConfirmProvider>
          <Gate>{children}</Gate>
        </ConfirmProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

function Gate({ children }: { children: ReactNode }) {
  const { configured, loading, user, admin, error, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (!configured || loading) return;
    if (!user && !isLogin) router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
    if (user && admin && isLogin) router.replace("/admin");
  }, [configured, loading, user, admin, isLogin, pathname, router]);

  if (!configured) return <SetupNotice />;
  if (isLogin) return <div className="min-h-screen bg-mist">{children}</div>;
  if (loading || !user) return <div className="flex min-h-screen items-center justify-center bg-mist"><Spinner label="Checking your session…" /></div>;
  if (!admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist p-6">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-soft">
          <h1 className="text-xl font-bold text-navy">Access denied</h1>
          <p className="mt-2 text-sm text-stone">{error || "Checking permissions…"}</p>
          <p className="mt-3 break-all rounded-lg bg-mist p-2 font-mono text-xs text-navy">UID: {user.uid}</p>
          <button type="button" onClick={signOut} className="btn btn-dark btn-sm mt-6">Sign out</button>
        </div>
      </div>
    );
  }
  return <Shell>{children}</Shell>;
}

function Shell({ children }: { children: ReactNode }) {
  const { user, admin, signOut } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  const nav = (
    <nav aria-label="Admin" className="flex flex-col gap-0.5">
      {NAV.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} aria-current={active(href) ? "page" : undefined} className={cx("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium", active(href) ? "bg-amber text-night" : "text-white/80 hover:bg-white/10 hover:text-white")}>
          <Icon className="size-4.5 shrink-0" aria-hidden /> {label}
        </Link>
      ))}
    </nav>
  );
  return (
    <div className="min-h-screen bg-mist lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className={cx("fixed inset-y-0 left-0 z-50 w-64 flex-col bg-navy p-4 lg:sticky lg:top-0 lg:flex lg:h-screen", open ? "flex" : "hidden")}>
        <div className="mb-6 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2"><Image src="/images/brand/logo-light.png" alt="Pack & Go" width={540} height={353} className="h-10 w-auto" /><span className="text-xs font-semibold uppercase tracking-wider text-amber-300">Admin</span></Link>
          <button type="button" className="text-white lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X className="size-6" aria-hidden /></button>
        </div>
        <div className="flex-1 overflow-y-auto">{nav}</div>
        <div className="mt-4 border-t border-white/10 pt-4 text-sm text-white/70">
          <a href="/" target="_blank" rel="noopener noreferrer" className="mb-2 flex items-center gap-2 hover:text-white"><ExternalLink className="size-4" aria-hidden /> View website</a>
          <p className="truncate" title={user?.email ?? ""}>{user?.email}</p>
          <p className="text-xs capitalize text-white/50">{admin?.role}</p>
          <button type="button" onClick={signOut} className="mt-3 flex items-center gap-2 font-semibold text-white hover:text-amber-300"><LogOut className="size-4" aria-hidden /> Sign out</button>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-40 bg-night/50 lg:hidden" onClick={() => setOpen(false)} aria-hidden />}
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 bg-navy px-4 py-3 text-white lg:hidden">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="size-6" aria-hidden /></button>
          <span className="font-semibold">Pack & Go admin</span>
        </header>
        <main id="admin-main" className="mx-auto max-w-6xl px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}

function SetupNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mist p-6">
      <div className="max-w-xl rounded-2xl bg-white p-8 shadow-soft">
        <h1 className="text-2xl font-bold text-navy">Admin panel not connected</h1>
        <p className="mt-3 text-stone">Firebase isn&apos;t configured for this deployment, so the admin panel can&apos;t sign anyone in. The public website keeps working with its bundled content.</p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-navy">
          <li>Create a Firebase project and a Web app.</li>
          <li>Add the <code>NEXT_PUBLIC_FIREBASE_*</code> values to your environment (see <code>.env.example</code>).</li>
          <li>Deploy <code>firestore.rules</code>, <code>storage.rules</code> and <code>firestore.indexes.json</code>.</li>
          <li>Create your admin user in Firebase Authentication and add an <code>admins/&lt;uid&gt;</code> document.</li>
        </ol>
        <p className="mt-4 text-sm text-stone">Full steps are in README.md → “Firebase setup”.</p>
        <Link href="/" className="btn btn-dark btn-sm mt-6">Back to website</Link>
      </div>
    </div>
  );
}
