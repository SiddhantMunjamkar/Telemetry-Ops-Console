"use client";

import { useSystemServices } from "@/hooks/use-system-status";
import { SidebarStatusItem } from "@/components/layout/sidebar-status-item";

export function InfrastructureStatus() {
  const services = useSystemServices();

  return (
    <ul>
      {services.map((service) => (
        <li key={service.id}>
          <SidebarStatusItem service={service} />
        </li>
      ))}
    </ul>
  );
}
