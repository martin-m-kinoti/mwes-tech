const { initializeApp, cert } = require("firebase-admin/app");
const { getDataConnect } = require("firebase-admin/data-connect");
const { BigQuery } = require("@google-cloud/bigquery");
const fs = require("fs");
const os = require("os");
const path = require("path");

const KEY = "./serviceAccountKey.json";
initializeApp({ credential: cert(require(KEY)) });

const dc = getDataConnect({ serviceId: "mwestech-service", location: "us-east4" });
const bq = new BigQuery({ keyFilename: KEY });

// Emails, phone numbers and comments are left out on purpose.
const JOBS = {
  users: {
    query: `query { users { id createdAt } }`,
    key: "users",
    map: (r) => ({ user_id: r.id, created_at: r.createdAt }),
  },
  orders: {
    query: `query { orders { id user { id } service deliveryDuration deliveryDate status createdAt updatedAt } }`,
    key: "orders",
    map: (r) => ({
      order_id: r.id, user_id: r.user?.id, service: r.service,
      delivery_duration: r.deliveryDuration, delivery_date: r.deliveryDate,
      status: r.status, created_at: r.createdAt, updated_at: r.updatedAt,
    }),
  },
  payments: {
    query: `query { payments { id user { id } checkoutRequestId serviceId amount status mpesaReceipt amountPaid failReason createdAt updatedAt } }`,
    key: "payments",
    map: (r) => ({
      payment_id: r.id, user_id: r.user?.id, checkout_request_id: r.checkoutRequestId,
      order_id: r.serviceId, amount: r.amount, status: r.status,
      mpesa_receipt: r.mpesaReceipt, amount_paid: r.amountPaid,
      fail_reason: r.failReason, created_at: r.createdAt, updated_at: r.updatedAt,
    }),
  },
  payment_events: {
    query: `query { paymentEvents { id payment { id } eventCode message createdAt } }`,
    key: "paymentEvents",
    map: (r) => ({
      event_id: r.id, payment_id: r.payment?.id,
      event_code: r.eventCode, message: r.message, created_at: r.createdAt,
    }),
  },
};

(async () => {
  for (const [table, job] of Object.entries(JOBS)) {
    const res = await dc.executeGraphqlRead(job.query);
    const rows = (res.data[job.key] || []).map(job.map);
    if (!rows.length) { console.log(`${table}: no rows`); continue; }

    const file = path.join(os.tmpdir(), `${table}.ndjson`);
    fs.writeFileSync(file, rows.map((r) => JSON.stringify(r)).join("\n"));

    await bq.dataset("firebase_export").table(table).load(file, {
      sourceFormat: "NEWLINE_DELIMITED_JSON",
      writeDisposition: "WRITE_TRUNCATE",
      autodetect: true,
    });
    console.log(`${table}: loaded ${rows.length} rows`);
  }
})().catch((e) => { console.error(e); process.exit(1); });