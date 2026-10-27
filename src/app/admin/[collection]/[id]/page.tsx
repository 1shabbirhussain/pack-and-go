"use client";
import { useParams } from "next/navigation";
import { CollectionEditor } from "@/components/admin/CollectionEditor";
import { EmptyState } from "@/components/admin/ui";
import { COLLECTIONS } from "@/lib/admin/registry";
import type { CollectionKey } from "@/lib/admin/data";

export default function EditPage() {
  const { collection, id } = useParams<{ collection: string; id: string }>();
  if (!(collection in COLLECTIONS)) return <EmptyState title="Unknown section" />;
  return <CollectionEditor key={`${collection}/${id}`} collection={collection as CollectionKey} id={decodeURIComponent(id)} />;
}
