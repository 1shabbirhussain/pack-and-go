"use client";
import { useParams } from "next/navigation";
import { SingletonEditor } from "@/components/admin/SingletonEditor";
import { EmptyState } from "@/components/admin/ui";
import { SINGLETONS } from "@/lib/admin/registry";
import type { SingletonKey } from "@/lib/admin/data";

export default function SettingsPage() {
  const { which } = useParams<{ which: string }>();
  if (!(which in SINGLETONS)) return <EmptyState title="Unknown settings page" />;
  return <SingletonEditor key={which} which={which as SingletonKey} />;
}
