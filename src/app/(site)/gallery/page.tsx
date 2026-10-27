import type { Metadata } from "next";
import { PageHero } from "@/components/site/Blocks";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { InstagramIcon } from "@/components/ui/icons";
import { getContact, getGallery, getSiteSettings } from "@/lib/content";
import { PHOTOS } from "@/content/seed/shared";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Gallery",
  description: "Mountains, lakes, valleys and rivers of northern Pakistan — photos from Pack & Go Tourism journeys and brochures.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const [items, site, contact] = await Promise.all([getGallery(), getSiteSettings(), getContact()]);
  return (
    <>
      <PageHero eyebrow="Gallery" title="Scenes from the north" subtitle="A glimpse of the valleys, lakes and mountain roads we travel." image={PHOTOS.snowPeaksReflection} crumbs={[{ name: "Home", href: "/" }, { name: "Gallery", href: "/gallery" }]}>
        {contact.instagramUrl && (
          <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light mt-8"><InstagramIcon className="size-5" /> More on Instagram</a>
        )}
      </PageHero>
      <section className="container-x py-14">
        <GalleryGrid items={items} categories={site.galleryCategories} />
      </section>
    </>
  );
}
