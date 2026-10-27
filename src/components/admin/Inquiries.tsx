"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Mail, Phone, RefreshCw, Trash2 } from "lucide-react";
import type { Inquiry, InquiryStatus } from "@/lib/schema";
import { inquiryStatus } from "@/lib/schema";
import { buildWhatsAppMessage, telLink, whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/icons";
import { EmptyState, ErrorBox, PageHeader, Spinner, StatusBadge, useConfirm, useToast } from "./ui";
import { useAuth } from "./AuthProvider";
import { cx } from "@/lib/format";

const STATUSES = inquiryStatus.options;
const fmtDate = (s?: string) => (s ? new Date(s).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" }) : "—");

/** Pakistani local numbers (03xx…) → +92… so WhatsApp/tel links work. */
export function normalisePhone(raw: string) {
  const d = raw.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) return d;
  if (d.startsWith("00")) return `+${d.slice(2)}`;
  if (d.startsWith("0")) return `+92${d.slice(1)}`;
  if (d.startsWith("92")) return `+${d}`;
  return `+${d}`;
}

export function InquiryInbox() {
  const [status, setStatus] = useState<string>("new");
  const [rows, setRows] = useState<Inquiry[] | null>(null);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setError(""); setRows(null);
    try { const { listInquiries } = await import("@/lib/admin/data"); setRows((await listInquiries(status)) as unknown as Inquiry[]); }
    catch (e) {
      const m = (e as Error).message;
      setError(m.includes("index") ? `${m}\n\nDeploy firestore.indexes.json (see README) to enable status filtering.` : m);
    }
  }, [status]);
  useEffect(() => { void load(); }, [load]);
  return (
    <div>
      <PageHeader title="Inquiries" description="Custom-tour and package inquiries submitted through the website. Contact details are private and visible only to admins." actions={<button type="button" onClick={load} className="btn btn-outline btn-sm"><RefreshCw className="size-4" aria-hidden /> Refresh</button>} />
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {["all", ...STATUSES].map((s) => (
          <button key={s} type="button" aria-pressed={status === s} onClick={() => setStatus(s)} className={cx("rounded-full px-3.5 py-1.5 text-sm font-semibold capitalize", status === s ? "bg-navy text-white" : "bg-white text-navy ring-1 ring-navy/10")}>{s}</button>
        ))}
      </div>
      {error ? <ErrorBox error={error} onRetry={load} /> : rows === null ? <Spinner /> : rows.length === 0 ? (
        <EmptyState title={status === "new" ? "No new inquiries" : "Nothing here"} text="New website inquiries will appear here." />
      ) : (
        <ul className="divide-y divide-navy/5 overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-navy/5">
          {rows.map((r) => (
            <li key={r.id}>
              <Link href={`/admin/inquiries/${r.id}`} className="flex flex-col gap-1 px-5 py-4 hover:bg-mist/60 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-semibold text-navy">{r.name} <span className="font-normal text-stone">· {r.phone}</span></p>
                  <p className="truncate text-sm text-stone">{r.packageId ? `Package: ${r.packageId}` : `Custom: ${(r.destinations ?? []).join(", ") || "—"}`} · {r.adults} adult(s){r.children ? `, ${r.children} child(ren)` : ""}{r.departureCity ? ` · from ${r.departureCity}` : ""}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-xs text-stone"><span>{fmtDate(r.createdAt)}</span><StatusBadge status={r.status} /></div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function InquiryDetail({ id }: { id: string }) {
  const toast = useToast();
  const confirm = useConfirm();
  const { admin } = useAuth();
  const [r, setR] = useState<Inquiry | null | undefined>(undefined);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    setError("");
    try { const { getOne } = await import("@/lib/admin/data"); setR((await getOne("inquiries", id)) as unknown as Inquiry | null); }
    catch (e) { setError((e as Error).message); }
  }, [id]);
  useEffect(() => { void load(); }, [load]);

  const setStatus = async (s: InquiryStatus) => {
    setBusy(true);
    try { const { patchDoc } = await import("@/lib/admin/data"); await patchDoc("inquiries", id, { status: s }); await load(); toast("success", `Status set to “${s}”.`); }
    catch (e) { toast("error", (e as Error).message); } finally { setBusy(false); }
  };
  const addNote = async () => {
    if (!note.trim()) return;
    setBusy(true);
    try { const { addInquiryNote } = await import("@/lib/admin/data"); await addInquiryNote(id, note.trim().slice(0, 2000)); setNote(""); await load(); toast("success", "Note added."); }
    catch (e) { toast("error", (e as Error).message); } finally { setBusy(false); }
  };
  const del = async () => {
    if (!(await confirm({ title: "Delete this inquiry?", body: "The customer's details will be permanently removed.", confirmLabel: "Delete", danger: true }))) return;
    try { const { removeDoc } = await import("@/lib/admin/data"); await removeDoc("inquiries", id); toast("success", "Inquiry deleted."); window.location.href = "/admin/inquiries"; }
    catch (e) { toast("error", (e as Error).message); }
  };

  if (error) return <ErrorBox error={error} onRetry={load} />;
  if (r === undefined) return <Spinner />;
  if (r === null) return <EmptyState title="Inquiry not found" action={<Link href="/admin/inquiries" className="btn btn-outline btn-sm">Back to inbox</Link>} />;

  const phone = normalisePhone(r.phone);
  const reply = whatsappLink(phone, buildWhatsAppMessage({ greeting: `Assalam-o-Alaikum ${r.name.split(" ")[0]}, this is Pack & Go Tourism regarding your inquiry.`, reference: `PG-${r.id.slice(0, 6).toUpperCase()}` }));
  const rows: [string, string][] = [
    ["Reference", `PG-${r.id.slice(0, 6).toUpperCase()}`], ["Received", fmtDate(r.createdAt)], ["Type", r.type],
    ["Package", r.packageId || "—"], ["Destinations", (r.destinations ?? []).join(", ") || "—"], ["Departure city", r.departureCity || "—"],
    ["Start date", `${r.startDate || "—"}${r.flexibleDates ? " (flexible)" : ""}`], ["Duration", r.durationDays ? `${r.durationDays} days` : "—"],
    ["Travellers", `${r.adults} adult(s), ${r.children ?? 0} child(ren)`], ["Budget", r.budget || "—"], ["Transport", r.transport || "—"],
    ["Preferred contact", r.preferredContact], ["Email", r.email || "—"],
  ];
  return (
    <div>
      <Link href="/admin/inquiries" className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-glacier-700 hover:underline"><ArrowLeft className="size-4" aria-hidden /> Inbox</Link>
      <PageHeader title={r.name} description={r.phone} actions={<StatusBadge status={r.status} />} />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <dl className="grid gap-x-6 gap-y-3 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy/5 sm:grid-cols-2">
            {rows.map(([k, v]) => <div key={k}><dt className="text-xs uppercase tracking-wider text-stone">{k}</dt><dd className="font-medium text-navy">{v}</dd></div>)}
            <div className="sm:col-span-2"><dt className="text-xs uppercase tracking-wider text-stone">Message</dt><dd className="whitespace-pre-wrap text-navy">{r.message || "—"}</dd></div>
          </dl>
          <section className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy/5">
            <h2 className="font-semibold text-navy">Internal notes</h2>
            <ul className="mt-3 space-y-3">
              {(r.notes ?? []).map((n, i) => <li key={i} className="rounded-xl bg-mist p-3 text-sm"><p className="whitespace-pre-wrap text-navy">{n.text}</p><p className="mt-1 text-xs text-stone">{n.by} · {fmtDate(n.at)}</p></li>)}
              {!(r.notes ?? []).length && <li className="text-sm text-stone">No notes yet.</li>}
            </ul>
            <label className="mt-4 block"><span className="sr-only">New note</span><textarea rows={3} className="field-input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Called, sent quote for 4 adults…" maxLength={2000} /></label>
            <button type="button" disabled={busy || !note.trim()} onClick={addNote} className="btn btn-dark btn-sm mt-2">Add note</button>
          </section>
        </div>
        <aside className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy/5">
            <h2 className="font-semibold text-navy">Contact the customer</h2>
            <div className="mt-4 grid gap-2">
              <a href={reply} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-sm"><WhatsAppIcon className="size-4" /> Reply on WhatsApp</a>
              <a href={telLink(phone)} className="btn btn-outline btn-sm"><Phone className="size-4" aria-hidden /> Call {phone}</a>
              {r.email && <a href={`mailto:${r.email}?subject=${encodeURIComponent("Your Pack & Go inquiry")}`} className="btn btn-outline btn-sm"><Mail className="size-4" aria-hidden /> Email</a>}
            </div>
            <p className="mt-3 text-xs text-stone">These open your own WhatsApp, phone or email app. Mark the inquiry as contacted once you have actually reached the customer.</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy/5">
            <h2 className="font-semibold text-navy">Status</h2>
            <label className="mt-3 block"><span className="sr-only">Status</span>
              <select className="field-input capitalize" value={r.status} disabled={busy} onChange={(e) => setStatus(e.target.value as InquiryStatus)}>{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select>
            </label>
            {r.status !== "handled" && <button type="button" disabled={busy} onClick={() => setStatus("handled")} className="btn btn-primary btn-sm mt-3 w-full"><CheckCircle2 className="size-4" aria-hidden /> Mark as handled</button>}
            {admin?.role === "owner" && <button type="button" onClick={del} className="btn btn-sm mt-3 w-full text-[#b42318] ring-1 ring-[#b42318]/30 hover:bg-[#fef3f2]"><Trash2 className="size-4" aria-hidden /> Delete inquiry</button>}
          </div>
        </aside>
      </div>
    </div>
  );
}
