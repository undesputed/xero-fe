import { FileText } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";

export default function SettlementsPage() {
  return (
    <>
      <TopBar title="Settlements" />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mx-auto"
            style={{ background: "var(--border)" }}
          >
            <FileText size={24} style={{ color: "var(--text-muted)" }} />
          </div>
          <p className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            No settlements yet
          </p>
          <p className="text-sm max-w-xs mx-auto" style={{ color: "var(--text-muted)" }}>
            Settlements appear here once sessions are approved and posted to Xero.
          </p>
        </div>
      </main>
    </>
  );
}
