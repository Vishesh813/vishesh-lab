"use client";

import { systemDesignModules } from "@/lib/system-design";
import { RouteSidebar, type RouteGroup } from "./route-sidebar";

const phaseOrder = [
  "Foundations",
  "Scale",
  "Distributed systems",
  "Production",
];

const groups: RouteGroup[] = phaseOrder.map((phase) => ({
  id: phase,
  label: phase,
  items: systemDesignModules
    .filter((module) => module.phase === phase)
    .map((module) => ({
      label: `${String(module.step).padStart(2, "0")} · ${module.title}`,
      href: `/system-design/${module.slug}/`,
    })),
}));

export function SystemDesignSidebar() {
  return (
    <RouteSidebar
      title="System Design"
      homeHref="/system-design/"
      homeLabel="Curriculum"
      groups={groups}
      footer={[
        { label: "Full curriculum", href: "/system-design/" },
        { label: "Case studies", href: "/case-studies/" },
      ]}
      triggerLabel="SD modules"
      ariaLabel="System Design modules"
    />
  );
}
