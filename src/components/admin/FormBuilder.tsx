"use client";
/**
 * Generic form engine used by every admin editor. Fields are declared in lib/admin/registry.ts
 * and validated with the same zod schemas used by the public site.
 */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useFormContext, type FieldErrors } from "react-hook-form";
import { ArrowDown, ArrowUp, ChevronDown, FileUp, ImagePlus, Link2, Plus, Trash2, Wand2 } from "lucide-react";
import type { FieldDef } from "@/lib/admin/registry";
import { RIGHTS } from "@/lib/admin/registry";
import type { ImageRef, PdfSource } from "@/lib/schema";
import { cx } from "@/lib/format";
import { mediaUrl } from "@/lib/media";
import { parseGoogleDriveId } from "@/lib/pdf";
import { isStorageConfigured } from "@/lib/firebase/config";
import { useToast } from "./ui";

export const FormMeta = createContext<{ isNew: boolean }>({ isNew: true });

export function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((o, k) => (o == null ? undefined : (o as Record<string, unknown>)[k]), obj);
}

function errorAt(errors: FieldErrors, name: string): string | undefined {
  const e = getPath(errors, name) as { message?: string } | undefined;
  return e?.message;
}

export function slugify(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);
}

/** Renders a list of fields, grouped into tabs when fields declare a `tab`. */
export function FieldsWithTabs({ fields }: { fields: FieldDef[] }) {
  const { formState: { errors } } = useFormContext();
  const tabs = useMemo(() => Array.from(new Set(fields.map((f) => f.tab ?? "Details"))), [fields]);
  const [tab, setTab] = useState(tabs[0]);
  if (tabs.length <= 1) return <FieldGrid fields={fields} />;
  return (
    <div>
      <div className="sticky top-0 z-10 -mx-1 mb-6 flex gap-1 overflow-x-auto bg-mist/95 px-1 py-2 backdrop-blur scrollbar-none" role="tablist">
        {tabs.map((t) => {
          const count = fields.filter((f) => (f.tab ?? "Details") === t && getPath(errors, f.name)).length;
          return (
            <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cx("whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold", tab === t ? "bg-navy text-white" : "bg-white text-navy ring-1 ring-navy/10 hover:ring-navy/30")}>
              {t}{count > 0 && <span className="ml-1.5 rounded-full bg-[#b42318] px-1.5 text-xs text-white">{count}</span>}
            </button>
          );
        })}
      </div>
      {tabs.map((t) => (
        <div key={t} role="tabpanel" hidden={t !== tab}>
          <FieldGrid fields={fields.filter((f) => (f.tab ?? "Details") === t)} />
        </div>
      ))}
    </div>
  );
}

export function FieldGrid({ fields, base }: { fields: FieldDef[]; base?: string }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {fields.map((f) => (
        <div key={f.name} className={"width" in f && f.width === "half" ? "" : "md:col-span-2"}>
          <Field def={f} base={base} />
        </div>
      ))}
    </div>
  );
}

function Label({ htmlFor, children, help }: { htmlFor?: string; children: React.ReactNode; help?: string }) {
  return (
    <>
      <label htmlFor={htmlFor} className="field-label">{children}</label>
      {help && <p className="-mt-1 mb-1.5 text-xs text-stone">{help}</p>}
    </>
  );
}

export function Field({ def, base }: { def: FieldDef; base?: string }) {
  const { register, control, formState: { errors }, getValues, setValue } = useFormContext();
  const { isNew } = useContext(FormMeta);
  const name = base ? `${base}.${def.name}` : def.name;
  const id = `f-${name.replace(/\./g, "-")}`;
  const err = errorAt(errors, name);
  const errEl = err ? <p className="field-error" role="alert">{err}</p> : null;

  switch (def.type) {
    case "text":
    case "url":
    case "email":
      return (<div><Label htmlFor={id} help={def.help}>{def.label}</Label><input id={id} type={def.type === "text" ? "text" : def.type} className="field-input" placeholder={def.placeholder} aria-invalid={!!err} {...register(name)} />{errEl}</div>);
    case "textarea":
      return (<div><Label htmlFor={id} help={def.help}>{def.label}</Label><textarea id={id} rows={def.rows ?? 4} className="field-input" aria-invalid={!!err} {...register(name)} />{errEl}</div>);
    case "number":
      return (
        <div>
          <Label htmlFor={id} help={def.help}>{def.label}</Label>
          <input id={id} type="number" inputMode="numeric" min={def.min} max={def.max} className="field-input" aria-invalid={!!err}
            {...register(name, { setValueAs: (v) => (v === "" || v == null || Number.isNaN(Number(v)) ? (def.nullable ? null : undefined) : Number(v)) })} />
          {errEl}
        </div>
      );
    case "boolean":
      return (
        <div>
          <label className="flex min-h-11 items-center gap-3 rounded-xl bg-white px-3 py-2 ring-1 ring-navy/10">
            <input id={id} type="checkbox" className="size-5 accent-[#232a3a]" {...register(name)} />
            <span className="text-sm font-medium text-navy">{def.label}</span>
          </label>
          {def.help && <p className="field-hint">{def.help}</p>}
        </div>
      );
    case "select":
      return (<div><Label htmlFor={id} help={def.help}>{def.label}</Label><select id={id} className="field-input" aria-invalid={!!err} {...register(name)}>{def.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>{errEl}</div>);
    case "slug":
      return (
        <div>
          <Label htmlFor={id} help={def.help}>{def.label}</Label>
          <div className="flex gap-2">
            <input id={id} className="field-input font-mono text-sm" disabled={!isNew} aria-invalid={!!err} {...register(name)} />
            {isNew && def.from && (
              <button type="button" className="btn btn-outline btn-sm shrink-0" onClick={() => setValue(name, slugify(String(getValues(def.from!) ?? "")), { shouldValidate: true })}>
                <Wand2 className="size-4" aria-hidden /> Generate
              </button>
            )}
          </div>
          {!isNew && <p className="field-hint">IDs cannot be changed after creation (they are used in page URLs).</p>}
          {errEl}
        </div>
      );
    case "stringList":
      return (<div><Label help={def.help}>{def.label}</Label><Controller control={control} name={name} render={({ field }) => <StringList value={(field.value as string[]) ?? []} onChange={field.onChange} multiline={def.multiline} label={def.label} />} />{errEl}</div>);
    case "refList":
      return (<div><Label help={def.help}>{def.label}</Label><Controller control={control} name={name} render={({ field }) => <RefList value={(field.value as string[]) ?? []} onChange={field.onChange} collection={def.collection} labelField={def.labelField} />} />{errEl}</div>);
    case "image":
      return (<div><Label help={def.help}>{def.label}</Label><Controller control={control} name={name} render={({ field }) => <ImageEditor value={field.value as ImageRef | undefined} onChange={field.onChange} />} />{errEl}</div>);
    case "imageList":
      return (
        <div>
          <Label help={def.help}>{def.label}</Label>
          <Controller control={control} name={name} render={({ field }) => {
            const list = (field.value as ImageRef[]) ?? [];
            return (
              <div className="space-y-3">
                {list.map((img, i) => (
                  <div key={i} className="rounded-xl bg-white p-3 ring-1 ring-navy/10">
                    <ImageEditor value={img} onChange={(v) => field.onChange(v ? list.map((x, j) => (j === i ? v : x)) : list.filter((_, j) => j !== i))} />
                    <button type="button" className="mt-2 text-xs font-semibold text-[#b42318]" onClick={() => field.onChange(list.filter((_, j) => j !== i))}>Remove image</button>
                  </div>
                ))}
                <button type="button" className="btn btn-outline btn-sm" onClick={() => field.onChange([...list, { src: { kind: "storage", path: "", url: "" }, alt: "", credit: "", rights: "owned" }])}><Plus className="size-4" aria-hidden /> Add image</button>
              </div>
            );
          }} />
          {errEl}
        </div>
      );
    case "pdfSource":
      return (
        <div>
          <Label help={def.help}>{def.label}</Label>
          <Controller control={control} name={name} render={({ field }) => (
            <PdfSourceEditor value={field.value as PdfSource} onChange={field.onChange} onUploaded={(size) => { if (!base) setValue("fileSizeBytes", size); }} />
          )} />
          {errEl}
        </div>
      );
    case "objectList":
      return <ObjectList def={def} name={name} />;
  }
}

function ObjectList({ def, name }: { def: Extract<FieldDef, { type: "objectList" }>; name: string }) {
  const { control, watch, formState: { errors } } = useFormContext();
  const { fields, append, remove, swap, insert } = useFieldArray({ control, name });
  const values = (watch(name) as Record<string, unknown>[]) ?? [];
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const err = errorAt(errors, name);
  return (
    <div>
      <p className="field-label">{def.label} <span className="font-normal text-stone">({fields.length})</span></p>
      {def.help && <p className="-mt-1 mb-2 text-xs text-stone">{def.help}</p>}
      <ol className="space-y-2">
        {fields.map((f, i) => {
          const isOpen = open[f.id] ?? false;
          const hasErr = !!getPath(errors, `${name}.${i}`);
          return (
            <li key={f.id} className={cx("rounded-xl bg-white ring-1", hasErr ? "ring-[#b42318]/50" : "ring-navy/10")}>
              <div className="flex items-center gap-1 p-2 pl-3">
                <button type="button" className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm font-semibold text-navy" aria-expanded={isOpen} onClick={() => setOpen((o) => ({ ...o, [f.id]: !isOpen }))}>
                  <ChevronDown className={cx("size-4 shrink-0 transition-transform", isOpen && "rotate-180")} aria-hidden />
                  <span className="truncate">{def.itemTitle(values[i] ?? {}, i)}</span>
                  {hasErr && <span className="text-xs text-[#b42318]">· needs attention</span>}
                </button>
                <button type="button" className="rounded-md p-2 hover:bg-mist disabled:opacity-30" disabled={i === 0} onClick={() => swap(i, i - 1)} aria-label="Move up"><ArrowUp className="size-4" aria-hidden /></button>
                <button type="button" className="rounded-md p-2 hover:bg-mist disabled:opacity-30" disabled={i === fields.length - 1} onClick={() => swap(i, i + 1)} aria-label="Move down"><ArrowDown className="size-4" aria-hidden /></button>
                <button type="button" className="rounded-md p-2 hover:bg-mist" onClick={() => insert(i + 1, JSON.parse(JSON.stringify(values[i] ?? def.newItem())))} aria-label="Duplicate" title="Duplicate"><Plus className="size-4" aria-hidden /></button>
                <button type="button" className="rounded-md p-2 text-[#b42318] hover:bg-[#fef3f2]" onClick={() => { if (confirm("Remove this item?")) remove(i); }} aria-label="Remove"><Trash2 className="size-4" aria-hidden /></button>
              </div>
              {isOpen && <div className="border-t border-navy/10 p-4"><FieldGrid fields={def.fields} base={`${name}.${i}`} /></div>}
            </li>
          );
        })}
      </ol>
      <button type="button" className="btn btn-outline btn-sm mt-3" onClick={() => append(def.newItem())}><Plus className="size-4" aria-hidden /> Add</button>
      {err && <p className="field-error">{err}</p>}
    </div>
  );
}

function StringList({ value, onChange, multiline, label }: { value: string[]; onChange: (v: string[]) => void; multiline?: boolean; label: string }) {
  const set = (i: number, v: string) => onChange(value.map((x, j) => (j === i ? v : x)));
  const move = (i: number, d: number) => { const a = [...value]; [a[i], a[i + d]] = [a[i + d], a[i]]; onChange(a); };
  return (
    <div className="space-y-2">
      {value.map((v, i) => (
        <div key={i} className="flex items-start gap-1">
          {multiline
            ? <textarea rows={2} className="field-input" value={v} onChange={(e) => set(i, e.target.value)} aria-label={`${label} ${i + 1}`} />
            : <input className="field-input" value={v} onChange={(e) => set(i, e.target.value)} aria-label={`${label} ${i + 1}`} />}
          <button type="button" className="rounded-md p-2.5 hover:bg-mist disabled:opacity-30" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up"><ArrowUp className="size-4" aria-hidden /></button>
          <button type="button" className="rounded-md p-2.5 hover:bg-mist disabled:opacity-30" disabled={i === value.length - 1} onClick={() => move(i, 1)} aria-label="Move down"><ArrowDown className="size-4" aria-hidden /></button>
          <button type="button" className="rounded-md p-2.5 text-[#b42318] hover:bg-[#fef3f2]" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Remove"><Trash2 className="size-4" aria-hidden /></button>
        </div>
      ))}
      <button type="button" className="btn btn-outline btn-sm" onClick={() => onChange([...value, ""])}><Plus className="size-4" aria-hidden /> Add</button>
    </div>
  );
}

function RefList({ value, onChange, collection, labelField }: { value: string[]; onChange: (v: string[]) => void; collection: string; labelField: string }) {
  const [opts, setOpts] = useState<{ id: string; label: string }[] | null>(null);
  useEffect(() => {
    let alive = true;
    import("@/lib/admin/data").then(({ listDocs }) => listDocs(collection)).then((docs) => {
      if (alive) setOpts(docs.map((d) => ({ id: d.id, label: String((d as Record<string, unknown>)[labelField] ?? d.id) })).sort((a, b) => a.label.localeCompare(b.label)));
    }).catch(() => alive && setOpts([]));
    return () => { alive = false; };
  }, [collection, labelField]);
  if (!opts) return <p className="text-sm text-stone">Loading…</p>;
  const missing = value.filter((v) => !opts.some((o) => o.id === v));
  return (
    <div className="flex flex-wrap gap-2">
      {[...opts, ...missing.map((m) => ({ id: m, label: `${m} (not found)` }))].map((o) => {
        const on = value.includes(o.id);
        return (
          <label key={o.id} className={cx("cursor-pointer rounded-full px-3 py-1.5 text-sm ring-1", on ? "bg-navy text-white ring-navy" : "bg-white text-navy ring-navy/15")}>
            <input type="checkbox" className="sr-only" checked={on} onChange={() => onChange(on ? value.filter((x) => x !== o.id) : [...value, o.id])} />{o.label}
          </label>
        );
      })}
      {opts.length === 0 && missing.length === 0 && <p className="text-sm text-stone">No items yet.</p>}
    </div>
  );
}

function UploadButton({ kind, onDone, label }: { kind: "image" | "pdf"; onDone: (r: { path: string; url: string; size: number }) => void; label: string }) {
  const toast = useToast();
  const [pct, setPct] = useState<number | null>(null);
  if (!isStorageConfigured) return <p className="text-xs text-stone">Uploads need Firebase Storage (see README → Storage).</p>;
  return (
    <label className={cx("btn btn-outline btn-sm cursor-pointer", pct != null && "pointer-events-none opacity-70")}>
      {kind === "pdf" ? <FileUp className="size-4" aria-hidden /> : <ImagePlus className="size-4" aria-hidden />}
      {pct != null ? `Uploading ${pct}%` : label}
      <input type="file" className="sr-only" accept={kind === "pdf" ? "application/pdf" : "image/jpeg,image/png,image/webp,image/avif"} onChange={async (e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        try {
          setPct(0);
          const { uploadFile } = await import("@/lib/admin/data");
          const r = await uploadFile(file, kind, setPct);
          onDone(r);
          toast("success", "Upload complete. Remember to save.");
        } catch (err) {
          toast("error", (err as Error).message || "Upload failed");
        } finally { setPct(null); }
      }} />
    </label>
  );
}

function ImageEditor({ value, onChange }: { value?: ImageRef; onChange: (v: ImageRef | undefined) => void }) {
  const v: ImageRef = value ?? { src: { kind: "storage", path: "", url: "" }, alt: "", credit: "", rights: "owned" };
  const url = mediaUrl(v.src);
  const set = (patch: Partial<ImageRef>) => onChange({ ...v, ...patch });
  return (
    <div className="grid gap-3 rounded-xl bg-mist/60 p-3 sm:grid-cols-[8rem_1fr]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white ring-1 ring-navy/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {url ? <img src={url} alt="" className="size-full object-cover" /> : <span className="flex size-full items-center justify-center text-xs text-stone">No image</span>}
      </div>
      <div className="grid gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <select className="field-input !w-auto !py-1.5 text-sm" value={v.src.kind} onChange={(e) => set({ src: { kind: e.target.value as ImageRef["src"]["kind"], path: "", url: "" } })} aria-label="Image source">
            <option value="bundled">Bundled file (/images/…)</option>
            <option value="storage">Uploaded (Firebase Storage)</option>
            <option value="external">External URL</option>
          </select>
          {v.src.kind === "storage" && <UploadButton kind="image" label="Upload image" onDone={(r) => set({ src: { kind: "storage", path: r.path, url: r.url } })} />}
          {value && <button type="button" className="text-xs font-semibold text-[#b42318]" onClick={() => onChange(undefined)}>Clear</button>}
        </div>
        {v.src.kind === "bundled" && <input className="field-input text-sm" placeholder="/images/photos/example.webp" value={v.src.path} onChange={(e) => set({ src: { ...v.src, path: e.target.value } })} aria-label="Bundled path" />}
        {v.src.kind === "external" && <input className="field-input text-sm" placeholder="https://…" value={v.src.url} onChange={(e) => set({ src: { ...v.src, url: e.target.value } })} aria-label="Image URL" />}
        {v.src.kind === "storage" && v.src.path && <p className="truncate text-xs text-stone">{v.src.path}</p>}
        <input className="field-input text-sm" placeholder="Alt text — describe the photo for screen readers" value={v.alt} onChange={(e) => set({ alt: e.target.value })} aria-label="Alt text" />
        <div className="grid gap-2 sm:grid-cols-2">
          <input className="field-input text-sm" placeholder="Credit / photographer" value={v.credit ?? ""} onChange={(e) => set({ credit: e.target.value })} aria-label="Credit" />
          <select className="field-input text-sm" value={v.rights} onChange={(e) => set({ rights: e.target.value as ImageRef["rights"] })} aria-label="Usage rights">
            {RIGHTS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

function PdfSourceEditor({ value, onChange, onUploaded }: { value?: PdfSource; onChange: (v: PdfSource) => void; onUploaded: (size: number) => void }) {
  const v: PdfSource = value ?? { kind: "storage", path: "", url: "" };
  const driveId = v.kind === "external" ? parseGoogleDriveId(v.url) : null;
  return (
    <div className="grid gap-3 rounded-xl bg-mist/60 p-4">
      <div role="radiogroup" aria-label="PDF source" className="grid gap-2 sm:grid-cols-3">
        {([
          ["bundled", "Bundled with the site", "Files in /public/brochures — change only by redeploying."],
          ["storage", "Uploaded file", "Upload a PDF to Firebase Storage."],
          ["external", "External link", "Google Drive share link or any public PDF URL."],
        ] as const).map(([k, t, d]) => (
          <label key={k} className={cx("cursor-pointer rounded-xl p-3 ring-2", v.kind === k ? "bg-white ring-amber" : "bg-white/60 ring-transparent hover:ring-navy/15")}>
            <input type="radio" className="sr-only" checked={v.kind === k} onChange={() => onChange({ kind: k, path: k === v.kind ? v.path : "", url: k === v.kind ? v.url : "" })} />
            <span className="block text-sm font-semibold text-navy">{t}</span>
            <span className="block text-xs text-stone">{d}</span>
          </label>
        ))}
      </div>
      {v.kind === "bundled" && (
        <input className="field-input font-mono text-sm" placeholder="/brochures/my-brochure.pdf" value={v.path} onChange={(e) => onChange({ ...v, path: e.target.value })} aria-label="Bundled PDF path" />
      )}
      {v.kind === "storage" && (
        <div className="flex flex-wrap items-center gap-3">
          <UploadButton kind="pdf" label={v.url ? "Replace PDF" : "Upload PDF"} onDone={(r) => { onChange({ kind: "storage", path: r.path, url: r.url }); onUploaded(r.size); }} />
          {v.path ? <span className="truncate text-xs text-stone">{v.path}</span> : <span className="text-xs text-stone">No file uploaded yet (max 20 MB).</span>}
        </div>
      )}
      {v.kind === "external" && (
        <div>
          <div className="flex items-center gap-2">
            <Link2 className="size-4 text-stone" aria-hidden />
            <input className="field-input text-sm" placeholder="https://drive.google.com/file/d/…/view?usp=sharing" value={v.url} onChange={(e) => onChange({ ...v, url: e.target.value })} aria-label="PDF URL" />
          </div>
          <p className="field-hint">
            {driveId ? `Google Drive file detected (ID ${driveId}). Make sure sharing is set to “Anyone with the link can view”.` : v.url ? "Direct URL. The host must allow cross-origin access for the in-page viewer; otherwise visitors get an embedded view or new-tab link." : "Paste a Google Drive share link or a direct PDF URL."}
          </p>
        </div>
      )}
      {(v.path || v.url) && (
        <a className="text-sm font-semibold text-glacier-700 underline" href={v.kind === "bundled" ? v.path : v.url} target="_blank" rel="noopener noreferrer">Open the file to check it</a>
      )}
    </div>
  );
}
