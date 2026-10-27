import { Quote, Star } from "lucide-react";
import type { Review } from "@/lib/schema";

export function ReviewCards({ reviews }: { reviews: Review[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((r) => (
        <li key={r.id} className="card flex flex-col p-6">
          <Quote className="size-7 text-amber" aria-hidden />
          {r.rating != null && (
            <p className="mt-3 flex gap-0.5" aria-label={`Rated ${r.rating} out of 5`}>
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`size-4 ${i < r.rating! ? "fill-amber text-amber" : "text-navy/20"}`} aria-hidden />)}
            </p>
          )}
          <blockquote className="mt-3 flex-1 leading-relaxed text-ink">{r.text}</blockquote>
          <footer className="mt-5 border-t border-navy/10 pt-4 text-sm">
            <p className="font-semibold text-navy">{r.name}{r.location ? `, ${r.location}` : ""}</p>
            <p className="text-stone">{[r.tripName, r.travelMonth].filter(Boolean).join(" · ")}</p>
            {r.reply && <p className="mt-3 rounded-xl bg-sand/60 p-3 text-stone"><span className="font-semibold text-navy">Pack & Go: </span>{r.reply}</p>}
          </footer>
        </li>
      ))}
    </ul>
  );
}
