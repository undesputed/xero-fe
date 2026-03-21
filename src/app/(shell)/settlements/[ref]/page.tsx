import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { DocumentCard } from "@/components/ui/DocumentCard";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface SettlementDetailPageProps {
  params: Promise<{ ref: string }>;
}

export default async function SettlementDetailPage({ params }: SettlementDetailPageProps) {
  const { ref } = await params;
  const decodedRef = decodeURIComponent(ref);

  // Phase 1: no persistence — show scaffold with the reference from the URL
  return (
    <>
      <TopBar title={decodedRef} breadcrumb="Settlements" />
      <main className="flex-1 p-6 space-y-6">
        {/* Back link */}
        <Link
          href="/settlements"
          className="inline-flex items-center gap-1.5 text-sm hover:underline"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft size={14} />
          Back to Settlements
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold font-mono" style={{ color: "var(--text-primary)" }}>
            {decodedRef}
          </h2>
          <StatusBadge status="PENDING" />
        </div>

        {/* Document grid — placeholder cards */}
        <div className="grid grid-cols-2 gap-4">
          <DocumentCard
            type="ACCREC"
            reference={decodedRef}
            date="—"
            lines={[]}
            total={0}
          />
          <DocumentCard
            type="ACCPAY"
            reference={`${decodedRef}-FEES`}
            date="—"
            lines={[]}
            total={0}
          />
          <DocumentCard
            type="ACCRECCREDIT"
            reference={`${decodedRef}-REF`}
            date="—"
            lines={[]}
            total={0}
          />
          <DocumentCard
            type="PAYMENT"
            reference={`${decodedRef}-PAY`}
            date="—"
            lines={[]}
            total={0}
          />
        </div>

        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Full document details will populate once BE persistence (DynamoDB) is connected in Phase 2.
        </p>
      </main>
    </>
  );
}
