"use client";

import { notFound } from "next/navigation";
import { DeviceDetailView } from "@/components/device";

type DeviceDetailPageClientProps = {
  id: string;
};

export function DeviceDetailPageClient({ id }: DeviceDetailPageClientProps) {
  if (!id) {
    notFound();
  }

  return <DeviceDetailView deviceId={id} />;
}
