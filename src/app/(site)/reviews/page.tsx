import type { Metadata } from "next";
import { MessageSquareQuote } from "lucide-react";
import { PageHero } from "@/components/site/Blocks";
import { ReviewCards } from "@/components/site/ReviewCards";
import { ReviewForm } from "@/components/site/ReviewForm";
import { getPackages, getReviews } from "@/lib/content";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { PHOTOS } from "@/content/seed/shared";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Traveller reviews",
  description: "Reviews from people who travelled with Pack & Go Tourism. Every review is from a real traveller and is checked before it is published.",
  alternates: { canonical: "/reviews" },
};

export default async function ReviewsPage() {
  const [reviews, packages] = await Promise.all([getReviews(), getPackages()]);
  return (
    <>
      <PageHero eyebrow="Reviews" title="Traveller stories" subtitle="Every review here comes from a real traveller and is checked by our team before it is published." image={PHOTOS.meadowHorseLake} crumbs={[{ name: "Home", href: "/" }, { name: "Reviews", href: "/reviews" }]} />
      <section className="container-x py-16">
        {reviews.length ? (
          <ReviewCards reviews={reviews} />
        ) : (
          <div className="card mx-auto max-w-2xl p-8 text-center">
            <MessageSquareQuote className="mx-auto size-10 text-amber-700" aria-hidden />
            <h2 className="mt-4 text-2xl font-semibold text-navy">Reviews are on their way</h2>
            <p className="mt-2 text-stone">We&apos;re collecting reviews from our recent travellers. Travelled with us? We&apos;d love to hear from you below.</p>
          </div>
        )}
      </section>
      <section className="container-x max-w-3xl pb-10" aria-labelledby="leave-h">
        <h2 id="leave-h" className="h-section text-navy">Share your experience</h2>
        <p className="mt-2 text-stone">Reviews are published after our team confirms them. We never edit what you say beyond fixing obvious typos.</p>
        <div className="mt-8"><ReviewForm trips={packages.map((p) => p.title)} configured={isFirebaseConfigured} /></div>
      </section>
    </>
  );
}
