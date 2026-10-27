"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, DatabaseZap, FileText, Inbox, Loader2, MessageSquareQuote, Package } from "lucide-react";
import { PageHeader, useConfirm, useToast } from "./ui";
import { useAuth } from "./AuthProvider";
import { isStorageConfigured } from "@/lib/firebase/config";

interface Stats { newInquiries: number; pendingReviews: number; packages: { id: string; title: string; status: string; flags: string[] }[]; initialized: boolean; verification: string[] }

export function Dashboard() {
  const { admin, user } = useAuth();
  const toast = useToast();
  const confirm = useConfirm();
  const [s, setS] = useState<Stats | null>(null);
  const [err, setErr] = useState("");
  const [importing, setImporting] = useState(false);

  const load = useCallback(async () => {
    setErr("");
    try {
      const d = await import("@/lib/admin/data");
      const [newInquiries, pendingReviews, packages, site, contact] = await Promise.all([
        d.countWhere("inquiries", "status", "new").catch(() => -1),
        d.countWhere("reviews", "status", "pending").catch(() => -1),
        d.listDocs("packages"),
        d.getSingleton("site"),
        d.getSingleton("contact"),
      ]);
      setS({
        newInquiries, pendingReviews,
        packages: packages.map((p) => ({ id: p.id, title: String(p.title ?? p.id), status: String(p.status ?? "draft"), flags: (p.reviewFlags as string[]) ?? [] })),
        initialized: Boolean(site?.initialized),
        verification: (contact?.verificationNotes as string[]) ?? [],
      });
    } catch (e) { setErr((e as Error).message); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const runImport = async () => {
    const ok = await confirm({ title: "Import starter content?", body: "This copies the four brochure packages, destinations, brochures, gallery, FAQs, homepage sections, contact details and policies into Firestore. Existing items with the same IDs are kept unchanged.", confirmLabel: "Import" });
    if (!ok) return;
    setImporting(true);
    try {
      const d = await import("@/lib/admin/data");
      const res = await d.importStarterContent(false);
      await d.refreshPublicSite();
      toast("success", `Imported: ${Object.entries(res).map(([k, v]) => `${k} ${v}`).join(", ")}. Firestore is now the content source.`);
      await load();
    } catch (e) { toast("error", (e as Error).message.includes("permission") ? "Only an owner can import starter content." : (e as Error).message); }
    finally { setImporting(false); }
  };

  const flagged = s?.packages.filter((p) => p.flags.length) ?? [];
  return (
    <div>
      <PageHeader title={`Welcome${user?.email ? `, ${user.email}` : ""}`} description={`Signed in as ${admin?.role}. Changes you publish here update the public website automatically.`} />
      {err && <p className="mb-6 rounded-xl bg-[#fef3f2] p-4 text-sm text-[#7a271a]">{err}</p>}
      {s && !s.initialized && (
        <section className="mb-8 rounded-2xl border-2 border-amber bg-amber/10 p-6">
          <h2 className="flex items-center gap-2 font-semibold text-navy"><DatabaseZap className="size-5" aria-hidden /> Set up your content</h2>
          <p className="mt-2 max-w-2xl text-sm text-stone">The website is currently showing the starter content bundled with the code. Import it into Firestore once to make everything editable here.</p>
          <button type="button" onClick={runImport} disabled={importing || admin?.role !== "owner"} className="btn btn-primary btn-sm mt-4">{importing && <Loader2 className="size-4 animate-spin" aria-hidden />} Import starter content</button>
          {admin?.role !== "owner" && <p className="mt-2 text-xs text-stone">Only an owner can run the import.</p>}
        </section>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat href="/admin/inquiries" icon={Inbox} label="New inquiries" value={s ? (s.newInquiries < 0 ? "—" : s.newInquiries) : null} />
        <Stat href="/admin/reviews" icon={MessageSquareQuote} label="Reviews awaiting approval" value={s ? (s.pendingReviews < 0 ? "—" : s.pendingReviews) : null} />
        <Stat href="/admin/packages" icon={Package} label="Published packages" value={s ? s.packages.filter((p) => p.status === "published").length : null} />
        <Stat href="/admin/pdfs" icon={FileText} label="Uploads" value={isStorageConfigured ? "Enabled" : "Off"} />
      </div>
      {(flagged.length > 0 || (s?.verification.length ?? 0) > 0) && (
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy/5">
          <h2 className="flex items-center gap-2 font-semibold text-navy"><AlertTriangle className="size-5 text-amber-700" aria-hidden /> Waiting for owner confirmation</h2>
          <p className="mt-1 text-sm text-stone">These items came from the brochure research and need a decision. They are never shown publicly.</p>
          <ul className="mt-4 space-y-4 text-sm">
            {s!.verification.length > 0 && (
              <li><Link href="/admin/settings/contact" className="font-semibold text-glacier-700 hover:underline">Contact & business details</Link>
                <ul className="mt-1 list-disc pl-5 text-stone">{s!.verification.map((v) => <li key={v}>{v}</li>)}</ul></li>
            )}
            {flagged.map((p) => (
              <li key={p.id}><Link href={`/admin/packages/${p.id}`} className="font-semibold text-glacier-700 hover:underline">{p.title}</Link>
                <ul className="mt-1 list-disc pl-5 text-stone">{p.flags.map((f) => <li key={f}>{f}</li>)}</ul></li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Stat({ href, icon: Icon, label, value }: { href: string; icon: typeof Inbox; label: string; value: number | string | null }) {
  return (
    <Link href={href} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-navy/5 hover:ring-amber">
      <Icon className="size-5 text-glacier" aria-hidden />
      <p className="mt-3 text-3xl font-bold text-navy">{value ?? <Loader2 className="size-6 animate-spin" aria-label="Loading" />}</p>
      <p className="text-sm text-stone">{label}</p>
    </Link>
  );
}
