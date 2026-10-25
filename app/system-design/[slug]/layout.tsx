import { SystemDesignSidebar } from "@/components/system-design-sidebar";

export default function SystemDesignModuleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="route-shell">
      <SystemDesignSidebar />
      <div className="route-main">{children}</div>
    </div>
  );
}
