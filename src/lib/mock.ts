import type { ChannelConfig, SessionDetail, SessionSummary } from "./types";

// ── Dashboard stats ───────────────────────────────────────────────────────────

export const DASHBOARD_STATS = {
  pending: 3,
  processedThisMonth: 8,
  failed: 1,
};

// ── Channel status grid ───────────────────────────────────────────────────────

export type ChannelDisplayStatus = "Done" | "Due" | "Paused";

export interface ChannelStatusRow {
  channel: string;
  lastRef: string;
  status: ChannelDisplayStatus;
  lastUpdated: string;
}

export const CHANNEL_STATUS_ROWS: ChannelStatusRow[] = [
  { channel: "Amazon UK",  lastRef: "—",                 status: "Due",    lastUpdated: "—"           },
  { channel: "Amazon EU",  lastRef: "—",                 status: "Due",    lastUpdated: "—"           },
  { channel: "B&Q",        lastRef: "—",                 status: "Due",    lastUpdated: "—"           },
  { channel: "Debenhams",  lastRef: "—",                 status: "Due",    lastUpdated: "—"           },
  { channel: "Tesco",      lastRef: "—",                 status: "Due",    lastUpdated: "—"           },
  { channel: "The Range",  lastRef: "—",                 status: "Paused", lastUpdated: "—"           },
  { channel: "eBay",       lastRef: "—",                 status: "Due",    lastUpdated: "—"           },
  { channel: "Shopify",    lastRef: "—",                 status: "Due",    lastUpdated: "—"           },
  { channel: "ManoMano",   lastRef: "MANO-20260315",     status: "Done",   lastUpdated: "15 Mar 2026" },
  { channel: "Fruugo",     lastRef: "—",                 status: "Due",    lastUpdated: "—"           },
  { channel: "OnBuy",      lastRef: "—",                 status: "Paused", lastUpdated: "—"           },
];

// ── Channel label map (lowercase key → display name) ─────────────────────────

export const CHANNEL_LABELS: Record<string, string> = {
  manomano:   "ManoMano",
  fruugo:     "Fruugo",
  onbuy:      "OnBuy",
  "amazon-uk": "Amazon UK",
  "amazon-eu": "Amazon EU",
  ebay:       "eBay",
  shopify:    "Shopify",
  bq:         "B&Q",
  debenhams:  "Debenhams",
  tesco:      "Tesco",
  therange:   "The Range",
};

// ── Sessions ──────────────────────────────────────────────────────────────────

export const ALL_SESSIONS: SessionSummary[] = [
  {
    session_id:     "mock-session-001",
    status:         "PENDING",
    channel:        "manomano",
    file_type:      "csv",
    settlement_ref: "MANO-20260315",
    file_name:      "manomano-march-2026.csv",
    created_at:     "2026-03-25T09:12:00Z",
    period_start:   "2026-03-01",
    period_end:     "2026-03-15",
    error:          "",
  },
  {
    session_id:     "mock-session-002",
    status:         "PENDING",
    channel:        "manomano",
    file_type:      "csv-deductions",
    settlement_ref: "MANO-DED-20260315",
    file_name:      "DEDUCTIONS-2026-03.csv",
    created_at:     "2026-03-25T09:14:00Z",
    period_start:   "2026-03-01",
    period_end:     "2026-03-15",
    error:          "",
  },
  {
    session_id:     "mock-session-003",
    status:         "PENDING",
    channel:        "manomano",
    file_type:      "pdf",
    settlement_ref: "MANO-FEES-20260315",
    file_name:      "colibri-invoice-mar.pdf",
    created_at:     "2026-03-25T09:16:00Z",
    period_start:   "2026-03-01",
    period_end:     "2026-03-15",
    error:          "",
  },
  {
    session_id:     "mock-session-004",
    status:         "APPROVED",
    channel:        "manomano",
    file_type:      "csv",
    settlement_ref: "MANO-20260301",
    file_name:      "manomano-feb-2026.csv",
    created_at:     "2026-03-10T14:22:00Z",
    period_start:   "2026-02-16",
    period_end:     "2026-03-01",
    error:          "",
  },
  {
    session_id:     "mock-session-005",
    status:         "APPROVED",
    channel:        "manomano",
    file_type:      "pdf",
    settlement_ref: "MANO-FEES-20260301",
    file_name:      "colibri-invoice-feb.pdf",
    created_at:     "2026-03-10T14:25:00Z",
    period_start:   "2026-02-16",
    period_end:     "2026-03-01",
    error:          "",
  },
  {
    session_id:     "mock-session-006",
    status:         "DECLINED",
    channel:        "manomano",
    file_type:      "csv",
    settlement_ref: "MANO-20260215",
    file_name:      "manomano-feb-early.csv",
    created_at:     "2026-02-28T11:05:00Z",
    period_start:   "2026-02-01",
    period_end:     "2026-02-15",
    error:          "",
  },
  {
    session_id:     "mock-session-007",
    status:         "FAILED",
    channel:        "manomano",
    file_type:      "csv-deductions",
    settlement_ref: "MANO-DED-20260215",
    file_name:      "DEDUCTIONS-2026-02.csv",
    created_at:     "2026-02-28T11:08:00Z",
    period_start:   "2026-02-01",
    period_end:     "2026-02-15",
    error:          "Xero API timeout",
  },
  {
    session_id:     "mock-session-008",
    status:         "APPROVED",
    channel:        "manomano",
    file_type:      "csv",
    settlement_ref: "MANO-20260201",
    file_name:      "manomano-jan-2026.csv",
    created_at:     "2026-02-15T10:00:00Z",
    period_start:   "2026-01-16",
    period_end:     "2026-02-01",
    error:          "",
  },
];

export const RECENT_SESSIONS = ALL_SESSIONS.slice(0, 5);

// ── Mock session detail for /review/mock-session-001 ─────────────────────────

export const MOCK_SESSION_DETAIL: SessionDetail = {
  session_id:     "mock-session-001",
  status:         "PENDING",
  channel:        "manomano",
  file_type:      "csv",
  settlement_ref: "MANO-20260315",
  file_name:      "manomano-march-2026.csv",
  created_at:     "2026-03-25T09:12:00Z",
  period_start:   "2026-03-01",
  period_end:     "2026-03-15",
  error:          "",
  xero_results:   [],
  preview: [
    {
      type:        "ACCREC",
      reference:   "MANO-20260315",
      contact:     "ManoMano (Colibri SAS)",
      date:        "2026-03-15",
      due_date:    "2026-04-14",
      currency:    "GBP",
      idempotency_key: "MANO-20260315-ACCREC-03",
      line_items: [
        { description: "Product sales — Mar 2026",  quantity: "1", unit_amount: "4820.00", account_code: "100", tax_type: "OUTPUT2" },
        { description: "Shipping income — Mar 2026", quantity: "1", unit_amount: "312.50",  account_code: "110", tax_type: "OUTPUT2" },
      ],
    },
    {
      type:        "ACCPAY",
      reference:   "MANO-FEES-20260315",
      contact:     "ManoMano (Colibri SAS)",
      date:        "2026-03-15",
      due_date:    "2026-04-14",
      currency:    "GBP",
      idempotency_key: "MANO-20260315-ACCPAY-03",
      line_items: [
        { description: "Commission fee",   quantity: "1", unit_amount: "482.00", account_code: "200", tax_type: "RCINPUT" },
        { description: "Subscription fee", quantity: "1", unit_amount: "49.00",  account_code: "240", tax_type: "RCINPUT" },
      ],
    },
    {
      type:        "ACCRECCREDIT",
      reference:   "MANO-REF-20260315",
      contact:     "ManoMano (Colibri SAS)",
      date:        "2026-03-15",
      due_date:    "2026-03-15",
      currency:    "GBP",
      idempotency_key: "MANO-20260315-ACCRECCREDIT-03",
      line_items: [
        { description: "Refund ORD-88821", quantity: "1", unit_amount: "189.99", account_code: "100", tax_type: "OUTPUT2" },
        { description: "Refund ORD-88904", quantity: "1", unit_amount: "95.00",  account_code: "100", tax_type: "OUTPUT2" },
      ],
    },
    {
      type:            "PAYMENT",
      reference:       "MANO-PAY-20260315",
      amount:          "4416.01",
      account_code:    "800",
      idempotency_key: "MANO-20260315-PAYMENT-03",
    },
  ],
};

// ── Channel configs for settings page ────────────────────────────────────────

export const CHANNEL_CONFIGS: ChannelConfig[] = [
  { channel: "Amazon UK",  xero_contact: "Amazon EU SARL (UK Branch)",  pattern: "SP-API",        status: "Active"  },
  { channel: "Amazon EU",  xero_contact: "Amazon EU SARL",               pattern: "SP-API",        status: "Active"  },
  { channel: "B&Q",        xero_contact: "Kingfisher Sourcing (B&Q)",    pattern: "Mirakl",        status: "Pending" },
  { channel: "Debenhams",  xero_contact: "Debenhams Retail Ltd",         pattern: "Mirakl",        status: "Pending" },
  { channel: "Tesco",      xero_contact: "Tesco Stores Ltd",             pattern: "Mirakl",        status: "Pending" },
  { channel: "The Range",  xero_contact: "CDS (Superstores Intl) Ltd",   pattern: "Mirakl",        status: "Pending" },
  { channel: "eBay",       xero_contact: "eBay (UK) Ltd",                pattern: "Finances API",  status: "Active"  },
  { channel: "Shopify",    xero_contact: "Shopify Payments (Stripe)",    pattern: "Finances API",  status: "Active"  },
  { channel: "ManoMano",   xero_contact: "ManoMano (Colibri SAS)",       pattern: "CSV",           status: "Active"  },
  { channel: "Fruugo",     xero_contact: "Fruugo.com Ltd",               pattern: "CSV",           status: "Paused"  },
  { channel: "OnBuy",      xero_contact: "OnBuy Ltd",                    pattern: "CSV",           status: "Paused"  },
];
