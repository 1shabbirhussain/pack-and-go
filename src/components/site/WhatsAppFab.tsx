"use client";
import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/ui/icons";

/** Floating WhatsApp button. Hidden on tour pages, which have their own sticky action bar. */
export function WhatsAppFab({ href }: { href: string }) {
  const pathname = usePathname();
  if (pathname.startsWith("/tours/")) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Pack & Go on WhatsApp (opens WhatsApp)"
      className="fixed bottom-5 right-5 z-40 inline-flex size-14 items-center justify-center rounded-full bg-[#1f8f5f] text-white shadow-lift transition-transform hover:scale-105 focus-visible:scale-105"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
