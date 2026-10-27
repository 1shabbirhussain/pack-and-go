"use client";
import { useParams } from "next/navigation";
import { CollectionList } from "@/components/admin/CollectionList";
import { EmptyState } from "@/components/admin/ui";
import { COLLECTIONS } from "@/lib/admin/registry";
import type { CollectionKey } from "@/lib/admin/data";

export default function CollectionPage() {
  const { collection } = useParams<{ collection: string }>();
  if (!(collection in COLLECTIONS)) return <EmptyState title="Unknown section" />;
  return <CollectionList key={collection} collection={collection as CollectionKey} />;
}
