export default function Loading() {
  return (
    <div className="container-x flex min-h-[60vh] items-center justify-center pt-24" role="status" aria-live="polite">
      <span className="inline-flex items-center gap-3 text-stone"><span className="size-5 animate-spin rounded-full border-2 border-navy/20 border-t-amber" /> Loading…</span>
    </div>
  );
}
