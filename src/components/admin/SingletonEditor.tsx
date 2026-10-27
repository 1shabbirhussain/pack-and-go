"use client";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { SINGLETONS } from "@/lib/admin/registry";
import type { SingletonKey } from "@/lib/admin/data";
import { SEED } from "@/content/seed";
import { FieldsWithTabs, FormMeta } from "./FormBuilder";
import { ErrorBox, PageHeader, Spinner, useToast } from "./ui";
import { useAuth } from "./AuthProvider";

export function SingletonEditor({ which }: { which: SingletonKey }) {
  const cfg = SINGLETONS[which];
  const [initial, setInitial] = useState<Record<string, unknown> | null>(null);
  const [fromSeed, setFromSeed] = useState(false);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setError("");
    try {
      const { getSingleton } = await import("@/lib/admin/data");
      const doc = await getSingleton(which);
      const seed = SEED.settings[which] as unknown as Record<string, unknown>;
      setFromSeed(!doc);
      const parsed = cfg.schema.safeParse(doc ?? seed);
      setInitial(parsed.success ? (parsed.data as Record<string, unknown>) : { ...seed, ...(doc ?? {}) });
    } catch (e) { setError((e as Error).message); }
  }, [which, cfg.schema]);
  useEffect(() => { setInitial(null); void load(); }, [load]);
  if (error) return <ErrorBox error={error} onRetry={load} />;
  if (!initial) return <Spinner />;
  return <Form key={which} which={which} initial={initial} fromSeed={fromSeed} />;
}

function Form({ which, initial, fromSeed }: { which: SingletonKey; initial: Record<string, unknown>; fromSeed: boolean }) {
  const cfg = SINGLETONS[which];
  const toast = useToast();
  const { admin } = useAuth();
  const [saving, setSaving] = useState(false);
  const methods = useForm<Record<string, unknown>>({ resolver: zodResolver(cfg.schema), defaultValues: initial });
  const readOnly = cfg.ownerOnly && admin?.role !== "owner";
  const onSave = async (data: Record<string, unknown>) => {
    setSaving(true);
    try {
      const { saveSingleton, refreshPublicSite } = await import("@/lib/admin/data");
      await saveSingleton(which, JSON.parse(JSON.stringify(data)));
      const ok = await refreshPublicSite();
      toast("success", ok ? "Saved. The website has been refreshed." : "Saved. The website will update within a few minutes.");
      methods.reset(data);
    } catch (e) {
      toast("error", (e as Error).message.includes("permission") ? "Only the owner can change these settings." : (e as Error).message);
    } finally { setSaving(false); }
  };
  return (
    <FormMeta.Provider value={{ isNew: false }}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSave, () => toast("error", "Please fix the highlighted fields."))} noValidate>
          <PageHeader title={cfg.label} description={cfg.description} actions={<button type="submit" disabled={saving || readOnly} className="btn btn-primary btn-sm">{saving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Save className="size-4" aria-hidden />} Save</button>} />
          {fromSeed && <p className="mb-6 rounded-xl bg-glacier-100 p-4 text-sm text-glacier-700">These values come from the starter content and have not been saved to Firestore yet. Saving stores them in your database.</p>}
          {readOnly && <p className="mb-6 rounded-xl bg-amber/15 p-4 text-sm text-navy">Only an owner can change these settings. You can view them.</p>}
          <fieldset disabled={readOnly}><FieldsWithTabs fields={cfg.fields} /></fieldset>
          <div className="sticky bottom-0 mt-8 flex justify-end border-t border-navy/10 bg-mist/95 py-4 backdrop-blur">
            <button type="submit" disabled={saving || readOnly} className="btn btn-primary">{saving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Save className="size-4" aria-hidden />} Save settings</button>
          </div>
        </form>
      </FormProvider>
    </FormMeta.Provider>
  );
}
