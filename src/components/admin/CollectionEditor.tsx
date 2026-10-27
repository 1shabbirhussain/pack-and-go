"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ExternalLink, Loader2, Save } from "lucide-react";
import { COLLECTIONS } from "@/lib/admin/registry";
import type { CollectionKey } from "@/lib/admin/data";
import { FieldsWithTabs, FormMeta } from "./FormBuilder";
import { ErrorBox, PageHeader, Spinner, useToast } from "./ui";

export function CollectionEditor({ collection, id }: { collection: CollectionKey; id: string }) {
  const cfg = COLLECTIONS[collection];
  const isNew = id === "new";
  const router = useRouter();
  const toast = useToast();
  const [initial, setInitial] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setError("");
    if (isNew) { setInitial(cfg.defaults()); return; }
    try {
      const { getOne } = await import("@/lib/admin/data");
      const doc = await getOne(collection, id);
      if (!doc) { setError("This item was not found. It may have been deleted."); return; }
      const parsed = cfg.schema.safeParse(doc);
      setInitial(parsed.success ? (parsed.data as Record<string, unknown>) : { ...cfg.defaults(), ...doc });
    } catch (e) { setError((e as Error).message); }
  }, [collection, id, isNew, cfg]);
  useEffect(() => { void load(); }, [load]);

  if (error) return <ErrorBox error={error} onRetry={load} />;
  if (!initial) return <Spinner />;
  return <EditorForm key={id} cfg={cfg} isNew={isNew} initial={initial} saving={saving} onSave={async (data) => {
    setSaving(true);
    try {
      const { saveDoc, refreshPublicSite } = await import("@/lib/admin/data");
      let docId = isNew ? String(data.id ?? "") : id;
      if (cfg.idMode === "auto" && isNew) docId = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
      if (!docId) throw new Error("Please set an ID.");
      const clean = JSON.parse(JSON.stringify(data)) as Record<string, unknown>;
      await saveDoc(collection, docId, clean, { create: isNew });
      const ok = await refreshPublicSite();
      toast("success", ok ? "Saved. The website has been refreshed." : "Saved. The website will update within a few minutes.");
      if (isNew) router.replace(`/admin/${collection}/${docId}`);
    } catch (e) {
      const msg = (e as Error).message;
      toast("error", msg.includes("permission") ? "You don't have permission to save this. Check your admin role." : msg);
    } finally { setSaving(false); }
  }} id={id} collection={collection} />;
}

function EditorForm({ cfg, isNew, initial, saving, onSave, id, collection }: { cfg: (typeof COLLECTIONS)[CollectionKey]; isNew: boolean; initial: Record<string, unknown>; saving: boolean; onSave: (d: Record<string, unknown>) => Promise<void>; id: string; collection: CollectionKey }) {
  const methods = useForm<Record<string, unknown>>({ resolver: zodResolver(cfg.schema), defaultValues: { ...initial, ...(cfg.idMode === "auto" ? { id: isNew ? "pending" : id } : {}) }, mode: "onBlur" });
  const { handleSubmit, formState: { isDirty, errors } } = methods;
  const toast = useToast();

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (isDirty) { e.preventDefault(); } };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  const title = String(initial[cfg.titleField] || "") || `New ${cfg.singular}`;
  return (
    <FormMeta.Provider value={{ isNew }}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSave, () => toast("error", `Please fix the highlighted fields (${Object.keys(errors).length || "some"} need attention).`))} noValidate>
          <Link href={`/admin/${collection}`} className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-glacier-700 hover:underline"><ArrowLeft className="size-4" aria-hidden /> {cfg.label}</Link>
          <PageHeader
            title={isNew ? `New ${cfg.singular}` : title}
            description={isNew ? cfg.description : `ID: ${id}`}
            actions={<>
              {!isNew && cfg.publicHref && <a href={cfg.publicHref(id)} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm"><ExternalLink className="size-4" aria-hidden /> View</a>}
              <button type="submit" disabled={saving} className="btn btn-primary btn-sm">{saving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Save className="size-4" aria-hidden />} Save</button>
            </>}
          />
          {collection === "packages" && Array.isArray(initial.reviewFlags) && initial.reviewFlags.length > 0 && (
            <div className="mb-6 rounded-xl border border-amber/60 bg-amber/10 p-4 text-sm">
              <p className="font-semibold text-navy">{initial.reviewFlags.length} owner check{initial.reviewFlags.length === 1 ? "" : "s"} pending</p>
              <p className="text-stone">See the “Owner checks” tab. Remove an item once it has been confirmed or corrected.</p>
            </div>
          )}
          <FieldsWithTabs fields={cfg.fields} />
          <div className="sticky bottom-0 mt-8 flex items-center justify-between gap-3 border-t border-navy/10 bg-mist/95 py-4 backdrop-blur">
            <p className="text-sm text-stone">{isDirty ? "You have unsaved changes." : "No unsaved changes."}</p>
            <button type="submit" disabled={saving} className="btn btn-primary">{saving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Save className="size-4" aria-hidden />} Save {cfg.singular}</button>
          </div>
        </form>
      </FormProvider>
    </FormMeta.Provider>
  );
}
