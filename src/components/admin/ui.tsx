"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, Loader2, X } from "lucide-react";
import { cx } from "@/lib/format";

/* ───── Toasts ───── */
type Toast = { id: number; kind: "success" | "error" | "info"; text: string };
const ToastCtx = createContext<(kind: Toast["kind"], text: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const push = useCallback((kind: Toast["kind"], text: string) => {
    const id = Date.now() + Math.random();
    setItems((x) => [...x, { id, kind, text }]);
    setTimeout(() => setItems((x) => x.filter((t) => t.id !== id)), kind === "error" ? 9000 : 5000);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2" aria-live="polite" role="status">
        {items.map((t) => (
          <div key={t.id} className={cx("flex items-start gap-3 rounded-xl p-4 text-sm shadow-lift ring-1", t.kind === "success" && "bg-white ring-pine/30", t.kind === "error" && "bg-[#fef3f2] text-[#7a271a] ring-[#b42318]/30", t.kind === "info" && "bg-white ring-navy/15")}>
            {t.kind === "success" ? <CheckCircle2 className="size-5 shrink-0 text-pine" aria-hidden /> : t.kind === "error" ? <AlertTriangle className="size-5 shrink-0" aria-hidden /> : <Info className="size-5 shrink-0 text-glacier" aria-hidden />}
            <p className="flex-1">{t.text}</p>
            <button type="button" onClick={() => setItems((x) => x.filter((y) => y.id !== t.id))} aria-label="Dismiss"><X className="size-4" aria-hidden /></button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ───── Confirm dialog ───── */
type ConfirmOpts = { title: string; body?: string; confirmLabel?: string; danger?: boolean };
const ConfirmCtx = createContext<(o: ConfirmOpts) => Promise<boolean>>(async () => false);
export const useConfirm = () => useContext(ConfirmCtx);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [opts, setOpts] = useState<ConfirmOpts | null>(null);
  const resolver = useRef<(v: boolean) => void>(() => {});
  const dialogRef = useRef<HTMLDialogElement>(null);
  const confirm = useCallback((o: ConfirmOpts) => new Promise<boolean>((res) => { resolver.current = res; setOpts(o); }), []);
  useEffect(() => { if (opts) dialogRef.current?.showModal(); }, [opts]);
  const done = (v: boolean) => { dialogRef.current?.close(); setOpts(null); resolver.current(v); };
  return (
    <ConfirmCtx.Provider value={confirm}>
      {children}
      {opts && (
        <dialog ref={dialogRef} onCancel={(e) => { e.preventDefault(); done(false); }} className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-2xl p-0 shadow-lift backdrop:bg-night/60">
          <div className="p-6">
            <h2 className="font-sans text-lg font-semibold text-navy">{opts.title}</h2>
            {opts.body && <p className="mt-2 text-sm text-stone">{opts.body}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => done(false)} autoFocus>Cancel</button>
              <button type="button" className={cx("btn btn-sm", opts.danger ? "bg-[#b42318] text-white hover:bg-[#912018]" : "btn-dark")} onClick={() => done(true)}>{opts.confirmLabel ?? "Confirm"}</button>
            </div>
          </div>
        </dialog>
      )}
    </ConfirmCtx.Provider>
  );
}

export function Spinner({ label = "Loading…" }: { label?: string }) {
  return <p className="flex items-center gap-2 py-10 text-sm text-stone" role="status"><Loader2 className="size-4 animate-spin" aria-hidden />{label}</p>;
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-navy/15 p-10 text-center">
      <p className="font-semibold text-navy">{title}</p>
      {text && <p className="mt-1 text-sm text-stone">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorBox({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <div className="rounded-xl border border-[#b42318]/30 bg-[#fef3f2] p-4 text-sm text-[#7a271a]" role="alert">
      <p className="font-semibold">Something went wrong</p>
      <p className="mt-1 break-words">{error}</p>
      {onRetry && <button type="button" className="btn btn-outline btn-sm mt-3" onClick={onRetry}>Try again</button>}
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  published: "bg-pine-100 text-pine", draft: "bg-sand text-stone", archived: "bg-mist text-stone", pending: "bg-amber/20 text-amber-700",
  rejected: "bg-[#fef3f2] text-[#b42318]", new: "bg-glacier-100 text-glacier-700", contacted: "bg-amber/20 text-amber-700",
  quoted: "bg-amber/20 text-amber-700", booked: "bg-pine-100 text-pine", handled: "bg-pine-100 text-pine", closed: "bg-mist text-stone", spam: "bg-[#fef3f2] text-[#b42318]",
  needs_review: "bg-amber/20 text-amber-700", hidden: "bg-mist text-stone",
};
export function StatusBadge({ status }: { status: string }) {
  return <span className={cx("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", STATUS_STYLES[status] ?? "bg-mist text-stone")}>{status.replace("_", " ")}</span>;
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div>
        <h1 className="font-sans text-2xl font-bold text-navy">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-stone">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
