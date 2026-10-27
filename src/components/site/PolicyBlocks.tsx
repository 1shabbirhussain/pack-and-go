import type { Policies } from "@/lib/schema";

export function PolicyBlocks({ blocks }: { blocks: Policies["tourTerms"] }) {
  return (
    <>
      {blocks.map((b) => (
        <section key={b.heading} className="mb-10">
          <h2 className="text-2xl font-semibold text-navy">{b.heading}</h2>
          <div className="prose-pg text-ink">
            {b.paragraphs.map((p) => <p key={p}>{p}</p>)}
            {b.list.length > 0 && <ol className="list-decimal space-y-2 pl-5">{b.list.map((l) => <li key={l} className="leading-relaxed">{l}</li>)}</ol>}
          </div>
        </section>
      ))}
    </>
  );
}
