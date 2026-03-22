export type SettlementStatus =
  | "COMPLETE"
  | "PENDING"
  | "IN_PROGRESS"
  | "FAILED"
  | "SKIPPED"
  | "PAUSED";

export type DocType = "ACCREC" | "ACCPAY" | "ACCRECCREDIT" | "PAYMENT";

export type IntegrationPattern = "CSV" | "Mirakl" | "SP-API" | "Finances API";

// ── Legacy result type (kept for UploadResult component) ─────────────────────

export interface DocumentResult {
  type: DocType;
  reference: string;
  xero_id?: string;
  amount?: number;
  skipped?: boolean;
}

export interface IngestResponse {
  settlement_ref: string;
  documents_created: number;
  skipped: number;
  results: DocumentResult[];
}

// ── Session / Preview types ───────────────────────────────────────────────────

/** A single line item within a preview document. Amounts are strings from the API. */
export interface PreviewLineItem {
  description: string;
  quantity: string;
  unit_amount: string;
  account_code: string;
  tax_type: string;
}

/** A document in the ingest preview (before Xero push). */
export interface PreviewDocument {
  type: DocType | "PAYMENT";
  reference: string;
  /** Contact name — present on ACCREC / ACCPAY / ACCRECCREDIT */
  contact?: string;
  date?: string;
  due_date?: string;
  currency?: string;
  line_items?: PreviewLineItem[];
  /** Net amount string — present on PAYMENT */
  amount?: string;
  /** Bank account code — present on PAYMENT */
  account_code?: string;
  idempotency_key: string;
}

/** Response from POST /ingest/manomano or POST /ingest/manomano/fees */
export interface IngestSessionResponse {
  session_id: string;
  settlement_ref: string;
  preview: PreviewDocument[];
}

/** Individual result entry after a session is approved */
export interface XeroResult {
  type: string;
  reference: string;
  xero_id?: string;
  skipped: boolean;
  note?: string;
}

/** Response from POST /sessions/{id}/approve */
export interface ApproveResponse {
  status: "APPROVED";
  documents_created: number;
  skipped: number;
  results: XeroResult[];
}

/** Response from GET /sessions/{id} */
export interface SessionDetail {
  session_id: string;
  status: "PENDING" | "APPROVED" | "DECLINED" | "FAILED";
  channel: string;
  file_type: string;
  settlement_ref: string;
  file_name: string;
  created_at: string;
  period_start: string;
  period_end: string;
  preview: PreviewDocument[];
  xero_results: XeroResult[];
  error: string;
}

/** Row returned by GET /ingest/sessions (list endpoint) */
export interface SessionSummary {
  session_id: string;
  status: "PENDING" | "APPROVED" | "DECLINED" | "FAILED";
  channel: string;
  file_type: string;
  settlement_ref: string;
  file_name: string;
  created_at: string;
  period_start: string;
  period_end: string;
  error: string;
}

/** Response from GET /channels or GET /channels/{channel} */
export interface ChannelRecord {
  channel: string;
  display_name: string;
  last_session_id: string;
  last_settlement_ref: string;
  last_period_start: string;
  last_period_end: string;
  last_created_at: string;
  last_status: string;
  total_sessions: number;
}

// ── Domain types ──────────────────────────────────────────────────────────────

export interface Settlement {
  id: string;
  channel: string;
  reference: string;
  period: string;
  status: SettlementStatus;
  net_amount?: number;
  documents?: DocumentResult[];
  processed_at?: string;
}

export interface ChannelConfig {
  channel: string;
  xero_contact: string;
  pattern: IntegrationPattern;
  status: "Active" | "Paused" | "Pending";
}

export interface DashboardStats {
  settlements_this_month: number;
  pending_count: number;
  net_this_month: number;
  channels: ChannelSummary[];
  recent_activity: ActivityItem[];
}

export interface ChannelSummary {
  channel: string;
  status: SettlementStatus;
  last_period?: string;
  last_net?: number;
}

export interface ActivityItem {
  channel: string;
  reference: string;
  status: SettlementStatus;
  time_ago: string;
}
