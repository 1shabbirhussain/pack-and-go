"use client";
/**
 * In-page PDF viewer built on pdf.js (loaded on demand).
 * - Bundled / Firebase Storage / direct URLs render with pdf.js: page navigation, zoom, fit-to-width,
 *   fullscreen, open in new tab and download.
 * - Google Drive links (which block cross-origin PDF access) are embedded with Drive's own previewer.
 * - If pdf.js cannot load a file (e.g. CORS), it falls back to an <iframe> + "open in new tab".
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Download, ExternalLink, Loader2, Maximize2, Minimize2, ScanLine, ZoomIn, ZoomOut } from "lucide-react";
import type { ResolvedPdf } from "@/lib/pdf";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";

interface Props {
  pdf: ResolvedPdf;
  title: string;
  allowDownload?: boolean;
  fileName?: string;
}

export function PdfViewer({ pdf, title, allowDownload = true, fileName }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const docRef = useRef<PDFDocumentProxy | null>(null);
  const renderRef = useRef<RenderTask | null>(null);
  const [mode, setMode] = useState<"pdfjs" | "iframe">(pdf.pdfUrl ? "pdfjs" : "iframe");
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [zoom, setZoom] = useState<number | "fit">("fit");
  const [fullscreen, setFullscreen] = useState(false);
  const [pageInput, setPageInput] = useState("1");

  // Load document
  useEffect(() => {
    if (mode !== "pdfjs" || !pdf.pdfUrl) return;
    let cancelled = false;
    setState("loading");
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
        const task = pdfjs.getDocument({ url: pdf.pdfUrl!, isEvalSupported: false, withCredentials: false });
        const doc = await task.promise;
        if (cancelled) { void doc.destroy(); return; }
        docRef.current = doc;
        setPages(doc.numPages);
        setPage(1);
        setState("ready");
      } catch (e) {
        console.warn("[pdf] pdf.js failed, falling back to embed", e);
        if (!cancelled) setMode("iframe");
      }
    })();
    return () => {
      cancelled = true;
      renderRef.current?.cancel();
      void docRef.current?.destroy();
      docRef.current = null;
    };
  }, [pdf.pdfUrl, mode]);

  const render = useCallback(async () => {
    const doc = docRef.current;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!doc || !canvas || !wrap) return;
    const p = await doc.getPage(page);
    const base = p.getViewport({ scale: 1 });
    const available = Math.max(280, wrap.clientWidth - 32);
    const scale = zoom === "fit" ? available / base.width : zoom;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const viewport = p.getViewport({ scale: scale * dpr });
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    canvas.style.width = `${Math.floor(viewport.width / dpr)}px`;
    canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;
    renderRef.current?.cancel();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const task = p.render({ canvasContext: ctx, viewport });
    renderRef.current = task;
    try { await task.promise; } catch { /* cancelled */ }
  }, [page, zoom]);

  useEffect(() => { if (state === "ready") void render(); }, [state, render]);
  useEffect(() => { setPageInput(String(page)); }, [page]);

  useEffect(() => {
    if (state !== "ready" || zoom !== "fit") return;
    const ro = new ResizeObserver(() => void render());
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [state, zoom, render]);

  useEffect(() => {
    const onFs = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const go = (n: number) => setPage((p) => Math.min(Math.max(1, n), pages || p));
  const currentScale = () => (typeof zoom === "number" ? zoom : 1);
  const zoomBy = (delta: number) => setZoom(Math.min(3, Math.max(0.4, Math.round((currentScale() + delta) * 10) / 10)));
  const toggleFs = async () => {
    const el = wrapRef.current?.parentElement;
    if (!el) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await el.requestFullscreen?.();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (mode !== "pdfjs") return;
    if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); go(page + 1); }
    if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); go(page - 1); }
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-3xl bg-navy shadow-lift ring-1 ring-navy/20 [&:fullscreen]:rounded-none">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-3 py-2.5 text-white sm:px-4" role="toolbar" aria-label="Brochure viewer controls">
        {mode === "pdfjs" ? (
          <div className="flex items-center gap-1">
            <IconBtn label="Previous page" onClick={() => go(page - 1)} disabled={page <= 1 || state !== "ready"}><ChevronLeft className="size-5" /></IconBtn>
            <form onSubmit={(e) => { e.preventDefault(); go(parseInt(pageInput, 10) || 1); }} className="flex items-center gap-1.5 text-sm">
              <label htmlFor="pdf-page" className="sr-only">Page number</label>
              <input id="pdf-page" inputMode="numeric" value={pageInput} onChange={(e) => setPageInput(e.target.value.replace(/\D/g, "").slice(0, 3))} onBlur={() => go(parseInt(pageInput, 10) || page)} className="w-11 rounded-md bg-white/10 px-1.5 py-1 text-center text-white focus:bg-white/20" />
              <span className="text-white/70">/ {pages || "–"}</span>
            </form>
            <IconBtn label="Next page" onClick={() => go(page + 1)} disabled={page >= pages || state !== "ready"}><ChevronRight className="size-5" /></IconBtn>
            <span className="mx-1 hidden h-5 w-px bg-white/15 sm:block" />
            <IconBtn label="Zoom out" onClick={() => zoomBy(-0.2)} disabled={state !== "ready"}><ZoomOut className="size-5" /></IconBtn>
            <span className="hidden w-12 text-center text-xs text-white/70 sm:inline" aria-live="polite">{zoom === "fit" ? "Fit" : `${Math.round(zoom * 100)}%`}</span>
            <IconBtn label="Zoom in" onClick={() => zoomBy(0.2)} disabled={state !== "ready"}><ZoomIn className="size-5" /></IconBtn>
            <IconBtn label="Fit to width" onClick={() => setZoom("fit")} disabled={state !== "ready"} pressed={zoom === "fit"}><ScanLine className="size-5" /></IconBtn>
          </div>
        ) : (
          <p className="px-1 text-sm text-white/75">{pdf.provider === "google-drive" ? "Viewing via Google Drive" : "Embedded viewer"}</p>
        )}
        <div className="flex items-center gap-1">
          <IconBtn label={fullscreen ? "Exit full screen" : "Full screen"} onClick={toggleFs}>{fullscreen ? <Minimize2 className="size-5" /> : <Maximize2 className="size-5" />}</IconBtn>
          <a href={pdf.openUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-sm hover:bg-white/10" aria-label={`Open ${title} in a new tab`}>
            <ExternalLink className="size-4" aria-hidden /><span className="hidden sm:inline">New tab</span>
          </a>
          {allowDownload && (
            <a href={pdf.downloadUrl} download={pdf.provider === "local" ? fileName || true : undefined} target={pdf.provider === "local" ? undefined : "_blank"} rel="noopener noreferrer" className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-amber px-3 text-sm font-semibold text-night hover:bg-amber-300">
              <Download className="size-4" aria-hidden /><span>Download</span>
            </a>
          )}
        </div>
      </div>

      <div
        ref={wrapRef}
        tabIndex={0}
        onKeyDown={onKey}
        aria-label={`${title} — page ${page} of ${pages || "?"}. Use the arrow keys to change page.`}
        className="relative min-h-[60vh] flex-1 overflow-auto bg-[#2c3547] p-4 focus-visible:outline-amber [&:fullscreen]:h-screen"
        style={{ maxHeight: fullscreen ? "calc(100vh - 56px)" : "80vh" }}
      >
        {mode === "pdfjs" ? (
          <>
            {state === "loading" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/80" role="status">
                <Loader2 className="size-8 animate-spin" aria-hidden /> Loading brochure…
              </div>
            )}
            <canvas ref={canvasRef} className="mx-auto block rounded-md bg-white shadow-xl" aria-hidden={state !== "ready"} role="img" aria-label={`Page ${page} of ${title}`} />
          </>
        ) : pdf.embedUrl ? (
          <iframe src={pdf.embedUrl} title={title} className="absolute inset-0 size-full border-0 bg-white" allow="fullscreen" loading="lazy" />
        ) : (
          <p className="text-white">This brochure can&apos;t be displayed here. Please use “New tab”.</p>
        )}
      </div>
    </div>
  );
}

function IconBtn({ label, onClick, disabled, pressed, children }: { label: string; onClick: () => void; disabled?: boolean; pressed?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} title={label} aria-pressed={pressed} className="inline-flex size-10 items-center justify-center rounded-lg hover:bg-white/10 disabled:opacity-35 aria-pressed:bg-white/15">
      <span aria-hidden>{children}</span>
    </button>
  );
}
