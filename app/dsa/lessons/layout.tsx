import { DsaSidebar } from "@/components/dsa-sidebar";

export default function DsaLessonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="route-shell">
      <DsaSidebar />
      <div className="route-main">{children}</div>
    </div>
  );
}
