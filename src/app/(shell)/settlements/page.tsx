import { TopBar } from "@/components/layout/TopBar";
import { SettlementTable } from "@/components/settlements/SettlementTable";

export default function SettlementsPage() {
  // Phase 1: no persistence yet — table renders empty state
  return (
    <>
      <TopBar title="Settlements" />
      <main className="flex-1 p-6 space-y-4">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Settlements processed through the pipeline appear here. Upload a CSV to create your first
          settlement.
        </p>
        <SettlementTable settlements={[]} />
      </main>
    </>
  );
}
