"use client";
import { useState } from "react";
import { ExternalLink, MapPin } from "lucide-react";
import { mapsEmbedUrl, mapsSearchUrl } from "@/lib/format";

/** Click-to-load Google Map: no third-party scripts or cookies until the visitor asks for the map. */
export function MapFacade({ query, title }: { query: string; title: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-glacier-100">
      {show ? (
        <iframe title={`Map: ${title}`} src={mapsEmbedUrl(query)} className="absolute inset-0 size-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_30%_30%,#dcecf1,#c7dfe7)] p-6 text-center">
          <MapPin className="size-8 text-glacier-700" aria-hidden />
          <p className="text-sm font-medium text-navy">{title}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => setShow(true)} className="btn btn-dark btn-sm">Show map</button>
            <a href={mapsSearchUrl(query)} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
              Open in Google Maps <ExternalLink className="size-3.5" aria-hidden />
            </a>
          </div>
          <p className="text-xs text-stone">Loading the map shares your IP address with Google.</p>
        </div>
      )}
    </div>
  );
}
