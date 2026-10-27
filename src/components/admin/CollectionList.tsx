"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ExternalLink, Eye, EyeOff, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { COLLECTIONS } from "@/lib/admin/registry";
import type { CollectionKey } from "@/lib/admin/data";
import { getPath } from "./FormBuilder";
import { EmptyState, ErrorBox, PageHeader, Spinner, StatusBadge, useConfirm, useToast } from "./ui";
import { useAuth } from "./AuthProvider";

type Row = Record<string, unknown> & { id: string };

export function CollectionList({ collection }: { collection: CollectionKey }) {
  const cfg = COLLECTIONS[collection];
  const toast = useToast();
  const confirm = useConfirm();
  const { admin } = useAuth();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError("");
    try {
      const { listDocs } = await import("@/lib/admin/data");
      const docs = (await listDocs(collection)) as Row[];
      docs.sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0) || String(a[cfg.titleField] ?? "").localeCompare(String(b[cfg.titleField] ?? "")));
      setRows(docs);
    } catch (e) { setError((e as Error).message); }
  }, [collection, cfg.titleField]);
  useEffect(() => { setRows(null); void load(); }, [load]);

  const visible = useMemo(() => (rows ?? []).filter((r) =>
    (status === "all" || r.status === status) &&
    (!q || JSON.stringify([r.id, r[cfg.titleField], r.name, r.question]).toLowerCase().includes(q.toLowerCase()))), [rows, q, status, cfg.titleField]);

  const after = async (msg: string) => {
    const { refreshPublicSite } = await import("@/lib/admin/data");
    const ok = await refreshPublicSite();
    toast("success", ok ? `${msg} The website has been refreshed.` : `${msg} The website will update within a few minutes.`);
  };

  const move = async (i: number, d: number) => {
    if (!rows || status !== "all" || q) return;
    const ids = rows.map((r) => r.id);
    [ids[i], ids[i + d]] = [ids[i + d], ids[i]];
    setBusy(true);
    try { const { reorder } = await import("@/lib/admin/data"); await reorder(collection, ids); await load(); await after("Order saved."); }
    catch (e) { toast("error", (e as Error).message); } finally { setBusy(false); }
  };

  const togglePublish = async (r: Row) => {
    const live = collection === "reviews" ? "published" : "published";
    const next = r.status === live ? (collection === "reviews" ? "pending" : "draft") : live;
    if (collection === "reviews" && next === "published" && !r.consent) { toast("error", "Record the traveller's consent before publishing this review."); return; }
    setBusy(true);
    try { const { patchDoc } = await import("@/lib/admin/data"); await patchDoc(collection, r.id, { status: next }); await load(); await after(next === live ? "Published." : "Unpublished."); }
    catch (e) { toast("error", (e as Error).message); } finally { setBusy(false); }
  };

  const del = async (r: Row) => {
    const ok = await confirm({ title: `Delete this ${cfg.singular}?`, body: `“${String(r[cfg.titleField] ?? r.id)}” will be permanently deleted. Consider unpublishing instead.`, confirmLabel: "Delete", danger: true });
    if (!ok) return;
    setBusy(true);
    try { const { removeDoc } = await import("@/lib/admin/data"); await removeDoc(collection, r.id); await load(); await after("Deleted."); }
    catch (e) { toast("error", (e as Error).message.includes("permission") ? "Only the owner can delete items." : (e as Error).message); } finally { setBusy(false); }
  };

  const fmt = (r: Row, c: (typeof cfg.columns)[number]) => {
    const v = getPath(r, c.name);
    if (c.format === "status") return <StatusBadge status={String(v ?? "draft")} />;
    if (c.format === "bool") return v ? "Yes" : "—";
    if (c.format === "count") return Array.isArray(v) ? (v.length ? <span className={c.name === "reviewFlags" ? "font-semibold text-amber-700" : ""}>{v.length}</span> : "—") : "—";
    return <span className="line-clamp-2">{String(v ?? "")}</span>;
  };

  return (
    <div>
      <PageHeader title={cfg.label} description={cfg.description} actions={<Link href={`/admin/${collection}/new`} className="btn btn-primary btn-sm"><Plus className="size-4" aria-hidden /> New {cfg.singular}</Link>} />
      <div className="mb-4 flex flex-wrap gap-2">
        <label className="relative flex-1">
          <span className="sr-only">Search</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone" aria-hidden />
          <input className="field-input !pl-9" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <select className="field-input !w-auto" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          <option value="all">All statuses</option>
          {cfg.statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      {error ? <ErrorBox error={error} onRetry={load} /> : rows === null ? <Spinner /> : visible.length === 0 ? (
        <EmptyState title={rows.length ? "No matches" : `No ${cfg.label.toLowerCase()} yet`} text={rows.length ? "Try a different search or filter." : "Create one, or import the starter content from the dashboard."} />
      ) : (
        <div className="relative overflow-x-auto rounded-2xl bg-white shadow-soft ring-1 ring-navy/5">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-navy/10 text-xs uppercase tracking-wider text-stone">
              <tr>
                <th scope="col" className="w-16 px-3 py-3">Order</th>
                {cfg.columns.map((c) => <th key={c.name} scope="col" className="px-3 py-3">{c.label}</th>)}
                <th scope="col" className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {visible.map((r, i) => (
                <tr key={r.id} className="hover:bg-mist/50">
                  <td className="px-3 py-2">
                    <div className="flex">
                      <button type="button" className="rounded p-1 hover:bg-mist disabled:opacity-25" disabled={busy || i === 0 || status !== "all" || !!q} onClick={() => move(i, -1)} aria-label="Move up"><ArrowUp className="size-4" aria-hidden /></button>
                      <button type="button" className="rounded p-1 hover:bg-mist disabled:opacity-25" disabled={busy || i === visible.length - 1 || status !== "all" || !!q} onClick={() => move(i, 1)} aria-label="Move down"><ArrowDown className="size-4" aria-hidden /></button>
                    </div>
                  </td>
                  {cfg.columns.map((c, ci) => (
                    <td key={c.name} className="px-3 py-3">
                      {ci === 0 ? <Link href={`/admin/${collection}/${r.id}`} className="font-semibold text-navy hover:underline">{fmt(r, c)}</Link> : fmt(r, c)}
                    </td>
                  ))}
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-1">
                      <button type="button" disabled={busy} onClick={() => togglePublish(r)} className="rounded-lg p-2 hover:bg-mist" title={r.status === "published" ? "Unpublish" : "Publish"} aria-label={r.status === "published" ? "Unpublish" : "Publish"}>
                        {r.status === "published" ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                      </button>
                      {cfg.publicHref && r.status === "published" && <a href={cfg.publicHref(r.id)} target="_blank" rel="noopener noreferrer" className="rounded-lg p-2 hover:bg-mist" aria-label="View on website"><ExternalLink className="size-4" aria-hidden /></a>}
                      <Link href={`/admin/${collection}/${r.id}`} className="rounded-lg p-2 hover:bg-mist" aria-label="Edit"><Pencil className="size-4" aria-hidden /></Link>
                      {admin?.role === "owner" && <button type="button" disabled={busy} onClick={() => del(r)} className="rounded-lg p-2 text-[#b42318] hover:bg-[#fef3f2]" aria-label="Delete"><Trash2 className="size-4" aria-hidden /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
