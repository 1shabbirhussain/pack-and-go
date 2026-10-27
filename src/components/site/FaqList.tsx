import { Plus } from "lucide-react";
import type { Faq } from "@/lib/schema";

/** Native <details> accordion: accessible and works without JavaScript. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="divide-y divide-navy/10 rounded-3xl bg-white shadow-soft ring-1 ring-navy/5">
      {faqs.map((f) => (
        <details key={f.id} className="group px-5 sm:px-7 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-semibold text-navy">
            <span>{f.question}</span>
            <Plus className="size-5 shrink-0 text-amber-700 transition-transform duration-300 group-open:rotate-45" aria-hidden />
          </summary>
          <p className="-mt-1 pb-6 leading-relaxed text-stone">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
