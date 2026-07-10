import { DeviceDetailPageClient } from "@/components/pages/device-detail-page-client";

type DeviceDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeviceDetailPage({ params }: DeviceDetailPageProps) {
  const { id } = await params;

  return <DeviceDetailPageClient id={id} />;
}
