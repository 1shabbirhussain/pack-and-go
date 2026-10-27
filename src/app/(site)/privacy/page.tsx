import type { Metadata } from "next";
import { PageHero } from "@/components/site/Blocks";
import { PolicyBlocks } from "@/components/site/PolicyBlocks";
import { getPolicies } from "@/lib/content";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Pack & Go Tourism collects, stores and uses the details you send through this website.",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const p = await getPolicies();
  return (
    <>
      <PageHero eyebrow="Privacy" title="Privacy policy" subtitle={p.lastUpdated ? `Last updated ${p.lastUpdated}` : undefined} crumbs={[{ name: "Home", href: "/" }, { name: "Privacy", href: "/privacy" }]} />
      <div className="container-x max-w-3xl py-16"><PolicyBlocks blocks={p.privacy} /></div>
    </>
  );
}
