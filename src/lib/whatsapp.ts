/** Builds wa.me links with a pre-filled message. Opening WhatsApp does NOT send anything by itself. */
export interface WhatsAppDetails {
  greeting?: string;
  tour?: string;
  departureCity?: string;
  transport?: string;
  adults?: number;
  children?: number;
  month?: string;
  reference?: string;
  extra?: string;
}

export function buildWhatsAppMessage(d: WhatsAppDetails): string {
  const lines: string[] = [d.greeting?.trim() || "Assalam-o-Alaikum Pack & Go!"];
  const intro = d.tour ? "I'm interested in:" : "I'd like to know more about your tours.";
  lines.push(intro);
  if (d.tour) lines.push(`• Tour: ${d.tour}`);
  if (d.departureCity) lines.push(`• From: ${d.departureCity}${d.transport ? ` – ${d.transport}` : ""}`);
  else if (d.transport) lines.push(`• Transport: ${d.transport}`);
  if (d.adults || d.children) {
    const parts = [] as string[];
    if (d.adults) parts.push(`${d.adults} adult${d.adults === 1 ? "" : "s"}`);
    if (d.children) parts.push(`${d.children} child${d.children === 1 ? "" : "ren"}`);
    lines.push(`• Travellers: ${parts.join(", ")}`);
  }
  if (d.month) lines.push(`• Preferred dates: ${d.month}`);
  if (d.reference) lines.push(`• Website inquiry ref: ${d.reference}`);
  if (d.extra) lines.push(d.extra);
  return lines.join("\n");
}

export function whatsappLink(e164: string, message?: string): string {
  const digits = e164.replace(/[^\d]/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function telLink(e164: string) {
  return `tel:${e164.replace(/[^\d+]/g, "")}`;
}
